""" Compliant Code Example """
import platform
import json


class Message(object):
    """Sample Message Object"""
    sender_id = int()
    text = str()

    def __init__(self):
        self.sender_id = 42
        self.text = "Some text"

    def printout(self):
        print(f"sender_id: {self.sender_id}\ntext: {self.text}")


class Preserver(object):
    """Demonstrating deserialisation"""

    def can(self, _message: Message) -> str:
        """Serializes a Message object.
            Parameters:
                _message (Message): Message object
            Returns:
                _jar (bytes): jar as string
        """
        return json.dumps(vars(_message))

    def uncan(self, _jar) -> Message:
        """Verifies and de-serializes a Message object.
            Parameters:
                _jar (String): Pickled jar
            Returns:
                (Message): Message object
        """
        j = json.loads(_jar)
        _message = Message()
        _message.sender_id = int(j["sender_id"])
        _message.text = str(j["text"])
        return _message


# serialization of a normal package
p1 = Preserver()
message = Message()
jar = p1.can(message)
print(jar)
print(type(json.loads(jar)))

# sending or storing would happen here
p2 = Preserver()
message = None
message = p2.uncan(jar)
message.printout()
print(message.sender_id)

#####################
# exploiting above code example
#####################
print("-" * 10)
print("Attacker trying to read the message")
print(jar)
message.printout()

print("-" * 10)
if platform.system() == "Windows":
    PAYLOAD = b"""cos
system
(S'calc.exe'
tR."""
else:
    PAYLOAD = b"""cos
system
(S'whoami;uptime;uname -a;ls -la /etc/shadow'
tR."""
print("Attacker trying to inject PAYLOAD")
p3 = Preserver()
message = None
message = p3.uncan(PAYLOAD)
