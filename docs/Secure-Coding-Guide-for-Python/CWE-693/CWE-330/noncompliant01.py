""" Non-compliant Code Example """
import random


def generate_web_token():
    """Poor random number generator"""
    return random.randrange(int("1" + "0" * 31), int("9" * 32), 1)


#####################
# attempting to exploit above code example
#####################
TOKEN = generate_web_token()
print(f"Your insecure token is: {TOKEN}")
