# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""

positive_int: int = 1
print(f"+{positive_int} = ", end="")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))

negative_int: int = -1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))
