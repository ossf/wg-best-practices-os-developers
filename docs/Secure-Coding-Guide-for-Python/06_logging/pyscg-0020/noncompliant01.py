# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

try:
    result = 10 / 0
except ZeroDivisionError as e:
    print("Error occurred:", e)
