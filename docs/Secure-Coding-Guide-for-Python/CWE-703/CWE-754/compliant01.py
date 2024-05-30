""" Compliant Code Example """
import sys
from math import isinf, isnan


class Package:
    def __init__(self):
        self.package_weight = float(1.0)

    def put_in_the_package(self, user_input):
        try:
            value = float(user_input)
        except ValueError:
            raise ValueError(f"{user_input} - Input is not a number!")

        print(f"value is {value}")

        if isnan(value) or isinf(value):
            raise ValueError(f"{user_input} - Input is not a real number!")

        if value < 0:
            raise ValueError(
                f"{user_input} - Packed object weight  cannot be negative!"
            )

        if value >= sys.float_info.max - self.package_weight:
            raise ValueError(f"{user_input} - Input exceeds acceptable range!")
        self.package_weight += value

    def get_package_weight(self):
        return self.package_weight


#####################
# exploiting above code example
#####################
package = Package()
print(f"\nOriginal package's weight is {package.get_package_weight():.2f} units\n")
for item in [sys.float_info.max, "infinity", "-infinity", "nan"]:
    try:
        package.put_in_the_package(item)
        print(f"Current package weight = {package.get_package_weight():.2f}\n")
    except Exception as e:
        print(e)
