# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import json
import logging
import socket
from datetime import datetime, timezone

logging.basicConfig(format="%(message)s", level=logging.INFO)
_audit = logging.getLogger("audit")
_HOSTNAME = socket.gethostname()


def audit_log(event: str, user: str, outcome: str, level: int) -> None:
    """Write a simple audit log entry in JSON format"""
    entry = {
        "timestamp": datetime.now(timezone.utc).isoformat(
            timespec="milliseconds"
        ),
        "hostname": _HOSTNAME,
        "event": event,
        "user": user,
        "outcome": outcome,
    }
    _audit.log(level, "%s", json.dumps(entry))


def login(username: str, password: str) -> bool:
    """Authenticate user with audit logging"""
    # TODO: use a proper credential store, see pyscg-0041
    if username == "admin" and password == "s3cr3t":
        audit_log("login", username, "success", logging.INFO)
        return True
    audit_log("login", username, "failure", logging.WARNING)
    # TODO: forward logs to a remote logging service in production
    return False


#####################
# Trying to exploit above code example
#####################
login("admin", "wrong_password")
login("admin", "password123!")
login("admin", "s3cr3t")
