# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def silly_string(user_input):
    """Function that changes the content of a string"""
    user_input.replace("un", "very ")
    return user_input


#####################
# exploiting above code example
#####################
print(silly_string("unsafe string"))
