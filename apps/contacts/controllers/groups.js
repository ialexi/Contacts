// ==========================================================================
// Project:   Contacts.groupsController
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts */

/** @class

  The controller for a list of groups.

  @extends SC.ArrayController
*/
Contacts.groupsController = SC.ArrayController.create(SC.CollectionViewDelegate,
/** @scope Contacts.groupsController.prototype */ {
	allowMultipleSelection: YES,
	all: null,
	selection: null,
	_observingGroups: [],
	allDidChange: function(){
	  if (!this.get("selection")) {
	    this.set("effectiveSelection", this.get("all"));
	    this.set("allIsSelected", YES);
    } else {
      this.recalculateFromGroups();
    }
	}.observes("all"),
	
	selectAllGroup: function(){
	  this.set("selection", null);
	  this.set("effectiveSelection", this.get("all"));
	  this.set("allIsSelected", YES);
	},
	
	selectionDidChange: function() {
	  for (var i = 0; i < this._observingGroups.length; i++){
	    this._observingGroups[i].removeObserver("contacts", this, this.groupDidChange);
	  }
	  this._observingGroups.length = 0;
	  if (this.get("selection")) {
	    this.get("selection").forEach(function(item) {
  	    item.addObserver("contacts", this, this.groupDidChange);
  	    this._observingGroups.push(item);
  	  }, this);
    }
	  this.recalculateFromGroups();
	}.observes("selection"),
	
	groupDidChange: function() {
	  this.recalculateFromGroups();
	},
	
	recalculateFromGroups: function() {
	  if (this.get("selection") && this.get("selection").get("length") > 0) {
	    var result = SC.Set.create();
	    this.get("selection").forEach(function(group){
	      result.addEach(group.get("contacts"));
	    });
	    
	    this.set("effectiveSelection", result);
	    this.set("allIsSelected", NO);
    }
	},
	
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
	},
	
	collectionViewDeleteContent: function(view, content, indexes) {
	  this._pendingOperation = { action: "deleteGroups", indexes: indexes  };
	  SC.AlertPane.warn(
	    "Be Careful!", 
	    "Are you sure you want to delete these " + indexes.get("length") + " groups?",
	    null,
	    "Keep Groups",
	    "Delete Groups",
	    null,
	    this
	  );
	},
	
	deleteGroups: function(op)
	{
	  var indexes = op.indexes;
	  var records = indexes.map(function(idx) {
	    return this.objectAt(idx);
	  }, this);
	  records.invoke('destroy');
	  
	  var selIndex = indexes.get('min') - 1;
	  if (selIndex < 0) selIndex = 0;
	  this.selectObject(this.objectAt(selIndex)); 
	  
		Contacts.store.commitRecords();
	},
	
	alertPaneDidDismiss: function(pane, status) {
	  if (!this._pendingOperation) return;
	  switch (status) {
	    case SC.BUTTON2_STATUS:
	      this[this._pendingOperation.action].call(this, this._pendingOperation);
	      this._pendingOperation = null;
	      break;
	    case SC.BUTTON1_STATUS:
	      break;
	  }
	},
	
	addGroup: function() {
	  var group;
	  group = Contacts.store.createRecord(Contacts.Group, { "name": "New Group" });
	  this.selectObject(group);
	  this.invokeLater(function(){
	    var contentIndex = this.indexOf(group);
	    var list = Contacts.mainPage.getPath("mainPane.splitter.topLeftView.groupList.contentView");
	    var listItem = list.itemViewForContentIndex(contentIndex);
	    listItem.beginEditing();
	  });
	},
	
	removeContacts: function(contacts) {
	  var sel = this.get("selection");
	  if (!sel) return;
	  
	  sel.forEach(function(item) {
	    item.get("contacts").removeObjects(contacts);
	  });
	},
	
	addNewContact: function(contact) {
	  var sel = this.get("selection");
	  if (!sel) return;
	  var pg = [];
	  sel.forEach(function(item) {
	    pg.push(item);
	  });
	  contact.set("pendingGroups", pg);
	}
}) ;
