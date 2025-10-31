# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import math


def calculate_exponential_value(number):
    """Return 'E' raised to the power of different numbers:"""
    try:
        return math.exp(number)
    except OverflowError:
        return "Number " + str(number) + " caused an integer overflow"


#####################
# attempting to exploit above code example
#####################
print(calculate_exponential_value(710))
