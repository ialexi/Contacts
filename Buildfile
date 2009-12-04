# ===========================================================================
# Project:   Contacts
# Copyright: ©2009 Alex Iskander and TPSi
# ===========================================================================

# Add initial buildfile information here
config :all, :required => :sproutcore, :load_fixtures => true
proxy '/server/', :to => 'localhost:8000', :url=> '/contacts/'
proxy '/comet/', :to => 'localhost:8008', :url=> '/'