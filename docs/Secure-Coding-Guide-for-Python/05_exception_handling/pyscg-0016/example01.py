# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Code Example"""


def slice_cake(cake: int, plates: int) -> float:
    """Calculates size of each slice per plate for a cake
    Args:
        cake (int)  : Size of the cake
        guests (int): Amount of guests
    Returns:
        (float): Size of each slice
    """

    try:
        return cake / plates
    except ZeroDivisionError as zero_division_error:
        raise ZeroDivisionError(
            "slice_cake:You got to give me plates"
        ) from zero_division_error


#####################
# exploiting above code example
#####################
slice_cake(cake=100, plates=0)
