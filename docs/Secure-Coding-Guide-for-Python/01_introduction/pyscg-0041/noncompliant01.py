# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import logging
import unittest

logging.basicConfig(encoding="utf-8", level=logging.DEBUG)


def front_end():
    """Dummy method demonstrating noncompliant implementation"""
    # A noncompliant implementation would typically hardcode server_config
    # and load it from a project global python file or variable
    server_config = {}
    server_config["IP"] = "192.168.0.1"
    server_config["PORT"] = "8080"
    server_config["USER"] = "admin"
    server_config["PASS"] = "SuperSecret123"

    # It would then use the configuration
    logging.debug("connecting to server IP %s", server_config["IP"])
    logging.debug("connecting to server PORT %s", server_config["PORT"])
    logging.debug("connecting to server USER %s", server_config["USER"])
    logging.debug("connecting to server PASS %s", server_config["PASS"])


class TestSimulateDeployingFrontEnd(unittest.TestCase):
    """
    Simulate the deployment starting the front_end to connect
    to the backend
    """

    def test_front_end(self):
        """Verify front_end implementation"""
        front_end()


if __name__ == "__main__":
    unittest.main()
