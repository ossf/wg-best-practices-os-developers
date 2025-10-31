# CWE-117: Improper Output Neutralization for Logs

Ensure all untrusted data is properly neutralized or sanitized before writing to application logs.

Log injection occurs when untrusted data is written to application logs without proper neutralization, allowing attackers to forge log entries or inject malicious content. Attackers can inject fake log records or hide real ones by inserting newline sequences (`\r` or `\n`), misleading auditors and incident-response teams. This vulnerability can also enable injection of XSS attacks when logs are viewed in vulnerable web applications.

Attackers can exploit this weakness (see [*Attacks on Logs*](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#attacks-on-logs) [[OWASP 2025]](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#attacks-on-logs)) by submitting strings containing CRLF sequences that create fake log entries.

Attackers can exploit this weakness by submitting strings containing Carriage Return Line Feed (CRLF) sequences that create fake log entries. For instance, an attacker authenticating with a crafted username can make failed login attempts appear successful in audit logs, potentially framing innocent users or hiding malicious activity.

This vulnerability is classified as **CWE-117: Improper Output Neutralization for Logs** [[CWE-117](https://cwe.mitre.org/data/definitions/117.html)]. It occurs when CRLF sequences are not properly neutralized in log output, which is a specific instance of the broader **CWE-93: Improper Neutralization of CRLF Sequences** [[CWE-93](https://cwe.mitre.org/data/definitions/93.html)] weakness. Attackers exploit this using the **CAPEC-93: Log Injection-Tampering-Forging** [[CAPEC-93](https://capec.mitre.org/data/definitions/93.html)] attack pattern.

The OWASP Top 10 [[OWASP A09:2021](https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/)] lists “Security Logging and Monitoring Failures” as a critical security risk.

## Noncompliant Code Example

This example demonstrates how raw user input written to logs enables injection attacks:

*[noncompliant01.py](noncompliant01.py):*

```python
""" Non-compliant Code Example """
import logging

def log_authentication_failed(user):
    """Simplified audit logging missing RFC 5424 details"""
    logging.warning("User login failed for: '%s'", user)

#####################
# attempting to exploit above code example
#####################
log_authentication_failed("guest'\nWARNING:root:User login failed for: 'administrator")
```

**Output of `noncompliant01.py`:**

```bash
WARNING:root:User login failed for: 'guest'
WARNING:root:User login failed for: 'administrator'
```

The attacker's input creates what appears to be a legitimate log entry showing a login failure for user `administrator`.

## Compliant Solution

As per the OWASP Logging Cheat Sheet [[OWASP 2025]](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html) section on ["Event collection"](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html#event-collection), applications should sanitize event data to prevent log injection and encode data correctly for the logged format.

The `compliant01.py` solution uses a strict allow-list for usernames and returns early on any mismatch, so `CR/LF` or other disallowed characters never reach the logger; for rejected attempts it logs a safe one-line summary with `%r` (escaped newlines), preventing forged secondary log lines. In short: validate upfront and neutralize what you do record.

*[compliant01.py](compliant01.py):*

```python
""" Compliant Code Example """

import logging
import re

# Allow only ASCII letters, digits, underscore, dot, and hyphen; max 64 chars
_ALLOWED_USER = re.compile(r"^[A-Za-z0-9._-]{1,64}$")


def is_allowed_username(user: str) -> bool:
    """Return True if username matches the strict allow-list."""
    return bool(_ALLOWED_USER.fullmatch(user))


def log_authentication_failed(user):
    """Simplified audit logging (example)"""
    if not is_allowed_username(user):
        # Safe summary: %r escapes CR/LF so the log remains one line
        logging.warning("Rejected login attempt: invalid username=%r", user)
        return
    logging.warning("User login failed for: '%s'", user)


#####################
# attempting to exploit above code example
#####################
log_authentication_failed("guest'\nWARNING:root:User login failed for: 'administrator")



# TODO: Production — keep sink-side neutralization (escape CR/LF) even with validation,
#       prefer structured JSON logs.
```

The following output shows that a warning is logged, and the input is sanitized before logging.

**Example compliant01.py output:**

```bash
WARNING:root:Rejected login attempt: invalid username="guest'\nWARNING:root:User login failed for: 'administrator"
```

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|B105<br>B106<br>B107|[B105: hardcoded_password_string — Bandit documentation](https://bandit.readthedocs.io/en/latest/plugins/b105_hardcoded_password_string.html)<br>[B106: hardcoded_password_funcarg — Bandit documentation](https://bandit.readthedocs.io/en/latest/plugins/b106_hardcoded_password_funcarg.html)<br>[B107: hardcoded_password_default — Bandit documentation](https://bandit.readthedocs.io/en/latest/plugins/b107_hardcoded_password_default.html)|
|sonarsource||RSPEC-2068<br>RSPEC-6437|[Python static code analysis: Hard-coded credentials are security-sensitive (sonarsource.com)](https://rules.sonarsource.com/python/RSPEC-2068)<br>[Credentials should not be hard-coded (sonarsource.com)](https://rules.sonarsource.com/python/type/Vulnerability/RSPEC-6437/)|
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
