Contacts.app
============
(I add .app for no reason)

It is _very_ work in progress; you can barely count it as functional!

First, you need to get contacts app and Dobby (the comet server):
		> git clone git://github.com/ialexi/Contacts.git contacts_app
		> git clone git://github.com/ialexi/dobby.git dobby

Now, in one Terminal, start Dobby. The default config will work for development,
*but is likely insecure for production* (if port 8003 is open, everyone can send
any message to anyone):
		> cd dobby
		> python dobby.py

Now, in another terminal, let's set up the contacts repository:
		> cd contacts_app
		> git submodule init
		> git submodule update

Now, we need to load default data, and start the Python server:
		> cd server/djangoserver
		> python load_default_data.py
		> python manage.py runserver

And finally, in yet another terminal (your third), start the SproutCore app:
		> cd contacts_app
		> sc-server

And it should now be running! sc-server is proxying both the Comet server and the
Django server. You should be able to open up two browser windows to:
http://localhost:4020/contacts

If you change something in one, the changes should automatically appear in the other.

Good luck. :)