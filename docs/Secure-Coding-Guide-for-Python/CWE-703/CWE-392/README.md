# CWE-392: Missing Report of Error Condition

Failure to provide a mechanism for reporting that tasks in a thread pool failed as a result of an exceptional condition can make it difficult or impossible to diagnose the problem.

**ThreadPoolExecutor** from the `concurrent.futures` module is used in Python to asynchronously execute callable tasks [[Python Docs - concurrent.futures]](https://docs.python.org/3/library/concurrent.futures.html). The `ThreadPoolExecutor` suppresses exceptions raised by tasks to ensure that the failure of a task does not result in the failure of a worker thread in the thread pool. Otherwise, worker threads would close whenever an exception is raised, negatively impacting the performance of the `ThreadPoolExecutor`.

## Non-Compliant Code Example (submit)

One of the ways of running a task with `ThreadPoolExecutor` is using a `submit()` function. The function returns a Future object, which represents the eventual result of an asynchronous operation. Without calling the `result()` function on the Future object, any exceptions raised during the task will not appear. In the below example, the function `get_sqrt()` will raise a `ValueError` when trying to calculate a square root of a negative number [[Python Docs - Errors and Exceptions]](https://docs.python.org/3/tutorial/errors.html#handling-exceptions). However, no Exception will be raised during the code execution.

*[noncompliant01.py](noncompliant01.py):*

```python
{% include_relative noncompliant01.py %}
```

## Compliant Solution (exception() method)

In order to determine whether an exception occurred, we can call the `exception()` method of the Future object. It returns the exception that was raised during the task execution or None if no exception was raised. It is important to note that **`exception()` does not raise the exception**, thus it cannot be caught in a `try … except` statement.

*[compliant01.py](compliant01.py):*

```python
{% include_relative compliant01.py %}
```

## Compliant Solution (result() method)

The exception that was suppressed by the ThreadPoolExecutor will also be raised upon calling the `result()` method on the Future object. Since the exception is raised, it can be handled using the `try … except` statement.

*[compliant02.py](compliant02.py):*

```python
{% include_relative compliant02.py %}
```

A similar example of using the `result()` and `exception()` methods to handle exceptions in the Future objects can be found at [[Ross 2020]](https://skeptric.com/python-futures-exception/index.html).

## Non-Compliant Code Example (map)

Alternatively, the asynchronous tasks can be run by the ThreadPoolExecutor using the `map()` function, which takes the function that should be run and an iterable collection of its parameters. `map()` creates a separate thread for each set of parameters in the given collection. Instead of a Future object, it returns all the task results in an iterator. The iterator maintains the order of submitted tasks - the first task that raises an exception will cause the iterator to be aborted and further results will not be generated.

*[noncompliant02.py](noncompliant02.py):*

```python
{% include_relative noncompliant02.py %}
```

## Compliant Solution (Custom exception handling)

Since an exception is raised during iterating over the results, we can handle the exception using the `try … except` statement.

*[compliant03.py](compliant03.py):*

```python
{% include_relative compliant03.py %}
```

Even after handling the exception, the results of tasks submitted after the erroneous task are still not available. If we were to iterate over the results manually using the `next()` method, we could see that after the task exception, a StopIterator is also raised. This terminates the result generator's useful life, which means further results will not be generated. This mechanism was described in [[PEP 0255]](https://peps.python.org/pep-0255/#specification-generators-and-exception-propagation).

If we want to make sure all task results will be available, we can either avoid using `map()` by using `submit()` instead, or we can ensure no unhandled exception will be raised within the executed task.

*[compliant04.py](compliant04.py):*

```python
{% include_relative compliant04.py %}
```

More examples of handling exceptions within and outside the concurrent tasks can be found at [[Brownlee 2022]](https://superfastpython.com/threadpoolexecutor-exception-handling/).

## Automated Detection

unknown

## Related Guidelines

|||
|:----|:----|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-703: Improper Check or Handling of Exceptional Conditions](https://cwe.mitre.org/data/definitions/703.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE-392, Missing Report of Error Condition](https://cwe.mitre.org/data/definitions/392.html)|
|[SEI CERT Java Coding Standards](https://wiki.sei.cmu.edu/confluence/display/seccode/SEI+CERT+Coding+Standards)|[TPS03-J. Ensure that tasks executing in a thread pool do not fail silently](https://wiki.sei.cmu.edu/confluence/display/java/TPS03-J.+Ensure+that+tasks+executing+in+a+thread+pool+do+not+fail+silently)|

## Biblography

|||
|:----|:----|
|[Python Docs - concurrent.futures]| Python 3.10.4 documentation - concurrent.futures — Launching parallel tasks \[online]. Available from: <https://docs.python.org/3/library/concurrent.futures.html> \[accessed 9 May 2024]|
|[Python Docs - Errors and Exceptions]| Python 3.10.4 documentation - 8. Errors and Exceptions \[online]. Available from: <https://docs.python.org/3/tutorial/errors.html> \[accessed 9 May 2024]|
|[Ross 2020]|Ross, E. (2020). Raising Exceptions in Python Futures \[online]. Available from: <https://skeptric.com/python-futures-exception/index.html> \[accessed 21 December 2023].|
|[Brownlee 2022]|Brownlee, J. (2022). How to Handle Exceptions With the ThreadPoolExecutor in Python \[online]. Available from: <https://superfastpython.com/threadpoolexecutor-exception-handling/> \[accessed 21 December 2023].|
|[PEP 0255]|PEP 255 - Simple Generators Specification: Generators and Exception Propagation \[online]. Available from: <https://peps.python.org/pep-0255/#specification-generators-and-exception-propagation> \[accessed 9 May 2024]|
