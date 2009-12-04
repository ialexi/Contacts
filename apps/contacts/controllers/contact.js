// ==========================================================================
// Project:   Contacts.contactController
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts */

/** @class

  The controller for a single contact.

  @extends SC.Object
*/
Contacts.contactController = SC.Object.create(
/** @scope Contacts.contactController.prototype */ {
	contentBinding: "Contacts.contactsController.selection",
	contentBindingDefault: SC.Binding.single(),
	
	isEditing: NO,
	
	beginEditing: function()
	{
		this.set("isEditing", YES);
		Contacts.mainPage.getPath("mainPane.splitter.bottomRightView.bottomRightView.contactView.contentView.form").beginEditing();
	},
	
	endEditing: function()
	{
		this.set("isEditing", NO);
		Contacts.mainPage.getPath("mainPane.splitter.bottomRightView.bottomRightView.contactView.contentView.form").commitEditing();
		Contacts.store.commitRecords();
	}
}) ;
