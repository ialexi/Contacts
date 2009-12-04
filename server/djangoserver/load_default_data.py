from django.core.management import setup_environ
import settings
setup_environ(settings)

from contacts.models import Contact, Group

groups = ["Christmas Party", "Greetings", "Credit Unions", "Gas", "Utilities", "Friends", "Employees"]
gmap = {}
for g in groups:
	group = Group(name=g)
	group.save()
	gmap[g] = group

contacts = [
	{
		"firstName": "Alex",
		"lastName": "Iskander",
		"preferredName": "Alex",
		"email": "alex@alex.alex",
		"groups": ["Christmas Party", "Greetings", "Friends", "Employees"]
	},
	{
		"firstName": "John",
		"lastName": "Doe",
		"preferredName": "Johnny",
		"email": "john@example.com",
		"groups": ["Credit Unions", "Friends"]
	},
	{
		"firstName": "Smeagol",
		"lastName": "Kentucky", 	# Uh... what?
		"preferredName": "Gollum",
		"email": "dichotomy@precious.com",
		"groups": ["Greetings"]
	}
]

for c in contacts:
	contact = Contact(firstName=c["firstName"],lastName=c["lastName"],preferredName=c["preferredName"],email=c["email"])
	contact.save()
	for g in c["groups"]:
		gmap[g].contacts.add(contact)
		gmap[g].save()