# CWE-501: Trust Boundary Violation

Python's trust boundaries rely on explicit process isolation, rather than in-process access control within a single interpreter.

Unlike Java, where we have in-process mechanisms like [Oracle Access Management](https://docs.oracle.com/en/middleware/idm/access-manager/12.2.1.3/aiaag/introducing-oracle-access-management.html) that can enforce access boundaries inside the same runtime, standard Python does not provide a built-in in-process access manager. In Python we need to implement different trust zones by starting python runtimes with individual POSIX/Machine users. The POSIX/Machine user access rights must be set in accordance to level of trust per zone.

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
|[Oracle Docs](https://docs.oracle.com/en/)| [Administering Oracle Access Management](https://docs.oracle.com/en/middleware/idm/access-manager/12.2.1.3/aiaag/introducing-oracle-access-management.html#GUID-D1D083AA-538E-4063-A921-9328DB784319) [accessed 29 October 2025]|
