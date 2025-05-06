# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""

print("\nstay positive")
positive_int: int = 1
print(f"+{positive_int} = ", end="")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))

positive_int >>= 1
positive_int >>= 1
print(f"+{positive_int} = ", end="")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))

positive_int <<= 1
positive_int <<= 1
positive_int <<= 1000000000
print(f"+{positive_int} = ", end="")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))


print("\nstaying negative")
negative_int: int = -1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))

negative_int >>= 1
negative_int >>= 1
negative_int >>= 1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))

negative_int <<= 1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))

negative_int <<= 1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))
