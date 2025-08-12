
# CWE-460: Improper Cleanup on Thrown Exception

The product does not clean up its state or incorrectly cleans up its state when an exception is thrown, leading to unexpected state or control flow.

Often, when functions or loops become complicated, some level of resource cleanup is needed throughout execution. Exceptions can disturb the flow of the code and prevent the necessary cleanup from happening.

A consequence of this is that the code is left in a bad state. 

One of the ways to mitigate this is to make sure that cleanup happens or that you should exit the program. Use throwing exceptions sparsely.

Another way to mitigate this is to use the ‘with’ statement. It simplifies resource management by automatically handling setup and cleanup tasks. It's commonly used with files, network connections and databases to ensure resources are properly released even if errors occur making your code cleaner.

## Non-Compliant Code Example

In the noncompliant.py example, a thread gets locked, but not unlocked due to an exception being thrown before it can be closed. This might lead to the lock remaining closed and inaccessible for further use.

noncompliant.py:

```import threading

lock = threading.Lock()

def noncompliant_example():
    lock.acquire()
    print("Lock acquired, performing critical operation...")
    raise ValueError("Something went wrong!")
    lock.release()  # This line is never reached due to the exception

try:
    noncompliant_example()
except ValueError as e:
    print(f"Caught exception: {e}")

# Next attempt to acquire the lock will block forever — deadlock!
lock.acquire()
print("This will never print because the lock was never released.")
```

In the above code example, the acquired lock never gets released, as an error gets thrown before it can be released.

## Compliant Solution

In compliant01.py we use the with statement to ensure that the lock is released properly even if an error is to occur.

compliant01.py:
## Compliant Code Example

```
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import threading

lock = threading.Lock()

def compliant_example():
    with lock:
        # the lock has been acquired using the 'with' statement and will be released when the block exits; even if an exception occurs
        print("Lock acquired, performing critical operation...")
        # raising an exception
        raise ValueError("Something went wrong!")
    print("Lock released.")

try:
    compliant_example()
except ValueError as e:
    print(f"Caught exception: {e}")
```

with lock: is shorthand for 

```
lock.acquire()
try:
    ...
finally:
    lock.release()
```



