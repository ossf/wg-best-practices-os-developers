# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""
foo = 5225
for shift in [16, 32, 64]:
    bar = foo << shift
    print("foo << " + str(shift) + ": type " + str(type(bar)) + " " + str(bin(bar)))
