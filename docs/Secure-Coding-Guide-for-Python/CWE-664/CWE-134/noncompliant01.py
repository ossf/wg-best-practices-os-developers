""" Non-compliant Code Example """
import sys

# Simulating a global include of sensitive information:
ENCRYPTION_KEY = "FL4G1"

# Simulating a include per language:
MESSAGE = "Contract '{0.instance_name}' created for "


class MicroService:
    """Fancy MicroService"""
    def __init__(self, instance_name):
        self.instance_name = instance_name


def front_end(customer):
    """Display service instance"""
    message_format = MESSAGE + customer
    mc = MicroService("big time microservice")
    print(message_format.format(mc))


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
