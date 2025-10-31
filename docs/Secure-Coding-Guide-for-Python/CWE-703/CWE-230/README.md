# CWE-230: Improper Handling of Missing Values

Detect and handle missing numberic values explicitly, either by removing, validating or converting them, before performing comparisons, sorting, or statistics, in order to avoid surprising or undefined behaviour.

The `NaN` value should be stripped before as they can cause surprising or undefined behaviours in the statistics functions that sort or count occurrences [[2024 doc.python.org]](https://docs.python.org/3/library/statistics.html).
In python, some datasets use `NaN` (not-a-number) to represent the missing data. This can be problematic as the `NaN` values are unordered.  Any ordered comparison of a number to a not-a-number value are `False`. A counter-intuitive implication is that `not-a-number` values are not equal to themselves.

This behavior is compliant with IEEE 754[[543-2019 - IEEE Standard for Floating-Point Arithmetic]](https://ieeexplore.ieee.org/document/8766229) a hardware induced compromise.
The [example01.py](example01.py) code demonstrates various comparisons of `float('NaN')` all resulting in `False`.

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """

foo = float('NaN')
print(f"foo={foo} type = {type(foo)}")


print(foo == float("NaN") or
      foo is float("NaN") or
      foo < 3 or
      foo == foo or
      foo is None
      )

```

## Non-Compliant Code Example

This noncompliant code example [[2024 docs.python.org]](https://docs.python.org/3/reference/expressions.html#value-comparisons) attempts a direct comparison with `NaN` in `_value == float("NaN")`.
*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def balance_is_positive(value: str) -> bool:
    """Returns True if there is still enough value for a transaction"""
    _value = float(value)
    if _value == float("NaN") or _value is float("NaN") or _value is None:
        raise ValueError("Expected a float")
    if _value <= 0:
        return False
    else:
        return True


#####################
# attempting to exploit above code example
#####################
print(balance_is_positive("0.01"))
print(balance_is_positive("0.001"))
print(balance_is_positive("NaN"))

```

## Compliant Solution

In the `compliant01.py` code example, the method `Decimal.quantize` is used to gain control over known rounding errors in floating point values.

The decision by the `balance_is_positive` method is to `ROUND_DOWN` instead of the default `ROUND_HALF_EVEN`.

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

from decimal import ROUND_DOWN, Decimal


def balance_is_positive(value: str) -> bool:
    """Returns True if there is still enough value for a transaction"""
    # TODO: additional input sanitation for expected type
    _value = Decimal(value)
    # TODO: exception handling
    return _value.quantize(Decimal(".01"), rounding=ROUND_DOWN) > Decimal("0.00")


#####################
# attempting to exploit above code example
#####################
print(balance_is_positive("0.01"))
print(balance_is_positive("0.001"))
print(balance_is_positive("NaN"))

```

`Decimal` throws a `decimal.InvalidOperation` for `NaN` values, the controlled rounding causes only `"0.01"` to return `True`.

In `compliant02.py` we use the `math.isnan` to verify if the value passed is a valid `float` value.

*[compliant02.py](compliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

import math


def balance_is_positive(value: str) -> bool:
    """Returns True if there is still enough value for a transaction"""
    _value = float(value)
    if math.isnan(_value) or _value is None:
        raise ValueError("Expected a float")
    if _value < 0.01:
        return False
    else:
        return True


#####################
# attempting to exploit above code example
#####################
print(balance_is_positive("0.01"))
print(balance_is_positive("0.001"))
print(balance_is_positive("NaN"))

```

The `balance_is_poitive` method will raise an `ValueError` for `NaN` values.

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|flake8|flake8-4.0.1 on python 3.10.4||Not Available|

## Related Guidelines

|||
|:---|:---|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM07-J. Do not attempt comparisons with NaN](https://wiki.sei.cmu.edu/confluence/display/java/NUM07-J.+Do+not+attempt+comparisons+with+NaN)|
|[ISO/IEC TR 24772:2013](https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-ISO/IECTR24772-2013)|Injection RST|
|[MITRE CWE Pillar](http://cwe.mitre.org/)|[CWE-703: Improper Check or Handling of Exceptional Conditions (mitre.org)](https://cwe.mitre.org/data/definitions/703.html)|
|[MITRE CWE Pillar](http://cwe.mitre.org/)|[CWE-230: Improper Handling of Missing Values](https://cwe.mitre.org/data/definitions/230.html)|
|[[Real Python]](https://realpython.com/python-string-formatting/)|Real Python: <https://realpython.com/python-string-formatting/> \[Accessed 20 October 2025]|

## Bibliography

|||
|:---|:---|
|[[Python 3.10.4 docs]](https://docs.python.org/3/library/string.html#formatstrings)|Format String Syntax. Available from: <https://docs.python.org/3/library/string.html#formatstrings> \[Accessed 22 July 2025]|
|[Python docs](https://docs.python.org/3/)|<https://docs.python.org/3/library/math.html#math.nan> \[Accessed 22 July 2025]|
|[Python docs](https://docs.python.org/3/)|Python Value comparisons<https://docs.python.org/3/reference/expressions.html#value-comparisons> \[Accessed 22 July 2025]|
|[[IEEE Xplore]](https://ieeexplore.ieee.org/Xplore/home.jsp)|IEEE 754: <https://ieeexplore.ieee.org/document/8766229> \[Accessed 20 October 2025]|
