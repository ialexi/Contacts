from django.conf.urls.defaults import *

urlpatterns = patterns('',
	# Here, we set up "servers" (logical servers, that is)
	# Each server is a Django-based Dudley server; that is, it receives requests
	# in bulk as signals, and can return similar signals in the same request, or later
	# by using the external Dobby server (making this a hybrid app).
	
	(r'^(?P<did>[^\s]+)$', 'contacts.controller.contactsController'),
	
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
