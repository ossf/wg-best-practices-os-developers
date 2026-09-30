# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from datetime import datetime, timezone


def utc_timestamp():
    """ Return the current UTC time as a POSIX timestamp """
    moment = datetime.now(timezone.utc)
    return moment.timestamp()


print(utc_timestamp())

# The timezone-aware value compares correctly against another aware datetime.
deadline = datetime(2038, 1, 19, tzinfo=timezone.utc)
print(datetime.now(timezone.utc) < deadline)
