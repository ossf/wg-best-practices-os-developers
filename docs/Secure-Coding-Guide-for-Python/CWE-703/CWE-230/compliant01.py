""" Non-compliant Code Example """

from decimal import ROUND_DOWN, Decimal


def balance_is_positive(value: str) -> bool:
    """Returns True if there is still enough value for a transaction"""
    # TODO: additional input sanitation for expected type
    _value = Decimal(value)
    # TODO: exception handling
    return _value.quantize(Decimal(".01"), rounding=ROUND_DOWN) > Decimal("0.00")


#####################
# attempting to exploit above code example
#####################
print(balance_is_positive("0.01"))
print(balance_is_positive("0.001"))
print(balance_is_positive("NaN"))
