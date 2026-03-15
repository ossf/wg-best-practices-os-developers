# pyscg-0027: Prevent Race Conditions

In multithreaded programming, use synchronization mechanisms, such as locks, to avoid race conditions, which occur when multiple threads access shared resources simultaneously and lead to unpredictable results.

> [!NOTE]
> Prerequisite to understand this page:
> [Intro to multiprocessing and multithreading](../../Intro_to_multiprocessing_and_multithreading/readme.md)

## Eval Breaking Operations

An update to Python 3.10 has introduced the change that prevents such issues from occurring under specific condition. The [[GH-18334 (2021)](https://github.com/python/cpython/pull/18334)] change has made it so that the GIL is released and re-aquired only after specific operations as opposed to a certain number of any of them. These operations, called "eval breaking", can be found in the `Python/ceval.c` file and call `CHECK_EVAL_BREAKER()` to check if the interpreter should process pending events, such as releasing GIL to switch threads. They don't include inplace operations, such as `INPLACE_ADD` (called when using the `+=` operator) but they do include `CALL_METHOD`. The `dis` library provides a disassembler for analyzing bytecode operations in specific functions [[Python docs 2025 - dis](https://docs.python.org/3/library/dis.html)].

The `example01.py` code example demonstrates the issue. Its output will differ depending on the version of Python. Before Python 3.10, both `direct_add` and `method_calling_add` were at risk of race conditions. After Python 3.10 changed how eval breaking operations are handled [[GH-18334 (2021)](https://github.com/python/cpython/pull/18334)], `direct_add` should not require additional locks while `method_calling_add` might give unpredictable results without them:

_[example01.py:](example01.py)_

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """
import dis


class Number():
    """
    Example of a class where a method calls another method
    """
    amount = 100

    def direct_add(self):
        """Simulating hard work"""
        a = 0
        a += self.amount

    def method_calling_add(self):
        """Simulating hard work"""
        a = 0
        a += self.read_amount()

    def read_amount(self):
        """Simulating data fetching"""
        return self.amount


num = Number()
print("direct_add():")
dis.dis(num.direct_add)
print("method_calling_add():")
dis.dis(num.method_calling_add)

```

When run on Python 3.10.13, output shows that `CALL_METHOD` doesn't appear when calling `direct_add` but it does when `method_calling_add` is called instead:

 __Output of example01.py:__

```bash
direct_add():
 14           0 LOAD_CONST               1 (0)
              2 STORE_FAST               1 (a)

 15           4 LOAD_FAST                1 (a)
              6 LOAD_FAST                0 (self)
              8 LOAD_ATTR                0 (amount)
             10 INPLACE_ADD
             12 STORE_FAST               1 (a)
             14 LOAD_CONST               2 (None)
             16 RETURN_VALUE
method_calling_add():
 19           0 LOAD_CONST               1 (0)
              2 STORE_FAST               1 (a)

 20           4 LOAD_FAST                1 (a)
              6 LOAD_FAST                0 (self)
              8 LOAD_METHOD              0 (read_amount)
             10 CALL_METHOD              0
             12 INPLACE_ADD
             14 STORE_FAST               1 (a)
             16 LOAD_CONST               2 (None)
             18 RETURN_VALUE
```

While both methods might cause race conditions on older versions of Python, only the latter method is risky since Python 3.10. Since Python 3.11, `CALL_FUNCTION` and `CALL_METHOD` have been replaced by a singular `CALL` operation, which is eval breaking as well. [[Python docs 2025 - dis](https://docs.python.org/3/library/dis.html)].

### Non-Compliant Code Example - Unsynchronized Addition/Subtraction

The `noncompliant01.py` code example modifies the value of `amount` by adding and subtracting numerous times. Each of the arithmetic operations is performed by an independent thread [[Python docs 2025 - launching parallel tasks](https://docs.python.org/3.9/library/concurrent.futures.html)]. The expected value once both threads finish their calculations should be `0`.

_[noncompliant01.py](noncompliant01.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import logging
import sys
from threading import Thread

logging.basicConfig(level=logging.INFO)


class Number():
    """
    Multithreading incompatible class missing locks.
    Issue only occures with more than 1 million repetitions.
    """
    value = 0
    repeats = 1000000

    def add(self):
        """Simulating hard work"""
        for _ in range(self.repeats):
            logging.debug("Number.add: id=%i int=%s size=%s", id(self.value), self.value, sys.getsizeof(self.value))
            self.value += self.read_amount()

    def remove(self):
        """Simulating hard work"""
        for _ in range(self.repeats):
            self.value -= self.read_amount()

    def read_amount(self):
        """ Simulating reading amount from an external source, i.e. a file, a database, etc. """
        return 100


if __name__ == "__main__":
    #####################
    # exploiting above code example
    #####################
    number = Number()
    logging.info("id=%i int=%s size=%s", id(number.value), number.value, sys.getsizeof(number.value))
    add = Thread(target=number.add)
    substract = Thread(target=number.remove)
    add.start()
    substract.start()

    logging.info('Waiting for threads to finish...')
    add.join()
    substract.join()

    logging.info("id=%i int=%s size=%s", id(number.value), number.value, sys.getsizeof(number.value))

```

Due to a race condition occurring, the value is never what we expect e.g. `0`. In this example it is `-2609100`.

 __Example noncompliant01.py output should show int=0:__

 ```bash
INFO:root:id=2084074055952 int=0 size=24
INFO:root:Waiting for threads to finish...
INFO:root:id=2084083567824 int=-2609100 size=28
```

### Compliant Solution - Using a Lock

This compliant solution uses a lock to ensure atomicity and visibility. It ensure only one thread at a time has access to and can modify `self.value` [[Python docs 2025 - lock](https://docs.python.org/3.9/library/concurrent.futures.html)]:

_[compliant01.py](compliant01.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import logging
import sys
import threading
from threading import Thread

logging.basicConfig(level=logging.INFO)


class Number():
    """
    Multithreading compatible class with locks.
    """
    value = 0
    repeats = 1000000

    def __init__(self):
        self.lock = threading.Lock()

    def add(self):
        """Simulating hard work"""
        for _ in range(self.repeats):
            logging.debug("Number.add: id=%i int=%s size=%s", id(self.value), self.value, sys.getsizeof(self.value))
            self.lock.acquire()
            self.value += self.read_amount()
            self.lock.release()

    def remove(self):
        """Simulating hard work"""
        for _ in range(self.repeats):
            self.lock.acquire()
            self.value -= self.read_amount()
            self.lock.release()

    def read_amount(self):
        """ Simulating reading amount from an external source, i.e. a file, a database, etc. """
        return 100


if __name__ == "__main__":
    #####################
    # exploiting above code example
    #####################
    number = Number()
    logging.info("id=%i int=%s size=%s", id(number.value), number.value, sys.getsizeof(number.value))
    add = Thread(target=number.add)
    substract = Thread(target=number.remove)
    add.start()
    substract.start()

    logging.info('Waiting for threads to finish...')
    add.join()
    substract.join()

    logging.info("id=%i int=%s size=%s", id(number.value), number.value, sys.getsizeof(number.value))

```

 __Example compliant01.py output provides the expected output of int=0:__

 ```bash
INFO:root:id=2799840487696 int=0 size=24
INFO:root:Waiting for threads to finish...
INFO:root:id=2799840487696 int=0 size=24
```

## Method Chaining

Method chaining is a programming technique where multiple methods are called on the same object sequentially, with each method call returning the object itself or another object that supports further method calls.  Objects that return a reference to themselves allow method chaining, which we frequently use when stripping strings of unwanted content:

> `"Hello There\n".lstrip().rstrip()`

Although the individual methods may be thread-safe, that might not be the case when they are chained together.

### Non-Compliant Code Example - Unsynchronized Method Chaining

The practice of chaining methods is often used in the `Builder` design pattern for setting optional object fields [Bloch 2017]. Values shared fields can become inconsistent during concurrent access as demonstrated in `noncompliant02.py`.

Since the order of threads may differ between runs, you might need to run `noncomplilant02.py` multiple times to see the effect.

_[noncompliant02.py](noncompliant02.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-Compliant Code Example"""

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

In `noncompliant02.py` , the client constructs an `Animal` object and runs two threads. One of the threads is trying to create a dog while the other thread sets up a cat. The expected result of this code example is for the animal to always have the desired set of characteristics. The [CPython Global Interpreter Lock(GIL)](https://docs.python.org/3/glossary.html#term-global-interpreter-lock) does not prevent unexpected results in this case. Sometimes, the code may result in a meowing dog or a barking cat.

### Compliant Solution - Method Chaining with a Lock

This compliant solution uses a lock to ensure that the object cannot be written to while another thread is using it.

_[compliant02.py](compliant02.py):_

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

<table>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Pillar: <a href="https://cwe.mitre.org/data/definitions/691.html"> [CWE-691: Insufficient Control Flow Management]</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Class: <a href="https://cwe.mitre.org/data/definitions/362.html">[CWE-362: Concurrent Execution Using Shared Resource with Improper Synchronization ("Race Condition")]</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/366.html">[CWE-366: Race Condition within a Thread]</a></td>
    </tr>
    <tr>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java">SEI CERT Oracle Coding Standard for Java</a></td>
    <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/VNA02-J.+Ensure+that+compound+operations+on+shared+variables+are+atomic">[VNA02-J. Ensure that compound operations on shared variables are atomic]</a></td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>[Python docs 2025 - launching parallel tasks]</td>
        <td>Python Software Foundation. (2024). concurrent.futures — Launching parallel tasks [online]. Available from: <a href="https://docs.python.org/3.10/library/concurrent.futures.html">https://docs.python.org/3.10/library/concurrent.futures.html</a>,  [Accessed 18 September 2025]</td>
    </tr>
    <tr>
        <td>[Python docs 2025 - lock]</td>
        <td>Python Software Foundation. (2024). Lock Objects [online]. Available from: <a href="https://docs.python.org/3.10/library/threading.html#lock-objects">https://docs.python.org/3.10/library/threading.html#lock-objects</a>,  [Accessed 18 September 2025]</td>
    </tr>
    <tr>
        <td>[Python docs 2025 - dis]</td>
        <td>Python Software Foundation. (2024). dis — Disassembler for Python bytecode [online]. Available from: <a href="https://docs.python.org/3/library/dis.html">https://docs.python.org/3/library/dis.html</a>,  [Accessed 18 September 2025]</td>
    </tr>
    <tr>
        <td>[GH-18334 (2021)]</td>
        <td>GitHub CPython bpo-29988: Only check evalbreaker after calls and on backwards egdes. #18334 [online]. Available from: <a href="https://github.com/python/cpython/pull/18334">https://github.com/python/cpython/pull/18334</a>,  [Accessed 18 September 2025]</td>
    </tr>
    <tr>
        <td>[Bloch 2017]</td>
        <td>Bloch, J. (2017) Creating and Destroying Objects. In: Friendly, S. and Lindholm, T. and Hendrickson, M., eds. Effective Java. 3rd ed. Boston: Addison-Wesley Professional, pp.10-17.</td>
    </tr>
</table>
