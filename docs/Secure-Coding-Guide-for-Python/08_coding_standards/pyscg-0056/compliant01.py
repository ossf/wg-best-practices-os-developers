# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import hashlib
import hmac

# Obtained from the publisher through a channel the attacker does not control,
# such as a pinned value in this repository. A digest served alongside the
# artifact proves nothing: whoever replaces one replaces the other.
EXPECTED_SHA256 = "a94a8fe5ccb19ba61c4c0873d391e987982fbbd3"


class IntegrityError(Exception):
    """Raised when an artifact does not match its expected digest."""


def verify(artifact: bytes, expected_hex: str) -> bytes:
    """Return the artifact only if its digest matches the expected value."""
    digest = hashlib.sha256(artifact).hexdigest()
    if not hmac.compare_digest(digest, expected_hex):
        raise IntegrityError("artifact does not match its expected digest")
    return artifact


#####################
# Trying to exploit above code example
#####################
ATTACKER_SOURCE = b"import os\nos.system('id')\n"
try:
    verify(ATTACKER_SOURCE, EXPECTED_SHA256)
except IntegrityError as error:
    print(f"rejected before execution: {error}")
