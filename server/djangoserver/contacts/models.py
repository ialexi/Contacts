from django.db import models
import cornelius.dudley
from django.db.models.signals import post_save


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
		if len(data["firstName"]) > 0 or len(data["lastName"]) > 0:
			self.firstName = data["firstName"]
			self.lastName = data["lastName"]
		self.email = data["email"]
		self.address = data["address"]
		self.city = data["city"]
		self.state = data["state"]
		self.zipcode = data["zip"]
	
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
	def fromRaw(self):
		pass


# Comet alerters
def contact_saved(sender, **kwargs):
	try:
		instance = kwargs["instance"]
		cornelius.dudley.update("contacts", json.dumps(instance.toRaw()))
	except:
		pass

post_save.connect(contact_saved, sender=Contact)

def group_saved(sender, **kwargs):
	try:
		instance = kwargs["instance"]
		cornelius.dudley.update("groups", json.dumps(instance.toRaw()))
	except:
		pass

post_save.connect(group_saved, sender=Group)