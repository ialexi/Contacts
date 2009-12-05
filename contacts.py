import sys
if len(sys.argv) < 2:
	command = "usage"
else:
	command = sys.argv[1]

if command == "setup":
	import commands.setup
	commands.setup.run()
elif command == "clean":
	import commands.clean
	commands.clean.run()
elif command == "start":
	import commands.start
	commands.start.run()
elif command == "usage":
	import commands.usage
	commands.usage.run()