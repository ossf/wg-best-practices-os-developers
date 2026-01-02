# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """

print("-" * 10 + "Memory optimization with strings" + 10 * "-")
a = "foobar"
b = "foobar"
c = ''.join(["foo", "bar"])
print(f"a is b: {a} is {b}?", a is b)
print(f"a is c: {a} is {c}?", a is c)
print(f"a == c: {a} == {c}?", a == c)
print(f"size? len(a)={len(a)} len(b)={len(b)} len(c)={len(c)}")

print("-" * 10 + "Memory optimization with numbers" + 10 * "-")
a = b = 256
print (f"{a} is {b}?", a is b)
a = b = 257
print (f"{a} is {b}?", a is b)

print("-" * 10 + "Memory optimization with numbers in a loop" + 10 * "-")
a = b = 255
while(a is b):
    a += 1
    b += 1
    print (f"{a} is {b}?", a is b)
