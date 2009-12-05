from helpers import cmd
import os.path

# Have to go one folder up
cmd.setBase(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

commands = [
	# Django
	cmd.relative(""),
	["rm", "server/djangoserver/contacts.db"]
]

def run():
	cmd.run(commands)

# And run.
if __name__ == "main":
	run()