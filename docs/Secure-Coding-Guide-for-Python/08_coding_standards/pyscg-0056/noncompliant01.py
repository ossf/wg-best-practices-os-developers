# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import urllib.request

PLUGIN_URL = "https://downloads.example.com/plugin.py"


def load_plugin(url: str) -> dict:
    """Download a plugin and run it."""
    with urllib.request.urlopen(url) as response:  # noqa: S310
        source = response.read()
    namespace: dict = {}
    exec(source, namespace)  # noqa: S102
    return namespace


#####################
# Trying to exploit above code example
#####################
# A mirror, a cache, or anyone able to alter the response body serves this
# instead. TLS authenticates the host that answered, not the bytes it sent.
ATTACKER_SOURCE = b"import os\nos.system('id')\n"
namespace: dict = {}
exec(ATTACKER_SOURCE, namespace)  # noqa: S102
print("attacker code ran with the privileges of this process")
