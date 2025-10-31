# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """


def do_logic():
    try:
        raise Exception
    finally:
        c = 0
        while c < 5:
            print(f"c is {c}")
            c += 1
            if c == 3:
                break
    # return statement goes here
    # when exception is raised conditionally
    return True


#####################
# exploiting above code example
#####################
do_logic()
