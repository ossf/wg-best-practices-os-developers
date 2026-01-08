# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

from typing import Optional


def is_valid_name(s: Optional[str]) -> bool:
    """ Check if the input is a name with 2 capitalised Strings """
    if s is None:
        return False
    names = s.split()
    if len(names) != 2:
        return False
    return s.istitle()


#####################
# Attempting to exploit above code example
#####################
name = is_valid_name(None)


print(name)
