// ==========================================================================
// Project:   Contacts.contactController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Contacts.contactController = SC.Object.create(
/** @scope Contacts.contactController.prototype */ {
	contentBinding: "Contacts.contactsController.selection",
	contentBindingDefault: SC.Binding.single()
}) ;
