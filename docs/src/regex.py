#!/usr/bin/env python3

import re

print('Test Python regex')
print("Must be false: ", bool(re.search(r'^wrong$', "hello")))
print("Must be true: ", bool(re.search(r'^hello$', "hello")))
print("True if permissive: ", bool(re.search(r'^hello$', "hello\n")))
print("Should be false: ", bool(re.search(r'^hello$', "hello\nthere")))
