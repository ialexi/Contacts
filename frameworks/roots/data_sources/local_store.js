/* A localStorage based offline storage for Roots 
   Progress: the basics should work, except that sync support is not written.
   The real issue is that it writes things in the wrong order: it needs to add
   first, then update other entries; be more transactional and such, to prevent
   some edge case issues that could corrupt the storage, so to speak.
   
   It would probably take just a few hours to fix properly, but since I don't want
   to spend those few hours yet, I'll let this (and offline storage in general) 
   rest for the time being.
*/
/*globals localStorage Roots*/
/**
  @class LocalStore
  Works by having collections, each of which has two linked lists: records and deleted records.
  
  The records list is the list retrieved by, for instance, fetch. The 
*/

Roots.LocalStore = SC.Object.extend({
  init: function() {
    
  },
  
  _get: function(path, id) {
    var result = localStorage[this.appId + ":" + path + "/" + id];
    if (!result) return null;
    return JSON.parse(result);
  },
  
  _set: function(path, id, value) {
    localStorage[this.appId + ":" + path + "/" + id] = JSON.stringify(value);
  },
  
  firstRecordId: function(path) {
    return localStorage[this.appId + "::firstRecord::" + path];
  },
  
  setFirstRecordId: function(path, id) {
    localStorage[this.appId + "::firstRecord::" + path] = id;
  },
  
  firstSyncId: function(path) {
    return localStorage[this.appId + "::firstSync::" + path];
  },
  
  setFirstSyncId: function(path, id) {
    localStorage[this.appId + "::firstSync::" + path] = id;
  },
  
  put: function(path, id, data) {
    // see if we have that id already in the store.
    var object = this._get(path, id);
    if (!object) {
      object = {
        nextSync: null,
        prevSync: null,
        inSyncSet: NO,
        nextRecord: null,
        prevRecord: null,
        inRecordSet: NO
      };
    }
    
    // set data
    object.data = data; // set data.
    
    // if being deleted, handle appropriately.
    if (data["DELETE"]) {
      if (object.inRecordSet) {
        // touch previous and next, patching them together.
        var prev = this._get(path, object.prevRecord);
        var next = this._get(path, object.nextRecord);
        
        // update props
        if (prev) prev.nextRecord = object.nextRecord;
        if (next) next.prevRecord = object.prevRecord;
        
        // save
        if (prev) this._set(path, object.prevRecord, prev);
        if (next) this._set(path, object.nextRecord, next);
        
        object.inRecordSet = NO;
      }
      
      // need to add a special optimization for inSyncSet where the
      // object's creation has not yet been synced.
    } else {
      if (!object.inRecordSet) {
        // need to read "first record" id and just change it.
        var first_record_id = this.firstRecordId(path);
        var first_record = this._get(path, first_record_id);
        
        // set its previous record the new first record
        if (first_record){
          first_record.prevRecord = id;
        
          // save
          this._set(path, first_record_id, first_record);
        }
        
        // now, set up new first record.
        object.prevRecord = null;
        object.nextRecord = first_record_id;
        object.inRecordSet = YES;
        this.setFirstRecordId(path, id);
      }
    }
    
    // now, add to sync set
    if (!object.inSyncSet) {
      var first_sync_id = this.firstSyncId(path);
      var first_sync = this._get(path, first_sync_id);
      if (first_sync) {
        first_sync.prevSync = id;
        this._set(path, first_sync_id, first_sync);
      }
      
      
      object.nextSync = first_sync_id;
      object.prevSync = null;
      object.inSyncSet = YES;
      this.setFirstSyncId(path, id);
    }
    
    // and finally, save the object
    this._set(path, id, object);
  },
  
  // get all entries for path
  get: function(path) {
    var result = [];
    var start = this._get(path, this.firstRecordId(path));
    while (start) {
      result.push(start);
      start = this._get(path, start.nextRecord);
    }
    return result;
  }
});