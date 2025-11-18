# CWE-798: Use of hardcoded credentials

Ensure that unique keys or secrets can be replaced or rejected at runtime and never hard-code sensitive information, such as passwords, and encryption keys in a component.

User accounts are either for human or machine type of users. Machine users, such as a front end connecting to a backend `SQL`, have it easy to use complexity during identity verification. Hardcoded credentials for machine users are typically caused by a missing strategy or architecture infrastructure to establish trust between components at deployment time. Human users need a level of usability for their identity verification such as a combination of what they have and what they can remember. A human user Identity Management (IDM) system needs to support initial access and users forgetting passphrases or passwords without jeopardizing security.

Examples of hard-coded sensitive information:

* Default usernames with default password
* Database credentials
* API keys, tokens, SSH keys
* Service account credentials or keys used for installation or management.
* Default passwords for administrators after installation.
* Backend IP Addresses

Storing sensitive data as part of a components source code or deliverable package can result in legal consequences governed by:

* Health Insurance Portability and Accountability Act (HIPAA) [US Congress 1996](https://aspe.hhs.gov/reports/health-insurance-portability-accountability-act-1996),
* General Data Protection Regulation (GDPR) [European Parliament 2016](https://gdpr-info.eu/)"
* California Consumer Privacy Act (CCPA) DIVISION 3. OBLIGATIONS 1427 - 3273.16 [CPPA 2025](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.150)

Issues with hard-coded sensitive information include:

* Implementation does not scale
* Customers know each others passwords
* Attackers can extract them from packages or byte-code `.pyo` or `.pyc` files
* Hard to replace at runtime.

## Non-Compliant Code Example

The `noncompliant01.py` code example is simulating a `front-end`, `back-end`, and its deployment in one file. A real world example would have each run and delivered separately. The `TestSimulateDeployingFrontEnd` unit-test simulates a deployment of the `front_end`. The implementation of the `front_end` did not consider leaving connection details to the deployment and hardcoded them instead.

[*noncompliant01.py*](noncompliant01.py)

```py
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
```

The `noncompliant01.py` example will print the hardcoded connection information and credential information `PASS SuperSecret123` in use.

## Compliant Solution

Create reusable components by separating deployment such as connection information and trust between a deployed front-end and back-end.

|||
|:---|:---|
|__Anti-pattern__|__Recommended pattern__|
|Passwords for machine to machine identity verification|time limited keys or access tokens that are unique per deployment or instances and get assigned at deployment time.|
|Shared usernames|RBAC, ABAC or policy engines|
|Hardcoded `UIDs`, `GIDs`|identity names|
|Hardcoded `IPs` or ports|Rather than hardcoding IP addresses DNS should be properly implemented in the deployment in combination with solutions such as:<br>- `RFC 9250` - [DNS over Dedicated QUIC Connections (ietf.org)](https://datatracker.ietf.org/doc/rfc9250/)<br>- `RFC 7858` - [Specification for DNS over Transport Layer Security (TLS) (ietf.org)](https://datatracker.ietf.org/doc/html/rfc7858)<br>- `RFC 6494` - [Certificate Profile and Certificate Management for SEcure Neighbor Discovery (SEND) (ietf.org) for IPV6](https://datatracker.ietf.org/doc/rfc6494/)<br>- `DNSSEC` [RFC 9364](https://datatracker.ietf.org/doc/html/rfc9364), `RFC 6014`, `5155`, `4641`....<br><br>The order and ways to resolve IPs is configured via `/etc/nsswitch.conf` on most Unix systems.<br><br>Using `mTLS` with a high granularity of machine identities can reduce or remove `DNS` related risks.|

The `compliant01.py` code is using a `config.ini` file to decouple connection information. The deployment represented by `TestSimulateDeployingFrontEnd` is now in full control of proving connectivity information to the `front-end` and `back-end`. Using configuration files, such as `ini`, `yaml` or `json`, allows a language independent solution (`bash` vs `python`). The deployment, represented by `TestSimulateDeployingFrontEnd`, steering these files also secures them by making them read only to a single user via `self.config_file_path.chmod(0o400)`. The password based identity verification is replaced with a certificate based solution.

*[compliant01.py](compliant01.py):*

```python
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
```

The `compliant01.py` code avoids using password based authentication in the first place. It prints connection information only for convenience here and should not be considered in a real world implementation as per [CWE-532: Insertion of Sensitive Information into Log File](https://best.openssf.org/Secure-Coding-Guide-for-Python/CWE-664/CWE-532/) [OSSF 2025].

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|B105|[B105: hardcoded_password_string — Bandit documentation](https://bandit.readthedocs.io/en/latest/plugins/b105_hardcoded_password_string.html)|
|Bandit|1.7.4 on Python 3.10.4|B106|[B106: hardcoded_password_funcarg — Bandit documentation](https://bandit.readthedocs.io/en/latest/plugins/b106_hardcoded_password_funcarg.html)|
|Bandit|1.7.4 on Python 3.10.4|B107|[B107: hardcoded_password_default — Bandit documentation](https://bandit.readthedocs.io/en/latest/plugins/b107_hardcoded_password_default.html)|
|sonarsource||RSPEC-2068|[Python static code analysis: Hard-coded credentials are security-sensitive (sonarsource.com)](https://rules.sonarsource.com/python/RSPEC-2068)|
|sonarsource||RSPEC-6437|[Credentials should not be hard-coded (sonarsource.com)](https://rules.sonarsource.com/python/type/Vulnerability/RSPEC-6437/)|
|codeQL|||[Hard-coded credentials — CodeQL query help documentation (github.com)](https://codeql.github.com/codeql-query-help/python/py-hardcoded-credentials/)|

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-693: Protection Mechanism Failure (4.12) (mitre.org)](https://cwe.mitre.org/data/definitions/693.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-798: Use of hardcoded credentials](https://cwe.mitre.org/data/definitions/798.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Variant: [CWE-259: Use of hardcoded password](https://cwe.mitre.org/data/definitions/259.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Variant: [CWE-321: Use of hardcode cryptographic key](https://cwe.mitre.org/data/definitions/321.html)|
|[SEI CERT Oracle Codign Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[MSC03-J: Never hardcode sensitive information](https://wiki.sei.cmu.edu/confluence/display/java/MSC03-J.+Never+hard+code+sensitive+information)|

## Bibliography

|||
|:---|:---|
| [US Congress 1996] | Health Insurance Portability and Accountability Act (HIPAA) [online].Available from: [https://aspe.hhs.gov/reports/health-insurance-portability-accountability-act-1996](https://aspe.hhs.gov/reports/health-insurance-portability-accountability-act-1996) [accessed 27 February 2025]|
| [European Parliament 2016] | General Data Protection Regulation (GDPR) [online]. Available from: [https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.150](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.150) [accessed 27 February 2025]|
| [CPPA 2025] |DIVISION 3. OBLIGATIONS [1427 - 3273.16] [online]. Available from: [https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.150](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.150) [accessed 27 February 2025]|
| [OSSF 2025] | CWE-532: Insertion of Sensitive Information into Log File [online]. Available from: [https://best.openssf.org/Secure-Coding-Guide-for-Python/CWE-664/CWE-532/](https://best.openssf.org/Secure-Coding-Guide-for-Python/CWE-664/CWE-532/) [accessed 27 February 2025]|
