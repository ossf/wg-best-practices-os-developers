# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def is_valid_name(s: str) -> bool:
    """ Check if the input is a name with 2 capitalised Strings """
    names = s.split()
    if len(names) != 2:
        return False
    return s.istitle()


#####################
# Attempting to exploit above code example
#####################
name = is_valid_name(None) 


print(name)
