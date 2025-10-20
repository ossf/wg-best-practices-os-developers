# CWE-501: Trust Boundary Violation

In Python we need to implement different trust zone's by starting python runtime's with individual POSIX/Machine users. The POSIX/Machine user access rights must be set in accordance to level of trust per zone.

STRIDE is a mnemonic which is useful in the identification of threats by prompting us to think about various attack steps. [[OWASP, Threat Modeling Process, 2025](https://owasp.org/www-community/Threat_Modeling_Process)]

The acronym stands for six key threat categories:

* Spoofing - Impersonating someone else, foten to gain unauthorized access.
* Tampering - Unauthorised modification of data, code, or configurations.
* Repudiation - Denying the performance of an action, making it difficult to prove responsibility wihtout proper logging or auditing.
* Information Disclosure - Exposing sensitive information to unauthorised parties.
* Denial of Service (DoS) - Disrupting system availability or performance.
* Elevation of Privilege - Gaining higher access rights than intented, often leading to great system control.

## Noncompliant STRIDE example - New User Sign-up Process

The example shows how new users sign up for a bank account. STRIDE illustrates trust boundaries in dotted red lines [[OWASP, Conklin,  Drake, 2023]](https://cwe.mitre.org/data/definitions/134.html). In the noncompliant example, we have all Python scripts running under the same POSIX user.

![noncompliant01.png](noncompliant01.png "noncompliant01.png")

Breaking the outer perimeter allows the attacker to run commands under the same privileges as the rest of the system.

## Compliant STRIDE example - New User Sign-up Process

The compliant solution has multiple layers of trust zones creating defense in depth. Each zone running their runtime environment under a different user. Crossing the red-dotted borders requires authentication and authorization.

![compliant01.png](compliant01.png "compliant01.png")

Layering security allows to secure the more sensitive parts of the system.

## Automated Detection

unknown

## Related Vulnerabilities

|Product|CVE|Description|CVSS Rating|Comment|
|:----|:----|:----|:----|:----|
|Zoom clients <= 5.13.5|[CVE-2023-28597](https://www.cvedetails.com/cve/CVE-2023-28597/)|v3.1:8.3|A Python format string issue leading to information disclosure and potentially remote code execution.||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE - CWE-501: Trust Boundary Violation (4.12) (mitre.org)](https://cwe.mitre.org/data/definitions/501.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE - CWE-306: Missing Authentication for Critical Function (4.12) (mitre.org)](https://cwe.mitre.org/data/definitions/306.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Class [CWE - CWE-269: Improper Privilege Management (4.12) (mitre.org)](https://cwe.mitre.org/data/definitions/269.html)|
|[OWASP Top 10:2021](https://owasp.org/Top10/A04_2021-Insecure_Design/)|[A04 Insecure Design - OWASP Top 10:2021](https://owasp.org/Top10/A04_2021-Insecure_Design/)|

## Bibliography

|||
|:---|:---|
|[[Python 2023]](https://docs.python.org/3.9/tutorial/classes.html?highlight=private#private-variables)|Python Software Foundation. (2023). Classes - Private Variables. Available from: [Python Documentation](https://docs.python.org/3.9/tutorial/classes.html?highlight=private#private-variables) [accessed 13 September 2023]|
|[[OWASP, Conklin,  Drake, 2023]](https://cwe.mitre.org/data/definitions/134.html)|[CWE - CWE-134: Use of Externally-Controlled Format String (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/134.html)|
|[[OWASP, Threat Modeling Process, 2025](https://owasp.org/www-community/Threat_Modeling_Process)]| OWASP Foundation; Conklin, L.; Drake, V.; Strittmatter, S.; Braiterman, Z.; Shostack, A. (2025). Threat Modeling Process – STRIDE. Available from: OWASP Threat Modeling Process [accessed 17 October 2025]|
