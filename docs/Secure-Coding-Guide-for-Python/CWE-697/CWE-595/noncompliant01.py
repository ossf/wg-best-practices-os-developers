# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

class Integer:
    def __init__(self, value):
        self.value = value


#####################
# exploiting above code example
#####################
print(Integer(12) == Integer(12))
# Prints False, as == operator compares id(self) == id(other) when __eq__ isn't implemented
# As a result, the same will be true for comparing lists as they delegate comparison to the objects.
print([Integer(12)] == [Integer(12)])
# And this is equally this will always be False as well
print(Integer(12) in [Integer(10), Integer(12)])
# The 'is' will return True only if both references point to the same object
a = Integer(12)
b = a
# Here, a and b point to the same Integer, so 'is' returns True
print(a is b)

b = Integer(12)
# Even though b still points to an Integer of the same value, it is a new object, so 'is' returns False
print(a is b)
