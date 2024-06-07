# Secure Coding One Stop Shop for Python

Promote secure products by knowing the difference between secure compliant
and non-compliant code with `CPython >= 3.9` using modules listed on

[Python Module Index](https://docs.python.org/3.9/py-modindex.html) [Python 2023].

This page is in initiative by Ericsson to improve secure coding in Python by providing a location for study. Its structure is based on
Common Weakness Enamurator (CWE) [Pillar Weakness](https://cwe.mitre.org/documents/glossary/#Pillar%20Weakness) [mitre.org 2023].
It currently contains *only* the code examples, documentation will follow.

## Disclaimer

Content comes WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, as stated in the license text [CC-BY-4.0](LICENSE/CC-BY-4.0.txt) for documentation and [MIT](LICENSE/MIT.txt).
Following or using the documentation and or code is at your own risk. Code examples are intended purely for educational use and not for products in parts or in full.
Code examples are NOT to be used to cause harm of any kind to anyone or anything.

## Introduction

Every person writing code shall study the following:

* OWASP Secure Coding [Practices-Quick Reference Guide](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/) [OWASP 2022]
* OWASP Top 10 Report [OWASP 2022](https://owasp.org/www-project-top-ten/) [OWASP 2022]
* CWE Top 25 2022 [CWE 2022](https://cwe.mitre.org/top25/archive/2022/2022_cwe_top25.html) [MITRE 2023]

## Secure Coding Standard for Python

Code examples are written to explain security design with as little code as possible demonstrating the issue in the `noncompliantXX.py` titled Python file.
The `compliantXX.py` file demonstrates only the mitigation or removal of the described risk.
None of the code examples are intendet to be used 'as is' for production. Using the code is at your own risk.

It is **not production code** and requires code-style or python best practices to be added such as:

* Inline documentation
* Custom exceptions
* Full descriptive variable names
* Line length limit
* Proper logging instead of printing to `stdout`
* Secure coding compliance outside of described issue

|[CWE-664: Improper Control of a Resource Through its Lifetime](https://cwe.mitre.org/data/definitions/664.html)|Prominent CVE|
|:-----------------------------------------------------------------------------------------------------------------------------------------------|:----|
|[CWE-134: Use of Externally-Controlled Format String](CWE-664/CWE-134/README.md)|[CVE-2022-27177](https://www.cvedetails.com/cve/CVE-2022-27177/),<br/>CVSSv3.1: **9.8**,<br/>EPSS:**00.37**(01.12.2023)|
|[CWE-197: Numeric Truncation Error](CWE-664/CWE-197/.)||
|[CWE-400: Uncontrolled Resource Consumption](CWE-664/CWE-400/README.md)||
|[CWE-409: Improper Handling of Highly Compressed Data (Data Amplification)](CWE-664/CWE-409/.)||
|[CWE-410: Insufficient Resource Pool](CWE-664/CWE-410/.)||
|[CWE-501: Trust Boundary Violation)](CWE-664/CWE-501/README.md)||
|[CWE-502: Deserialization of Untrusted Data)](CWE-664/CWE-502/.)||
|[CWE-665: Improper Initialization](CWE-664/CWE-665/.)||
|[CWE-681: Improper Control of a Resource Through its Lifetime](CWE-664/CWE-681/.)||
|[CWE-833: Deadlock](CWE-664/CWE-833/README.md)||
|[CWE-843: Access of Resource Using Incompatible Type ('Type Confusion')](CWE-664/CWE-843/.)||
|[XXX-005: Consider hash-based integrity verification of byte code files against their source code files](CWE-664/XXX-005/.)||

|[CWE-682: Incorrect Calculation](https://cwe.mitre.org/data/definitions/682.html)|Prominent CVE|
|:---------------------------------------------------------------------------------------------------------------|:----|
|[CWE-1335: Promote readability and compatibility by using mathematical written code with arithmetic operations instead of bit-wise operations](CWE-682/CWE-1335/01/README.md)||
|[CWE-1339: Insufficient Precision or Accuracy of a Real Number](CWE-682/CWE-1339/.)                            ||

|[CWE-693: Protection Mechanism Failure](https://cwe.mitre.org/data/definitions/693.html)|Prominent CVE|
|:----------------------------------------------------------------|:----|
|[CWE-184: Incomplete List of Disallowed Input](CWE-693/CWE-184/.)||
|[CWE-330: Use of Insufficiently Random Values](CWE-693/CWE-330/.)||
|[CWE-798: Use of hardcoded credentials](CWE-693/CWE-798/.)||

|[CWE-703: Improper Check or Handling of Exceptional Conditions](https://cwe.mitre.org/data/definitions/703.html)|Prominent CVE|
|:----------------------------------------------------------------|:----|
|[CWE-230: Improper Handling of Missing Values](CWE-703/CWE-230/.)||
|[CWE-392: Missing Report of Error Condition](CWE-703/CWE-392/README.md)||
|[CWE-754: Improper Check for Unusual or Exceptional Conditions](CWE-703/CWE-754/.)||

|[CWE-707: Improper Neutralization](https://cwe.mitre.org/data/definitions/707.html)|Prominent CVE|
|:----------------------------------------------------------------|:----|
|[CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')](CWE-707/CWE-89/.)|[CVE-2019-8600](https://www.cvedetails.com/cve/CVE-2019-8600/),<br/>CVSSv3.1: **9.8**,<br/>EPSS:**01.43**(18.02.2024)|
|[CWE-117: Improper Output Neutralization for Logs](CWE-707/CWE-117/.)||
|[CWE-180: Incorrect behavior order: Validate before Canonicalize](CWE-707/CWE-180/.)||

|[CWE-710: Improper Adherence to Coding Standards](https://cwe.mitre.org/data/definitions/710.html)|Prominent CVE|
|:----------------------------------------------------------------|:----|
|[CWE-1095: Loop Condition Value Update within the Loop](CWE-710/CWE-1095/README.md)||
|[CWE-1109: Use of Same Variable for Multiple Purposes](CWE-710/CWE-1109/.)||

## Biblography

|Ref|Detail|
|-----|-----|
|[Python 2023]|[3.9 Module Index](https://docs.python.org/3.9/py-modindex.html)|
|[mitre.org 2023]|[CWE - CWE-1000: Research Concepts](https://cwe.mitre.org/data/definitions/1000.html)|
|[OWASP 2022]|[Secure Coding Practices-Quick Reference Guide](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)|
|[OWASP 2022]|[OWASP Top 10 Report 2022](https://owasp.org/www-project-top-ten/)|
|[MITRE 2023]|[CWE Top 25 2022](https://cwe.mitre.org/top25/archive/2022/2022_cwe_top25.html)|

## License

* [CC-BY 4.0](LICENSE/CC-BY-4.0.txt) for documentation
* [MIT](LICENSE/MIT.txt) for code snippets
