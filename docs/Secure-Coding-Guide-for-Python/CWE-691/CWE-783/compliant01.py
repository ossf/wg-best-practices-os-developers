# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def label(number: int):
    if number < 0:
        return "neg"
    if number % 2 == 0:
        return "even"
    if number < 5:
        return "small"
    return "big"


for number in range(-3, 3):
    print(f"{number} = {label(number)}")
