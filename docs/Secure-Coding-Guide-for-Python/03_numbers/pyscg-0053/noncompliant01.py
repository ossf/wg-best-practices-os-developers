# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example."""
from time import sleep


def shift_right(value: int) -> int:
    while (value != 0):
        print(f"{value}", flush=True)
        value >>= 1
        sleep(1)
    return value


value = shift_right(10)
print("Returned", value)
shift_right(-10)
print("Will never reach here")
