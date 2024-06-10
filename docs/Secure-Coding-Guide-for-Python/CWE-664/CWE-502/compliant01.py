""" Compliant Code Example """
import hashlib
import hmac
import platform
import pickle
import secrets


class Message(object):
    """Sample Message Object"""
    sender_id = 42
    text = "Some text"

    def printout(self):
        """prints content to stdout to demonstrate active content"""
        print(f"Message:sender_id={self.sender_id} text={self.text}")


class Preserver(object):
    """Demonstrating deserialisation"""
    def __init__(self, _key):
        self._key = _key

    def can(self, _message: Message) -> tuple:
        """Serializes a Message object.
            Parameters:
                _message (Message): Message object
            Returns:
                _digest (String): HMAC digest string
                _jar (bytes): pickled jar as string
        """
        _jar = pickle.dumps(_message)
        _digest = hmac.new(self._key, _jar, hashlib.sha256).hexdigest()
        return _digest, _jar

    def uncan(self, _expected_digest, _jar) -> Message:
        """Verifies and de-serializes a Message object.
            Parameters:
                _expected_digest (String): Message HMAC digest
                _jar (bytes): Pickled jar
            Returns:
                (Message): Message object
        """
        _digest = hmac.new(self._key, _jar, hashlib.sha256).hexdigest()
        if _expected_digest != _digest:
            raise ValueError("Integrity of jar compromised")
        return pickle.loads(_jar)


# serialization of a normal package
key = secrets.token_bytes()
print(f"key={key}")
p1 = Preserver(key)
message = Message()
message.printout()
digest, jar = p1.can(message)

# sending or storing would happen here
p2 = Preserver(key)
message = None
message = p2.uncan(digest, jar)
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
p3 = Preserver(b"dont know")
message = None
message = p3.uncan(digest, PAYLOAD)
