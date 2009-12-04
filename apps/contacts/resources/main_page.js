// ==========================================================================
// Project:   Contacts - mainPage
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts Animate */
require("views/contact");
// This page describes the main user interface for your application.  
Contacts.mainPage = SC.Page.design({

	// The main pane is made visible on screen as soon as your app is loaded.
	// Add childViews to this pane for views to display immediately on page 
	// load.
	mainPane: SC.MainPane.design({
		childViews: 'toolbar splitter'.w(),
		toolbar: SC.ToolbarView.design({
		  classNames: ["toolbar"],
			layout: { left: 0, top: 0, right: 0, height: 32 }
		}),
		
		// splitter between contact chooser and contact view.
		splitter: SC.SplitView.design({
			layout: { left: 0, top: 32, right: 0, bottom: 0 },
			defaultThickness: 200,
			dividerThickness: 1,
			// companies
			topLeftView: SC.ScrollView.design({
				borderStyle: SC.BORDER_NONE,
				hasHorizontalScroller: NO,
				contentView: SC.ListView.design({
					contentBinding: "Contacts.groupsController.arrangedObjects",
					selectionBinding: "Contacts.groupsController.selection",
					contentValueKey: "name",
					canEditContent: YES,
					exampleView: SC.ListItemView.design({
						inlineEditorDidEndEditing: function() {
							sc_super();
							Contacts.store.commitRecords();
						}
					})
				})
			}),
			
			// another splitter between companies and contacts
			bottomRightView: SC.SplitView.design({
				defaultThickness: 200,
				dividerThickness: 1,
				topLeftView: SC.ScrollView.design({
					borderStyle: SC.BORDER_NONE,
					contentView: SC.ListView.design({
						contentBinding: "Contacts.contactsController.arrangedObjects",
						selectionBinding: "Contacts.contactsController.selection",
						contentValueKey: "fullName",
						exampleView: SC.ListItemView.design({
							/*renderLabel: function(context, label) {
								if (label === undefined || label === 'undefined') label = "Loading...";
								this._cachedLabel = label;
								return arguments.callee.base.call(this, context, label);
							},
							mouseDown: function(evt){
								sc_super();
								var dv = SC.LabelView.create({
									layout: {
										height: this.get('layout').height,
										width: 100
									},

									value: this._cachedLabel
								}).createLayer();

								// initiate the drag
								SC.Drag.start({
									event: evt,
									source: this,
									dragView: dv,
									ghost: YES,
									ghostActsLikeCursor: YES,
									slideBack: YES,
									dataSource: this
								});

								return YES;
							},

							dragDidEnd: function(drag){
								//drag.dragView.destroy();
							}*/
						})
					})
				}),
				
				// contact view
				bottomRightView: SC.View.design({
					backgroundColor: "#555",
					childViews: 'contactView toolbar'.w(),
					contactView: SC.ScrollView.design({
						classNames: ["contact-panel"],
						layout: { left: 15, right: 15, bottom: 47, top: 15 },
						borderStyle: SC.BORDER_NONE,
					  	contentView: Contacts.ContactView.design({
						  contentBinding: "Contacts.contactsController.selection"
					  })
					}),
					
					beginEditing: function()
					{
						console.error("Hi");
					},
					
					toolbar: SC.ToolbarView.design({
						layout: { left:0, right:0, bottom:0, height:32 },
						childViews: "edit save".w(),
						edit: SC.ButtonView.design(Animate.Animatable, {
							transitions: {
								opacity: 0.25
							},
							title: "Edit",
							layout: { left: 10, centerY: 0, height:24, width: 90 },
							target: Contacts.contactController,
							action: "beginEditing",
							style: { opacity: 1 }
						}),
						save: SC.ButtonView.design(Animate.Animatable, {
							transitions: { opacity: 0.25 },
							title: "Save",
							layout: { left: 10, centerY: 0, height: 24, width: 90 },
							target: Contacts.contactController,
							action: "endEditing",
							style: {
								opacity: 0, display: "none"
							}
						}),
						
						controllerIsEditing: NO,
						controllerIsEditingBinding: "Contacts.contactController.isEditing",
						controllerIsEditingDidChange: function()
						{
							var save = this.get("save");
							var edit = this.get("edit");
							
							
							if (save.isClass) return;
							
							if (this.get("controllerIsEditing"))
							{
								save.adjust({
									opacity: 1, display: "block"
								}).updateLayout();
								edit.adjust({
									opacity: 1, display: "none"
								}).updateLayout();
							}
							else
							{
								edit.adjust({
									opacity: 1, display: "block"
								}).updateLayout();
								save.adjust({
									opacity: 1, display: "none"
								}).updateLayout();
							}
						}.observes("controllerIsEditing")
					})
				})
			})
			
		})
	})

});
