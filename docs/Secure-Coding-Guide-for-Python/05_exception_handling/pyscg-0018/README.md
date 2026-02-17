# pyscg-0018: Validate Numeric Data Beyond Type Checking

Ensure to have handling for exceptional floating-point values.

The `float` class has the capability to interpret various input values as floating-point numbers. Some special cases can interpret input values as

* Positive Infinity
* Negative Infinity
* `NaN` (Not-a-Number)

These floating-point class values represent numbers that fall outside the typical range and exhibit unique behaviors. `NaN` (Not a Number) lacks a defined order and is not considered equal to any value, including itself. Hence, evaluating an expression such as `NaN == NaN` returns `False`.

In Python, some datasets use `NaN` (not-a-number) to represent missing data. This can be problematic as the `NaN` values are unordered. Any ordered comparison of a number to a not-a-number value is `False`. A counter-intuitive implication is that `not-a-number` values are not equal to themselves. This behavior is compliant with IEEE 754 [[IEEE Standard for Floating-Point Arithmetic](https://ieeexplore.ieee.org/document/8766229)], a hardware-induced compromise.

The `NaN` value should be stripped before performing operations as they can cause surprising or undefined behaviours in statistics functions that sort or count occurrences [[Python docs - statistics](https://docs.python.org/3/library/statistics.html)].

The following code example demonstrates various comparisons of `float('NaN')` all resulting in `False`:

*[example01.py](example01.py):*

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

The `noncompliant01.py` intent is to ensure that adding objects will not exceed a total weight of `100` units. Validation fails as the code to test for exceptional conditions, such as `NaN` or `infinity`, is missing.

*[noncompliant01.py](noncompliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""
 
import sys
 
 
class Package:
    """Class representing a package object"""
 
    def __init__(self):
        self.package_weight: float = 0.0
        self.max_package_weight: float = 100.0
 
    def add_to_package(self, object_weight: str):
        """Function for adding an object into the package"""
        value = float(object_weight)
        # This is dead code as value gets type cast to float,
        # hence will never be equal to string "NaN"
        if value == "NaN":
            raise ValueError("'NaN' not a number")
        # This is also dead code as value is type cast to float,
        # unusual inputs like -infinity will not get caught
        if isinstance(value, float) is False:
            raise ValueError("not a number")
        if self.package_weight + value > self.max_package_weight:
            raise ValueError("Addition would exceed maximum package weight.")
 
        self.package_weight += value
 
    def get_package_weight(self):
        """Getter for outputting the package's current weight"""
        return self.package_weight
 
 
#####################
# exploiting above code example
#####################
package = Package()
print(f"\nOriginal package's weight is {package.get_package_weight():.2f} units\n")
for item in [100, "-infinity", sys.float_info.max, "NaN", -100]:
    print(f"package.add_to_package({item})")
    try:
        package.add_to_package(item)
        print(
            f"package.get_package_weight() = {package.get_package_weight():.2f}\n"
        )
 
    except Exception as e:
        print(e)
```

Some important considerations when dealing with floating-point values from `non-complaint01.py`.

* Setting a value above `sys.float_info.max` does not increase the held value. In some cases, incrementing `package_weight` with a high enough value may turn its value into `inf`.
* Setting the added value to `-infinity` and `+infinity` causes the value of the `package_weight` to be infinite as well.
* Adding `"NaN"`, which is not a valid value to `package_weight` will always return `"nan"`.

**Example `noncompliant01.py` output:**

```bash
Original package's weight is 0.00 units

package.add_to_package(100)
package.get_package_weight() = 100.00

package.add_to_package(-infinity)
package.get_package_weight() = -inf

package.add_to_package(1.7976931348623157e+308)
package.get_package_weight() = -inf

package.add_to_package(NaN)
package.get_package_weight() = nan

package.add_to_package(-100)
package.get_package_weight() = nan
```

## Compliant Solution

Exceptional values and out-of-range values are handled in `compliant01.py`. Some negative values are also checked for due to the nature of the code example.
The `isfinite` function from the `math` library is useful for checking for `NaN`, `infinity` and `-infinity` values. `math.isfinite` checks if a value is neither `infinite` nor a `NaN`.

Other functions from the `math` library that could be of use are `isnan`, which checks if an inputted value is `"NaN"`, and `isinf` (which checks if a value is positive or negative infinity).

*[compliant01.py](compliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """


import sys
from math import isfinite, isnan
from typing import Union


class Package:
    """Class representing a package object."""
    def __init__(self) -> None:
        self.package_weight: float = 0.0
        self.max_package_weight: float = 100.0

    def add_to_package(self, object_weight: Union[str, int, float]) -> None:
        # TODO: input sanitation.
        # TODO: proper exception handling
        """Add an object into the package after validating its weight."""
        try:
            value = float(object_weight)
        except (ValueError, TypeError) as e:
            raise ValueError("Input cannot be converted to a float.") from e
        if isnan(value):
            raise ValueError("Input is not a number")
        if not isfinite(value):
            raise ValueError("Input is not a finite number.")
        if value < 0:
            raise ValueError("Weight must be a non-negative number.")
        if self.package_weight + value > self.max_package_weight:
            raise ValueError("Addition would exceed maximum package weight.")
 
        print(f"Adding an object that weighs {value} units to package")
        self.package_weight += value
 
    def get_package_weight(self) -> float:
        """Return the package's current weight."""
        return self.package_weight


#####################
# exploiting above code example
#####################
 
 
package = Package()
print(f"\nOriginal package's weight is {package.get_package_weight():.2f} units\n")
for item in [100, "-infinity", sys.float_info.max, "NaN", -100]:
    print(f"package.add_to_package({item})")
    try:
        package.add_to_package(item)
        print(
            f"package.get_package_weight() = {package.get_package_weight():.2f}\n"
        )
 
    except Exception as e:
        print(e)
```

This compliant code example will raise a `ValueError` for inputs that are `-infinity`, `infinity`, or `NaN`, with messages "Input is not a finite number" and "Input is not a number" respectively. It should also ensure weights are non-negative, returning "Weight must be a non-negative number" for negative inputs.

**Example `compliant01.py` output:**

```bash
Original package's weight is 0.00 units
 
package.add_to_package(100)
Adding an object that weighs 100.0 units to package
package.get_package_weight() = 100.00
 
package.add_to_package(-infinity)
Input is not a finite number.
package.add_to_package(1.7976931348623157e+308)
Addition would exceed maximum package weight.
package.add_to_package(NaN)
Input is not a number
package.add_to_package(-100)
Weight must be a non-negative number.
```

## Non-Compliant Code Example (Direct NaN Comparison)

This noncompliant code example [[Python docs - value comparisons](https://docs.python.org/3/reference/expressions.html#value-comparisons)] attempts a direct comparison with `NaN` in `_value == float("NaN")`, which will always fail because `NaN` is never equal to anything, including itself.

*[noncompliant02.py](noncompliant02.py):*

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

## Compliant Solution (Using math.isnan)

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

The `balance_is_positive` method will raise a `ValueError` for `NaN` values.

## Compliant Solution (Using Decimal)

In the `compliant03.py` code example, the method `Decimal.quantize` is used to gain control over known rounding errors in floating point values.

The decision by the `balance_is_positive` method is to `ROUND_DOWN` instead of the default `ROUND_HALF_EVEN`.

*[compliant03.py](compliant03.py):*

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

## Automated Detection

|||||
|:---|:---|:---|:---|
|Tool|Version|Checker|Description|
|bandit|1.7.4|no detection||

## Related Guidelines

|||
|:---|:---|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[FLP04-C. Check floating-point inputs for exceptional values](https://wiki.sei.cmu.edu/confluence/display/c/FLP04-C.+Check+floating-point+inputs+for+exceptional+values)|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java?src=sidebar)|[NUM08-J. Check floating-point inputs for exceptional values](https://wiki.sei.cmu.edu/confluence/display/java/NUM08-J.+Check+floating-point+inputs+for+exceptional+values)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM07-J. Do not attempt comparisons with NaN](https://wiki.sei.cmu.edu/confluence/display/java/NUM07-J.+Do+not+attempt+comparisons+with+NaN)|
|[CWE MITRE Pillar](http://cwe.mitre.org/)|[CWE-703: Improper Check or Handling of Exceptional Conditions](https://cwe.mitre.org/data/definitions/703.html)|
|[MITRE CWE Base](https://cwe.mitre.org/)|[CWE-754: Improper Check for Unusual or Exceptional Conditions](https://cwe.mitre.org/data/definitions/754.html)|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-230: Improper Handling of Missing Values](https://cwe.mitre.org/data/definitions/230.html)|

## Bibliography

|||
|:---|:---|
|[[Python docs - statistics]](https://docs.python.org/3/library/statistics.html)|Python Software Foundation. (2024). statistics - Mathematical statistics functions [online]. Available from: <https://docs.python.org/3/library/statistics.html> [Accessed 22 July 2025]|
|[[Python docs - value comparisons]](https://docs.python.org/3/reference/expressions.html#value-comparisons)|Python Software Foundation. (2024). Value comparisons [online]. Available from: <https://docs.python.org/3/reference/expressions.html#value-comparisons> [Accessed 22 July 2025]|
|[[Python docs - math]](https://docs.python.org/3/library/math.html#math.nan)|Python Software Foundation. (2024). math - Mathematical functions [online]. Available from: <https://docs.python.org/3/library/math.html#math.nan> [Accessed 22 July 2025]|
|[[IEEE Standard for Floating-Point Arithmetic]](https://ieeexplore.ieee.org/document/8766229)|IEEE. (2019). 754-2019 - IEEE Standard for Floating-Point Arithmetic [online]. Available from: <https://ieeexplore.ieee.org/document/8766229> [Accessed 20 October 2025]|
