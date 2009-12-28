Contacts.app
============
(I add .app for no reason)

It is _very_ work in progress; you can barely count it as functional!

For awhile, you had to actually download two components and start three servers manually.
Now, as long as you have a few prerequisites, everything should work!

No-Back-End-Method (SproutCore as only prerequisite)
----------------------------------------------------
If you just run sc-server in the project directory, it should already work using fixtures.

Prerequisites (that I know of):
-------------------------------
* Python 2.6 (or 2.5 w/simplejson)
* twisted (package for Python)
* django
* SproutCore (and all that entails)
* Edited core.js to enable Django back-end.

To download:
		> git clone git://github.com/ialexi/Contacts contacts

To initialize all submodules and set up the sample database:
		> cd contacts
		> python contacts.py setup

It will show everything it does.

Change apps/contacts/core.js to enable the back-end by uncommenting
the line for the django back-end.

To run:
		> python contacts.py start

And it should now be running! contacts.py starts all three servers (sc-server,
Dobby, and django).

sc-server will proxy both the Comet server and the Django server. 
You should be able to open up two browser windows to:
http://localhost:4020/contacts

If you change something in one, the changes should automatically appear in the other. There
are some issues with deleting contacts (refreshing fixes these).

Good luck. :)