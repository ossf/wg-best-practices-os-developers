""" Compliant Code Example """


def shopping_bag(price: int, qty: int) -> int:
    return int(price) * int(qty)


####################
# attempting to exploit #above code example
#####################
print(shopping_bag(100, "3"))
