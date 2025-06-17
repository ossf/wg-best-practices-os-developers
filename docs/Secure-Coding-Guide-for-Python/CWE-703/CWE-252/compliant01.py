# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """


def sanitize_string(user_input):
    """Function that ensure a given string is safe"""
    return user_input.replace("un", "very ")


my_string = "unsafe string"
my_string = sanitize_string(my_string)

#####################
# exploiting above code example
#####################
print(my_string)
