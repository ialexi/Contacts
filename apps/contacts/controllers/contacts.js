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
	contentBinding: "Contacts.contactsSortController.sortedContent",
	canAddContent: YES,
	canReorderContent: NO,
	canRemoveContent: YES,
	isEditable: YES,
	
	// deleting contacts is handled by contactsController.
	// removing contacts from groups is handled by the groupConttroller.
	inAll: YES, // can be NO or YES. If YES, the parent controller is called to remove items.
	inAllBinding: "Contacts.groupsController.allIsSelected",
	
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
	},
	
	collectionViewDeleteContent: function(view, content, indexes) {
	  // get records first for safety :)
	  var records = indexes.map(function(idx) {
	    return this.objectAt(idx);
	  }, this);
	  
	  // we only handle deletion if in "All" category.
	  if (!this.get("inAll")) {
	    Contacts.groupsController.removeContacts(records);
	    return;
	  }
	  
	  // process OUR WAY!
	  this._pendingOperation = { action: "deleteContacts", records: records, indexes: indexes  };
	  
	  // calculate text
	  var text = "";
	  var name = "Contact";
	  var len = indexes.get("length");
	  if (len > 1) { 
	    name += "s";
	    text = "Are you sure you want to delete these " + len + " contacts?";
    } else {
      text = "Are you sure you want to delete this contact?";
    }
    
    // show warning
	  SC.AlertPane.warn(
	    "Be Careful!", 
	    text,
	    null,
	    "Keep " + name,
	    "Delete " + name,
	    null,
	    this
	  );
	},
	
	deleteContacts: function(op)
	{
	  var records = op.records, indexes = op.indexes;
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
	
	addContact: function() {
	  var contact;
	  contact = Contacts.store.createRecord(Contacts.Contact, { firstName: "", lastName: "" }); // no name.
	  
	  // add contact to current group if needed
	  if (!this.get("inAll")) Contacts.groupsController.addNewContact(contact);
	  
	  this.selectObject(contact);
	  this.invokeLater(function(){
	    Contacts.contactController.beginEditing();
	  });
	  
	  contact.commitRecord();
	}
}) ;
