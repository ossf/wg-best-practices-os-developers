# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

import math


def balance_is_positive(value: str) -> bool:
    """Returns True if there is still enough value for a transaction"""
    _value = float(value)
    if math.isnan(_value) or _value is None:
        raise ValueError("Expected a float")
    if _value < 0.01:
        return False
    else:
        return True


#####################
# attempting to exploit above code example
#####################
print(balance_is_positive("0.01"))
print(balance_is_positive("0.001"))
print(balance_is_positive("NaN"))
