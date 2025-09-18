# Secure Coding One Stop Shop for Python

> ⓘ  NOTE: This is a draft. Contributions welcome!<br>
> Web: [https://best.openssf.org/Secure-Coding-Guide-for-Python/](https://best.openssf.org/Secure-Coding-Guide-for-Python/)<br>
> GitHub: [https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)

An initiative by the OpenSSF to provide new Python programmers a resource to study secure coding in `CPython >= 3.9` with working code examples.

Documentation is written in academic style to support security researchers while using plain English to cater for an international audience.

Python modules outside of the _Python Module Index_ [[Python 2023](https://docs.python.org/3.9/py-modindex.html)] are specifically not covered by this document.
The structure is based on Common Weakness Enumeration (CWE) _Pillar Weakness_ [[MITRE Pillar 2024](https://cwe.mitre.org/documents/glossary/#Pillar%20Weakness)].

Please join us, see [contributing](CONTRIBUTING.md)

## Disclaimer

Content comes __WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED__, as stated in the license text [CC-BY-4.0](../../LICENSES/CC-BY-4.0.txt) for documentation and [MIT](../../LICENSES/MIT.txt).
Following or using the documentation and or code is at your own risk. Code examples are intended purely for educational use and not for products in parts or in full.
Code examples are NOT to be used to cause harm of any kind to anyone or anything.

## Introduction

Every person writing code shall study the following:

* _OWASP Developer Guide_ [[OWASP dev 2024](https://owasp.org/www-project-developer-guide/release/)]
* _OWASP Top 10 Report_ [[OWASP 2021](https://owasp.org/www-project-top-ten/)]
* _CWE Top 25_ [[MITRE 2024](https://cwe.mitre.org/top25/index.html)]

## Secure Coding Standard for Python

Code examples are written to explain security design with as little code as possible. __None__ of the code examples are intended to be used 'as is' for production. Using the code is at your own risk!

__Code file naming conventions:__

* `noncompliantXX.py` anti-pattern, bad programming practice.
* `compliantXX.py` mitigation or removal of __ONLY__ the described risk.
* `exampleXX.py` to allow understanding the documented behaviour.

It is __not production code__ and requires code-style or python best practices to be added such as:

* Inline documentation
* Custom exceptions
* Full descriptive variable names
* Line length limit
* Proper logging instead of printing to `stdout`
* Secure coding compliance outside of described issue

|[CWE-664: Improper Control of a Resource Through its Lifetime](https://cwe.mitre.org/data/definitions/664.html)|Prominent CVE|
|:-----------------------------------------------------------------------------------------------------------------------------------------------|:----|
|[CWE-134: Use of Externally-Controlled Format String](CWE-664/CWE-134/README.md)|[CVE-2022-27177](https://www.cvedetails.com/cve/CVE-2022-27177/),<br/>CVSSv3.1: __9.8__,<br/>EPSS: __00.37__ (01.12.2023)|
|[CWE-197: Numeric Truncation Error](CWE-664/CWE-197/README.md)||
|[CWE-197: Control rounding when converting to less precise numbers](CWE-664/CWE-197/01/README.md)||
|[CWE-209: Generation of Error Message Containing Sensitive Information](CWE-664/CWE-209/README.md)|[CVE-2013-0773](https://www.cvedetails.com/cve/CVE-2013-0773/),<br/>CVSSv3.1:__3.3__,<br/>EPSS: __00.95__ (23.11.2023)|
|[CWE-400: Uncontrolled Resource Consumption](CWE-664/CWE-400/README.md)||
|[CWE-404: Improper Resource Shutdown or Release](CWE-664/CWE-404/README.md)||
|[CWE-409: Improper Handling of Highly Compressed Data (Data Amplification)](CWE-664/CWE-409/README.md)||
|[CWE-410: Insufficient Resource Pool](CWE-664/CWE-410/README.md)||
|[CWE-426: Untrusted Search Path](CWE-664/CWE-426/README.md)|[CVE-2015-1326](https://www.cvedetails.com/cve/CVE-2015-1326),<br/>CVSSv3.0: __8.8__,<br/>EPSS: __00.20__ (23.11.2023)|
|[CWE-459: Incomplete Cleanup](CWE-664/CWE-459/README.md)||
|[CWE-460: Improper Cleanup on Thrown Exception](CWE-664/CWE-460/README.md)|[CVE-2008-0002](https://www.cvedetails.com/cve/CVE-2008-0002),<br/>CVSSv3.1: __5.8__,<br/>EPSS: __04.10__ (04.09.2025)|
|[CWE-501: Trust Boundary Violation)](CWE-664/CWE-501/README.md)|[CVE-2023-28597](https://www.cvedetails.com/cve/CVE-2023-28597),<br/>CVSSv3.0: __7.5__,<br/>EPSS: __00.11__ (05.11.2024)|
|[CWE-502: Deserialization of Untrusted Data)](CWE-664/CWE-502/.)|[CVE-2018-8021](https://www.cvedetails.com/cve/CVE-2018-8021),<br/>CVSSv3.0: __9.8__,<br/>EPSS: __93.54__ (05.11.2024)|
|[CWE-532: Insertion of Sensitive Information into Log File](CWE-664/CWE-532/README.md)|[CVE-2023-45585](https://www.cvedetails.com/cve/CVE-2023-45585),<br/>CVSSv3.1: __9.8__,<br/>EPSS: __0.04__ (01.11.2024)|
|[CWE-584: Return Inside Finally Block](CWE-664/CWE-584/README.md)||
|[CWE-665: Improper Initialization](CWE-664/CWE-665/README.md)||
|[CWE-681: Incorrect Conversion between Numeric Types](CWE-664/CWE-681/README.md)||
|[CWE-681: Avoid an uncontrolled loss of precision when passing floating-point literals to a Decimal constructor.](CWE-664/CWE-681/01/README.md)||
|[CWE-833: Deadlock](CWE-664/CWE-833/README.md)||
|[CWE-843: Access of Resource Using Incompatible Type ('Type Confusion')](CWE-664/CWE-843/README.md)|[CVE-2021-29513](https://www.cvedetails.com/cve/CVE-2021-29513),<br/>CVSSv3.1: __7.8__,<br/>EPSS: __00.02__ (13.05.2025)|

|[CWE-682: Incorrect Calculation](https://cwe.mitre.org/data/definitions/682.html)|Prominent CVE|
|:---------------------------------------------------------------------------------------------------------------|:----|
|[CWE-191: Integer Underflow (Wrap or Wraparound)](CWE-682/CWE-191/README.md)||
|[CWE-1335: Incorrect Bitwise Shift of Integer](CWE-682/CWE-1335/README.md)||
|[CWE-1335: Promote readability and compatibility by using mathematical written code with arithmetic operations instead of bit-wise operations](CWE-682/CWE-1335/01/README.md)||
|[CWE-1339: Insufficient Precision or Accuracy of a Real Number](CWE-682/CWE-1339/.)                            ||

|[CWE-691: Insufficient Control Flow Management](https://cwe.mitre.org/data/definitions/691.html)|Prominent CVE|
|:---------------------------------------------------------------------------------------------------------------|:----|
|[CWE-366: Race Condition within a Thread](CWE-691/CWE-366/README.md)||
|[CWE-362: Concurrent Execution Using Shared Resource with Improper Synchronization ("Race Condition")](CWE-691/CWE-362/README.md)||
|[CWE-617: Reachable Assertion](CWE-691/CWE-617/README.md)||

|[CWE-693: Protection Mechanism Failure](https://cwe.mitre.org/data/definitions/693.html)|Prominent CVE|
|:---------------------------------------------------------------------------------------------------------------|:----|
|[CWE-182: Collapse of Data into Unsafe Value](CWE-693/CWE-182/README.md)||
|[CWE-184: Incomplete List of Disallowed Input](CWE-693/CWE-184/README.md)||
|[CWE-330: Use of Insufficiently Random Values](CWE-693/CWE-330/README.md)|[CVE-2020-7548](https://www.cvedetails.com/cve/CVE-2020-7548),<br/>CVSSv3.1: __9.8__,<br/>EPSS: __0.22__ (12.12.2024)|
|[CWE-472: External Control of Assumed-Immutable Web Parameter](CWE-693/CWE-472/README.md)||
|[CWE-778: Insufficient Logging](CWE-693/CWE-778/README.md)||
|[CWE-798: Use of hardcoded credentials](CWE-693/CWE-798/README.md)||

|[CWE-697: Incorrect Comparison](https://cwe.mitre.org/data/definitions/697.html)|Prominent CVE|
|:----------------------------------------------------------------|:----|
|[CWE-595: Comparison of Object References Instead of Object Contents](CWE-697/CWE-595/README.md)||

|[CWE-703: Improper Check or Handling of Exceptional Conditions](https://cwe.mitre.org/data/definitions/703.html)|Prominent CVE|
|:----------------------------------------------------------------|:----|
|[CWE-230: Improper Handling of Missing Values](CWE-703/CWE-230/.)||
|[CWE-252: Unchecked Return Value](CWE-703/CWE-252/README.md)||
|[CWE-390: Detection of Error Condition without Action](CWE-703/CWE-390/README.md)||
|[CWE-392: Missing Report of Error Condition](CWE-703/CWE-392/README.md)||
|[CWE-397: Declaration of Throws for Generic Exception](CWE-703/CWE-397/README.md)||
|[CWE-476: NULL Pointer Dereference](CWE-703/CWE-476/README.md)||
|[CWE-754: Improper Check for Unusual or Exceptional Conditions - float](CWE-703/CWE-754/README.md)||
|[CWE-755: Improper Handling of Exceptional Conditions](CWE-703/CWE-755/README.md)|[CVE-2024-39560](https://www.cvedetails.com/cve/CVE-2024-39560),<br/>CVSSv3.1: __6.5__,<br/>EPSS: __0.04__ (01.11.2024)|

|[CWE-707: Improper Neutralization](https://cwe.mitre.org/data/definitions/707.html)|Prominent CVE|
|:----------------------------------------------------------------|:----|
|[CWE-78: Improper Neutralization of Special Elements Used in an OS Command ("OS Command Injection")](CWE-707/CWE-78/README.md)|[CVE-2024-43804](https://www.cvedetails.com/cve/CVE-2024-43804/),<br/>CVSSv3.1: __8.8__,<br/>EPSS: __00.06__ (08.11.2024)|
|[CWE-89: Improper Neutralization of Special Elements used in an SQL Command ('SQL Injection')](CWE-707/CWE-89/README.md)|[CVE-2019-8600](https://www.cvedetails.com/cve/CVE-2019-8600/),<br/>CVSSv3.1: __9.8__,<br/>EPSS: __01.43__ (18.02.2024)|
|[CWE-117: Improper Output Neutralization for Logs](CWE-707/CWE-117/.)||
|[CWE-175: Improper Handling of Mixed Encoding](CWE-707/CWE-175/README.md)||
|[CWE-180: Incorrect behavior order: Validate before Canonicalize](CWE-707/CWE-180/README.md)|[CVE-2022-26136](https://www.cvedetails.com/cve/CVE-2022-26136/),<br/>CVSSv3.1: __9.8__,<br/>EPSS: __00.18__ (24.04.2025)|
|[CWE-838: Inappropriate Encoding for Output Context](CWE-707/CWE-838/README.md)||

|[CWE-710: Improper Adherence to Coding Standards](https://cwe.mitre.org/data/definitions/710.html)|Prominent CVE|
|:----------------------------------------------------------------|:----|
|[CWE-1095: Loop Condition Value Update within the Loop](CWE-710/CWE-1095/README.md)||
|[CWE-1109: Use of Same Variable for Multiple Purposes](CWE-710/CWE-1109/README.md)||
|[CWE-489: Active Debug Code](CWE-710/CWE-489/README.md)|[CVE-2018-14649](https://www.cvedetails.com/cve/CVE-2018-14649),<br/>CVSSv3.1: __9.8__,<br/>EPSS: __69.64__ (12.12.2023)|

## Biblography

|Ref|Detail|
|-----|-----|
|\[Python 2023\]|3.9 Module Index \[online\], available from [https://docs.python.org/3.9/py-modindex.html](https://docs.python.org/3.9/py-modindex.html) \[accessed Dec 2024\]|
|\[mitre.org 2023\]|CWE - CWE-1000: Research Concepts \[online\], available from [https://cwe.mitre.org/data/definitions/1000.html](https://cwe.mitre.org/data/definitions/1000.html) \[accessed Dec 2024\]|
|\[OWASP dev 2024\]|OWASP Developer Guide \[online\], available from [https://owasp.org/www-project-developer-guide/release/](https://owasp.org/www-project-developer-guide/release/) \[accessed Dec 2024\]|
|\[OWASP 2021\]|OWASP Top 10 Report 2021 \[online\], available from [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)|
|\[MITRE Pillar 2024\]|_Pillar Weakness_ \[online\], available form [https://cwe.mitre.org/documents/glossary/#Pillar%20Weakness](https://cwe.mitre.org/documents/glossary/#Pillar%20Weakness) \[accessed Dec 2024\]|
|\[MITRE 2024\]|CWE Top 25 \[online\], available form [https://cwe.mitre.org/top25/index.html](https://cwe.mitre.org/top25/archive/2022/2022_cwe_top25.html) \[accessed Dec 2024\]|

## License

* [CC-BY 4.0](../../LICENSES/CC-BY-4.0.txt) for documentation
* [MIT](../../LICENSES/MIT.txt) for code snippets
