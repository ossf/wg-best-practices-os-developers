# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """


def shopping_bag(price: int, qty: str) -> int:
    return int(price) * int(qty)


####################
# attempting to exploit #above code example
#####################
print(shopping_bag(100, "3"))
