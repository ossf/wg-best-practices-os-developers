# pyscg-0052: Ensure Cleanup on Exceptions

Make sure that your code fully and correctly cleans up its state whenever an exception occurs to avoid unexpected state or control flow.

Often, when functions or loops become complicated, some level of resource cleanup is needed throughout execution.
Exceptions can disturb the flow of the code and prevent the necessary cleanup from happening.

A consequence of this is that the code is left in a bad state.

One of the ways to mitigate this is to make sure that cleanup happens or that you should exit the program. Use throwing exceptions sparsely.

Another way to mitigate this is to use the `with` statement. It simplifies resource management by automatically handling setup and cleanup tasks. It's commonly used with files, network connections and databases to ensure resources are properly released even if errors occur making your code cleaner.

Not using the `with` statement requires to use `lock.aquire()` and `lock.release()` as demonstrated in the `example01.py` code.

*[example01.py](example01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

import threading

lock = threading.Lock()
lock.acquire()
try:
    ...
finally:
    lock.release()

```

It is best practice to use `with` statement in such cases as it will make sure the resource gets released even if an exception occurs in the execution. There are other resources that also require cleanup, most commonly data streams for files, database connections, etc.

## Non-Compliant Code Example

The `noncompliant01.py` contains a example of a stateful resource. The `DbConnection` class imitates a data stream, simplyfying it to the `connected` boolean value. It also provides the `connect` and `disconnect` methods for manipulating this value. The `read` method simulates an operation that results in an unexpected exception.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

class DbConnection:
    """Class representing a house"""
    def __init__(self):
        self.connected = False

    def connect(self):
        """Sets the connection to True"""
        self.connected = True

    def disconnect(self):
        """Sets the connection to False"""
        self.connected = False

    def read(self):
        """Simulates an operation resulting in an error"""
        if self.connected:
            print("Reading from the database...")
            raise RuntimeError("Database could not be read from!")

def read_from_database(database):
    """Simulates usage of a stateful resource"""
    database.connect()
    database.read()
    database.disconnect()


#####################
# Exploiting above code example
#####################


my_db = DbConnection()
try:
    read_from_database(my_db)
except RuntimeError as e:
    print("Error while trying to read: ", e)

print("Is the connection open: ", my_db.connected)


```

Because the `read_from_database` method manages the connection manually, it gets interrupted by the `RuntimeError` and the `connected` value is never set back to `False`.

## Compliant Solution

The `compliant01.py` code example introduces the `with` statement to the `read_from_database` method and two new methods inside `DbConnection`: `__enter__` and `__exit__`. These methods define the behavior of the **context manager** object, which is responsible for managing the context of the code within the `with` statement. The `__enter__` method defines what operations should happen when entering the `with` block, while `__exit__` defines the operations that should be performed while exiting it.

*[compliant01.py](compliant01.py):*

## Compliant Code Example - `with` statement

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

class DbConnection:
    """Class representing a house"""
    def __init__(self):
        self.connected = False

    def _connect(self):
        self.connected = True

    def _disconnect(self):
        self.connected = False

    def read(self):
        """Simulates an operation resulting in an error"""
        if self.connected:
            print("Reading from the database...")
            raise RuntimeError("Database could not be read from!")

    def __enter__(self):
        """Perform operations when accessing the resource"""
        self._connect()

    def __exit__(self, exception_type, exception_value, traceback):
        """Perform clean-up after the resource is no longer needed"""
        self._disconnect()


def read_from_database(database):
    """Simulates usage of a stateful resource"""
    with database:
        database.read()


#####################
# Exploiting above code example
#####################


my_db = DbConnection()
try:
    read_from_database(my_db)
except RuntimeError as e:
    print("Error while trying to read: ", e)

print("Is the connection open: ", my_db.connected)


```

Now, the connection is closed even in case of an exception because the `__exit__` is called regardless of exceptions, similarly to the code in a `final` block. Note that the `__enter__` has to be executed without an error for the `__exit__` method to be called [[Python docs 2026 - The with statement](https://docs.python.org/3/reference/compound_stmts.html#with)].

## Compliant Code Example - `@contextmanager` decorator

An alternative solution is to use the `@contextmanager` decorator from the `contextlib` library. It can be used to define the behaviour for the `with` statement without needing additional methods, or even classes. The `compliant02.py` code example shows an alternative solution by decorating the `connect` method.

*[compliant02.py](compliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from contextlib import contextmanager

class DbConnection:
    """Class representing a house"""
    def __init__(self):
        self.connected = False

    @contextmanager
    def connect(self):
        """Manages the connection"""
        self.connected = True
        try:
            yield self
        finally:
            self._disconnect()

    def _disconnect(self):
        self.connected = False

    def read(self):
        """Simulates an operation resulting in an error"""
        if self.connected:
            print("Reading from the database...")
            raise RuntimeError("Database could not be read from!")



def read_from_database(database):
    """Simulates usage of a stateful resource"""
    with database.connect():
        database.read()


#####################
# Exploiting above code example
#####################


my_db = DbConnection()
try:
    read_from_database(my_db)
except RuntimeError as e:
    print("Error while trying to read: ", e)

print("Is the connection open: ", my_db.connected)

```

The method annotated with this decorator must be a generator that yields exactly one value. When the value is yielded, the code within the `with` block is executed. After that, the generator method is resumed, allowing for necessary cleanup operations. It is advised to use the `try...finally` statement to ensure exceptions won't interrupt the execution of the generator method [[Python docs 2026 - contextlib](https://docs.python.org/3/library/contextlib.html)].

The `with` statement and the `@contextmanager` decorator have been specified in [[PEP-343](https://peps.python.org/pep-0343/)].

## Automated Detection

<table>
    <tr>
        <th>Tool</th>
        <th>Version</th>
        <th>Checker</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Bandit</td>
        <td>1.7.4 on Python 3.10.4</td>
        <td>Not Available</td>
        <td></td>
    </tr>
</table>

## Related Guidelines

<table>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Pillar: <a href="https://cwe.mitre.org/data/definitions/703.html"> CWE-703: Improper Check or Handling of Exceptional Conditions</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base <a href="http://cwe.mitre.org/data/definitions/460.html">CWE-460: Improper Cleanup on Thrown Exception</a></td>
    </tr>
    <tr>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java">SEI CERT Oracle Coding Standard for Java</a></td>
    <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/ERR03-J.+Restore+prior+object+state+on+method+failure"></a>ERR03-J. Restore prior object state on method failure</td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>[Python docs 2026 - The with statement]</td>
        <td>8.5. The with statement [online]. Available from: <a href="https://docs.python.org/3/reference/compound_stmts.html#with">https://docs.python.org/3/reference/compound_stmts.html#with</a>,  [Accessed 31 July 2026]</td>
    </tr>
    <tr>
        <td>[Python docs 2026 - contextlib]</td>
        <td>contextlib — Utilities for with-statement contexts [online]. Available from: <a href="https://docs.python.org/3/library/contextlib.html">https://docs.python.org/3/library/contextlib.html</a>,  [Accessed 31 July 2026]</td>
    </tr>
    <tr>
        <td>[PEP-343]</td>
        <td>PEP 343 – The “with” Statement [online]. Available from: <a href="https://peps.python.org/pep-0343/">https://peps.python.org/pep-0343/</a>,  [Accessed 31 July 2026]</td>
    </tr>
</table>
