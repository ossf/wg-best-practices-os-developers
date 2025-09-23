# CWE-117: Improper Output Neutralization for Logs

Log injection occurs when untrusted data is written to application logs without proper neutralization, allowing attackers to forge log entries or inject malicious content. Attackers can inject fake log records or hide real ones by inserting newline sequences (`\r` or `\n`), misleading auditors and incident-response teams. This vulnerability can also enable injection of XSS attacks when logs are viewed in vulnerable web applications.

Attackers can exploit this weakness by submitting strings containing CRLF (Carriage Return Line Feed) sequences that create fake log entries. For instance, an attacker authenticating with a crafted username can make failed login attempts appear successful in audit logs, potentially framing innocent users or hiding malicious activity.

This vulnerability is classified as **CWE-117: Improper Output Neutralization for Logs** [cwe117]. It occurs when CRLF sequences are not properly neutralized in log output, which is a specific instance of the broader **CWE-93: Improper Neutralization of CRLF Sequences** [cwe93] weakness. Attackers exploit this using the **CAPEC-93: Log Injection-Tampering-Forging** [capec93] attack pattern.

The OWASP Top 10 lists “Security Logging and Monitoring Failures” as a critical security risk, emphasizing that log data must be encoded correctly to prevent injections.

## Noncompliant Code Example

This example demonstrates how raw user input written to logs enables injection attacks:

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

The output demonstrates successful log injection:

```bash
WARNING:root:User login failed for: 'guest'
WARNING:root:User login failed for: 'administrator'
```

The attacker's input creates what appears to be a legitimate log entry showing a login failure for user `administrator`.

## Compliant Solution

The `compliant01.py` solution uses a strict allow-list for usernames and returns early on any mismatch, so CR/LF or other disallowed characters never reach the logger; for rejected attempts it logs a safe one-line summary with `%r` (escaped newlines), preventing forged secondary log lines. In short: validate upfront and neutralize what you do record.

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

- **CWE-117**: Improper Output Neutralization for Logs [cwe117]
- **CWE-93**: Improper Neutralization of CRLF Sequences ('CRLF Injection') [cwe93]
- **CWE-113**: Improper Neutralization of CRLF Sequences in HTTP Headers [cwe113]
- **CAPEC-93**: Log Injection-Tampering-Forging [capec93]
- **OWASP Top 10 2021**: A09 - Security Logging and Monitoring Failures [owasp_top10_2021]
- **OWASP ASVS 4.0**: V7.1 Log Content Requirements [owasp_asvs]
- **ISO/IEC TR 24772:2013**: Injection [RST] [iso24772]
- **NIST SP 800-92**: Guide to Computer Security Log Management [nist80092]

## Bibliography

<ul>
  <li>[cwe117] MITRE. “CWE-117: Improper Output Neutralization for Logs” [online]. Available from: <a href="https://cwe.mitre.org/data/definitions/117.html">https://cwe.mitre.org/data/definitions/117.html</a>. Accessed 23 September 2025.</li>
  <li>[cwe93] MITRE. “CWE-93: Improper Neutralization of CRLF Sequences ('CRLF Injection')” [online]. Available from: <a href="https://cwe.mitre.org/data/definitions/93.html">https://cwe.mitre.org/data/definitions/93.html</a>. Accessed 23 September 2025.</li>
  <li>[cwe113] MITRE. “CWE-113: Improper Neutralization of CRLF Sequences in HTTP Headers” [online]. Available from: <a href="https://cwe.mitre.org/data/definitions/113.html">https://cwe.mitre.org/data/definitions/113.html</a>. Accessed 23 September 2025.</li>
  <li>[capec93] MITRE. “CAPEC-93: Log Injection‑Tampering‑Forging” [online]. Available from: <a href="https://capec.mitre.org/data/definitions/93.html">https://capec.mitre.org/data/definitions/93.html</a>. Accessed 23 September 2025.</li>
  <li>[nist80092] Kent, K.; Souppaya, M. “NIST Special Publication 800‑92: Guide to Computer Security Log Management” [online]. Available from: <a href="https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf">https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-92.pdf</a>. Accessed 23 September 2025.</li>
  <li>[owasp_asvs] OWASP. “Application Security Verification Standard 4.x” [online]. Available from: <a href="https://owasp.org/www-project-application-security-verification-standard/">https://owasp.org/www-project-application-security-verification-standard/</a>. Accessed 23 September 2025.</li>
  <li>[owasp_top10_2021] OWASP. “OWASP Top 10 — 2021: A09 Security Logging and Monitoring Failures” [online]. Available from: <a href="https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/">https://owasp.org/Top10/A09_2021-Security_Logging_and_Monitoring_Failures/</a>. Accessed 23 September 2025.</li>
  <li>[codeql] GitHub. “Log Injection — CodeQL query help (Python)” [online]. Available from: <a href="https://codeql.github.com/codeql-query-help/python/py-log-injection/">https://codeql.github.com/codeql-query-help/python/py-log-injection/</a>. Accessed 23 September 2025.</li>
  <li>[veracode] Veracode. “How to Fix CWE‑117 — Improper Output Neutralization for Logs” [online]. Available from: <a href="https://community.veracode.com/s/article/How-to-Fix-CWE-117-Improper-Output-Neutralization-for-Logs">https://community.veracode.com/s/article/How-to-Fix-CWE-117-Improper-Output-Neutralization-for-Logs</a>. Accessed 23 September 2025.</li>
  <li>[iso24772] ISO/IEC. “TR 24772:2013 — Programming languages — Guidance to avoiding vulnerabilities in programming languages through language selection and use (Withdrawn)” [online]. Available from: <a href="https://www.iso.org/standard/61457.html">https://www.iso.org/standard/61457.html</a>. Accessed 23 September 2025.</li>
</ul>
