// ==========================================================================
// Project:   Contacts.contactsController
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts */

/** @class

  The controller for a list of contacts.

  @extends SC.Object
*/
Contacts.contactsController = SC.ArrayController.create(SC.CollectionViewDelegate,
/** @scope Contacts.contactsController.prototype */ {
	inputBinding: "Contacts.groupsController.selection",
	inputBindingDefault: SC.Binding.single(),
	contentBinding: ".*input.contacts",
	canAddContent: YES,
	canReorderContent: NO,
	canRemoveContent: YES,
	isEditable: YES,
	
	collectionViewDragDataTypes: function(view) {
		return [Contacts.Contact];
	},
	
	collectionViewDragDataForType: function(view, drag, dataType) {
		var ret = null, sel;
		if (dataType == Contacts.Contact) {
			sel = view.get("selection");
			ret = [];
			if (sel) sel.forEach(function(x){ ret.push(x); }, this);
		}
		return ret;
	},
	
	collectionViewComputeDragOperations: function(view, drag) {
		return SC.DRAG_COPY;
	}
}) ;
