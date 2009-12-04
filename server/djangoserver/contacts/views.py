from models import Contact, Group
from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect, HttpResponse, HttpResponseNotFound
import cornelius.imperio

try:
	import simplejson as json
except ImportError:
	import json
	

def groups(request):
	if request.method == "GET":
		groups = Group.objects.all()
		return HttpResponse(format_groups(groups), mimetype="application/json")


def group(request, gid):
	if request.method == "GET":
		group = get_object_or_404(Group, pk=int(gid))
		return HttpResponse(format_groups([group]), mimetype="application/json")
	elif request.method == "PUT":
		group = get_object_or_404(Group, pk=int(gid))
		data = json.loads(request.raw_post_data)
		if len(data["name"]) > 0:
			group.name = data["name"]
			group.save()
		return HttpResponse(format_groups([group]), mimetype="application/json")

def format_groups(groups):
	data = []
	for g in groups:
		data.append(g.toRaw())
	return json.dumps(data)




def contacts(request):
	if request.method == "GET":
		contacts = Contact.objects.all()
		return HttpResponse(format_contacts(contacts), mimetype="application/json")


def contact(request, cid):
	contact = get_object_or_404(Contact, pk=int(cid))
	if request.method == "PUT":
		data = json.loads(request.raw_post_data)
		contact.fromRaw(data)
		contact.save()
	return HttpResponse(format_contacts([contact]), mimetype="application/json")
			

def format_contacts(contacts):
	data = []
	for c in contacts:
		data.append(c.toRaw())
	return json.dumps(data)


def connect(request, uid):
	paths = json.loads(request.raw_post_data)
	# Unfortunately, this will send out a request for each. Optimizations would be nice...
	for p in paths:
		cornelius.imperio.connect(uid, p)
	return HttpResponse("{sent:true}", mimetype="application/json")

def disconnect(request, uid):
	paths = json.loads(request.raw_post_data)
	for p in paths:
		cornelius.imperio.disconnect(uid, p)
	return HttpResponse("{sent:true}", mimetype="application/json")