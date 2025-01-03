# CWE-489: Active Debug Code

Keep design tooling in separate packages from the actual product and supply useful logging.

Design tooling for functional tests, performance tests, or troubleshooting increases the attackable surface making a product more vulnerable [[MITRE 2023](https://cwe.mitre.org/data/definitions/489.html)]. A need to include them in a final product typically originates from missing the concept of staged testing with separate packaging of the product and required design tooling. Designers only using high privileged users for troubleshooting is often the root cause for badly designed logging that forces the operator to also use highly privileged or shared accounts in production.

Anti-patterns:

* Printing debug information directly to stdout or to the web-interface
* Ports left open such as 22 for ssh or 5678  for debugpy
* Verbose logging enabled in production sites.
* Monkey patching [[Monkey patch - Wikipedia 2023](https://en.wikipedia.org/wiki/Monkey_patch)].
* Hidden functions enabling/disabling verbose logging via external interfaces.
* Hidden functions providing a shell for troubleshooting.
* Operators need of root or superuser access for troubleshooting
* Test tools and results available in the product
* Designing directly on a live instance.

Not knowing that a product must be deployed differently in production than in staging can leave well known entry points wide open. [[Hammond 2022](https://www.youtube.com/watch?v=jwBRgaIRdgs)]. Well written test-driven design can avoid the need to have such excessive troubleshooting design tooling as seen in Flask.

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Vulnerabilities

|Component|CVE|Description|CVSS Rating|Comment|
|:---|:---|:---|:---|:---|
|ceph-isci-cli Red Hat Ceph Storage 2,3|[CVE-2018-14649](https://nvd.nist.gov/vuln/detail/CVE-2018-14649)|ceph-isci-cli package as shipped by Red Hat Ceph Storage 2 and 3 is using python-werkzeug in debug shell mode. This is done by setting debug=True in file /usr/bin/rbd-target-api provided by ceph-isci-cli package. This allows unauthenticated attackers to access this debug shell and escalate privileges.|CVSS 3.xx: 9.8||
|OpenStack ironic-inspector, ironic-discoverd|[CVE-2015-5306](https://nvd.nist.gov/vuln/detail/CVE-2015-5306)|When debug mode is enabled, might allow remote attackers to access the Flask console and execute arbitrary Python code by triggering an error.|CVSS 2.x: 6.8||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-710: Improper Adherence to Coding Standards (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/710.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-489: Active Debug Code (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/489.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[ENV05-J. Do not deploy an application that can be remotely monitored](https://wiki.sei.cmu.edu/confluence/display/java/ENV05-J.+Do+not+deploy+an+application+that+can+be+remotely+monitored)|
|[Python - Secure Coding One Stop Shop](https://eteamspace.internal.ericsson.com/display/DEVEN/Python+-+Secure+Coding+One+Stop+Shop)|[FIO13-P3. Do not log sensitive information outside a trust boundary](https://eteamspace.internal.ericsson.com/display/DEVEN/FIO13-P3.+Do+not+log+sensitive+information+outside+a+trust+boundary)|

## Bibliography

|||
|:---|:---|
|[[Monkey patch - Wikipedia 2023](https://en.wikipedia.org/wiki/Monkey_patch)]|Wikimedia Foundation. (2024). Monkey patch [online]. Available from: [https://en.wikipedia.org/wiki/Monkey_patch](https://en.wikipedia.org/wiki/Monkey_patch) [accessed 3 January 2025]
|[[Hammond 2022](https://en.wikipedia.org/wiki/Monkey_patch)]|John Hammond. (2024). DANGEROUS Python Flask Debug Mode Vulnerabilities [online]. Available from: [https://www.youtube.com/watch?v=jwBRgaIRdgs](hhttps://www.youtube.com/watch?v=jwBRgaIRdgs) [accessed 3 January 2025]
