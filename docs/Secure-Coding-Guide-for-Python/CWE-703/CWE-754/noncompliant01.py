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
