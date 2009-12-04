// ==========================================================================
// Project:   Contacts.Provider
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts, Pomona */
Contacts.GROUPS_QUERY = SC.Query.local(Contacts.Group, {
	orderBy: "name"
});
Contacts.CONTACTS_QUERY = SC.Query.local(Contacts.Contact);


/** @class

Data source for Contacts.

@extends SC.DataSource
*/
Contacts.Provider = SC.DataSource.extend(
/** @scope Contacts.Provider.prototype */ {
	init: function() {
		this.firenze = Pomona.Firenze.create();
		this.firenze.connect("contacts", this, "contactReceived");
		this.firenze.connect("groups", this, "groupReceived");
	},

	// ..........................................................
	// QUERY SUPPORT
	// 
	
	contactReceived: function(path, message) {
		if (message.trim() === "") return;
		var data = JSON.parse(message);
		
		
		Contacts.store.loadRecords(Contacts.Contact, [data]);
	},
	
	groupReceived: function(path, message) {
		if (message.trim() === "") return;
		var data = JSON.parse(message);
		
		Contacts.store.loadRecords(Contacts.Group, [data]);
	},
	
	fetch: function(store, query) {
		if (!query) return NO;
		if (query.get("recordType") === Contacts.Group) {
			if (this.get("hasFetchedGroups"))
			{
				store.dataSourceDidFetchQuery(query);
				return YES;
			}
			SC.Request.getUrl("/server/groups").json().notify(this, "didFetchGroups", store, query).send();
			return YES;
		} else if (query.get("recordType") === Contacts.Contact) {
			if (this.get("hasFetchedContacts"))
			{
				store.dataSourceDidFetchQuery(query);
				return YES;
			}
			SC.Request.getUrl("/server/contacts").json().notify(this, "didFetchContacts", store, query).send();
			return YES;
		}
		return NO;
	},
	
	didFetchGroups: function(response, store, query) {
		if (SC.ok(response)) {
			this.set("hasFetchedGroups", YES);
			store.loadRecords(Contacts.Group, response.get("body"));
			if (query) store.dataSourceDidFetchQuery(query);
		} else if (query) store.dataSourceDidErrorQuery(query, response);
	},
	
	didFetchContacts: function(response, store, query) {
		if (SC.ok(response)) {
			this.set("hasFetchedContacts", YES);
			store.loadRecords(Contacts.Contact, response.get("body"));
			if (query) store.dataSourceDidFetchQuery(query);
		} else if (query) store.dataSourceDidErrorQuery(query, response);
	},

	// ..........................................................
	// RECORD SUPPORT
	// 

	retrieveRecord: function(store, storeKey) {
		if (SC.kindOf(store.recordTypeFor(storeKey), Contacts.Group)) {
			var url = "/server/group/" + store.idFor(storeKey);
			SC.Request.getUrl(url).json().notify(this, "didRetrieveGroup", store, storeKey).send();
		}
	},

	createRecord: function(store, storeKey) {
		// TODO: Add handlers to submit new records to the data source.
		// call store.dataSourceDidComplete(storeKey) when done.

		return NO ; // return YES if you handled the storeKey
	},

	updateRecord: function(store, storeKey) {
		var url = "";
		if (SC.kindOf(store.recordTypeFor(storeKey), Contacts.Group)) {
			url = "/server/group/";
		} else if (SC.kindOf(store.recordTypeFor(storeKey), Contacts.Contact))  {
			url = "/server/contact/";
		}
		
		if (url !== "") {
			SC.Request.putUrl(url + store.idFor(storeKey))
				.json().notify(this, "didUpdateRecord", store, storeKey)
				.send(store.readDataHash(storeKey));
			return YES;
		}
		
		return NO ; // return YES if you handled the storeKey
	},
	
	didUpdateRecord: function(response, store, storeKey) {
		if (SC.ok(response)) {
			var data = response.get('body');
			if (data) data = data[0];
			store.dataSourceDidComplete(storeKey, data);
		} else store.dataSourceDidError(storeKey);
	},

	destroyRecord: function(store, storeKey) {

		// TODO: Add handlers to destroy records on the data source.
		// call store.dataSourceDidDestroy(storeKey) when done

		return NO ; // return YES if you handled the storeKey
	}

}) ;
