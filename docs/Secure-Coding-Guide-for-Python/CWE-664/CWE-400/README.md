# CWE-400: Uncontrolled Resource Consumption

Canceling the task in a thread pool only prevents it from being executed if it has not started yet. For the task to be interruptible, it must handle the `threading.Event` flag.

## Non-Compliant Code Example

Tasks can be submitted to the ThreadPoolExecutor by calling `submit()`. Submitted tasks can be canceled by calling `cancel()` on the Future object returned by `submit()`. Calling this method will return True and stop the task from being executed if it has not started yet. However, if its execution has already started, calling `cancel()` will instead return  False and will not stop the task [[Python 3.10.4 docs on threading.Event]](https://docs.python.org/3/library/threading.html#event-objects).

[*noncompliant01.py:*](noncompliant01.py)

```py
""" Non-compliant Code Example """
import time
from concurrent.futures import ThreadPoolExecutor


def take_time(x):
    print(f"Started Task: {x}")
    # Simulate work
    for i in range(10):
        time.sleep(1)
    print(f"Completed Task: {x}")


def run_thread(_executor, var):
    future = _executor.submit(take_time, var)
    return future


def interrupt(future):
    print(future.cancel())
    print(f"Interrupted: {future}")


#####################
# Exploiting above code example
#####################


with ThreadPoolExecutor() as executor:
    task = run_thread(executor, "A")
    interrupt(task)

```

## Compliant Solution

Tasks submitted to the ThreadPoolExecutor can be interrupted by setting a thread-safe flag, such as `threading.Event`  [[Python 3.10.4 docs on threading.Event]](https://docs.python.org/3/library/threading.html#event-objects). An Event object should be passed as an argument to the submitted task. From within the task function, we need to manually check the flag status by calling `event.is_set()` and handling the interruption. In order to set the Event flag, we can call `event.set()` on the event object.

[*compliant01.py:*](compliant01.py)

```py
""" Compliant Code Example """
import time
from concurrent.futures import ThreadPoolExecutor
from threading import Event


def take_time(x, _event):
    print(f"Started Task: {x}")
    # Simulate work
    for _ in range(10):
        if _event.is_set():
            print(f"Interrupted Task: {x}")
            # Save partial results
            return
        time.sleep(1)
    print(f"Completed Task: {x}")


def run_thread(_executor, var):
    e = Event()
    future = _executor.submit(take_time, var, e)
    return future, e


def interrupt(future, e):
    """Cancel the task, just in case it is not yet running, and set the Event flag"""
    future.cancel()
    e.set()


#####################
# Exploiting above code example
#####################


with ThreadPoolExecutor() as executor:
    task, event = run_thread(executor, "A")
    interrupt(task, event)

```

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Class [CWE-400: Uncontrolled Resource Consumption (4.12)](https://cwe.mitre.org/data/definitions/400.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[TPS02-J. Ensure that tasks submitted to a thread pool are interruptible](https://wiki.sei.cmu.edu/confluence/display/java/TPS02-J.+Ensure+that+tasks+submitted+to+a+thread+pool+are+interruptible)|

## Bibliography

|||
|:---|:---|
|[[Python 3.10.4 docs Future.cancel]](https://docs.python.org/3/library/concurrent.futures.html)|concurrent.futures — Launching parallel tasks — Python 3.10.4 documentation. Available from: <https://docs.python.org/3/library/concurrent.futures.html> \[Last Accessed May 2024]|
|[[Python 3.10.4 docs on threading.Event]](https://docs.python.org/3/library/threading.html#event-objects)|threading — Thread-based parallelism - Event Objects. Available from: <https://docs.python.org/3/library/threading.html#event-objects> \[Last Accessed May 2024]|
