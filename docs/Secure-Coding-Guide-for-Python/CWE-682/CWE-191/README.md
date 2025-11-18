# CWE-191, Integer Underflow (Wrap or Wraparound)

Ensure that integer overflow is properly handled in order to avoid unexpected behavior. Python data types can be divided into two categories:

- Built-in types such as `int`, `float`, or `complex` [[Python 2024]](https://docs.python.org/3.9/library/stdtypes.html). These types are provided by classes and are protected against overflows.

- Primitive types share issues known from `C` , or `C++` and appear in `Python` to:
  - interact with the operating system modules such as `time`.
  - to be memory efficiency using modules such as `numpy` or `ctype`.

Developers should follow the `C` guidelines when using or interacting with `C` type variables.

## Non-Compliant Code Example -- Using numpy.int64

Using a `numpy.int64` can cause an unintentional flip of its sign when reaching the maximum number that can be stored as demonstrated in `noncompliant01.py`.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import numpy

a = numpy.int64(numpy.iinfo(numpy.int64).max)
print(a + 1)  # RuntimeWarning and continues
print()
b = numpy.int64(numpy.iinfo(numpy.int64).max + 1)  # OverflowError and stops
print(b)  # we will never reach this
```

Adding `+1` to `9223372036854775807` results in a negative number `-9223372036854775808` and throws a `RuntimeWarning`  but continues.

An attempt to create `int` from a too big number causes an `OverflowError` and stops.

> [!NOTE]
> It has been observed that different results may occur depending on the version of `numpy`. For reference, we are using `numpy 1.23.1` and Python `3.9.12.`

## Compliant Solution -- Using numpy.int64

The `compliant01.py` code detects the integer overflow by catching the appropriate Exception.

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

import warnings
import numpy

warnings.filterwarnings("error")
a = numpy.int64(numpy.iinfo(numpy.int64).max)
with warnings.catch_warnings():
    try:
        print(a + 1)
    except Warning:
        print("Failed to increment " + str(a) + " due to overflow error")
    # RuntimeWarning and continues

try:
    b = numpy.int64(numpy.iinfo(numpy.int64).max + 1)  # OverflowError and stops
except OverflowError:
    print("Failed to assign value to B due to overflow error")
```

## Non-Compliant Code Example -- Using datetime.timedelta()

The `noncompliant02.py` example uses `datetime.timedelta()` to get `x` hours in the future or past for time travelers. The `datetime` is interfacing with the operating system through the `libpython` library written in `C`. Overall the Georgian calender ISO 8601 is limited to 1 - 9999 years [Python datetime 2025](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes).

*[noncompliant02.py](noncompliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Noncompliant Code Example"""

from datetime import datetime, timedelta


def get_datetime(currtime: datetime, hours: int):
    """
    Gets the time n hours in the future or past

    Parameters:
    currtime (datetime): A datetime object with the starting datetime.
    hours (int): Hours going forward or backwards

    Returns:
    datetime: A datetime object
    """
    return currtime + timedelta(hours=hours)


#####################
# attempting to exploit above code example
#####################
datetime.fromtimestamp(0)
currtime = datetime.fromtimestamp(1)  # 1st Jan 1970

# OK values are expected to work
# NOK values trigger OverflowErrors in libpython written in C
hours_list = [
    0,  # OK
    1,  # OK
    70389526,  # OK
    70389527,  # NOK
    51539700001,  # NOK
    24000000001,  # NOK
    -1,  # OK
    -17259889,  # OK
    -17259890,  # NOK
    -23999999999,  # NOK
    -51539699999,  # NOK
]
for hours in hours_list:
    try:
        result = get_datetime(currtime, hours)
        print(f"{hours} OK, datetime='{result}'")
    except Exception as exception:
        print(f"{hours} {repr(exception)}")
```

The `noncompliant02.py` code is triggering various `OverflowError` exceptions in the `libpython` library:

- `date value out of range`
- `OverflowError('Python int too large to convert to C int')`
- `days=1000000000; must have magnitude <= 999999999`

## Compliant Solution -- Using datetime.timedelta()

This `compliant02.py` solution is preventing `OverflowError` exception in `libpython` by safeguarding the upper and lower limits in the provided `hours`. Upper and lower limit for `currtime` as well as input sanitization and secure logging are missing and must be added when interfacing with a lesser trusted entity.

*[compliant02.py](compliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from datetime import datetime, timedelta
import logging

# Enabling verbose debugging
# logging.basicConfig(level=logging.DEBUG)


def get_datetime(currtime: datetime, hours: int):
    """
    Gets the time n hours in the future or past

    Parameters:
    currtime (datetime): A datetime object with the starting datetime.
    hours (int): Hours going forward or backwards

    Returns:
    datetime: A datetime object
    """
    # TODO: input sanitation
    # Calculate lower boundary, hours from year 1 to currtime:
    timedelta_lowerbound = currtime - datetime(1, 1, 1)  # 1st Jan 0001
    hours_min = timedelta_lowerbound.total_seconds() // 3600 * -1

    # Calculate upper boundary, hours from year 9999 to currtime:
    timedelta_upperbound = datetime(9999, 12, 31) - currtime
    hours_max = timedelta_upperbound.total_seconds() // 3600

    # TODO: proper secure logging
    logging.debug(
        "hours_max=%s hours_min=%s hours=%s",
        hours_max,
        hours_min,
        hours,
    )
    if (hours > hours_max) or (hours < hours_min):
        raise ValueError("hours out of range")

    return currtime + timedelta(hours=hours)


#####################
# attempting to exploit above code example
#####################
datetime.fromtimestamp(0)
currtime = datetime.fromtimestamp(1)  # 1st Jan 1970

# OK values are expected to work
# NOK values trigger OverflowErrors in libpython written in C
hours_list = [
    0,  # OK
    1,  # OK
    70389526,  # OK
    70389527,  # NOK
    51539700001,  # NOK
    24000000001,  # NOK
    -1,  # OK
    -17259889,  # OK
    -17259890,  # NOK
    -23999999999,  # NOK
    -51539699999,  # NOK
]
for hours in hours_list:
    try:
        result = get_datetime(currtime, hours)
        print(f"{hours} OK, datetime='{result}'")
    except Exception as exception:
        print(f"{hours} {repr(exception)}")
```

The `compliant02.py` example is protecting the lower level c-lib from an `OverflowError` by setting boundaries for valid values in `hours`. Similar issues occur with any functionality provided through the operating system.

## Non-Compliant Code Example -- Using math.exp

The `noncompliant03.py` code example results in a `OverflowError: math range error`. This is due to `math.exp` being a `C` implementation behind the scenes for better performance. So while it returns a `Python float` it does use `C` type of variables internally for the calculation in `mathmodule.c` [[cpython 2024]](https://github.com/python/cpython/blob/main/Modules/mathmodule.c).

*[noncompliant03.py](noncompliant03.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
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

## Compliant Solution -- Using math.exp

This `compliant03.py` solution detects the `integer` overflow by catching the appropriate Exception on overflow:

*[compliant03.py](compliant03.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import math


def calculate_exponential_value(number):
    """Return 'E' raised to the power of different numbers:"""
    try:
        return math.exp(number)
    except OverflowError:
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
|[[Python 2024]](https://docs.python.org/3.9/library/stdtypes.html)|Format String Syntax. [online] Available from: <https://docs.python.org/3.9/library/stdtypes.html> \[Accessed 20 June 2024]|
|[[cpython 2024]](https://github.com/python/cpython/blob/main/Modules/mathmodule.c)|mathmodule.c. [online] Available from: <https://github.com/python/cpython/blob/main/Modules/mathmodule.c)> \[Accessed 20 June 2024]|
|[Python datetime 2025]|datetime strftime() and strptime() Format Codes [online], Available from: <https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes> [Accessed 27 March 2025]|
