# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from decimal import Decimal, ROUND_HALF_UP, ROUND_HALF_DOWN

print(Decimal("0.5").quantize(Decimal("1"), rounding=ROUND_HALF_UP))  # prints 1
print(Decimal("1.5").quantize(Decimal("1"), rounding=ROUND_HALF_UP))  # prints 2
print(Decimal("0.5").quantize(Decimal("1"), rounding=ROUND_HALF_DOWN))  # prints 0
print(Decimal("1.5").quantize(Decimal("1"), rounding=ROUND_HALF_DOWN))  # prints 1
