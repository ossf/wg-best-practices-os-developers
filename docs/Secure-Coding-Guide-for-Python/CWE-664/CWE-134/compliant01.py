""" Compliant Code Example """
import sys
from string import Template

# Simulating a global include of sensitive information:
ENCRYPTION_KEY = "FL4G1"

# Simulating a include per language for international support:
MESSAGE = Template("Contract '$instance_name' created for '$customer'")


class MicroService:
    """Fancy MicroService"""
    def __init__(self, instance_name):
        self.instance_name = instance_name

    def get_instance_name(self) -> str:
        """return instance_name as string"""
        return self.instance_name


def front_end(customer) -> str:
    """Display service instance"""
    mc = MicroService("big time microservice")
    print(MESSAGE.substitute(instance_name=mc.get_instance_name(),
                             customer=customer))


#####################
# exploiting above code example
#####################
if __name__ == "__main__":
    if len(sys.argv) > 1:  # running from command line
        # you can print the global encryption key by using '{0.__init__.__globals__[ENCRYPTION_KEY]}' as
        # argument.
        front_end(sys.argv[1])
    else:
        # running in your IDE, simulating command line:
        # Printing the ENCRYPTION_KEY via the global accessible object
        front_end("{0.__init__.__globals__[ENCRYPTION_KEY]}")
