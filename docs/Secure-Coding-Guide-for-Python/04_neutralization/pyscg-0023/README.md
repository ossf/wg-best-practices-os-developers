# pyscg-0023: Secure Deserialization (including pickle)

When loading data into your program ("deserializing"), do not permit an attack. Only load data (1) from a trusted source *or* (2) by using a secure loading process. Where practical, do both.

You may consider data to be trusted once you verify that it's digitally signed by a trusted source. If you take this approach, you must ensure an attacker cannot gain access to the signing keys, that attackers can't cause the system to accept attacker's signatures, and that the signing algorithm is cryptographically secure. If this will be deployed in 2029 or later, it should use a quantum-resistant algorithm (e.g., HMAC with 256 bit or longer keys).

Prefer storing and loading data only in formats like JSON that are safe to load by default. That's the simplest approach. Most of the text in this section exists to help developers who aren't taking the simplest approach.

If used correctly, `XML` [[xml]](https://docs.python.org/3/library/xml.html#xml-security) and `YAML` [[fkkarakurt]](https://dev.to/fkkarakurt/be-careful-when-using-yaml-in-python-there-may-be-security-vulnerabilities-3cdb) are *often* safe in Python if used correctly, but see the notes below. You might choose to avoid them because they are often *not* safe by default in other ecosystems.

Where practical, do *not* load `pickle` files from untrusted sources, and don't send `pickle` files either. That's because loading a pickle runs arbitrary programs by default. You are supposed to only unpickle data that you completely trust [[docs.python.org 2023]](https://docs.python.org/3.9/library/pickle.html). Using pickle is one of the most common security vulnerabilities in Python; [Paws in the Pickle Jar: Risk & Vulnerability in the Model-sharing Ecosystem](https://www.splunk.com/en_us/blog/security/paws-in-the-pickle-jar-risk-vulnerability-in-the-model-sharing-ecosystem.html) reports that, "more than 80% of the evaluated machine learning models in the ecosystem consist of pickle-serialized code, which is vulnerable to code injection / arbitrary code execution risks". If you *must* use pickle, use special precautions. The `shelve` module is backed by pickle and carries the same risks.

Do not use `marshal` for storing and retrieving untrusted data; that is not its purpose. Its format is intentionally undocumented and changeable.

Security-related concerns during object serialization and deserialization include:

* Consider signing data that is crossing trust boundaries and verify the data signature before loading. One approach is using `hmac`, which uses shared keys. If you do, use `hmac.compare_digest()` for the signature verification to resist timing attacks. However, signatures only work if an attacker cannot gain access to the signing keys and cannot cause their own signatures to be used. Asymmetric signing with X.509 certificates (e.g., with `cryptography.x509`) avoids the need to share a secret key between signer and verifier, though the signer's private key must still be protected.
* Prefer formats like `JSON` that *never* permit running arbitrary code or unrestricted expansion when deserializing.
* Consider using `Base64` encoding if you must encode binary data in a text format (like JSON).
* Consider using safe formats instead of insecure formats, such as [safetensors](https://github.com/safetensors/safetensors) and BSON. Note that this will often require using external packages.
* Loading `XML` data with the Python built-in `xml` libraries is safe today if it's a reasonably recent version of Python and `import pyexpat; pyexpat.version_info >= (2, 7, 2)`. That's because this combination does not have the XML External Entity (XXE) vulnerability that affects some other ecosystems and is no longer vulnerable to "decompression bomb" attacks. Historically `defusedxml` was recommended instead but this is no longer necessary [[xml]](https://docs.python.org/3/library/xml.html#xml-security)] [[status-defusedxml](https://discuss.python.org/t/status-of-defusedxml-and-recommendation-in-docs/34762/21)]. Consider avoiding sending XML, , since in other ecosystems it's not safe to load by default.
* Use `xmlrpc` with care. `xmlrpc.server` exposes registered Python functions to any reachable caller with no built-in authentication or authorization. Registering an object instance exposes all its public methods, including inherited ones, which is often more than intended. Enabling `allow_dotted_names=True` is particularly severe: it lets callers walk Python attribute chains to reach `os`, `sys`, or other interfaces and achieve Remote Code Execution (RCE). Neither the server nor the client provides TLS by default; add it explicitly (e.g., via an HTTPS reverse proxy or `ssl.SSLContext`) — do not assume the network is safe. On the client side, `xmlrpc.client` parses XML responses from the server it connects to; if that server is compromised, the client processes attacker-controlled XML regardless of transport security.
* If you load untrusted `YAML` data, use `safe_load` not `load`. It is *not* safe to use `load` in typical implementations, as this can run arbitrary programs via YAML tags [[fkkarakurt]](https://dev.to/fkkarakurt/be-careful-when-using-yaml-in-python-there-may-be-security-vulnerabilities-3cdb). Cosider avoid sending YAML, since in other ecosystems it's not safe to load by default.
* Only unpickle data you completely trust \[docs.python.org 2023\] unless you take special precautions.
* If you *must* load untrusted `pickle` data, use `pickle.Unpickler` and `find_class` with an allowlist of permitted classes, and ensure no attacks can occur via those allowed classes [[docs.python.org 2023]](https://docs.python.org/3.9/library/pickle.html). An example is below. This process is complicated because `pickle` is not intended for safe use on untrusted data.
* Perform input validation. Ensure all loaded data values are strictly validated. Ideally you'd do this before or during loading, but few libraries support this. At least do this immediately after loading the data before you use it.

## Noncompliant Code Example 1

The `noncompliant01.py`  code demonstrates arbitrary code execution using `os.system` to launch a program during unpickling when `pickle.loads()` [[Checkoway Oct 2013](https://checkoway.net/musings/pickle/)]

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

The deserializing `Preserver.uncan()` method has no solution to verify the content prior to unpickling it and runs the PAYLOAD even before turning it into an object. On Windows you have `calc.exe`  and on Unix a bunch of commands such as `uname -a and ls -la /etc/shadow`.

## Example 1: HMAC Integrity Protection

The `example01.py` code shows how HMAC signing can detect tampering with a pickle stream before it is unpickled. It is provided to illustrate this specific technique, not as a complete or production-ready solution.

> [!CAUTION]
> The `example01.py` code only demonstrates integrity protection with hmac.
> The pickled object is not encrypted and key-handling is inappropriate!
> Consider using proper key management and encryption [[pyca/cryptography 2023]](https://cryptography.io/en/latest/).

*[example01.py](example01.py):*

```py
""" Example Code: HMAC integrity protection with pickle """
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
        _digest = hmac.HMAC(self._key, _jar, hashlib.sha256).hexdigest()
        return _digest, _jar

    def uncan(self, _expected_digest, _jar) -> Message:
        """Verifies and de-serializes a Message object.
            Parameters:
                _expected_digest (String): Message HMAC digest
                _jar (bytes): Pickled jar
            Returns:
                (Message): Message object
        """
        _digest = hmac.HMAC(self._key, _jar, hashlib.sha256).hexdigest()
        if not hmac.compare_digest(_expected_digest, _digest):
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

The integrity verification in `example01.py` throws a `ValueError: Integrity of jar compromised` exception, preventing the payload from being unpickled.

## Example 2: Allowlist-based Secure Pickle Loading

The `example02.py` code shows how to load pickle data securely by restricting which classes and callables pickle is permitted to resolve. Pickle executes code by looking up `(module, name)` pairs and invoking the resulting objects; `__reduce__` is the most common path (a class returns a `(callable, args)` pair that pickle invokes on load), but `__new__`, `__setstate__`, and raw GLOBAL opcodes follow the same resolution path. Overriding `find_class()` to raise `UnpicklingError` for anything outside an explicit allowlist blocks all of them.

> [!CAUTION]
> `SafeUnpickler` prevents code execution during loading but does **not** automatically validate field values. An attacker who controls the pickle stream may still inject malicious strings, SQL fragments, or out-of-range numbers into a loaded object's attributes. The `validate_orders` function below demonstrates the required second step: always validate both structure and domain constraints on every loaded object before use.

*[example02.py](example02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Example Code: secure loading of pickle data """

# pickle is widely used but unsafe by default: loading a pickle stream can
# execute arbitrary code. This module provides an allowlist-based defence:
#
#   Only classes explicitly approved by the caller are permitted.
#   This blocks code execution during loading (__reduce__ exploits).
#
# This module controls *what kinds of objects* are allowed to load, mirroring
# how json.loads controls what kinds of values JSON can represent. It does NOT
# validate data values; ensuring that loaded values are safe and correct
# remains the caller's responsibility, just as it is with json.loads.
#
# Quick start:
#
#   from example02 import SafeUnpickler
#
#   loader = SafeUnpickler(allowed_classes=[MyRecord])
#   record = loader.safe_loads(raw_bytes)
#   # validate record's field values here before use
#
# Run doctests:
#
#   python3 -m doctest example02.py

import builtins
import datetime
import decimal
import io
import pickle
import types
import uuid
from collections.abc import Sequence


# ---------------------------------------------------------------------------
# Default allowlist
# ---------------------------------------------------------------------------

# Build the default set from concrete class objects so that module renames or
# reimports cannot silently widen the allowlist.
_PICKLE_SAFE_CLASSES = (
    # Built-in primitives and containers.
    # These cannot execute code on load, though they can carry attacker-
    # controlled string data; always validate values after loading.
    builtins.str, builtins.int, builtins.float, builtins.bool,
    builtins.bytes, builtins.bytearray, type(None),
    builtins.list, builtins.tuple, builtins.dict,
    builtins.set, builtins.frozenset, builtins.complex,
    builtins.range, builtins.slice,

    # Immutable stdlib value types with well-defined structure.
    datetime.date, datetime.time, datetime.datetime,
    datetime.timedelta, datetime.timezone,
    decimal.Decimal,
    uuid.UUID,

    # Unvalidated carriers: safe to unpickle but may hold arbitrary string
    # data. Several exceptions included because pickle is widely used for
    # inter-process communication (IPC) where exceptions are routinely
    # serialized. SimpleNamespace is a common lightweight container.
    builtins.Exception, builtins.ValueError, builtins.TypeError,
    builtins.KeyError, builtins.IndexError, builtins.AttributeError,
    builtins.RuntimeError,
    types.SimpleNamespace,
)

PICKLE_SAFE_TYPES: frozenset = frozenset(
    (cls.__module__, cls.__name__) for cls in _PICKLE_SAFE_CLASSES
)


# ---------------------------------------------------------------------------
# Internal restricted unpickler
# ---------------------------------------------------------------------------

class _RestrictedUnpickler(pickle.Unpickler):
    """Unpickler that blocks every class not in allowed_globals.

    Not part of the public API; use SafeUnpickler instead.
    pickle.Unpickler is bound to one file at construction and is
    single-use; SafeUnpickler holds the allowlist configuration and
    creates a fresh instance of this class for each load.
    """

    def __init__(self, file, allowed_globals: frozenset):
        super().__init__(file)
        self._allowed_globals = allowed_globals

    def find_class(self, module: str, name: str):
        if (module, name) in self._allowed_globals:
            mod = __import__(module, fromlist=[name])
            return getattr(mod, name)
        raise pickle.UnpicklingError(
            f"Security block: '{module}.{name}' is not in the allowlist. "
            f"Add it to allowed_classes if you have verified it's safe to load."
        )


# ---------------------------------------------------------------------------
# Public loader class
# ---------------------------------------------------------------------------

class SafeUnpickler:
    """Configure a restricted unpickler once; load safely many times."""

    def __init__(self, allowed_classes: Sequence[type] | None = None,
                 exclusive: bool = False):
        caller_set = frozenset(
            (cls.__module__, cls.__name__) for cls in (allowed_classes or [])
        )
        self._allowed_globals = (
            caller_set if exclusive else PICKLE_SAFE_TYPES | caller_set
        )

    def safe_loads(self, data: bytes):
        return _RestrictedUnpickler(io.BytesIO(data), self._allowed_globals).load()

    def safe_load(self, file_obj):
        return self.safe_loads(file_obj.read())


# ---------------------------------------------------------------------------
# Module-level convenience functions
# ---------------------------------------------------------------------------

def safe_loads(data: bytes, allowed_classes: Sequence[type] | None = None,
               exclusive: bool = False):
    return SafeUnpickler(allowed_classes, exclusive).safe_loads(data)


def safe_load(file_obj, allowed_classes: Sequence[type] | None = None,
              exclusive: bool = False):
    return SafeUnpickler(allowed_classes, exclusive).safe_load(file_obj)


# ---------------------------------------------------------------------------
# Usage demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    from dataclasses import dataclass

    @dataclass
    class Order:
        order_id: int
        customer: str
        amount: float

    loader = SafeUnpickler(allowed_classes=[Order])

    def validate_orders(raw) -> list[Order]:
        """Validate structure and domain constraints on a loaded orders list."""
        if not isinstance(raw, list):
            raise TypeError(
                f"Expected list of orders, got {type(raw).__name__}"
            )
        for i, order in enumerate(raw):
            if not isinstance(order, Order):
                raise TypeError(
                    f"orders[{i}]: expected Order, got {type(order).__name__}"
                )
            if not (isinstance(order.order_id, int) and order.order_id >= 1):
                raise ValueError(
                    f"orders[{i}].order_id must be int >= 1, "
                    f"got {order.order_id!r}"
                )
            if not (isinstance(order.customer, str) and order.customer):
                raise ValueError(
                    f"orders[{i}].customer must be a non-empty str"
                )
            if not (isinstance(order.amount, (int, float))
                    and order.amount >= 0.0):
                raise ValueError(
                    f"orders[{i}].amount must be >= 0.0, "
                    f"got {order.amount!r}"
                )
        return raw

    print("Normal round-trip:")
    original = Order(order_id=42, customer="Alice", amount=99.95)
    loaded = loader.safe_loads(pickle.dumps(original))
    print(f"  {loaded}")

    print("\nLoading and validating a list of orders:")
    orders = [
        Order(order_id=1, customer="Alice", amount=99.95),
        Order(order_id=2, customer="Bob", amount=0.0),
    ]
    validated = validate_orders(loader.safe_loads(pickle.dumps(orders)))
    print(f"  Loaded {len(validated)} valid orders")
    for order in validated:
        print(f"  {order}")
```

`SafeUnpickler` configures the allowlist once and creates a fresh `_RestrictedUnpickler` for each load, which is necessary because `pickle.Unpickler` is bound to a single file at construction. The default allowlist, `PICKLE_SAFE_TYPES`, covers common built-in types, standard library value types, and exceptions frequently used in inter-process communication. Pass `allowed_classes` to permit additional application-specific types; set `exclusive=True` to restrict loading to *only* those types, bypassing `PICKLE_SAFE_TYPES` entirely.

The `validate_orders` function demonstrates the required second step: after safe loading, validate both structure (is this actually a list of `Order` objects?) and domain constraints (is `order_id` a positive integer, `customer` a non-empty string, `amount` non-negative?). Each condition is written as an allowlist — `if not (correct_condition):` — so the valid range is stated explicitly rather than the invalid cases. Note that `amount` checks `isinstance(..., (int, float))` rather than just `float`, because pickle writes directly to `__dict__` and can place an `int` into an annotated `float` field without error.

Before adding any class to `allowed_classes`, check the audit checklist in the `SafeUnpickler` docstring in `example02.py`. In particular, verify that `__new__`, `__setstate__`, and `__del__` do not perform dangerous operations; confirm `__reduce__`/`__reduce_ex__` cannot be exploited via the allowlist; and avoid allowlisting complex third-party classes that may contain exploitable gadget chains.

## Compliant Solution JSON without pickle 1

Text-based formats that have a reduced attack surface, such as `JSON`, should always be preferred over formats like `pickle` \[python.org comparison-with-json 2023\].

The `compliant01.py`  code only allows serializing and deserialization of object data and not object methods as in `noncompliant01.py` or `example01.py`.

Consider converting binary data into text using `Base64` encoding for performance and size irrelevant operations.

*[compliant01.py](compliant01.py):*

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

The `compliant01.py` stops with the unpacking with a `json.decoder.JSONDecodeError`.

## Exceptions

Serialized data from a trusted input source does not require sanitization, provided that the code clearly documents that it relies on the input source being trustworthy. For example, when writing internal library code, a routine may document a precondition that its callers must either pre-sanitize any passed-in serialized data or confirm the input source as trustworthy.

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|Bandit|1.7.4|B301|Pickle and modules that wrap it can be unsafe when used to de-serialize untrusted data, possible security issue. Bandit can only detect a pickle module in use and is unable to detect an acceptable implementation code that combines pickle with `hmac` and proper key management.|

## Related Vulnerabilities

|Product|CVE|Description|CVSS Rating|Comment|
|:----|:----|:----|:----|:----|
|TensorFlow using the pickle module|[CVE-2021-37678](https://www.cvedetails.com/cve/CVE-2021-37678/)|TensorFlow machine learning platform allows code execution when de-serializing a Keras model from `YAML` format.|v3.1: 8.8 High||
|NVFLARE < 2.1.4|[CVE-2022-34668](https://www.cvedetails.com/cve/CVE-2022-34668/)|Deserialization of Untrusted Data with Pickle may allow an unprivileged network attacker to cause Remote Code Execution (RCE).|v3.1: 9.8 Critical|Exploit available on [exploit-db.com](https://www.exploit-db.com/exploits/51051)|
|Graphite 0.9.5 through 0.9.10|[CVE-2013-5093](https://www.cvedetails.com/cve/CVE-2013-5093/)|The renderLocalView function in render/views.py uses the pickle Python module unsafely, which allows remote attackers to execute arbitrary code via a crafted serialized object|v3.1: 7.5 High|Exploit available on [exploit-db.com](https://www.exploit-db.com/exploits/27752)|
|Superset prior to 0.23|[CVE-2018-8021](https://www.cvedetails.com/cve/CVE-2018-8021/)|Unsafe load method from the pickle library to deserialize data leading to possible RCE|v3.1: 9.8 Critical|Exploit available on [exploit-db.com](https://www.exploit-db.com/exploits/45933)|
|rpc.py through 0.6.0|[CVE-2022-35411](https://www.cvedetails.com/cve/CVE-2022-35411/)|HTTP HEADERS set to `"serializer: pickle"` triggers `rcp.py` to de-serialize with `pickle` instead of the default `JSON` allowing Allows Remote Code Execution|v3.1:9.8 Critical|Exploit available on [https://github.com/](https://github.com/ehtec/rpcpy-exploit/blob/main/rpcpy-exploit.py)|

## Related Guidelines

|||
|:---|:---|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java) (shown by analogy)|[SER01-J. Do not deviate from the proper signatures of serialization methods](https://wiki.sei.cmu.edu/confluence/display/java/SER01-J.+Do+not+deviate+from+the+proper+signatures+of+serialization+methods)|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE-502, Deserialization of Untrusted Data](http://cwe.mitre.org/data/definitions/502.html)|
|\[Checkoway 2013\]|Checkoway, S. (2013) 'Arbitrary code execution with Python pickles', 8 October. Available from: [checkoway.net](https://checkoway.net/musings/pickle/) \[Accessed 07 May 2024\]|

## Bibliography

|||
|:---|:---|
|[[docs.python.org 2023]](https://docs.python.org/)|pickle — Python object serialization. Available from: <https://docs.python.org/3.9/library/pickle.html> \[Accessed 07 May 2024]|
|\[python.org comparison-with-json 2023\]|pickle - Comparison with JSON. Available from: <https://docs.python.org/3.9/library/pickle.html#comparison-with-json> \[Accessed 07 May 2024]|
|\[pyca/cryptography 2023\]|Welcome to pyca/cryptography. Available from: <https://cryptography.io/en/latest/> \[Accessed 07 May 2024]|
