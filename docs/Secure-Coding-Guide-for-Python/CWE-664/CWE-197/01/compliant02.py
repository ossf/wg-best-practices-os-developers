# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from decimal import Decimal, ROUND_HALF_UP, ROUND_HALF_DOWN

print(Decimal("3.5").quantize(Decimal("1"), rounding=ROUND_HALF_UP))  # prints 4
print(Decimal("3.5").quantize(Decimal("1"), rounding=ROUND_HALF_DOWN))  # prints 3
