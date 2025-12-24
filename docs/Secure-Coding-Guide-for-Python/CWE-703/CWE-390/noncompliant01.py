# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
# EXPECTED_TIMEOUT: intentional infinite loop for educational purposes

from time import sleep


def exception_example():
    """Non-compliant Code Example using bare except"""
    while True:
        try:
            sleep(1)
            _ = 1 / 0
        except:
            print("Don't care")


#####################
# exploiting above code example
#####################
exception_example()
