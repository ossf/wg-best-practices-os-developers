# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """
import dis


class Number():
    """
    Example of a class where a method calls another method
    """
    amount = 100

    def direct_add(self):
        """Simulating hard work"""
        a = 0
        a += self.amount

    def method_calling_add(self):
        """Simulating hard work"""
        a = 0
        a += self.read_amount()

    def read_amount(self):
        """Simulating data fetching"""
        return self.amount


num = Number()
print("direct_add():")
dis.dis(num.direct_add)
print("method_calling_add():")
dis.dis(num.method_calling_add)
