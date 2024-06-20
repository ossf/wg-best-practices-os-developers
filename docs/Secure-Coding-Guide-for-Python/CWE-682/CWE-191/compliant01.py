# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

import warnings
import numpy

warnings.filterwarnings("error")
a = numpy.int64(numpy.iinfo(numpy.int64).max)
with warnings.catch_warnings():
    try:
        print(a + 1)
    except Warning as _:
        print("Failed to increment " + str(a) + " due to overflow error")
    # RuntimeWarning and continues

try:
    b = numpy.int64(numpy.iinfo(numpy.int64).max + 1)  # OverflowError and stops
except OverflowError as e:
    print("Failed to assign value to B due to overflow error")
