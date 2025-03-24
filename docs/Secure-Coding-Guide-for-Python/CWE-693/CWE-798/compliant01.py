# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import logging
from pathlib import Path
import unittest
import configparser

logging.basicConfig(encoding="utf-8", level=logging.DEBUG)


def front_end(config_file_path: Path):
    """Simulating front end implementation"""
    # A compliant solution loads connection information from a well-protected file
    _config = configparser.ConfigParser()
    _config.read(config_file_path)

    # It would then use the configuration
    logging.debug("Loading deployment config %s", config_file_path.absolute())
    logging.debug("connecting to server IP %s", _config["SERVER"]["IP"])
    logging.debug("connecting to server PORT %s", _config["SERVER"]["PORT"])
    logging.debug("connecting to server USER %s", _config["SERVER"]["USER"])
    logging.debug("connecting to server pem %s", _config["SERVER"]["CERT_FILE"])


class TestSimulateDeployingFrontEnd(unittest.TestCase):
    """
    Simulate the deployment starting the front_end to connect
    to the backend
    """

    def setUp(self):
        config = configparser.ConfigParser()
        config["SERVER"] = {
            "IP": "192.168.0.1",
            "PORT": "8080",
            "USER": "admin",
            "CERT_FILE": "example.pem",
        }

        config["LOGGING"] = {
            "level": "DEBUG",
        }
        self.config_file_path = Path("config.ini", exist_ok=True)
        with open(self.config_file_path, "w", encoding="utf-8") as config_file:
            config.write(config_file)
        self.config_file_path.chmod(0o400)

    def test_front_end(self):
        """Verify front_end implementation"""
        front_end(self.config_file_path)

    def tearDown(self):
        """Clean up after us and remove the config file"""
        self.config_file_path.unlink()


if __name__ == "__main__":
    unittest.main()
