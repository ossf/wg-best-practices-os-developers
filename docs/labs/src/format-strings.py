#!/usr/bin/env python3

# Here is a demo of how an attack can happen, though we don't need
# all this detail to be displayed to the learner.

# CONFIG includes a secret key that must not be revealed
CONFIG = {'SECRET_KEY': 'secret_password'}

# A event object with a single attribute used by the malicious format string to gain access to the
# secret application configuration below
class Event(object):
    def __init__(self, level, message):
        self.level = level
        self.message = message 

def format_event(user_input, new_event):
  return user_input.format(event=new_event)

my_event = Event('high', 'CPU burning')
print(format_event('{event.level}, {event.message}', my_event))
print(format_event('{event.__init__.__globals__[CONFIG][SECRET_KEY]}', my_event))

# Let's redefine format_event
print("Redefining")

def format_event(new_event):
  return '{event.level},{event.message}'.format(event=new_event)

print(format_event(my_event))
