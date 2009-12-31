# ===========================================================================
# Project:   Contacts
# Copyright: ©2009 Alex Iskander and TPSi
# ===========================================================================

# Add initial buildfile information here
config :all, :required => :sproutcore

mode :production do
	config :all, :url_prefix => "/contacts/"
end


proxy '/s/contacts/', :to => 'localhost:8000', :url=> '/'
proxy '/comet/', :to => 'localhost:8008', :url=> '/'