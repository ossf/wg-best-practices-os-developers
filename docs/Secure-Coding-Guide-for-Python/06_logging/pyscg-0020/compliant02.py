# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import logging

logging.basicConfig(
    format="%(asctime)s %(levelname)s event=%(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    level=logging.INFO,
)
_audit = logging.getLogger("audit")


def login(username: str, password: str) -> bool:
    """Authenticate user with audit logging"""
    # TODO: use a proper credential store
    if username == "admin" and password == "s3cr3t":
        _audit.info("login_success user=%s", username)
        return True
    _audit.warning("login_failed user=%s", username)
    # TODO: forward logs to a remote logging service in production
    return False


#####################
# Trying to exploit above code example
#####################
login("admin", "wrong_password")
login("admin", "password123!")
login("admin", "s3cr3t")
