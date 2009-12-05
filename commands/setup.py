from helpers import cmd
import os.path

# Have to go one folder up
cmd.setBase(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

commands = [
	# Django
	cmd.relative(""),
	["git", "submodule", "init"],
	["git", "submodule", "update"],
	cmd.relative("server/dobby"),
	["git", "submodule", "init"],
	["git", "submodule", "update"],
	cmd.relative("server/djangoserver"),
	["python", "manage.py", "syncdb"],
	["python", "load_default_data.py"]
]

def run():
	cmd.run(commands)

# And run.
if __name__ == "main":
	run()