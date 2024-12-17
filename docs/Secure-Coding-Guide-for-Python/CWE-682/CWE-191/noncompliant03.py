# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import math


def calculate_exponential_value(number):
    """Return 'E' raised to the power of different numbers:"""
    return math.exp(number)


#####################
# attempting to exploit above code example
#####################
print(calculate_exponential_value(1000))
