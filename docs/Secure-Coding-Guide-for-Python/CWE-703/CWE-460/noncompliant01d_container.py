# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""


class pallet:
    """_Fake Euro Pallet"""

    pallet_weight_kg: int = 25
    max_weight_in_kg: int = 1500
    weight_kg: int = 0

    def __init__(self):
        self.weight_kg = self.pallet_weight_kg

    def add_box(self, kg: str):
        self.weight_kg += int(kg)

    def get_total(self):
        return str(self.weight_kg)


#####################
# Trying to exploit above code example
#####################
p = pallet()
p.add_box(kg="100")
print(p.get_total())
p.add_box("100.0")
print(p.get_total())
