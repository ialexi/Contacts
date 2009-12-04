Contacts.app
============
(I add .app for no reason)

It is _very_ work in progress; you can barely count it as functional!

For awhile, you had to actually download two components and start three servers manually.
Now, as long as you have a few prerequisites, everything should work!

Prerequisites (that I know of):
-------------------------------
* Python 2.6 (or 2.5 w/simplejson)
* twisted (package for Python)
* django
* SproutCore (and all that entails)

To download:
		> git clone git://github.com/ialexi/Contacts contacts
		> cd contacts
		> git submodule init
		> git submodule update

To set up the sample database:
		> cd server/djangoserver
		> python manage.py syncdb
		> python load_default_data.py

To run:
		> python server.py

And it should now be running! server.py starts all three servers (sc-server,
Dobby, and django).

sc-server will proxying both the Comet server and the Django server. 
You should be able to open up two browser windows to:
http://localhost:4020/contacts

If you change something in one, the changes should automatically appear in the other.

Good luck. :)