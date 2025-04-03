# CWE-390: Detection of Error Condition without Action

Allow exceptions to bubble up and handle exceptions at the right level in the stack.

Each `except` block must ensure that the program continues only with formally specified behavior by either:

* Recovering from the exceptional condition
* Re-throwing the exception with additional information
* Throwing custom exception only if it provides a benefit over Python's [Built-in Exceptions](https://docs.python.org/3.9/library/exceptions.html) [Python.org 2022].

Invalid reasons for suppressing exceptions cause:

* Excessive complexity
* Print statements from lower levels
* Incomplete trace-logs
* Excessive logging

Printing the stack trace can reveal details and sensitive data about an application such as the components in use, existing users, and other sensitive information such as keys or passwords, as described in [CWE-209: Generation of Error Message Containing Sensitive Information](https://cwe.mitre.org/data/definitions/209.html) and will not be handled in these examples.

## Non-Compliant Code Example - Bare Exception

In Python `Exception` extends from `BaseException`and a bare `except` will catch everything.

For instance, catching a bare `except` causes a user to be unable to stop a script via `CTRL+C`, due to the base `except` catching all exceptions. In comparison, catching `except Exception` allows a `KeyboardInterrupt` to be the Python interpreter itself or other parts of the code. This is due to `KeyboardInterrupt` extending `BaseException` and not `Exception`.

Note that using `except Exception` is still too broad as per [CWE-755: Improper Handling of Exceptional Conditions](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/CWE-703/CWE-755/README.md) and that a more specific exception handling is preferred.

The `noncompliant01.py` code demonstrates a bare `except` on a `ZeroDivisionError` and must be run on the command line in order to experience the issue.

*[noncompliant01.py](noncompliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
 
from time import sleep
 
 
def exception_example():
    """Non-compliant Code Example using bare except"""
    while True:
        try:
            sleep(1)
            _ = 1 / 0
        except:
            print("Don't care")
 
 
#####################
# exploiting above code example
#####################
exception_example()
```

The `noncompliant01.py` will continue to run when launched via terminal even when using `CTRL+C`.

The process will have to be terminated or killed in order to stop it. A programming IDE will allow stopping the `noncompliant01.py`as IDEs tend to kill the process rather than sending `CTRL+C`.

## Compliant Code Example - Bare Exception

The `compliant01.py` code example can be stopped via `CTRL+C` on the command line as it is catching the self created `ZeroDivisionError` instead of using a bare exception.

*[compliant01.py](compliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from time import sleep


def exception_example():
    """Compliant Code Example catching a specific exception"""
    while True:
        sleep(1)
        try:
            _ = 1 / 0
        except ZeroDivisionError:
            print("How is it now?")


#####################
# exploiting above code example
#####################
exception_example()
```

If recovery from an exception remains impossible, it is often best practice to wrap the checked exception in an unchecked exception and rethrow it. This approach allows the application to fail gracefully or log the error for future debugging, rather than crashing unexpectedly.

`example01.py` assist in the understanding of Java's SEI Cert exceptions [SEI CERT ERR00-J 2025](https://wiki.sei.cmu.edu/confluence/display/java/ERR00-J.+Do+not+suppress+or+ignore+checked+exceptions) by providing a use-case specfic explaination `slice_cake:You got to give me plates` when re-throwing `ZeroDivisionError`.

*[example01.py](example01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Code Example"""


def slice_cake(cake: int, plates: int) -> float:
    """Calculates size of each slice per plate for a cake
    Args:
        cake (int)  : Size of the cake
        guests (int): Amount of guests
    Returns:
        (float): Size of each slice
    """

    try:
        return cake / plates
    except ZeroDivisionError as zero_division_error:
        raise ZeroDivisionError(
            "slice_cake:You got to give me plates"
        ) from zero_division_error


#####################
# exploiting above code example
#####################
slice_cake(cake=100, plates=0)
```

## Exceptions

The following two exceptions, highlighted in [SEI Cert's Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java), are important to understand when to attempt to handle exceptions at the right level in the stack in Python also.

* __ERR00-J-EX0:__ You may suppress exceptions during the release of non-reusable resources, such as closing files, network sockets, or shutting down threads, if they don't affect future program behavior.
* __ERR00-J-EX1:__ Allow higher-level code to catch and attempt recovery from exceptions. If recovery is not possible, log the exception, add information if needed, and rethrow it.

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|[Ruff](https://docs.astral.sh/ruff/)|v0.4.5|[bare-except (E722)](https://docs.astral.sh/ruff/rules/bare-except/)|Use lazy % formatting in logging functions|
|[Pylint](https://pylint.pycqa.org/)|3.2.7|[W0702:bare-except](https://pylint.pycqa.org/en/latest/user_guide/messages/warning/bare-except.html)|No exception type(s) specified|
|[flake8](https://www.flake8rules.com/)|7.1.1|[E722](https://www.flake8rules.com/rules/E722.html)|do not use bare 'except'|

## Related Guidelines

|||
|:---|:---|
|[MITRE](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)|[CWE-209: Generation of Error Message Containing Sensitive Information](https://cwe.mitre.org/data/definitions/209.html)|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[ERR00-J. Do not suppress or ignore checked exceptions](https://wiki.sei.cmu.edu/confluence/display/java/ERR00-J.+Do+not+suppress+or+ignore+checked+exceptions)|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-703](https://cwe.mitre.org/data/definitions/703.html), Improper Check or Handling of Exceptional Conditions|
|[MITRE CWE Pillar](http://cwe.mitre.org/)|[CWE-390](http://cwe.mitre.org/data/definitions/390.html), Detection of Error Condition without Action|

## Biblography

|||
|:---|:---|
|[[Python.org](https://docs.python.org/3.9/) 2022]| python.org. (2022). Built-in Exceptions [online]. Available from: [https://docs.python.org/3.9/library/exceptions.html](https://docs.python.org/3.9/library/exceptions.html) [accessed 08 February 2023]|
|[SEI CERT ERR00-J 2025]|ERR00-J. Do not suppress or ignore checked exceptions [online]. Available from: [https://wiki.sei.cmu.edu/confluence/display/java/ERR00-J.+Do+not+suppress+or+ignore+checked+exceptions](https://wiki.sei.cmu.edu/confluence/display/java/ERR00-J.+Do+not+suppress+or+ignore+checked+exceptions) [Accessed Februrary 2025]|
