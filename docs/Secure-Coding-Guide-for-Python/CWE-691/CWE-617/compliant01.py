# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
import math


def my_exp(x):
    if x not in range(1, 710):  # range(1, 709) produces 1-708
        raise ValueError(f"Argument {x} is not valid")
    return math.exp(x)


#####################
# exploiting above code example
#####################

try:
    print(my_exp(1))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(709))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(710))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(0))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp("b"))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

# output

# $ python3.9 compliant01.py
# 2.718281828459045
# 8.218407461554972e+307
# Argument 710 is not valid
# Argument 0 is not valid
# Argument b is not valid
# $ python3.9 -O compliant01.py
# 2.718281828459045
# 8.218407461554972e+307
# Argument 710 is not valid
# Argument 0 is not valid
# Argument b is not valid
 