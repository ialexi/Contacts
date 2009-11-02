// ==========================================================================
// Project:   Contacts.ContactView
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts */

/** @class

  (Document Your View Here)

  @extends SC.View
*/
Contacts.ContactView = SC.View.extend(
/** @scope Contacts.ContactView.prototype */ {
	classNames: ["contact-view"],
	childViews: ["form"],
	backgroundColor: "white",
	contentBindingDefault: SC.Binding.single(),
	form: Forms.FormView.design(Forms.FormAnimation, {
		layout: { left: 20, top: 20, right: 20, bottom: 20 },
		contentBinding: ".parentView.content",
		fields: "name company address csz phone email".w(),
	
		name: Forms.FormView.row({
			fields: 'firstName lastName'.w(),
			fieldLabel: NO,
			// and I kinda should test fieldLabel: NO
			firstName: Forms.FormView.field(SC.TextFieldView, { hint: "first", classNames: ["name"], layout: { height: 35, width: 200 } }),
			lastName: Forms.FormView.field(SC.TextFieldView, { hint: "last", classNames: ["name"], layout: { height: 35, width: 200 } })
		}),
	
		company: Forms.FormView.row(SC.TextFieldView, {
			//fieldLabel: NO, // I LIKE HINTS DARNIT
			hint: "company",
			fieldKey: "company",
			fieldLabel: "company"
		}),
	
		address: Forms.FormView.row(SC.TextFieldView, {
			fieldLabel: "address", // because it insists on capitalizing
			fieldKey: "address", // redundant
			hint: "address",
			isTextArea: YES,
			layout: { width: 300, height: 100 }
		}),
		
		csz: Forms.FormView.row({
			fields: 'city state zip'.w(),
			fieldLabel: "",
			
			// and I kinda should test fieldLabel: NO
			city: Forms.FormView.field(SC.TextFieldView, { hint: "city", classNames: ["csz"], layout: { height: 35, width: 200 } }),
			state: Forms.FormView.field(SC.TextFieldView, { hint: "state", classNames: ["csz"], layout: { height: 35, width: 200 } }),
			zip: Forms.FormView.field(SC.TextFieldView, { hint: "zip", classNames: ["csz"], layout: { height: 35, width: 200 } }),
		}),
		
		phone: Forms.FormView.row(SC.TextFieldView, {
			hint: "phone",
			fieldKey: "phone",
			fieldLabel: "phone"
		}),
		
		email: Forms.FormView.row(SC.TextFieldView, {
			hint: "email",
			fieldKey: "email",
			fieldLabel: "email"
		}),
		
	
		/* This stuff goes at the end because it is entirely to test animation. So there. */
		index: 0,
	
		init: function()
		{
			sc_super();
		
			SC.Timer.schedule({
				target: this,
				action: function()
				{
					this.index++;
					if (this.index % 2 == 0)
					{
						var f = this.get("fields");
						var v = f.shift();
						f.push(v);
						this.notifyPropertyChange("fields");
					}
					else
					{
						for (var i = 0; i < this.childViews.length; i++)
						{
						//	this.childViews[i].adjust("height", Math.random() * 50 + 70);
						}
					}
				},
				interval: 1500,
				repeats: YES
			});
		}
	})
});
