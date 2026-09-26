# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import hashlib
import hmac

PLUGIN_URL = "https://downloads.example.com/plugin.py"
# Obtained from the publisher through a channel the attacker does not control,
# such as a pinned value in this repository. A digest served alongside the
# artifact proves nothing: whoever replaces one replaces the other.
EXPECTED_SHA256 = "9f6077fbddaa732bb91278098b727709ad4a3cf5c00022057b6775e77fb92127"


class IntegrityError(Exception):
    """Raised when an artifact does not match its expected digest."""


def verify(artifact: bytes, expected_hex: str) -> bytes:
    """Return the artifact only if its digest matches the expected value."""
    digest = hashlib.sha256(artifact).hexdigest()
    if not hmac.compare_digest(digest, expected_hex):
        raise IntegrityError("artifact does not match its expected digest")
    return artifact


def get_plugin_source() -> bytes:
    """Return the bytes served by PLUGIN_URL."""
    return b"print('plugin loaded')\n"


def load_plugin() -> dict:
    """Download a plugin, verify it, and only then run it."""
    namespace: dict = {}
    try:
        source = verify(get_plugin_source(), EXPECTED_SHA256)
    except IntegrityError as error:
        print(f"rejected before execution: {error}")
        return namespace
    exec(source, namespace)  # noqa: S102
    return namespace


#####################
# Trying to exploit above code example
#####################
# A mirror, a cache, or anyone able to alter the response body serves these
# bytes instead. TLS authenticates the host that answered, not what it sent.
def tampered_source() -> bytes:
    """Stand in for a response body the attacker replaced."""
    return b"import os\nos.system('id')\n"


get_plugin_source = tampered_source  # noqa: F811
load_plugin()
