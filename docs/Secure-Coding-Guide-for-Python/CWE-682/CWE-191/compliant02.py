# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from datetime import datetime, timedelta
import logging

# Enabling verbose debugging
# logging.basicConfig(level=logging.DEBUG)


def get_datetime(currtime: datetime, hours: int):
    """
    Gets the time n hours in the future or past

    Parameters:
    currtime (datetime): A datetime object with the starting datetime.
    hours (int): Hours going forward or backwards

    Returns:
    datetime: A datetime object
    """
    # TODO: input sanitation
    # Calculate lower boundary, hours from year 1 to currtime:
    timedelta_lowerbound = currtime - datetime(1, 1, 1)  # 1st Jan 0001
    hours_min = timedelta_lowerbound.total_seconds() // 3600 * -1

    # Calculate upper boundary, hours from year 9999 to currtime:
    timedelta_upperbound = datetime(9999, 12, 31) - currtime
    hours_max = timedelta_upperbound.total_seconds() // 3600

    # TODO: proper secure logging
    logging.debug(
        "hours_max=%s hours_min=%s hours=%s",
        hours_max,
        hours_min,
        hours,
    )
    if (hours > hours_max) or (hours < hours_min):
        raise ValueError("hours out of range")

    return currtime + timedelta(hours=hours)


#####################
# attempting to exploit above code example
#####################
datetime.fromtimestamp(0)
currtime = datetime.fromtimestamp(1)  # 1st Jan 1970

# OK values are expected to work
# NOK values trigger OverflowErrors in libpython written in C
hours_list = [
    0,  # OK
    1,  # OK
    70389526,  # OK
    70389527,  # NOK
    51539700001,  # NOK
    24000000001,  # NOK
    -1,  # OK
    -17259889,  # OK
    -17259890,  # NOK
    -23999999999,  # NOK
    -51539699999,  # NOK
]
for hours in hours_list:
    try:
        result = get_datetime(currtime, hours)
        print(f"{hours} OK, datetime='{result}'")
    except Exception as exception:
        print(f"{hours} {repr(exception)}")
