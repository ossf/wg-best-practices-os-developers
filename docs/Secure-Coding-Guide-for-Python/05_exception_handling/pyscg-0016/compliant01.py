# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from time import sleep


def exception_example():
    """Compliant Code Example catching a specific exception"""
    while True:
        sleep(1)
        try:
            _ = 1 / 0
        except ZeroDivisionError:
            print("How is it now?")


#####################
# exploiting above code example
#####################
exception_example()
