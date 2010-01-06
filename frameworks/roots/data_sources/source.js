// ==========================================================================
// Project:   Roots.Source
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Roots Pomona*/

/** @class
  Data source for the experimental Roots server-side concept.
  
  Here's what you do: you supply Roots with paths on the server and map those
  to models on the client. Roots handles the middle part, including Comet.
  
  It can also act as a source for local storage, and handle some of the
  syncinc between client and server (merging is not its bag).

  @extends SC.DataSource
*/
Roots.Source = SC.DataSource.extend(
/** @scope Roots.Source.prototype */ {
  /**
  The map between server-side attach points and client-side models.
  
  There should be no beginning slashes.
  */
  map: {
  },
  
  firenzePort: window.location.port,
  firenzeDomain: document.domain,
  firenzePrefix: "comet/",
  firenzeProtocol: "http",
  
  isConnected: NO,
  
  /**
  The Url that everything in map is relative to. For instance, if this is
  "/contacts", a map to "groups" would create a url "/contacts/groups"
  */
  rootPath: "",
  
  init: function(){ 
    sc_super();
    
    var self = this;
    
    // setup firenze
    // we relay all fetches through firenze so that it can re-fetch if Comet is interrupted.
    this.firenze = Pomona.Firenze.create({
      prefix: this.firenzePrefix,
      domain: this.firenzeDomain,
      port: this.firenzePort,
      protocol: this.firenzeProtocol,
      requestAttachments: function(connections){
        self.startAttach(connections);
      },
      
      requestDetachments: function(connections){
        self.stopAttach(connections);
      }
    });
    
    this.bind("isConnected", [this.firenze, "isConnected"]);
    
    // later (lazily) we will create our reverse-map
    // this._reverse_map
    this._pendingQueries = {};
    this._stores = {};
    this._currentId = 0;
  },
  
  _normalMap: function(){
    if (this._normal_map) return this._normal_map;
    
    this._normal_map = {};
    for (var i in this.map){
      var v = this.map[i]; // get entry
      
      // normalize it to an actual object if possible
      if (typeof v === SC.T_STRING) {
        v = SC.objectForPropertyPath(v);
        // NO CREATION HERE! THEY ARE RECORD _TYPES_ AND SHALL STAY THAT WAY!
        // I can't believe I did not realize that before.
        this._normal_map[i] = v;
      }
    }
    
    this._reverse_map = null; // to ensure recalculation.
    return this._normal_map;
  },
  
  _reverseMap: function(){
    if (this._reverse_map) return this._reverse_map;
    
    // loop over normal map (always calcualte first, because it can destroy _reverse_map)
    var map = this._normalMap();
    
    // prepare the reverse map
    this._reverse_map = {};
    
    for (var i in map) {
      var v = map[i]; // get entry      
      if (!v) continue; // invalid entry.
      
      // add to reverse map
      this._reverse_map[SC.guidFor(v)] = i;
    }
    
    return this._reverse_map;
  },
  
  url: function(){
    return this.rootPath + "/" + this.firenze.getDoloresId();
  },
  
  // attach signal is 
  startAttach: function(paths) {
    var connect_messages = [];
    for (var i = 0; i < paths.length; i++) {
      connect_messages.push({ path: paths[i] + "/::attach" });
    }
    
    var url = this.url();
    SC.Request.putUrl(url).json().notify(this, "didAttach").send(connect_messages);
  },
  
  // oddly enough... no command for this yet. Huh.
  // Have to do something about that sometime.
  endAttach: function(path) {
    
  },
  
  didAttach: function(response){
    if (SC.ok(response)) {
      var res = response.get("body");
      for (var i = 0; i < res.length; i++) this.receiveRecordFromFirenze(res[i]["path"], res[i]["message"]);
    }
  },
  
  // ..........................................................
  // QUERY SUPPORT
  // 

  fetch: function(store, query) {
    // a fetch is really a request for an attachment. So, we just call Firenze.connect,
    // and be done with it.
    // we listen to responses there to confim that we got stuff, even though it is not our
    // main response path.
    
    // reverse-map
    var rm = this._reverseMap();
    
    // get connect path
    var path = rm[SC.guidFor(query.recordType)];
    
    // connect firenze
    if (path) {
      // pending queries (different from attached stores)
      if (!this._pendingQueries[path]) this._pendingQueries[path] = [];
      this._pendingQueries[path].push([store, query]);
      
      // add store
      if (!this._stores[path]) this._stores[path] = [];
      this._stores[path].push(store);
      
      // now, do the real connect
      this.firenze.connect(path, this, "receiveRecordFromFirenze");
      return YES;
    }
    return NO ; // return YES if you handled the query
  },
  
  /**
  Receives records corresponding to a path.
  */
  receiveRecords: function(path, _records) {
    var normal = this._normalMap();
    var model = normal[path];
    if (!model) return;
    
    var stores = this._stores[path], queries = this._pendingQueries[path], idx, len, q, r;
    
    // preprocess records (adding guid and removing destroys)
    len = _records.length;
    var records = [];
    var deletes = [];
    for (idx = 0; idx < len; idx++) {
      r = _records[idx];
      
      // set guid.
      r.guid = r.id;
      
      if (r["DELETE"]) deletes.push(r);
      else records.push(r);
    }
    
    // update stores
    if (stores) {
      len = stores.length;
      for (idx = 0; idx < len; idx++) {
        stores[idx].loadRecords(model, records);
        for (var di = 0; di < deletes.length; di++) {
          stores[idx].pushDestroy(model, deletes[di]["guid"]);
        }
      }
    }
    
    // if there are any pending queries for the path
    if (queries) {
      // get the number
      len = queries.length;
      
      // loop
      for (idx = 0; idx < len; idx++) {
        // get item and update (first part: store, second part: query)
        q = queries[idx];
        q[0].dataSourceDidFetchQuery(q[1]);
      }
      
      delete this._pendingQueries[path];
    }
  },
  
  // it would be much faster if firenze could bundle
  receiveRecordFromFirenze: function(path, record) {
    var rec;
    if (record !== "") rec = [JSON.parse(record)];
    else rec = [];
    this.receiveRecords(path, rec);
  },

  // ..........................................................
  // RECORD SUPPORT
  // 
  
  retrieveRecord: function(store, storeKey) {
    // if we don't have it, it does not exist!
    // So, tell them!
    var hash = {
      guid: store.idFor(storeKey),
      DELETE: true
    };
    
    store.dataSourceDidComplete(storeKey, hash, hash.guid);
    
    return YES;
  },
  
  createRecord: function(store, storeKey) {
    // reverse-map
    var rm = this._reverseMap();
    
    // get connect path
    var path = rm[SC.guidFor(store.recordTypeFor(storeKey))];
    
    // if path doesn't exist, return NO because we cannot do anything.
    if (!path) return NO;
    
    // get the hash
    var hash = store.readEditableDataHash(storeKey);
    
    // create an id for the hash
    // we need a unique id. Dolores ID is guaranteed to be unique.
    var did = this.firenze.getDoloresId();
    if (did == "NONE") {
      store.dataSourceDidError(storeKey);
      return NO;
    }
    hash.guid = did + "-" + (++this._currentId);
    hash.id = hash.guid;
    
    // we have added it (even if only in memory)
    store.dataSourceDidComplete(storeKey, hash, hash.guid);
    
    // send request
    SC.Request.putUrl(this.url()).json().notify(this, "didCreateRecord", store, storeKey, path, store.recordTypeFor(storeKey), hash.guid)
    .send([{path: path, message: JSON.stringify(hash) }]); // send to server
    
    return YES ; // return YES if you handled the storeKey
  },
  
  didCreateRecord: function(response, store, storeKey, path, recordType, id) {
    // we get an update, and that's all we need (assuming stuff worked)
    var result; 
    if (SC.ok(response) && (result = response.get("body")) && result.length > 0) {
      this.receiveRecords(path, result); // receive the records!!!!
    }
    // if it didn't, well, we have the store key so we can mark error
    else {
      // get the record
      var record = store.find(recordType, id);
      record.set("syncError", "CREATE");
    }
  },
  
  updateRecord: function(store, storeKey) {
    // reverse-map
    var rm = this._reverseMap();
    
    // get connect path
    var path = rm[SC.guidFor(store.recordTypeFor(storeKey))];
    
    // if path doesn't exist, return NO because we cannot do anything.
    if (!path) return NO;
    
    // get the hash
    var hash = store.readDataHash(storeKey);
    
    // we have added it (even if only in memory)
    store.dataSourceDidComplete(storeKey, hash);
    
    // send request
    SC.Request.putUrl(this.url()).json().notify(this, "didUpdateRecord", store, storeKey, path, store.recordTypeFor(storeKey), hash.guid)
    .send([{path: path, message: JSON.stringify(hash)}]); // send to server
    
    return YES ; // return YES if you handled the storeKey
  },
  
  didUpdateRecord: function(response, store, storeKey, path, recordType, id) {
    // we get an update, and that's all we need (assuming stuff worked)
    if (SC.ok(response)) {
      var result = response.get("body");
      this.receiveRecords(path, result); // receive the records!!!!
    }
    // if it didn't, well, we have the store key so we can mark error
    else {
      // get the record
      var record = store.find(recordType, id);
      record.set("syncError", "UPDATE");
    }
  },
  
  destroyRecord: function(store, storeKey) {
    // reverse-map
    var rm = this._reverseMap();
    
    // get connect path
    var path = rm[SC.guidFor(store.recordTypeFor(storeKey))];
    
    // if path doesn't exist, return NO because we cannot do anything.
    if (!path) return NO;
    
    // get the hash
    var hash = store.readDataHash(storeKey);
    
    // we have added it (even if only in memory)
    store.dataSourceDidDestroy(storeKey);
    
    // modify hash
    if (hash) hash.DELETE = YES;
    
    // send request
    SC.Request.putUrl(this.url()).json().notify(this, "didDestroyRecord", store, storeKey, path, store.recordTypeFor(storeKey), hash.guid)
    .send([{path: path, message: JSON.stringify(hash)}]); // send to server
    
    return YES ; // return YES if you handled the storeKey
  },
  
  didDestroyRecord: function(response, store, storeKey, path, recordType, id) {
    // we get an update, and that's all we need (assuming stuff worked)
    if (SC.ok(response)) {
      var result = response.get("body");
      this.receiveRecords(path, result); // receive the records!!!!
    }
    // if it didn't, well, we have the store key so we can mark error
    else {
      // who do we tell ? Not sure yet.
    }
  }
  
}) ;
