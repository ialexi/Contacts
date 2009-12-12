// ==========================================================================
// Project:   Contacts.groupsController
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts */

/** @class

  The controller for a list of groups.

  @extends SC.ArrayController
*/
Contacts.groupsController = SC.ArrayController.create(
/** @scope Contacts.groupsController.prototype */ {
	allowMultipleSelection: NO,
	
	computeDragOperations: function(group, drag){
		var data = drag.dataForType(Contacts.Contact);
		if (data) {
			return SC.DRAG_COPY;
		}
	},
	
	performDragOperations: function(group, drag){
		var data = drag.dataForType(Contacts.Contact);
		group.get("contacts").pushObjects(data);
		Contacts.store.commitRecords();
	}
}) ;
