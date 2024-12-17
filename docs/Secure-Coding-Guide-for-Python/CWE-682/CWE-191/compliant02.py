# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

import time


def get_time_in_future(hours_in_future):
    """Gets the time n hours in the future"""
    try:
        currtime = list(time.localtime())
        currtime[3] = currtime[3] + hours_in_future
        if currtime[3] + hours_in_future > 24:
            currtime[3] = currtime[3] - 24
        return time.asctime(tuple(currtime)).split(" ")[3]
    except OverflowError as _:
        return "Number too large to set time in future " + str(hours_in_future)


#####################
# attempting to exploit above code example
#####################
print(get_time_in_future(23**74))
