// ==========================================================================
// Project:   Contacts.contactController
// Copyright: ©2009 Alex Iskander and TPSi
// ==========================================================================
/*globals Contacts */

/** @class

  The controller for a single contact.

  @extends SC.Object
*/
Contacts.appController = SC.ObjectController.create(
/** @scope Contacts.contactController.prototype */ {
	groupsList: null,
	contactsList: null,
	allGroup: null,
	
	focusContactsList: function() {
	  if (this.get("contactsList")) {
	    if (!Contacts.contactsController.get("hasSelection")) {
	      Contacts.contactsController.selectObject(Contacts.contactsController.firstSelectableObject());
	    }
	    this.get("contactsList").becomeFirstResponder();
    }
	},
	focusGroupsList: function() {
	  if (this.get("groupsList")) {
	    if (Contacts.groupsController.get("allIsSelected")) {
	      this.focusAllGroup();
	    } else {
	      this.get("groupsList").becomeFirstResponder();
      }
    }
	},
	focusAllGroup: function() {
	  if (this.get("allGroup")) this.get("allGroup").becomeFirstResponder();
	},
	selectFirstGroup: function() {
	  if (this.get("groupsList")) {
	    this.get("groupsList").becomeFirstResponder();
	    var set = SC.SelectionSet.create();
	    Contacts.groupsController.selectObject(Contacts.groupsController.objectAt(0));
    }
	}
}) ;
