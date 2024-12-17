# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
BALANCE = 3.00
ITEM_COST = 0.33
ITEM_COUNT = 5
print(
    f"{str(ITEM_COUNT)} items bought, ${ITEM_COST} each. "
    f"Current account balance: "
    f"${str(BALANCE - ITEM_COUNT * ITEM_COST)}"
)
