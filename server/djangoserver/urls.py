from django.conf.urls.defaults import *

urlpatterns = patterns('',
	# Here, we set up "servers" (logical servers, that is)
	# Each server (groups and contacts) works with URLs like this:
	# contacts/groups|contacts
	
	(r'^contacts/(?P<rtype>groups|contacts)$', 'contacts.views.records'),
	
	# These should eventually be bundled into attach
	#(r'^contacts/connect/(?P<uid>[^\s]+)$', "contacts.views.connect"),
	#(r'^contacts/disconnect/(?P<uid>[^\s]+)$', "contacts.views.connect")	
	
#	(r'^contacts/groups$', "contacts.views.groups"),
#	(r'^contacts/group/(?P<gid>[0-9]+)$', "contacts.views.group"),
#	(r'^contacts/contacts$', "contacts.views.contacts"),
#	(r'^contacts/contact/(?P<cid>[0-9]+)$', "contacts.views.contact"),
#	
#	(r'^contacts/connect/(?P<uid>[^\s]+)$', "contacts.views.connect"),
#	(r'^contacts/disconnect/(?P<uid>[^\s]+)$', "contacts.views.connect")
)
