// ==========================================================================
// Project:   Contacts.groupController
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts */

/** @class

  The controller which IS NOT USED AT THE MOMENT!!!
  @extends SC.Object
*/
Contacts.groupController = SC.Object.create(
/** @scope Contacts.contactsController.prototype */ {
	contentBinding: "Contacts.groupsController.selection",
	contentBindingDefault: SC.Binding.single(),
}) ;
