from helpers import multiserve
import os.path

commands = [
	# Django
	multiserve.relative("server/djangoserver"),
	["python", "manage.py", "runserver"],
	
	# Dobby
	multiserve.relative("server/dobby"),
	["python", "dobby.py"], # Dobby's so sweet...
	
	# SproutCore
	multiserve.relative(""),
	["sc-server"]
]

# And run.
multiserve.run(commands)