# pyscg-0052: Ensure Cleanup on Exceptions

Ensure your code fully and correctly restores its state whenever an exception occurs to avoid lingering side effects or corrupted control flow.

As functions or loops increase in complexity, managing resource lifecycles becomes critical. Exceptions can interrupt normal execution flow before necessary cleanup operations are performed, leaving resources acquired, connections open, locks held, or other state changes unreverted.

To mitigate this, ensure that cleanup or state-restoration logic executes before control leaves the relevant scope, regardless of whether the scope is exited normally, by an early return, or because of an exception.

The preferred approach in Python is the `with` statement. It provides a structured way to manage setup and cleanup around a block of code. It is commonly used with files, network connections, and databases to ensure resources are properly released even if errors occur.

Operating without the `with` statement requires manual management, such as explicitly matching `lock.acquire()` and `lock.release()`, as demonstrated in the `example01.py` code.

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

The `with` statement ensures that the context manager's cleanup protocol is invoked when control leaves the block, including when the block exits because of an exception. The context manager is responsible for implementing that cleanup correctly.

When a context manager is not available, use `try...finally` to ensure cleanup is attempted even when the protected operation raises an exception. When a resource provides a context-manager interface, prefer `with` over manually managing its lifecycle.

## Non-Compliant Code Example

The `noncompliant01.py` script provides an example of a stateful resource. The `DbConnection` class imitates a data stream, simplifying it to the `connected` boolean attribute. It provides the `connect()` and `disconnect()` methods to manipulate this value, while the `read` method simulates an operation that results in an unexpected exception.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

class DbConnection:
    """Class representing a database connection"""
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

Because the `read_from_database` function manages the connection manually, the unexpected `RuntimeError` aborts execution before `database.disconnect()` can run. As a result, the `connected` attribute remains `True` after the exception, leaving the connection in an invalid state.

## Compliant Solution

The `compliant01.py` code example solves this by introducing the `with` statement to the `read_from_database` function and implementing the **context manager** protocol through the `__enter__` and `__exit__` special methods inside `DbConnection`. The `__enter__` method handles operations required when opening or entering the block, while `__exit__`  method is invoked when the `with` block is exited, allowing the context manager to perform cleanup.

*[compliant01.py](compliant01.py):*

## Compliant Code Example - `with` statement

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

class DbConnection:
    """Class representing a database connection"""
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

The connection is now safely closed even if an exception occurs because `__exit__` is invoked regardless of how the block terminates, similarly to the code in a `finally` block. Note that `__enter__` has to be executed without an error for the `__exit__` method to be called [[Python docs 2026 - The with statement](https://docs.python.org/3/reference/compound_stmts.html#with)].

## Compliant Code Example - `@contextmanager` decorator

An alternative solution is the `@contextmanager` decorator from the `contextlib` standard library module. This allows you to define context manager behavior using a generator function instead of writing a dedicated class with magic methods. The `compliant02.py` code example demonstrates this approach by decorating the `connect` method.

*[compliant02.py](compliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from contextlib import contextmanager

class DbConnection:
    """Class representing a database connection"""
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

A function decorated with `@contextmanager` must be a generator that yields exactly once. Code before the `yield` performs setup, while code after the `yield` performs cleanup. Cleanup should normally be placed in a `finally` block so that it executes even when the with body raises an exception. [[Python docs 2026 - contextlib](https://docs.python.org/3/library/contextlib.html)].

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
