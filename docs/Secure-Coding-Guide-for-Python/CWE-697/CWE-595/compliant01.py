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
