from helpers import multiserve
import os.path

multiserve.setBase(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
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
def run():
	multiserve.run(commands)
	
if __name__ == "main":
	run()