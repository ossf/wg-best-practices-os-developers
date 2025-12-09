# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
counter = 0.0
while counter <= 1.0:
    if counter == 0.8:
        print("we reached 0.8")  
        break  # never going to reach this
    counter += 0.1
