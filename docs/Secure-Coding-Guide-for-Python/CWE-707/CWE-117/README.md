# CWE-117: Improper Output Neutralization for Logs

Log injection occurs when untrusted data is written to application logs without proper neutralization, allowing attackers to forge log entries or inject malicious content. Attackers can inject fake log records or hide real ones by inserting newline sequences (`\r` or `\n`), misleading auditors and incident-response teams. This vulnerability can also enable injection of `XSS` attacks when logs are viewed in vulnerable web applications.

Attackers can exploit this weakness by submitting strings containing `CRLF` (Carriage Return Line Feed) sequences that create fake log entries. For instance, an attacker authenticating with a crafted username can make failed login attempts appear successful in audit logs, potentially framing innocent users or hiding malicious activity.

This vulnerability is classified as **CWE-117: Improper Output Neutralization for Logs** [[CWE-117](https://cwe.mitre.org/data/definitions/117.html)]. It occurs when `CRLF` sequences are not properly neutralized in log output, which is a specific instance of the broader **CWE-93: Improper Neutralization of CRLF Sequences** [[CWE-93](https://cwe.mitre.org/data/definitions/93.html)] weakness. Attackers exploit this using the **CAPEC-93: Log Injection-Tampering-Forging** [[CAPEC-93](https://capec.mitre.org/data/definitions/93.html)] attack pattern.

The OWASP Top 10 [[OWASP](https://owasp.org/www-project-top-ten/)]lists “Security Logging and Monitoring Failures” as a critical security risk, emphasizing that log data must be encoded correctly to prevent injections.

## Noncompliant Code Example

This example demonstrates how raw user input written to logs enables injection attacks:

_[noncompliant01.py](noncompliant01.py):_

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

**Expample output of noncompliant01.py:**

```bash
WARNING:root:User login failed for: 'guest'
WARNING:root:User login failed for: 'administrator'
```

The attacker's input creates what appears to be a legitimate log entry showing a login failure for user `administrator`.

## Compliant Solution

The `compliant01.py` solution uses a strict allow-list for usernames and returns early on any mismatch, so `CR/LF` or other disallowed characters never reach the logger; for rejected attempts it logs a safe one-line summary with `%r` (escaped newlines), preventing forged secondary log lines. In short: validate upfront and neutralize what you do record.

_[compliant01.py](compliant01.py):_

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

<table>
  <thead>
    <tr>
      <th>Tool</th>
      <th>Version</th>
      <th>Check</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Bandit</td>
      <td>1.7.5</td>
      <td>Not Available</td>
      <td></td>
    </tr>
    <tr>
      <td>PyLint</td>
      <td>2.17</td>
      <td>Not Available</td>
      <td></td>
    </tr>
    <tr>
      <td>CodeQL</td>
      <td>Latest</td>
      <td><a href="https://codeql.github.com/codeql-query-help/python/py-log-injection/">py-log-injection</a></td>
      <td></td>
    </tr>
    <tr>
      <td>Veracode</td>
      <td>Latest</td>
      <td>CWE 117</td>
      <td><a href="https://community.veracode.com/s/article/How-to-Fix-CWE-117-Improper-Output-Neutralization-for-Logs">How to Fix CWE-117</a></td>
    </tr>
  </tbody>
</table>

## Related Guidelines

<table>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Pillar: <a href="https://cwe.mitre.org/data/definitions/707.html"> CWE-707: Improper Neutralization</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/117.html">CWE-117: Improper Output Neutralization for Log</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/93.html">CWE-93: Improper Neutralization of CRLF Sequences ('CRLF Injection')</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Variant: <a href="https://cwe.mitre.org/data/definitions/113.html">CWE-113: Improper Neutralization of CRLF Sequences in HTTP Headers ('HTTP Request/Response Splitting')</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Detailed: <a href="https://capec.mitre.org/data/definitions/93.html">CAPEC-93: Log Injection-Tampering-Forging</a></td>
    </tr>
    <tr>
        <td><a href="https://csrc.nist.gov/">NIST SP 800-92</a></td>
        <td><a href="https://csrc.nist.gov/pubs/sp/800/92/final">2006 Guide to Computer Security Log Management</a></td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>[OWASP ASVS 4.0]</td>
        <td>Python Software Foundation. (2024). concurrent.futures — Launching parallel tasks [online]. Available from: <a href="https://docs.python.org/3.10/library/concurrent.futures.html">https://docs.python.org/3.10/library/concurrent.futures.html</a>,  [Accessed 18 September 2025]</td>
    </tr>
</table>
