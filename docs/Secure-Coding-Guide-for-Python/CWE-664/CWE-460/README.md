
# CWE-460: Improper Cleanup on Thrown Exception

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

It is best practice to use `with` statement in such cases as it will make sure the resource gets released even if an exception occurs in the execution.

## Non-Compliant Code Example

In the `noncompliant01.py` example, a thread gets locked, but not unlocked due to an exception being thrown before it can be closed. This might lead to the lock remaining closed and inaccessible for further use.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import threading


lock = threading.Lock()


def perform_critical_operation():
    lock.acquire()
    print("Lock acquired, performing critical operation...")
    raise ValueError("Something went wrong!")
    lock.release()  # This line is never reached due to the exception


try:
    perform_critical_operation()
except ValueError as e:
    print(f"Caught exception: {e}")


# Next attempt to acquire the lock will block forever; as there is a deadlock!
lock.acquire()
print("This will not print because the lock was never released.")

```

In the `noncompliant01.py` code example, the acquired lock never gets released, as an error gets thrown before it can be released.

## Compliant Solution

The `compliant01.py` is using the `with` statement to ensure that the lock is released properly even if an error is to occur.

*[compliant01.py](compliant01.py):*

## Compliant Code Example

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import threading

lock = threading.Lock()


def perform_critical_operation():
    with lock:
        # the lock has been acquired using the 'with' statement and will be released when the block exits; even if an exception occurs
        print("Lock acquired, performing critical operation...")
        raise ValueError("Something went wrong!")
        # This line will not be reached because of the exception above
    print("Lock released.")


try:
    perform_critical_operation()
except ValueError as e:
    print(f"Caught exception: {e}")

```

## Automated Detection

|||||
|:---|:---|:---|:---|
|Tool|Version|Checker|Description|

## Related Guidelines

|||
|:---|:---|
|[SEI CERT](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[ERR03-J. Restore prior object state on method failure - SEI CERT Oracle Coding Standard for Java - Confluence (cmu.edu)](https://wiki.sei.cmu.edu/confluence/display/java/ERR03-J.+Restore+prior+object+state+on+method+failure)|
|[CWE MITRE Pillar](http://cwe.mitre.org/)|<http://cwe.mitre.org/data/definitions/460.html>|
