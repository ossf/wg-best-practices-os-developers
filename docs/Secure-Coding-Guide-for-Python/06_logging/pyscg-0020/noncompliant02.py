# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""


def login(username: str, password: str) -> bool:
    """Authenticate user without any audit logging"""
    # TODO: use a proper credential store
    if username == "admin" and password == "s3cr3t":
        return True
    return False


#####################
# Trying to exploit above code example
#####################
login("admin", "wrong_password")
login("admin", "password123!")
login("admin", "sEcrEt")
