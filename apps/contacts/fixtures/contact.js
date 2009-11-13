// ==========================================================================
// Project:   Contacts.Contact Fixtures
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Contacts */

sc_require('models/contact');

Contacts.Contact.FIXTURES = [
	{
		"guid": 1,
		"firstName": "Alex",
		"lastName": "Iskander",
		"company": "",
		"address": "5544 S 104 East Avenue\nThe Loud Room",
		"city": "Tulsa",
		"state": "OK",
		"zip": "74146",
		"email": "alex@alex.alex",
		"phone": "(123) 456-7890",
		"active": true,
		"relationship": "customer"
	},
	{
		"guid": 2,
		"firstName": "Fadel",
		"lastName": "Iskander",
		"company": "TPSi",
		"address": "5544 S 104 East Avenue\nThe Loud Room",
		"city": "Tulsa",
		"state": "OK",
		"zip": "74146",
		"email": "da-fado@no-where.com",
		"active": true,
		"relationship": "friend"
		
	},
	{
		"guid": 3,
		"firstName": "Unknown",
		"lastName": "Iskander",
		"company": "TPSi",
		"address": "5544 S 104 East Avenue\nThe Loud Room",
		"city": "Tulsa",
		"state": "OK",
		"zip": "74146",
		"active": false,
		"relationship": "enemy"
	}
];
