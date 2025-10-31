# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""


def do_logic():
    try:
        raise Exception
    finally:
        print("logic done")
        return True


#####################
# exploiting above code example
#####################
do_logic()
