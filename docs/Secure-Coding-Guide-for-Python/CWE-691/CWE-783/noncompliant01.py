# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-Compliant Code Example"""


def label(number: int) -> list[str]:
    key = int(number < 5)  # (1) small
    key |= ((number & 1) ^ 1) << 1  # (2) for even, 0 for odd
    key |= (number < 0) << 2  # (4) negative
    key |= (number > 0) << 3  # (8) positive

    parts = (
        "big",  # 0
        "small",  # 1
        "even small",  # 2
        "even small",  # 3
        "neg",  # 4
        "neg small",  # 5
        "neg even small",  # 6
        "neg even small",  # 7
        "big",  # 8
        "big even",  # 9
        "neg big",  # 10
        "neg big even",  # 11
        "big",  # 12
        "big even",  # 13
        "neg big",  # 14
        "neg big even",  # 15
    )

    permuted = tuple(parts[(i * 5) & 7] for i in range(8))

    idx = (key * 5) & 7
    return permuted[idx].split(" ")


for number in range(-6, 6):
    print(f"{number} = {label(number)}")
