import subprocess
import sys
import os, os.path
import time

base = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
def setBase(path):
	global base
	base = os.path.abspath(path)

def relative(path):
	global base
	return os.path.join(base, path)

def run(commands):
	processes = []
	for command in commands:
		if isinstance(command, basestring):
			os.chdir(command)
		else:
			print command
			process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE, universal_newlines=True)
			print process.communicate()[0]