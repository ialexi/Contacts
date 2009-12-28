// ==========================================================================
// Project:   Contacts
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts */

// This is the function that will start your app running.  The default
// implementation will load any fixtures you have created then instantiate
// your controllers and awake the elements on your page.
//
// As you develop your application you will probably want to override this.
// See comments for some pointers on what to do next.
//
Contacts.main = function main() {
	Contacts.getPath('mainPage.mainPane').append() ;
	var groups = Contacts.store.find(Contacts.Group);
	var contacts = Contacts.store.find(Contacts.Contact);
	Contacts.groupsController.set("all", contacts);
	Contacts.groupsController.set('content', groups);
} ;

function main() { Contacts.main(); }
