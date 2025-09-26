# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """


class Integer:
    def __init__(self, value):
        self.value = value

    def __eq__(self, other):
        if isinstance(other, type(self)):
            return self.value == other.value
        if isinstance(other, int):
            return self.value == other
        return False


#####################
# exploiting above code example
#####################
# All these scenarios will now show True
print(Integer(12) == Integer(12))
print([Integer(12)] == [Integer(12)])
print(Integer(12) in [Integer(10), Integer(12)])

# By adding the handling for int we also support
print(Integer(12) == 12)
# The 'is' will return True only if both references point to the same object
a = Integer(12)
b = a
# Here, a and b point to the same Integer, so 'is' returns True
print(a is b)

b = Integer(12)
# Since the 'is' operator does not call __eq__, print below will still return False
print(a is b)
