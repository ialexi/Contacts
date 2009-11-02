// ==========================================================================
// Project:   Contacts.Group Fixtures
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts */

sc_require('models/group');

Contacts.Group.FIXTURES = [
	{
		"guid": 1,
		"name": "All",
		"contacts": [ 1, 2, 3 ]
	},
	{
		"guid": 2,
		"name": "First",
		"contacts": [1, 2]
	},
	{
		"guid": 3,
		"name": "Second",
		"contacts": [2, 3]
	},
	{
		"guid": 4,
		"name": "Third",
		"contacts": [1, 3]
	}
];
