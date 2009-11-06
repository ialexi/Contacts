// ==========================================================================
// Project:   Contacts.contactsController
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts */

/** @class

  The controller for a list of contacts.

  @extends SC.Object
*/
Contacts.contactsController = SC.ArrayController.create(
/** @scope Contacts.contactsController.prototype */ {
	inputBinding: "Contacts.groupsController.selection",
	inputBindingDefault: SC.Binding.single(),
	canAddContent: YES,
	canReorderContent: NO,
	canRemoveContent: YES,
	isEditable: YES,
	test: function()
	{
		var c = [];
		var i = this.get("input");
		if (i)
		{
			if (i.get("length"))
			{
				console.error("YES");
				i = i.firstObject();
			}
			c = i.get("contacts");
		}
		this.set("content", c);
	}.observes("input")
}) ;
