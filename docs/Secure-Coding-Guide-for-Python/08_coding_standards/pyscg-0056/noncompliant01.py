# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

PLUGIN_URL = "https://downloads.example.com/plugin.py"


def get_plugin_source() -> bytes:
    """Return the bytes served by PLUGIN_URL."""
    return b"print('plugin loaded')\n"


def load_plugin() -> dict:
    """Download a plugin and run it."""
    source = get_plugin_source()
    namespace: dict = {}
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
