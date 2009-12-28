// ==========================================================================
// Project:   Contacts
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts Roots */

/** @namespace

  My cool new app.  Describe your application.
  
  @extends SC.Object
*/
Contacts = SC.Application.create(
  /** @scope Contacts.prototype */ {

  NAMESPACE: 'Contacts',
  VERSION: '0.1.0',

  // This is your application store.  You will use this store to access all
  // of your model data.  You can also set a data source on this store to
  // connect to a backend server.  The default setup below connects the store
  // to any fixtures you define.
  store: SC.Store.create({
  }).from(SC.Record.fixtures) //.from('Contacts.Provider')
  /*store: Roots.Store.create({
    map: {
      "contacts": "Contacts.Contact",
      "groups": "Contacts.Group"
    },
    rootPath: "/server"
  })*/
  
  // TODO: Add global constants or singleton objects needed by your app here.

}) ;
