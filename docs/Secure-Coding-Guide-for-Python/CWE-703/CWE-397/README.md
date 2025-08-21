# CWE-397: Declaration of Throws for Generic Exception

Avoid raising exceptions that aren't informative on specific errors.

`Exception` is the base class of all non-system-exiting exceptions [[Python docs 2025](https://docs.python.org/3/library/exceptions.html#Exception)]. Specific exceptions allow to determine why they were raised and attempt recovery. To catch a generic `Exception`, you must also account for any more specific exceptions that inherit from it. Raising `Exception` is likely to hide bugs and and prevents using more specialized except statements. The problem is even more severe when raising `BaseException`, which additionally includes subclasses signifying termination signals, such as `KeyboardInterrupt` and `SystemExit` [[PEP 2024](https://peps.python.org/pep-0352/#exception-hierarchy-changes)].

## Non-Compliant Code Example

The `noncompliant01.py` code example consists of a function that divides two given numbers. In case the `divisor` is zero, the `divide()` function throws a generic `Exception`.

_[noncompliant01.py](noncompliant01.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def divide(divided: int, divisor: int) -> float:
    """Function that divides two numbers"""
    if divisor == 0:
        raise Exception("Cannot divide by zero")
    return divided / divisor


#####################
# exploiting above code example
#####################
try:
    divide(1, 0)
except SystemError:
    print("Something wrong with the system!")
except ZeroDivisionError:
    print("I divided by zero!")
except Exception:
    print("Something went wrong and I have no clue what!")

```

Despite including the reason for the exception in its message, the client, having expected this particular mistake to result in a `ZeroDivisionError`, will not handle it the intended way.

## Compliant Solution

In this specific instance, Python has a built-in exception `ZeroDivisionError` that can be thrown instead of the generic `Exception`.

_[compliant01.py](compliant01.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def divide(divided: int, divisor: int) -> float:
    """Function that divides two numbers"""
    if divisor == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return divided / divisor


#####################
# exploiting above code example
#####################
try:
    divide(1, 0)
except SystemError:
    print("Something wrong with the system!")
except ZeroDivisionError:
    print("I divided by zero!")
except Exception:
    print("Something went wrong and I have no clue what!")

```

The same exception would have been thrown when directly dividing a number by zero. Nonetheless, using specific exceptions is useful when handling different errors and edge cases.

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
        <td>1.7.4 on Python 3.10.4</td>
        <td>Not Available</td>
        <td></td>
    </tr>
    <tr>
        <td>Flake8</td>
        <td>8-4.0.1 on Python 3.10.4</td>
        <td>Not Available</td>
        <td></td>
    </tr>
</table>

## Related Guidelines

<table>
    <tr>
        <td>
            <a href="https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java">
                SEI CERT Oracle Coding Standard for Java
            </a>
        </td>
        <td>
            <a href="https://wiki.sei.cmu.edu/confluence/display/java/ERR07-J.+Do+not+throw+RuntimeException%2C+Exception%2C+or+Throwable">
                ERR07-J. Do not throw RuntimeException, Exception, or Throwable
            </a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="http://cwe.mitre.org/">
                MITRE CWE
            </a>
        </td>
        <td>
            Pillar:
            <a href="https://cwe.mitre.org/data/definitions/703.html">
                CWE-703: Improper Check or Handling of Exceptional Conditions
            </a>
        </td>
    </tr>
    <tr>
        <td>
            <a href="http://cwe.mitre.org/">
                MITRE CWE
            </a>
        </td>
        <td>
            Base:
            <a href="https://cwe.mitre.org/data/definitions/397.html">
                CWE-397, Declaration of Throws for Generic Exception (4.12)
            </a>
        </td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>
            [
                <a href="https://docs.python.org/3/library/exceptions.html#Exception">
                    Python docs 2025
                </a>
            ]
        </td>
        <td>
            Python Software Foundation. (2025). Built in exceptions [online].<br>
            Available from:
            <a href="https://docs.python.org/3/library/exceptions.html#Exception">
                https://docs.python.org/3/library/exceptions.html#Exception
            </a><br>
            [Accessed 29 July 2025]
        </td>
    </tr>
    <tr>
        <td>
            [
            <a href="https://peps.python.org/pep-0352/#exception-hierarchy-changes">
                PEP 2024
            </a>
            ]
        </td>
        <td>
            Python Enhancement Proposal 352. (2024). Required Superclass for Exceptions [online].<br>
            Available from:
            <a href="https://peps.python.org/pep-0352/#exception-hierarchy-changes">
                https://peps.python.org/pep-0352/#exception-hierarchy-changes
            </a><br>
            [Accessed 29 July 2025]
        </td>
    </tr>
</table>
