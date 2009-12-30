from django.http import HttpResponse
from django.http import Http404
from cornelius import dudley
import datetime
import random
import re, string

try: import simplejson as json
except ImportError: import json

class Roots(object):
	def __init__(self, root, allowed):
		"""
		Initializes a Roots server object with a set of allowed attach points.
		"""
		if not allowed:
			allowed = []
		self.allowed = allowed
		self.root = root
	
	def __call__(self, request, rtype):
		""" The main responder """
		if not rtype in self.allowed:
			raise Http404
		
		if request.method == "GET":
			return self.get(request, rtype)
		elif request.method == "PUT": # delete is done with record containing "DELETE"==True
			return self.put(request, rtype)
	
	def get(self, request, rtype):
		# for now, we only support sending _All_ data to the client.
		did = None
		if "did" in request.GET: did = request.GET["did"]
		
		data = self.attach(rtype, did) # attach returns a dump of the data
		return HttpResponse(json.dumps(data), mimetype="application/json")
	
	def attach(self, rtype, did):
		# connect if we can
		if did: dudley.connect(did, (rtype, ))
		
		# now, get records and return that
		return self.fetch_records(rtype)
	
	def put(self, request, rtype):
		records = json.loads(request.raw_post_data)
		result = self.receive_records(rtype, records)
		return HttpResponse(json.dumps(result), mimetype="application/json")
		
	def fetch_records(self, rtype):
		return []
	
	def receive_records(self, rtype, records):
		return []
	

from pymongo import Connection
class MongoRoots(Roots):
	def __init__(self, root, allowed, db):
		Roots.__init__(self, root, allowed)
		self.db = db
	
	def fetch_records(self, rtype):
		result = []
		for i in self.db[rtype].find():
			r = {}
			for key in i:
				value = i[key]
				
				# skip _id
				if key == "_id": continue
				if isinstance(value, datetime.datetime) or isinstance(value, datetime.time) or isinstance(value, datetime.date):
					value = value.isoformat() # it should usually be stored in string format anyway...
				r[key] = value
			result.append(r)
		return result
	
	def receive_records(self, rtype, records):
		"""receive messages"""
		result = []
		updates = []
		for record in records:
			if not "id" in record:
				continue
			
			existing = None
			
			# get a valid full id
			id = record["id"]
						
			# see if there is an existing.
			existing = self.db[rtype].find_one({"id": id})
			
			# if so, grab the _id from the old one.
			if existing: record["_id"] = existing["_id"]
			
			# see if we are supposed to delete.
			if "DELETE" in record and record["DELETE"]:
				if existing: self.db[rtype].remove(record["_id"])
				else: continue
			else:
				self.db[rtype].save(record)
			
			del record["_id"]
			result.append(record)
			updates.append( (rtype, json.dumps(record)) )
		
		dudley.updates(updates) # Delete, updates, and adds! So easy!
		return result


records = MongoRoots("contacts", ["groups", "contacts"], db=Connection().contacts)