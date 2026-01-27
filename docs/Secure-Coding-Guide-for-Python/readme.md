# Secure Coding One Stop Shop for Python

> ⓘ  NOTE: This is a draft. Contributions welcome!<br>
> Web: [https://best.openssf.org/Secure-Coding-Guide-for-Python/](https://best.openssf.org/Secure-Coding-Guide-for-Python/)<br>
> GitHub: [https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)

An initiative by the OpenSSF to provide new Python programmers a resource to study secure coding in `CPython >= 3.9` with working code examples.

Documentation is written in academic style to support security researchers while using plain English to cater for an international audience.

Python modules outside of the _Python Module Index_ [[Python 2023](https://docs.python.org/3.9/py-modindex.html)] are specifically not covered by this document.

Please join us, see [contributing](CONTRIBUTING.md)

## Disclaimer

Content comes __WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED__, as stated in the license text [CC-BY-4.0](../../LICENSES/CC-BY-4.0.txt) for documentation and [MIT](../../LICENSES/MIT.txt).
Following or using the documentation and or code is at your own risk. Code examples are intended purely for educational use and not for products in parts or in full.
Code examples are NOT to be used to cause harm of any kind to anyone or anything.

## Introduction

Every person writing code shall study the following:

* _OWASP Developer Guide_ [[OWASP dev 2024](https://owasp.org/www-project-developer-guide/release/)]
* _OWASP Top 10 Report_ [[OWASP 2021](https://owasp.org/Top10/A00_2021_Introduction/)]
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

<table border="1">
<tr>
<th>01 Introduction</th>
<th>Prominent CVEs</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="01_introduction/pyscg-0040/README.md">pyscg-0040: Trust Boundary Violation</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2023-28597">CVE-2023-28597</a>,<br>CVSSv3.0: <strong style='color:orange'>7.5</strong>,<br>EPSS: <strong>00.11</strong> (05.11.2024)</td>
<td><a href="https://cwe.mitre.org/data/definitions/501.html">CWE-501</a></td>
</tr>

<tr>
<td><a href="01_introduction/pyscg-0041/README.md">pyscg-0041: Use of Hardcoded Credentials</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/798.html">CWE-798</a></td>
</tr>

<tr>
<td><a href="01_introduction/pyscg-0042/README.md">pyscg-0042: Operator Precedence Logic Error</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/783.html">CWE-783</a></td>
</tr>

<tr>
<td><a href="01_introduction/pyscg-0055/README.md">pyscg-0055: External Control of Assumed-Immutable Web Parameter</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/472.html">CWE-472</a></td>
</tr>

<tr>
<th>02 Encoding and Strings</th>
<th>Prominent CVEs</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="02_encoding_and_strings/pyscg-0043/README.md">pyscg-0043: Specify Locale Explicitly</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/175.html">CWE-175</a></td>
</tr>

<tr>
<td><a href="02_encoding_and_strings/pyscg-0044/README.md">pyscg-0044: Canonicalize Input Before Validating</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2022-26136/">CVE-2022-26136</a>,<br>CVSSv3.1: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>00.28</strong> (31.12.2025)</td>
<td><a href="https://cwe.mitre.org/data/definitions/180.html">CWE-180</a></td>
</tr>

<tr>
<td><a href="02_encoding_and_strings/pyscg-0045/README.md">pyscg-0045: Enforce Consistent Encoding</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/182.html">CWE-182</a></td>
</tr>

<tr>
<th>03 Numbers</th>
<th>Prominent CVEs</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="03_numbers/pyscg-0001/README.md">pyscg-0001: Insufficient Precision or Accuracy of a Real Number</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/1339.html">CWE-1339</a></td>
</tr>

<tr>
<td><a href="03_numbers/pyscg-0002/README.md">pyscg-0002: Integer Underflow ('Wrap or Wraparound')</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/191.html">CWE-191</a></td>
</tr>

<tr>
<td><a href="03_numbers/pyscg-0053/README.md">pyscg-0053: Incorrect Bitwise Shift of Integer</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/1335.html">CWE-1335</a></td>
</tr>

<tr>
<td><a href="03_numbers/pyscg-0003/README.md">pyscg-0003: Promote Readability and Compatibility by Using Mathematical Written Code with Arithmetic Operations Instead of Bit-wise Operations</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/1335.html">CWE-1335</a></td>
</tr>

<tr>
<td><a href="03_numbers/pyscg-0004/README.md">pyscg-0004: Numeric Truncation Error</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/197.html">CWE-197</a></td>
</tr>

<tr>
<td><a href="03_numbers/pyscg-0005/README.md">pyscg-0005: Control Rounding When Converting to Less Precise Numbers</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/197.html">CWE-197</a></td>
</tr>

<tr>
<td><a href="03_numbers/pyscg-0006/README.md">pyscg-0006: Incorrect Conversion Between Numeric Types</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/681.html">CWE-681</a></td>
</tr>

<tr>
<td><a href="03_numbers/pyscg-0007/README.md">pyscg-0007: Avoid an Uncontrolled Loss of Precision When Passing Floating-point Literals to a Decimal Constructor</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/681.html">CWE-681</a></td>
</tr>

<tr>
<th>04 Neutralization</th>
<th>Prominent CVEs</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="04_neutralization/pyscg-0047/README.md">pyscg-0047: Incomplete List of Disallowed Input</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/184.html">CWE-184</a></td>
</tr>

<tr>
<td><a href="04_neutralization/pyscg-0008/README.md">pyscg-0008: Use of Externally-Controlled Format String</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2022-27177/">CVE-2022-27177</a>,<br>CVSSv3.1: <strong style='color:darkred'>9.8</strong>,<br>EPSS: <strong>00.37</strong> (01.12.2023)</td>
<td><a href="https://cwe.mitre.org/data/definitions/134.html">CWE-134</a></td>
</tr>

<tr>
<td><a href="04_neutralization/pyscg-0009/README.md">pyscg-0009: Improper Neutralization of Special Elements Used in an OS Command ('OS Command Injection')</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2024-43804/">CVE-2024-43804</a>,<br>CVSSv3.1: <strong>8.8</strong>,<br>EPSS: <strong>00.06</strong> (08.11.2024)</td>
<td><a href="https://cwe.mitre.org/data/definitions/78.html">CWE-78</a></td>
</tr>

<tr>
<td><a href="04_neutralization/pyscg-0010/README.md">pyscg-0010: Improper Neutralization of Special Elements Used in an SQL Command ('SQL Injection')</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2019-8600">CVE-2019-8600</a>,<br>CVSSv3.1: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>01.43</strong> (18.02.2024)</td>
<td><a href="https://cwe.mitre.org/data/definitions/89.html">CWE-89</a></td>
</tr>

<tr>
<td><a href="04_neutralization/pyscg-0011/README.md">pyscg-0011: Access of Resource Using Incompatible Type ('Type Confusion')</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2021-29513">CVE-2021-29513</a>,<br>CVSSv3.1: <strong style='color:orange'>7.8</strong>,<br>EPSS: <strong>00.02</strong> (13.05.2025)</td>
<td><a href="https://cwe.mitre.org/data/definitions/843.html">CWE-843</a></td>
</tr>

<tr>
<td><a href="04_neutralization/pyscg-0012/README.md">pyscg-0012: Improper Handling of Highly Compressed Data ('Data Amplification')</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2019-9674/">CVE-2019-9674</a>,<br>CVSSv3.1: <strong style='color:orange'>7.5</strong>,<br>EPSS: <strong>1.2%</strong> (10.09.2025)</td>
<td><a href="https://cwe.mitre.org/data/definitions/409.html">CWE-409</a></td>
</tr>

<tr>
<td><a href="04_neutralization/pyscg-0013/README.md">pyscg-0013: Untrusted Search Path</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2015-1326">CVE-2015-1326</a>,<br>CVSSv3.0: <strong style='color:red'>8.8</strong>,<br>EPSS: <strong>00.20</strong> (23.11.2023)</td>
<td><a href="https://cwe.mitre.org/data/definitions/426.html">CWE-426</a></td>
</tr>

<tr>
<td><a href="04_neutralization/pyscg-0023/README.md">pyscg-0023: Deserialization of Untrusted Data</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2018-8021">CVE-2018-8021</a>,<br>CVSSv3.0: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>93.54</strong> (05.11.2024)</td>
<td><a href="https://cwe.mitre.org/data/definitions/502.html">CWE-502</a></td>
</tr>

<tr>
<th>05 Exception handling</th>
<th>Prominent CVEs</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="05_exception_handling/pyscg-0014/README.md">pyscg-0014: Declaration of Throws for Generic Exception</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/397.html">CWE-397</a></td>
</tr>

<tr>
<td><a href="05_exception_handling/pyscg-0015/README.md">pyscg-0015: Improper Handling of Exceptional Conditions</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2024-39560">CVE-2024-39560</a>,<br>CVSSv3.1: <strong style='color:yellow'>6.5</strong>,<br>EPSS: <strong>0.04</strong> (01.11.2024)</td>
<td><a href="https://cwe.mitre.org/data/definitions/755.html">CWE-755</a></td>
</tr>

<tr>
<td><a href="05_exception_handling/pyscg-0016/README.md">pyscg-0016: Detection of Error Condition Without Action</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/390.html">CWE-390</a></td>
</tr>

<tr>
<td><a href="05_exception_handling/pyscg-0017/README.md">pyscg-0017: Improper Handling of Missing Values</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/230.html">CWE-230</a></td>
</tr>

<tr>
<td><a href="05_exception_handling/pyscg-0018/README.md">pyscg-0018: Improper Check for Unusual or Exceptional Conditions - Float</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/754.html">CWE-754</a></td>
</tr>

<tr>
<td><a href="05_exception_handling/pyscg-0052/README.md">pyscg-0052: Improper Cleanup on Thrown Exception</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/460.html">CWE-460</a></td>
</tr>

<tr>
<th>06 Logging</th>
<th>Prominent CVEs</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="06_logging/pyscg-0019/README.md">pyscg-0019: Insertion of Sensitive Information into Log File</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2023-45585">CVE-2023-45585</a>,<br>CVSSv3.1: <strong>9.8</strong>,<br>EPSS: <strong>0.04</strong> (01.11.2024)</td>
<td><a href="https://cwe.mitre.org/data/definitions/532.html">CWE-532</a></td>
</tr>

<tr>
<td><a href="06_logging/pyscg-0020/README.md">pyscg-0020: Insufficient Logging</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/778.html">CWE-778</a></td>
</tr>

<tr>
<td><a href="06_logging/pyscg-0021/README.md">pyscg-0021: Active Debug Code</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2018-14649">CVE-2018-14649</a>,<br>CVSSv3.1: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>69.64</strong> (12.12.2023)</td>
<td><a href="https://cwe.mitre.org/data/definitions/489.html">CWE-489</a></td>
</tr>

<tr>
<td><a href="06_logging/pyscg-0022/README.md">pyscg-0022: Improper Output Neutralization for Logs</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/117.html">CWE-117</a></td>
</tr>

<tr>
<td><a href="06_logging/pyscg-0050/README.md">pyscg-0050: Generation of Error Message Containing Sensitive Information</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/209.html">CWE-209</a></td>
</tr>

<tr>
<th><a href="07_concurrency/readme.md">07 Concurrency</a></th>
<th>Prominent CVE</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0024/README.md">pyscg-0024: Uncontrolled Resource Consumption</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/400.html">CWE-400</a></td>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0025/README.md">pyscg-0025: Insufficient Resource Pool</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/410.html">CWE-410</a></td>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0026/README.md">pyscg-0026: Deadlock</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/833.html">CWE-833</a></td>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0027/README.md">pyscg-0027: Concurrent Execution Using Shared Resource with Improper Synchronization ('Race Condition')</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/362.html">CWE-362</a></td>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0028/README.md">pyscg-0028: Return inside Finally Block</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/584.html">CWE-584</a></td>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0029/README.md">pyscg-0029: Improper Initialization</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/665.html">CWE-665</a></td>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0030/README.md">pyscg-0030: Missing Report of Error Condition</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/392.html">CWE-392</a></td>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0051/README.md">pyscg-0051: Improper Resource Shutdown or Release</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/404.html">CWE-404</a></td>
</tr>

<tr>
<td><a href="07_concurrency/pyscg-0054/README.md">pyscg-0054: Race Condition Within a Thread</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/366.html">CWE-366</a></td>
</tr>

<tr>
<th>08 Coding Standards</th>
<th>Prominent CVE</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="08_coding_standards/pyscg-0031/README.md">pyscg-0031: Loop Condition Value Update Within the Loop</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/1095.html">CWE-1095</a></td>
</tr>

<tr>
<td><a href="08_coding_standards/pyscg-0032/README.md">pyscg-0032: Use of Same Variable for Multiple Purposes</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/1109.html">CWE-1109</a></td>
</tr>

<tr>
<td><a href="08_coding_standards/pyscg-0033/README.md">pyscg-0033: Comparison of Object References Instead of Object Contents</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/595.html">CWE-595</a></td>
</tr>

<tr>
<td><a href="08_coding_standards/pyscg-0034/README.md">pyscg-0034: NULL Pointer Dereference</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/476.html">CWE-476</a></td>
</tr>

<tr>
<td><a href="08_coding_standards/pyscg-0035/README.md">pyscg-0035: Incomplete Cleanup</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/459.html">CWE-459</a></td>
</tr>

<tr>
<td><a href="08_coding_standards/pyscg-0036/README.md">pyscg-0036: Unchecked Return Value</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/252.html">CWE-252</a></td>
</tr>

<tr>
<td><a href="08_coding_standards/pyscg-0037/README.md">pyscg-0037: Reachable Assertion</a></td>
<td></td>
<td><a href="https://cwe.mitre.org/data/definitions/617.html">CWE-617</a></td>
</tr>

<tr>
<th>09 Cryptography</th>
<th>Prominent CVE</th>
<th>MITRE</th>
</tr>

<tr>
<td><a href="09_cryptography/pyscg-0038/README.md">pyscg-0038: Use of Insufficiently Random Values</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2020-7548">CVE-2020-7548</a>,<br>CVSSv3.1: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>0.22</strong> (12.12.2024)</td>
<td><a href="https://cwe.mitre.org/data/definitions/330.html">CWE-330</a></td>
</tr>
</table>

## Biblography

|Ref|Detail|
|-----|-----|
|\[Python 2023\]|3.9 Module Index \[online\], available from [https://docs.python.org/3.9/py-modindex.html](https://docs.python.org/3.9/py-modindex.html) \[accessed Dec 2024\]|
|\[mitre.org 2023\]|CWE - CWE-1000: Research Concepts \[online\], available from [https://cwe.mitre.org/data/definitions/1000.html](https://cwe.mitre.org/data/definitions/1000.html) \[accessed Dec 2024\]|
|\[OWASP dev 2024\]|OWASP Developer Guide \[online\], available from [https://owasp.org/www-project-developer-guide/release/](https://owasp.org/www-project-developer-guide/release/) \[accessed Dec 2024\]|
|\[OWASP 2021\]|OWASP Top 10 Report 2021 \[online\], available from [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)|
|\[MITRE Pillar 2024\]|_Pillar Weakness_ \[online\], available form [https://cwe.mitre.org/documents/glossary/#Pillar%20Weakness](https://cwe.mitre.org/documents/glossary/#Pillar%20Weakness) \[accessed Dec 2024\]|
|\[MITRE 2024\]|CWE Top 25 \[online\], available form [https://cwe.mitre.org/top25/index.html](https://cwe.mitre.org/top25/archive/2022/2022_cwe_top25.html) \[accessed Dec 2024\]|

## Contributors

This guide was jointly developed by the following group of awesome contributors:

* Andrew Costello
* Bartlomiej Karas
* David A. Wheeler
* Dean Wiley
* Georg Kunz
* Helge Wehder
* Hubert Daniszewski
* Ketki Davda
* Kyrylo Yatsenko
* Michael Scovetta
* Noah Spahn
* Tom McDermott
* Viktor Szépe

## License

* [CC-BY 4.0](../../LICENSES/CC-BY-4.0.txt) for documentation
* [MIT](../../LICENSES/MIT.txt) for code snippets
