# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

FLAG_READ = 0b0001
FLAG_WRITE = 0b0010
FLAG_EXECUTE = 0b0100

perms = FLAG_READ | FLAG_EXECUTE
perms |= FLAG_WRITE  # bitwise OR sets the bit
perms |= FLAG_WRITE  # idempotent: setting it again is harmless

print(f"perms = {perms:04b}")
print(f"has WRITE?   {bool(perms & FLAG_WRITE)}")
print(f"has EXECUTE? {bool(perms & FLAG_EXECUTE)}")
