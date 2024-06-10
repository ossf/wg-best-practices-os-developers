# CWE-502: Deserialization of Untrusted Data

The `pickle` module is known to be vulnerable [[docs.python.org 2023]](https://docs.python.org/3.9/library/pickle.html) against unwanted code execution during deserialization and should only be used if there is no architectural text-based alternative.
Even if data has been created from a trusted source we need to verify that it has not been tampered with during transport.

Security-related concerns during object serialization and deserialization include:

* Prefer text-based formats such as `JSON` or `YAML` if possible.
* Consider using `Base64` encoding for binary data
* Only unpickle data you trust [docs.python.org 2023].
* Restricting Globals during deserialization.
* Prefer `xmlrpc.client` for network operations that are already `XML` based.
* Sign data that is crossing trust boundaries with `hmac`.
* Use Input validation.

## Noncompliant Code Example

The `noncompliant01.py`  code demonstrates arbitrary code execution [Checkoway Oct 2013] using `os.system` to launch a program during unpickling when `pickle.loads()`.

*[noncompliant01.py](noncompliant01.py):*

```py
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
```

The deserializating `Preserver.uncan()` method has no solution to verify the content prior to unpickling it and runs the PAYLOAD even before turning it into an object. On Windows you have `calc.exe`  and on Unix a bunch of commands such as `uname -a and ls -la /etc/shadow`.

> [!CAUTION]
> The `compliant01.py` code only demonstrates integrity protection with hmac.
> The pickled object is not encrypted and key-handling is inappropriate!
> Consider using proper key management with `x509` and encryption [[pyca/cryptography 2023]](https://cryptography.io/en/latest/).

*[compliant01.py](compliant01.py):*

```py
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
```

The integrity verification in `compliant01.py` throws an exception `ValueError: Integrity of jar compromised prior to deserializationunpickling to prevent the PAYLOAD executed.`

## Compliant Solution JSON without pickle

Text-based formats, such as `JSON` and `YAML`, should always be preferred. They have a lower set of capabilities and reduce the attack surface [python.org comparison-with-json 2023] when compared to `pickle`.

The `compliant02.py`  code only allows serializing and deserialization of object data and not object methods as in `noncompliant01.py` or `compliant01.py`.

Consider converting binary data into text using `Base64` encoding for performance and size irrelevant operations.

*[compliant02.py](compliant02.py):*

```py
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
```

The `compliant02.py` stops with the unpacking with a `json.decoder.JSONDecodeError`.

## Exceptions

Serialized data from a trusted input source does not require sanitization, provided that the code clearly documents that it relies on the input source being trustworthy. For example, if a library is being audited, a routine of that library may have a documented precondition that its callers pre-sanitize any passed-in serialized data or confirm the input source as trustworthy.

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|Bandit|1.7.4|B301|Pickle and modules that wrap it can be unsafe when used to de-serialize untrusted data, possible security issue.Bandit can only detect a pickle module in use and is unable to detect an acceptable implementation code that combines pickle with `hmac` and proper key managment.|

## Related Vulnerabilities

|Product|CVE|Description|CVSS Rating|Comment|
|:----|:----|:----|:----|:----|
|TensorFlow using the pickle module|[CVE-2021-37678](https://www.cvedetails.com/cve/CVE-2021-37678/)|TensorFlow machine learning platform allows code execution when de-serializing a Keras model from `YAML` format.|v3.1: 8.8 High||
|NVFLARE < 2.1.4|[CVE-2022-34668](https://www.cvedetails.com/cve/CVE-2022-34668/)|Deserialization of Untrusted Data with Pickle may allow an unprivileged network attacker to cause Remote Code Execution (RCE).|v3.1: 9.8 Critical|Exploit available on [exploit-db.com](https://www.exploit-db.com/exploits/51051)|
|Graphite 0.9.5 through 0.9.10|[CVE-2013-5093](https://www.cvedetails.com/cve/CVE-2013-5093/)|The renderLocalView function in render/views.py uses the pickle Python module unsafely, which allows remote attackers to execute arbitrary code via a crafted serialized object|n/a|Exploit available on [exploit-db.com](https://www.exploit-db.com/exploits/27752)|
|Superset prior to 0.23|[CVE-2018-8021](https://www.cvedetails.com/cve/CVE-2018-8021/)|TUnsafe load method from the pickle library to deserialize data leading to possible RCE|v3.1: 9.8 Critical|Exploit available on [exploit-db.com](https://www.exploit-db.com/exploits/45933)|
|rpc.py through 0.6.0|[CVE-2022-35411](https://www.cvedetails.com/cve/CVE-2022-35411/)|HTTP HEADERS set to `"serializer: pickle"` triggers `rcp.py` to de-serialize with `pickle` instead of the default `JSON` allowing Allows Remote Code Execution|v3.1:9.8 Critical|Exploit available on [https://github.com/](https://github.com/ehtec/rpcpy-exploit/blob/main/rpcpy-exploit.py)|

## Related Guidelines

|||
|:---|:---|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[SER01-J. Do not deviate from the proper signatures of serialization methods](https://wiki.sei.cmu.edu/confluence/display/java/SER01-J.+Do+not+deviate+from+the+proper+signatures+of+serialization+methods)|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE-502, Deserialization of Untrusted Data](http://cwe.mitre.org/data/definitions/502.html)|

## Biblography

|||
|:---|:---|
|[[docs.python.org 2023]](https://docs.python.org/)|pickle — Python object serialization. Available from: <https://docs.python.org/3.9/library/pickle.html> \[Accessed 07 May 2024]|
|[python.org comparison-with-json 2023]|pickle - Comparison with JSON. Available from: <https://docs.python.org/3.9/library/pickle.html#comparison-with-json> \[Acessed 07 May 2024]|
|[pyca/cryptography 2023]|Welcome to pyca/cryptography. Available from: <https://cryptography.io/en/latest/> \[Acessed 07 May 2024]|
