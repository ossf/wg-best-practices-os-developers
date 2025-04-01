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
