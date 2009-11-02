// ==========================================================================
// Project:   Contacts.contactsController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts */

/** @class

  (Document Your Controller Here)

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
