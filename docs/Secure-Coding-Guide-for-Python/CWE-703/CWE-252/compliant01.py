# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """


def silly_string(user_input):
    """Function that changes the content of a string"""
    return user_input.replace("un", "very ")


#####################
# exploiting above code example
#####################
print(silly_string("unsafe string"))
