# CWE-400: Uncontrolled Resource Consumption

Canceling the task in a thread pool only prevents it from being executed if it has not started yet. For the task to be interruptible, it must handle the `threading.Event` flag.

## Non-Compliant Code Example

Tasks can be submitted to the ThreadPoolExecutor by calling `submit()`. Submitted tasks can be canceled by calling `cancel()` on the Future object returned by `submit()`. Calling this method will return True and stop the task from being executed if it has not started yet. However, if its execution has already started, calling `cancel()` will instead return  False and will not stop the task [[Python 3.10.4 docs on threading.Event]](https://docs.python.org/3/library/threading.html#event-objects).

[*noncompliant01.py:*](noncompliant01.py)

```python
{% include_relative noncompliant01.py %}
```

## Compliant Solution

Tasks submitted to the ThreadPoolExecutor can be interrupted by setting a thread-safe flag, such as `threading.Event`  [[Python 3.10.4 docs on threading.Event]](https://docs.python.org/3/library/threading.html#event-objects). An Event object should be passed as an argument to the submitted task. From within the task function, we need to manually check the flag status by calling `event.is_set()` and handling the interruption. In order to set the Event flag, we can call `event.set()` on the event object.

[*compliant01.py:*](compliant01.py)

```python
{% include_relative compliant01.py %}
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
