# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def label(number: int) -> list[str]:
    labels = []
    if number < 0:
        labels.append("neg")
    if number % 2 == 0:
        labels.append("even")
    if number < 5:
        labels.append("small")
    if number >= 5:
        labels.append("big")
    return labels


for number in range(-6, 6):
    print(f"{number} = {label(number)}")
