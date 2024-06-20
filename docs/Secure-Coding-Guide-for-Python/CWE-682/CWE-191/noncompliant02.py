# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import time


def get_time_in_future(hours_in_future):
    """Gets the time n hours in the future"""
    currtime = list(time.localtime())
    currtime[3] = currtime[3] + hours_in_future
    if currtime[3] + hours_in_future > 24:
        currtime[3] = currtime[3] - 24
    return time.asctime(tuple(currtime)).split(" ")[3]


#####################
# exploiting above code example
#####################
print(get_time_in_future(23**74))
