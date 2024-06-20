# CWE-191, Integer Underflow (Wrap or Wraparound)

Ensure that integer overflow is properly handled in order to avoid unexpected behavior. Python data types can be divided into two categories:

- Built-in types such as `int`, `float`, or `complex` [[Python 2024]](https://docs.python.org/3.9/library/stdtypes.html). These types are provided by classes and are protected against overflows.

- Primitive types such as `numpy`, `time`, or `ctype`  share issues known from `C` , or `C++`  and are often used to interact with the operating system, or for efficiency. Developers should follow the `C` guidelines for rules to follow.

## Non-Compliant Code Example

Using a `numpy.int64` can cause an unintentional flip of its sign when reaching the maximum number that can be store as demonstrated in `noncompliant01.py`.

*[noncompliant01.py](noncompliant01.py):*

```python
""" Non-compliant Code Example """

import numpy

a = numpy.int64(numpy.iinfo(numpy.int64).max)
print(a + 1)  # RuntimeWarning and continues
print()
b = numpy.int64(numpy.iinfo(numpy.int64).max + 1)  # OverflowError and stops
print(b)  # we will never reach this
```

Adding `+1` to `9223372036854775807` results in a negative number `-9223372036854775808` throws a `RuntimeWarning`  but continues.

An attempt to create `int` from a too big number causes an `OverflowError` and stops.

> [!NOTE]
> It has been observed that different result may occur depending on `numpy` version for reference we are using `numpy 1.23.1` and Python version: `3.9.12.`

## Compliant Solution

The `compliant01.py` code detects the integer overflow by catching the appropriate Exception.

*[compliant01.py](compliant01.py):*

```python
""" Compliant Code Example """

import warnings
import numpy

warnings.filterwarnings("error")
a = numpy.int64(numpy.iinfo(numpy.int64).max)
with warnings.catch_warnings():
    try:
        print(a + 1)
    except Warning as _:
        print("Failed to increment " + str(a) + " due to overflow error")
    # RuntimeWarning and continues

try:
    b = numpy.int64(numpy.iinfo(numpy.int64).max + 1)  # OverflowError and stops
except OverflowError as e:
    print("Failed to assign value to B due to overflow error")
```

## Non-Compliant Code Example

The `noncompliant02.py` example tries to use `time.localtime()` to get `x` hours in the future but causes integer overflow as the given Python `int` is too large to convert to `C long`. This is possible because `time` implements C representations of integers with all the security vulnerabilities as if you were using `C`.

*[noncompliant02.py](noncompliant02.py):*

```python
""" Non-compliant Code Example """
 
import time
 
 
def get_time_in_future(hours_in_future):
    """Gets the time n hours in the future"""
    currtime = [tm for tm in time.localtime()]
    currtime[3] = currtime[3] + hours_in_future
    if currtime[3] + hours_in_future > 24:
        currtime[3] = currtime[3] - 24
    return time.asctime(tuple(currtime)).split(" ")[3]
 
 
#####################
# exploiting above code example
#####################
print(get_time_in_future(23**74))
```

## Compliant Solution

This `compliant02.py` solution handles `OverflowError` Exception when a to high value is given to `get_time_in_future`.

*[compliant02.py](compliant02.py):*

```python
""" Compliant Code Example """

import time


def get_time_in_future(hours_in_future):
    """Gets the time n hours in the future"""
    try:
        currtime = list(time.localtime())
        currtime[3] = currtime[3] + hours_in_future
        if currtime[3] + hours_in_future > 24:
            currtime[3] = currtime[3] - 24
        return time.asctime(tuple(currtime)).split(" ")[3]
    except OverflowError as _:
        return "Number too large to set time in future " + str(hours_in_future)


#####################
# attempting to exploit above code example
#####################
print(get_time_in_future(23**74))
```

## Non-Compliant Code Example

The `noncompliant03.py` code example results in a `OverflowError: math range error`. This is due to `math.exp` being a `C` implementation behind the scenes for better performance. So while it returns a `Python float` it does use `C` type of variables internally for the calculation in `mathmodule.c` [[cpython 2024]](https://github.com/python/cpython/blob/main/Modules/mathmodule.c).

*[noncompliant03.py](noncompliant03.py):*

```python
""" Non-compliant Code Example """

import math


def calculate_exponential_value(number):
    """Return 'E' raised to the power of different numbers:"""
    return math.exp(number)


#####################
# attempting to exploit above code example
#####################
print(calculate_exponential_value(1000))

```

## Compliant Solution

This `compliant03.py` solution detects the `integer` overflow by catching the appropriate Exception on overflow:

*[compliant03.py](compliant03.py):*

```python
""" Compliant Code Example """
import math


def calculate_exponential_value(number):
    """Return 'E' raised to the power of different numbers:"""
    try:
        return math.exp(number)
    except OverflowError as _:
        return "Number " + str(number) + " caused an integer overflow"


#####################
# attempting to exploit above code example
#####################
print(calculate_exponential_value(710))
```

## Related Guidelines

|||
|:---|:---|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[INT32-C. Ensure that operations on signed integers do not result in overflow](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM00-J. Detect or prevent integer overflow](https://wiki.sei.cmu.edu/confluence/display/java/NUM00-J.+Detect+or+prevent+integer+overflow)|
|ISO/IEC TR 24772:2010|Wrap-around Error [XYY]|
|[MITRE CWE Pillar](http://cwe.mitre.org/)|[CWE-682: Incorrect Calculation](https://cwe.mitre.org/data/definitions/682.html)|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-191, Integer Underflow (Wrap or Wraparound)](http://cwe.mitre.org/data/definitions/191.html)|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-190, Integer Overflow or Wraparound](http://cwe.mitre.org/data/definitions/190.html)|

## Bibliography

|||
|:---|:---|
|[[Python 2024]](https://docs.python.org/3.9/library/stdtypes.html)|Format String Syntax. Available from: <https://docs.python.org/3.9/library/stdtypes.html> \[Accessed 20 June 2024]|
|[[cpython 2024]](https://github.com/python/cpython/blob/main/Modules/mathmodule.c)|mathmodule.c. Available from: <https://github.com/python/cpython/blob/main/Modules/mathmodule.c)> \[Accessed 20 June 2024]|
