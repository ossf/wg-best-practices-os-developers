# pyscg-0018: Improper Check for Unusual or Exceptional Conditions - Float

Ensure to have handling for exceptional floating-point values.

The `float` class has the capability to interpret various input values as floating-point numbers. Some special cases can interpret input values as

* Positive Infinity
* Negative Infinity
* `NaN` (Not-a-Number)

These floating-point class values represent numbers that fall outside the typical range and exhibit unique behaviors. `NaN` (Not a Number) lacks a defined order and is not considered equal to any value, including itself. Hence, evaluating an expression such as `NaN == NaN` returns `False`.

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
|[CWE MITRE Pillar](http://cwe.mitre.org/)|[CWE-703: Improper Check or Handling of Exceptional Conditions](https://cwe.mitre.org/data/definitions/703.html)|
|[MITRE CWE Base](https://cwe.mitre.org/)|[CWE-754: Improper Check for Unusual or Exceptional Conditions](https://cwe.mitre.org/data/definitions/754.html)|
