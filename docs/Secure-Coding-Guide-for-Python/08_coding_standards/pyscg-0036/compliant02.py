# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """


def wrap_in_quotes(full_string, sub_string):
    """Function that wraps a substring inside of a string in quotes"""
    index_start = full_string.find(sub_string)
  
    if index_start >= 0:
        index_end = index_start + len(sub_string)
        return (full_string[:index_start]
                + "\""
                + full_string[index_start:index_end]
                + "\""
                + full_string[index_end:])
    else:
        # Nothing to wrap, return unchanged string
        return full_string


#####################
# exploiting above code example
#####################
my_string = "Secure Python coding"
print(wrap_in_quotes(my_string, "Secure"))
print(wrap_in_quotes(my_string, "I'm evil"))