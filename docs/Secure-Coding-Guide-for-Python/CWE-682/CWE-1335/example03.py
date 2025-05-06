# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""

positive_int: int = 1
print(f"Before: {type(positive_int)}")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))
print("\nShifting 1000x\n")
positive_int <<= 1000
print(f"After: {type(positive_int)}")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))
