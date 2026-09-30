# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from collections.abc import Mapping


def count_keys(mapping):
    """ Check the argument is a mapping and return how many keys it has """
    if not isinstance(mapping, Mapping):
        raise TypeError("expected a mapping")
    return len(mapping)


print(count_keys({"a": 1, "b": 2}))
