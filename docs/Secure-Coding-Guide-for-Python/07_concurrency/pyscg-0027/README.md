# pyscg-0027: Concurrent Execution Using Shared Resource with Improper Synchronization ('Race Condition')

Ensure to implement locking mechanisms when chaining methods in a multithreaded environment to prevent unexpected results.

Method chaining is a programming technique where multiple methods are called on the same object sequentially, with each method call returning the object itself or another object that supports further method calls.  Objects that return a reference to themselves allow method chaining, which we frequently use when stripping strings of unwanted content:

> `"Hello There\n".lstrip().rstrip()`

Although the individual methods may be thread-safe, that might not be the case when they are chained together.

## Non-Compliant Code Example

The practice of chaining methods is often used in the `Builder` design pattern for setting optional object fields \[Bloch 2017\]. Values shared fields can become inconsistent during concurrent access as demonstrated in `noncompliant01.py`.

Since the order of threads may differ between runs, you might need to run `noncomplilant01.py` multiple times to see the effect.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Noncompliant Code Example"""

from time import sleep
import logging
import threading
import secrets


def thread_function(animal: "Animal", animal_name: str, animal_sound: str):
    """Function that changes animal's characteristics using method chaining"""
    for _ in range(3):
        logging.info(
            "Thread: starting - %s goes %s",
            animal.name,
            animal.sound,
        )
        animal.set_name(animal_name).set_sound(animal_sound)
        logging.info(
            "Thread: finishing - %s goes %s",
            animal.name,
            animal.sound,
        )
        # Simulate a longer operation on non-shared resources
        for i in range(10, 1000):
            _ = (secrets.randbelow(i) + 1) / i


class Animal:
    """Class that represents an animal"""

    # The characteristics of the animal (optional fields)
    def __init__(self):
        self.name = ""
        self.sound = ""

    def set_name(self, name: str):
        """Sets the animal's name"""
        self.name = name
        # force the thread to lose the lock on the object by
        # simulating a long running operation
        sleep(0.1)
        return self

    def set_sound(self, sound: str):
        """Sets the sound that the animal makes"""
        self.sound = sound
        sleep(0.2)
        return self


#####################
# Exploiting above code example
#####################

if __name__ == "__main__":
    MESSAGE_FORMAT = "%(asctime)s: %(message)s"
    logging.basicConfig(
        format=MESSAGE_FORMAT, level=logging.INFO, datefmt="%H:%M:%S"
    )

    animal = Animal()
    dog = threading.Thread(
        target=thread_function,
        args=(animal, "DOG", "WOOF"),
    )
    cat = threading.Thread(
        target=thread_function, args=(animal, "CAT", "MEOW")
    )
    dog.start()
    cat.start()

```

In `noncompliant01.py` , the client constructs an `Animal` object and runs two threads. One of the threads is trying to create a dog while the other thread sets up a cat. The expected result of this code example is for the animal to always have the desired set of characteristics. The [CPython Global Interpreter Lock(GIL)](https://docs.python.org/3/glossary.html#term-global-interpreter-lock) does not prevent unexpected results in this case. Sometimes, the code may result in a meowing dog or a barking cat.

## Compliant Solution

This compliant solution uses a lock to ensure that the object cannot be written to while another thread is using it.

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from time import sleep
import logging
import threading
import secrets

LOCK = threading.Lock()


def thread_function(animal: "Animal", animal_name: str, animal_sound: str):
    """Function that changes animal's characteristics using method chaining"""
    for _ in range(3):
        LOCK.acquire()
        logging.info(
            "Thread: starting - %s goes %s",
            animal.name,
            animal.sound,
        )
        # First time, name and sound will be blank because
        # the object isn't initialized yet.
        animal.set_name(animal_name).set_sound(animal_sound)
        logging.info(
            "Thread: finishing - %s goes %s",
            animal.name,
            animal.sound,
        )
        LOCK.release()
        # Simulate a longer operation on non-shared resources
        for i in range(10, 1000):
            _ = (secrets.randbelow(i) + 1) / i


class Animal:
    """Class that represents an animal"""

    # The characteristics of the animal (optional fields)
    def __init__(self):
        self.name = ""
        self.sound = ""

    def set_name(self, name: str):
        """Sets the animal's name"""
        self.name = name
        # force the thread to lose the lock on the object by
        # simulating a long running operation
        sleep(0.1)
        return self

    def set_sound(self, sound: str):
        """Sets the sound that the animal makes"""
        self.sound = sound
        sleep(0.2)
        return self


#####################
# Exploiting above code example
#####################

if __name__ == "__main__":
    MESSAGE_FORMAT = "%(asctime)s: %(message)s"
    logging.basicConfig(
        format=MESSAGE_FORMAT, level=logging.INFO, datefmt="%H:%M:%S"
    )

    animal = Animal()
    dog = threading.Thread(
        target=thread_function,
        args=(animal, "DOG", "WOOF"),
    )
    cat = threading.Thread(
        target=thread_function, args=(animal, "CAT", "MEOW")
    )
    dog.start()
    cat.start()

```

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-691: Insufficient Control Flow Management (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/691.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Class: [CWE-362: Concurrent Execution Using Shared Resource with Improper Synchronization ("Race Condition")](https://cwe.mitre.org/data/definitions/362.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Class: [CWE-662: Numeric Truncation Error](https://cwe.mitre.org/data/definitions/662.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-366: Race Condition within a Thread](https://cwe.mitre.org/data/definitions/366.html)|

## Bibliography

|||
|:---|:---|
|[[Python docs](https://docs.python.org/3/library/threading.html)]|Python Software Foundation. (2024). threading — Thread-based parallelism \[online\]. Available from: [https://docs.python.org/3/library/threading.html](https://docs.python.org/3/library/threading.html) \[accessed 18 March 2024\]|
|\[Bloch 2017\]|Bloch, J. (2017) Creating and Destroying Objects. In: Friendly, S. and Lindholm, T. and Hendrickson, M., eds. Effective Java. 3rd ed. Boston: Addison-Wesley Professional, pp.10-17.|
