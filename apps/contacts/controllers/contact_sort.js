// ==========================================================================
// Project:   Contacts.contactSortController
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts */

/** @class

  (Document Your Controller Here)

  @extends SC.Object
*/
Contacts.contactsSortController = SC.ArrayController.create(
/** @scope RsvpClient.contactsController.prototype */ {
  content: null,
	contentBinding: "Contacts.contactSearchController.searchContent",
	
	sortedContent: [],
	sortOrder: "searchRelevance DESC,lastName,firstName",
	
	init: function()
	{
		sc_super();
		this.sortOrderDidChange();
	},
	
	_resort: function()
	{
		var sortkeys = this._sortKeys, content = this.get("[]");
		
		// return if no content
		if (!content)
		{
			this.set("sortedContent", null);
			return;
		}
		
		var i, l;
		
		// going to go directly to the source for performance.
		var store = Contacts.store;
		// make a compare function
		var compare = function(a, b)
		{
		  a = store.readDataHash(a.storeKey);
		  b = store.readDataHash(b.storeKey);
		  
		  var keys = sortkeys;
			var l = keys.length;
			for (i = 0; i< l; i++)
			{
				var k = keys[i];
				var aV = (a.get ? a.get(k.key) : a[k.key]);
				var bV = (b.get ? b.get(k.key) : b[k.key]);
				
				if (k.reverse)
				{
  				if (aV < bV) return 1;
  				else if (aV > bV) return -1;
				}
			  else {
  				if (aV > bV) return 1;
  				else if (aV < bV) return -1;
			  }
			}
			return 0;
		};
		
		// sort in new array
		var sorted = [];
		l = (content.get ? content.get("length") : content.length);
		for (i = 0; i < l; i++) sorted.push(content.objectAt(i));
		sorted.sort(compare);
		compare = null;
		this.set("sortedContent", sorted);
	},
	
	sortOrderDidChange: function()
	{
		var keystr = this.get("sortOrder");
		var keys = keystr.split(",");
		var result = [];
		
		var i, l = keys.length;
		for (i = 0; i < l; i++)
		{
			var key = keys[i];
			var parts = key.split(" ");
			
			var o = { "key": parts[0] };
			if (parts.length > 1 && parts[1] == "DESC") o.reverse = YES;
			
			result.push(o);
		}
		this._sortKeys = result;
		this._resort();
	}.observes("sortOrder"),
	
	contentDidChange: function()
	{
		this._resort();
	}.observes("[]")
}) ;
