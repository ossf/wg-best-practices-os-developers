# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def shopping_bag(price: int, qty: str) -> int:
    return price * qty


####################
# attempting to exploit #above code example
#####################
print(shopping_bag(100, "3"))
