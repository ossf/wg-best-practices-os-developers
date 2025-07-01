# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

number_list = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(f"len({number_list}) == {len(number_list)}")


def len(numbers: list[int]) -> int:
    """implementing a custom version of len"""
    result = 0
    for number in numbers:
        result += number
    return result


#####################
# Trying to exploit above code example
#####################

print(f"len({number_list}) == {len(number_list)}")
