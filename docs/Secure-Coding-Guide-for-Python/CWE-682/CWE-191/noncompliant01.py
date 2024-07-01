# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import numpy

a = numpy.int64(numpy.iinfo(numpy.int64).max)
print(a + 1)  # RuntimeWarning and continues
print()
b = numpy.int64(numpy.iinfo(numpy.int64).max + 1)  # OverflowError and stops
print(b)  # we will never reach this
