""" Compliant Code Example """
import os

print(f"Logged in user is {os.getlogin()}")


class custom_os:
    """ redefining standard class """

    @staticmethod
    def getlogin():
        """ redefining standard class method """
        return "Not implemented"


print(f"Logged in user is {os.getlogin()}")
