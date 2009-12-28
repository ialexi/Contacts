from django.db import models
import cornelius.dudley
from django.db.models.signals import post_save, post_delete


try:
	import simplejson as json
except ImportError:
	import json

class Contact(models.Model):
	"""A Contact"""
	firstName = models.TextField(blank=True)
	lastName = models.TextField(blank=True)
	
	preferredName = models.TextField(blank=True)
		
	company = models.ForeignKey("Contact", null=True)
	
	phone = models.CharField(blank=True, max_length=100)
	address = models.TextField(blank=True)
	city = models.TextField(blank=True)
	state = models.TextField(blank=True)
	zipcode = models.TextField(blank=True)
	
	email = models.EmailField()
	
	lastModified = models.DateTimeField(blank=True, auto_now=True)
	created = models.DateTimeField(blank=True, auto_now_add=True)
	
	def toRaw(self):
		return {
			"guid": self.pk,
			"firstName": self.firstName,
			"lastName": self.lastName,
			"preferredName": self.preferredName,
			"email": self.email,
			"address": self.address,
			"city": self.city,
			"state": self.state,
			"zip": self.zipcode
		}
		
	def fromRaw(self, data):
		if "firstName" in data: self.firstName = data["firstName"] # Yes, these may be blank
		if "lastName" in data: self.lastName = data["lastName"]
		if "email" in data: self.email = data["email"]
		if "address" in data: self.address = data["address"]
		if "city" in data: self.city = data["city"]
		if "state" in data: self.state = data["state"]
		if "zip" in data: self.zipcode = data["zip"]
	
	def __unicode__(self):
		return u"Contact: " + self.firstName + " " + self.lastName


class Group(models.Model):
	name = models.TextField(blank=False)
	contacts = models.ManyToManyField("Contact")
	
	def toRaw(self, includeContacts=True):
		data = {
			"guid": self.pk,
			"name": self.name
		}
		if includeContacts:
			contacts = []
			contacts = [contact.pk for contact in self.contacts.all()]
			data["contacts"] = contacts
		return data
	def fromRaw(self, data):
		self.name = data.name
		


# Comet alerters
def contact_saved(sender, **kwargs):
	try:
		instance = kwargs["instance"]
		cornelius.dudley.update("contacts", json.dumps(instance.toRaw()))
	except:
		pass

def contact_deleted(sender, **kwargs):
	try:
		instance = kwargs["instance"]
		struct = instance.toRaw()
		struct["DELETE"] = True
		cornelius.dudley.update("contacts", json.dumps(struct))
	except:
		pass

post_save.connect(contact_saved, sender=Contact)
post_delete.connect(contact_deleted, sender=Contact)

def group_saved(sender, **kwargs):
	try:
		instance = kwargs["instance"]
		cornelius.dudley.update("groups", json.dumps(instance.toRaw()))
	except:
		pass

def group_deleted(sender, **kwargs):
	try:
		instance = kwargs["instance"]
		struct = instance.toRaw()
		struct["DELETE"] = True
		cornelius.dudley.update("groups", json.dumps(struct))
	except:
		pass


post_save.connect(group_saved, sender=Group)
post_delete.connect(group_deleted, sender=Group)