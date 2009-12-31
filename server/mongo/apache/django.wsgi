import os,os.path
import sys

sys.path.append('R:\\clients\\tpsiwebsite\\websites\\apps\\s\\contacts-mongo')
os.environ['DJANGO_SETTINGS_MODULE'] = 'settings'

import django.core.handlers.wsgi
application = django.core.handlers.wsgi.WSGIHandler()

