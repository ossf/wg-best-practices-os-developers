# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-Compliant Code Example"""


def label(number: int) -> str:
    a = int(number < 0)  # negative flag
    b = (number & 1) ^ 1  # even flag (1 for even, 0 for odd)
    c = int(number < 5)  # small flag

    key = (a << 2) | (b << 1) | c  # pack flags into a single key

    parts = ("big", "small", "even", "even", "neg", "neg", "neg", "neg")

    permuted = tuple(parts[(i * 5) & 7] for i in range(8))

    idx = (key * 5) & 7
    return permuted[idx]


for number in range(-3, 3):
    print(f"{number} = {label(number)}")
