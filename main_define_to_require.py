'''Converts the first define in js/dist/main.js.  Did this to resolve the multipleDefine
error when working with dojoLoader and es6 modules'''

import re
import sys

js_file = sys.argv[1]

def read_file(file):
	file = open(file,"r")
	contents = file.read()
	return contents

def define_to_require(contents):
	return re.sub(r"\bdefine\b","require",contents,1)
	
	
def write_file(file, contents):
	file = open(file, "w")
	file.write(contents)
	file.close()
	
file_contents = read_file(js_file)
new_content = define_to_require(file_contents)
write_file(js_file, new_content)

print "define changed to require"
