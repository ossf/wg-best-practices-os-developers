# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import os

print(f"Process id='{os.getpid()}'")


class os:
    """redefining standard class"""

    @staticmethod
    def getpid():
        """redefining standard class method"""
        return "Not implemented"


#####################
# Trying to exploit above code example
#####################

print(f"Process id='{os.getpid()}'")
