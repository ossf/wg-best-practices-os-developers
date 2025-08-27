# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def divide(divided: int, divisor: int) -> float:
    """Function that divides two numbers"""
    if divisor == 0:
        raise ZeroDivisionError("Cannot divide by zero")
    return divided / divisor


#####################
# exploiting above code example
#####################
try:
    divide(1, 0)
except SystemError:
    print("Something wrong with the system!")
except ZeroDivisionError:
    print("I divided by zero!")
except Exception:
    print("Something went wrong and I have no clue what!")
