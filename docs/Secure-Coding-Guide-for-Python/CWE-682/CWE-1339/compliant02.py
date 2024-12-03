# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from decimal import Decimal
BALANCE = Decimal("3.00")
ITEM_COST = Decimal("0.33")
ITEM_COUNT = 5
 
print(
    f"{str(ITEM_COUNT)} items bought, ${ITEM_COST} each. "
    f"Current account balance: "
    F"${str(BALANCE - ITEM_COUNT * ITEM_COST)}"
)
