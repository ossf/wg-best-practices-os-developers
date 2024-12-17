# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """
from decimal import ROUND_HALF_UP, Decimal

print(Decimal("0.10")) # prints 0.10
print(Decimal(0.10))   # prints 0.1000000000000000055511151231257827021181583404541015625
print(Decimal("0.10").quantize(Decimal("0.10"), rounding=ROUND_HALF_UP)) # prints 0.10
print(Decimal(0.10).quantize(Decimal("0.10"), rounding=ROUND_HALF_UP)) # prints 0.10
