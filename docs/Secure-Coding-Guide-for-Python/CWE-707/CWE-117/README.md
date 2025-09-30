# CWE-117: Improper Output Neutralization for Logs

Ensure all untrusted data is properly neutralized or sanitized before writing to application logs. Log injection occurs when untrusted data is written to application logs without proper neutralization, allowing attackers to forge log entries or inject malicious content. Attackers can inject fake log records or hide real ones by inserting newline sequences (`\r` or `\n`), misleading auditors and incident-response teams. This vulnerability can also enable injection of XSS attacks when logs are viewed in vulnerable web applications.

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
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/117.html">CWE-117: Improper Output Neutralization for Log </a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/93.html">CWE-93: Improper Neutralization of CRLF Sequences ('CRLF Injection') </a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Variant: <a href="https://cwe.mitre.org/data/definitions/113.html">CWE-113: Improper Neutralization of CRLF Sequences in HTTP Headers ('HTTP Request/Response Splitting') </a></td>
    </tr>
    <tr>
        <td><a href="http://capec.mitre.org/">MITRE CAPEC</a></td>
        <td>Detailed: <a href="https://capec.mitre.org/data/definitions/93.html">CAPEC-93: Log Injection-Tampering-Forging </a></td>
    </tr>
    <tr>
        <td><a href="https://owasp.org/Top10/">OWASP Top 10</a></td>
        <td><a href="https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/">A09:2021 – Security Logging and Monitoring Failures </a></td>
    </tr>
    <tr>
        <td><a href="https://owasp.org/">OWASP ASVS 4.0</a></td>
        <td><a href="https://owasp.org/www-project-application-security-verification-standard/">OWASP Application Security Verification Standard (ASVS) </a>. See "V16 Security Logging and Error Handling".
</td>
    <tr>
        <td><a href="https://cheatsheetseries.owasp.org/index.html">OWASP Cheat Sheet Series</a></td>
        <td><a href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html">OWASP Logging Cheat Sheet</a></td>
    </tr>
    </tr>
    <tr>
        <td>ISO/IEC TR 24772:2013</td>
        <td><a href="https://www.iso.org/standard/61457.html">ISO/IEC TR 24772:2013 Information technology — Programming languages — Guidance to avoiding vulnerabilities in programming languages through language selection and use </a></td>
    </tr>
    <tr>
        <td>NIST SP 800-92</td>
        <td><a href="https://csrc.nist.gov/pubs/sp/800/92/final">NIST SP 800-92 Guide to Computer Security Log Management </a></td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>[CWE-117]</a></td>
        <td>CWE-117: Improper Output Neutralization for Log [online]. Available from <a href="https://cwe.mitre.org/data/definitions/117.html">https://cwe.mitre.org/data/definitions/117.html</a>, [Accessed 24 September 2025]</td>
    </tr>
    <tr>
        <td>[CWE-93]</a></td>
        <td>CWE-93: Improper Neutralization of CRLF Sequences ('CRLF Injection') [online]. Available from: <a href="https://cwe.mitre.org/data/definitions/93.html">https://cwe.mitre.org/data/definitions/93.html</a>, [Accessed 24 September 2025]</td>
    </tr>
    <tr>
        <td>[CWE-113]</a></td>
        <td>CWE-113: Improper Neutralization of CRLF Sequences in HTTP Headers ('HTTP Request/Response Splitting')<a href="https://cwe.mitre.org/data/definitions/113.html">https://cwe.mitre.org/data/definitions/113.html</a>, [Accessed 24 September 2025]</td>
    </tr>
    <tr>
        <td>[CAPEC-93]</td>
        <td>CAPEC-93: Log Injection-Tampering-Forging [online]. Available from: <a href="https://capec.mitre.org/data/definitions/93.html">https://capec.mitre.org/data/definitions/93.html</a>, [Accessed 24 September 2025]</td>
    </tr>
    <tr>
        <td>[OWASP A09:2021]</td>
        <td>A09:2021 – Security Logging and Monitoring Failures [online]. Available from:<a href="https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/">https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/</a>, [Accessed 24 September 2025]</td>
    </tr>
    <tr>
        <td>[OWASP 2025]</td>
        <td>OWASP Cheat Sheet Series: Logging Cheat Sheet [online]. Available from: <a href="https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html">https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html</a> (see “Event collection” and “Attacks on Logs”). [Accessed 24 September 2025]</td>
    </tr>
</table>
