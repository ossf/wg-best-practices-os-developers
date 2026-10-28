# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
from datetime import datetime, timezone


def utc_timestamp():
    """ Return the current UTC time as a POSIX timestamp """
    moment = datetime.utcnow()
    return moment.timestamp()


print(utc_timestamp())

# The naive value returned by utcnow() cannot be compared against a
# timezone-aware datetime, raising TypeError at runtime.
deadline = datetime(2038, 1, 19, tzinfo=timezone.utc)
try:
    print(datetime.utcnow() < deadline)
except TypeError as error:
    print(f"TypeError: {error}")
