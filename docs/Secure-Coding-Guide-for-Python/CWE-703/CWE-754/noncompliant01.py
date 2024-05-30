""" Non-compliant Code Example """
import sys


class Package:
    def __init__(self):
        self.package_weight = float(1.0)

    def put_in_the_package(self, object_weight):
        value = float(object_weight)
        print(f"Adding an object that weighs {value} units")
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
