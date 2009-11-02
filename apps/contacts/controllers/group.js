// ==========================================================================
// Project:   Contacts.groupController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Contacts.groupController = SC.Object.create(
/** @scope Contacts.contactsController.prototype */ {
	contentBinding: "Contacts.groupsController.selection",
	contentBindingDefault: SC.Binding.single(),
}) ;
