# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

counter = 0
while counter <= 10:
    value = counter/10
    if value == 0.8:
        print("we reached 0.8")
        break
    counter += 1
