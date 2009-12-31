from django.http import HttpResponse
from django.http import Http404
from cornelius import dudley
import datetime
import random
import re, string

try: import simplejson as json
except ImportError: import json

class Path(object):
	def __init__(self, full):
		# example full: contacts/groups/12/contacts/::attach
		self.full 			= full	# The full path
		self.partials 		= []	# contacts/groups/, 12/, contacts/
		self.location 		= ""	# contacts/groups/12/contacts/
		self.next 			= full	# ::attach (previously: contacts/::attach)
		self.parent			= ""	# 
		self.current 		= ""	# Defined by whatever passed path to you.
	
	def push(self, item, remain):
		if len(self.partials) > 0: self.parent += self.partials[-1]
		self.partials.append(item)
		self.next = remain
		self.location += item # append the path to the location

class RootRequest(object):
	def __init__(self, doloresid, request):
		self.request = request
		self.did = doloresid
		
		self.queuedConnects = []
		self.queuedUpdates = []
		self.updates = []
		if self.request.raw_post_data:
			try:
				self.updates = json.loads(self.request.raw_post_data)
			except:
				self.push("::error", {"type": "could not read updates"})
	
	def push(self, path, message):
		self.queuedUpdates.append({ "path": path, "message": json.dumps(message) })
	
	def push_all(self, path, messages):
		for message in messages:
			self.push(path, message)
	
	def finish(self):
		dudley.connect(self.did, self.queuedConnects)
		return HttpResponse(json.dumps(self.queuedUpdates), mimetype="application/json")
	
	def set(self, prop, value):
		self.request.session[prop] = value
	
	def get(self, prop):
		return self.request.session[prop]
	
	def connect(self, toPath):
		self.queuedConnects.append(toPath)
	

# This is meant to act as if you were building right on top of Dobby, but
# work while building right on top of Django :)
class Controller(object):
	paths = ()
	def __init__(self):
		pass
		
	def update(self, iq, path, message):
		found = False
		other_object = False
		trim_slashes = False
		path.current = path.location.strip("/") # our little inside info for path
		
		# Go through all of our possible matches; stop when we've found the right one.
		for possibility, action in self.paths:
			# By default, the path should expect either / or the end.
			# If it ends with the magic #, however, well... then that means use directly.
			if not possibility.endswith("#"):
				possibility = possibility + r"(/|$)"
			else: 
				possibility = possibility[:-1]
			
			if possibility == "":
				# THIS IS IT.
				found = True
				break
				
			# Match normally
			match = re.match(possibility, path.next)
			if match:
				found = True
				break
		
		# Handle not found
		if not found:
			iq.push("::not_found", {"path": path.full})
			return
		
		# Determine the action type
		if isinstance(action, basestring):
			try:
				result = getattr(self, action)
			except AttributeError:
				# probably need a more proper way of error handling
				iq.push("::not_implemented", { "path": path.full })
				print "Action not found: ", action
		else:
			# we must assume it is an object
			result = action.update
			other_object = True
		
		kwargs = {}
		if match: 
			kwargs = match.groupdict()
			path.push(match.group() , path.next[match.end():]) # Split the path.
		
		# call result
		result(iq, path, message, **kwargs)

				

class RootController(Controller):
	"""docstring for RootController"""
	def __init__(self):
		super(RootController, self).__init__()
	
	def __call__(self, request, did):
		# We only accept PUT (to receive messages)
		if request.method != "PUT":
			raise Http404()
			
		# Create the iq: the representative for the client
		iq = RootRequest(did, request)
		
		# send updates
		updates = iq.updates
		for update in updates: 
			path = None
			message = ""
			if "path" in update: path = update["path"]
			if "message" in update: message = json.loads(update["message"])
			
			if path: self.update(iq, Path(path), message)
		
		# return the response and process any queued stuff
		return iq.finish()


class ListController(Controller):
	# Normal list controllers have only two main paths.
	# One path is a signal (and as such, starts with ::)
	# The other modifies the list (in that it returns a single item rather than several)
	paths = (
		# The ^ character is unneeded because "match" is used.
		("::attach", "attach"), # strings are interpreted as function names on the object
		(r"(?P<id>[^\s]+)", "single"),
		("", "update_list") # default
	)
	
	def attach(self, iq, path, message):
		if self.allow(iq, "READ"):
			iq.connect(path.current) # path.location is the part excluding ::attach (which is path.next)
			iq.push_all(path.current, self.getAllItems(iq))
		else:
			iq.push(path.current, {"ERROR": "not-allowed"})
	
	def allow(self, iq, what):
		# what = "READ", "WRITE"
		return True
		
	def getAllItems(self, iq):
		return [] # THERE ARE NO ITEMS HERE!!! SUBCLASSES MUST ADD THEM!
		
	def single(self, iq, path, message, id):
		item = self.getItemById(iq, id)
		if item:
			iq.push(path.current, item)
		else:
			iq.push(path.current, {"id": id, "ERROR": "not-found: The requested record (id " + id + ") could not be retrieved."})
	
	def getItemById(self, iq, itemId):
		return None
	
	# path.next = "" because the handler for the list already handled the list name.
	def update_list(self, iq, path, message):
		result = None
		if self.allow(iq, "WRITE"):
			result = self.write(iq, message["id"], message)
		if result:
			dudley.update(path.current, json.dumps(result)) # dudley messages must be strings
			# no message for success
		else:
			message["ERROR"] = "not-allowed"
			iq.update(path.current, message)
			
	def write(self, iq, data):
		return None


class MongoListController(ListController):
	"""docstring for MongoListController"""
	def __init__(self, db, collectionName):
		super(MongoListController, self).__init__()
		self.db = db
		self.collectionName = collectionName
	
	def sanitize(self, item):
		r = {}
		
		# loop through each key
		for key in item:
			value = item[key]
		
			# skip id
			if key == "_id": continue
		
			# process dates
			if isinstance(value, datetime.datetime): value = value.isoformat()
		
			# add to result object
			r[key] = value
		return r
	
	def getAllItems(self, iq):
		# Basically loops through each item and does two things: sanitize DateTime and skip _id field
		result = [self.sanitize(r) for r in self.db[self.collectionName].find()]
		
		# return
		return result
	
	def getItemById(self, iq, itemId):
		res = self.db[self.collectionName].find_one({"id": itemId})
		if not res: return None
		
		return self.sanitize(res)
	
	def write(self, iq, itemId, data):
		# If there is an existing one, add the db id
		existing = self.db[self.collectionName].find_one({"id": itemId})
		if existing: data["_id"] = existing["_id"]
		
		if "DELETE" in data and data["DELETE"]:
			if existing: self.db[self.collectionName].remove(data["_id"])
			else: return None
		else:
			self.db[self.collectionName].save(data)
			
		del data["_id"]
		return data


from pymongo import Connection
db = Connection().contacts
class ContactsController(RootController):
	"""docstring for ContactsController"""
	paths = (
		("contacts", MongoListController(db, "contacts")),
		("groups", MongoListController(db, "groups"))
	)


contactsController = ContactsController()