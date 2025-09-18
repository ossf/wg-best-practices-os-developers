# CWE-366: Race Condition within a Thread

In multithreaded programming, use synchronization mechanisms, such as locks, to avoid race conditions, which occur when multiple threads access shared resources simultaneously and lead to unpredictable results.

> [!NOTE]
> Prerequisite to understand this page:
> [Intro to multiprocessing and multithreading](../../Intro_to_multiprocessing_and_multithreading/readme.md)

Before Python 3.10, both `direct_add` and `method_calling_add` were at risk of race conditions. After Python 3.10 changed how eval breaking operations are handled ([GH-18334](https://github.com/python/cpython/pull/18334)), `direct_add` should not require additional locks while `method_calling_add` might give unpredictable results without them. The `example01.py` code example is demonstrating the issue. Its output will differ depending on the version of Python:

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

An update to Python 3.10 has introduced the change that prevents such issues from occurring under specific condition. The [GH-18334](https://github.com/python/cpython/pull/18334) change has made it so that the GIL is released and re-aquired only after specific operations as opposed to a certain number of any of them. These operations, called "eval breaking", can be found in the `Python/ceval.c` file and call CHECK_EVAL_BREAKER() to check if the interpreter should process pending events, such as releasing GIL to switch threads. They don't include inplace operations, such as `INPLACE_ADD` (called when using the `+=` operator) but they do include `CALL_METHOD`. The `dis` library provides a disassembler for analyzing bytecode operations in specific functions [[Python docs 2025 - dis](https://docs.python.org/3/library/dis.html)].

While both methods might cause race conditions on older versions of Python, only the latter method is risky since Python 3.10. Since Python 3.11, `CALL_FUNCTION` and `CALL_METHOD` have been replaced by a singular `CALL` operation, which is eval breaking as well. [[Python docs 2025 - dis](https://docs.python.org/3/library/dis.html)].

## Non-Compliant Code Example - Unsynchronized Addition/Subtraction

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

## Compliant Solution - Using a Lock

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

## Automated Detection

<table>
    <hr>
        <td>Tool</td>
        <td>Version</td>
        <td>Checker</td>
        <td>Description</td>
    </hr>
    <tr>
        <td>Bandit</td>
        <td>1.7.4 on Python 3.10.13</td>
        <td>Not Available</td>
        <td></td>
    </tr>
    <tr>
        <td>Flake8</td>
        <td>8-4.0.1 on Python 3.10.13</td>
        <td>Not Available</td>
        <td></td>
    </tr>
</table>

## Related Guidelines

<table>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Pillar: <a href="https://cwe.mitre.org/data/definitions/691.html"> [CWE-691: Insufficient Control Flow Management]</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/366.html">[CWE-366: Race Condition within a Thread (4.18)]</a></td>
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
</table>
