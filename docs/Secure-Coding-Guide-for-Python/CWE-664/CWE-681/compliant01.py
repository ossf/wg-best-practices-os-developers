""" Compliant Code Example """
from decimal import Decimal

t = Decimal(str(4 / 2))
print(f"t: {t}")
# t still prints "2.0", but now it's a Decimal
if Decimal("2").compare(t) == 0:
    print("t equals 2")
# prints "t equals 2"
