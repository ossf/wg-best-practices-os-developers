# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def find_in_string(full_string, sub_string):
    """Function that searches for a sub-string in a given string"""
    index = full_string.find(sub_string)
    if index >= 0:
        print(f"""Sub-string '{sub_string}' appears for the first time in
              '{full_string}' at index {index}: '{full_string[index:]}'""")
    else:
        print(f"There is no '{sub_string}' in '{full_string}'")


#####################
# exploiting above code example
#####################
my_string = "Secure Python coding"
find_in_string(my_string, "Python")
find_in_string(my_string, "I'm evil")
