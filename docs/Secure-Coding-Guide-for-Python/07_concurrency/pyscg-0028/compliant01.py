# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def do_logic():
    try:
        raise Exception
    finally:
        print("logic done")
    # return statement goes here
    # when exception is raised conditionally
    return True


#####################
# exploiting above code example
#####################
do_logic()
