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

<table border=1>
<tr>
<th>MITRE</th>
<th>01 Introduction</th>
<th>Prominent CVEs</th>
</tr>

<tr>
<td>CWE-501</td>
<td><a href=01_introduction/pyscg-0040/README.md>pyscg-0040: Respect Trust Boundaries</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2023-28597">CVE-2023-28597</a>,<br>CVSSv3.0: <strong style='color:orange'>7.5</strong>,<br>EPSS: <strong>00.11</strong> (05.11.2024)</td>
</tr>

<tr><td>CWE-798</td><td><a href=01_introduction/pyscg-0041/README.md>pyscg-0041: Avoid Hardcoded Credentials</a></td><td></td></tr>
<tr><td>CWE-783</td><td><a href=01_introduction/pyscg-0042/README.md>pyscg-0042: Mind Operator Precedence</a></td><td></td></tr>
<tr><td>CWE-472</td><td><a href=01_introduction/pyscg-0055/README.md>pyscg-0055: Validate Web Parameters</a></td><td></td></tr>

<tr>
<th>MITRE</th>
<th>02 Encoding and Strings</th>
<th>Prominent CVEs</th>
</tr>
<tr><td>CWE-175</td><td><a href=02_encoding_and_strings/pyscg-0043/README.md>pyscg-0043: Handle Mixed Character Encoding</a></td><td></td></tr>

<tr>
<td>CWE-180</td>
<td><a href=02_encoding_and_strings/pyscg-0044/README.md>pyscg-0044: Validate Before Canonicalize</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2022-26136/">CVE-2022-26136</a>,<br>CVSSv3.1: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>00.28</strong> (31.12.2025)</td>
</tr>

<tr><td>CWE-182</td><td><a href=02_encoding_and_strings/pyscg-0045/README.md>pyscg-0045: Enforce Consistent Encoding</a></td></tr>

<tr><td>CWE-838</td><td><a href=02_encoding_and_strings/pyscg-0046/README.md>pyscg-0046: Context-Appropriate Output Encoding</a></td><td></td></tr>

<tr>
<th>MITRE</th>
<th>03 Numbers</th>
<th>Prominent CVEs</th>
</tr>

<tr><td>CWE-1339</td><td><a href=03_numbers/pyscg-0001/README.md>pyscg-0001: Control Numeric Precision</a></td><td></td></tr>
<tr><td>CWE-191</td><td><a href=03_numbers/pyscg-0002/README.md>pyscg-0002: Handle Integer Overflow</a></td><td></td></tr>
<tr><td>CWE-1335</td><td><a href=03_numbers/pyscg-0053/README.md>pyscg-0053: Handle Bitwise Shifts Safely</a></td><td></td></tr>
<tr><td>CWE-1335</td><td><a href=03_numbers/pyscg-0003/README.md>pyscg-0003: Use Arithmetic Over Bitwise Operations</a></td><td></td></tr>
<tr><td>CWE-197</td><td><a href=03_numbers/pyscg-0004/README.md>pyscg-0004: Use Integer Loop Counters</a></td><td></td></tr>
<tr><td>CWE-197</td><td><a href=03_numbers/pyscg-0005/README.md>pyscg-0005: Control Rounding Behavior</a></td><td></td></tr>
<tr><td>CWE-681</td><td><a href=03_numbers/pyscg-0006/README.md>pyscg-0006: Avoid Float String Comparisons</a></td><td></td></tr>
<tr><td>CWE-681</td><td><a href=03_numbers/pyscg-0007/README.md>pyscg-0007: Avoid Float Literals</a></td><td></td></tr>

<tr>
<th>MITRE</th>
<th>04 Neutralization</th>
<th>Prominent CVEs</th>
</tr>

<tr><td>CWE-184</td><td><a href=04_neutralization/pyscg-0047/README.md>pyscg-0047: Use Allow Lists Over Deny Lists</a></td><td></td></tr>

<tr>
  <td>CWE-134</td>
  <td><a href=04_neutralization/pyscg-0008/README.md>pyscg-0008: Prevent Format String Injection</a></td>
  <td><a href="https://www.cvedetails.com/cve/CVE-2022-27177/">CVE-2022-27177</a>,<br>CVSSv3.1: <strong style='color:darkred'>9.8</strong>,<br>EPSS: <strong>00.37</strong> (01.12.2023)</td>
</tr>

<tr>
  <td>CWE-78</td>
  <td><a href=04_neutralization/pyscg-0009/README.md>pyscg-0009: Prevent OS Command Injection</a></td>
  <td><a href="https://www.cvedetails.com/cve/CVE-2024-43804/">CVE-2024-43804</a>,<br>CVSSv3.1: <strong>8.8</strong>,<br>EPSS: <strong>00.06</strong> (08.11.2024)</td>
</tr>

<tr>
 <td>CWE-89</td>
 <td><a href=04_neutralization/pyscg-0010/README.md>pyscg-0010: Prevent SQL Injection</a></td>
 <td><a href="https://www.cvedetails.com/cve/CVE-2019-8600">CVE-2019-8600</a>,<br>CVSSv3.1: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>01.43</strong> (18.02.2024)</td>
</tr>

<tr>
<td>CWE-843</td>
<td><a href=04_neutralization/pyscg-0011/README.md>pyscg-0011: Prevent Type Confusion</a></td>
<td><a href="https://www.cvedetails.com/cve/CVE-2021-29513">CVE-2021-29513</a>,<br>CVSSv3.1: <strong style='color:orange'>7.8</strong>,<br>EPSS: <strong>00.02</strong> (13.05.2025)</td>
</tr>

<tr>
  <td>CWE-409</td>
  <td><a href=04_neutralization/pyscg-0012/README.md>pyscg-0012: Handle Data Amplification</a></td>
  <td><a href="https://www.cvedetails.com/cve/CVE-2019-9674/">CVE-2019-9674</a>,<br>CVSSv3.1: <strong style='color:orange'>7.5</strong>,<br>EPSS: <strong>1.2%</strong> (10.09.2025)</td>
</tr>

<tr>
  <td>CWE-426</td>
  <td><a href=04_neutralization/pyscg-0013/README.md>pyscg-0013: Secure Search Paths</a></td>
  <td><a href="https://www.cvedetails.com/cve/CVE-2015-1326">CVE-2015-1326</a>,<br>CVSSv3.0: <strong style='color:red'>8.8</strong>,<br>EPSS: <strong>00.20</strong> (23.11.2023)</td>
</tr>

<tr><td>CWE-502</td><td><a href=04_neutralization/pyscg-0023/README.md>pyscg-0023: Secure Deserialization</a></td><td><a href=https://www.cvedetails.com/cve/CVE-2018-8021>CVE-2018-8021</a>,<br>CVSSv3.0: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>93.54</strong> (05.11.2024)</td></tr>

<tr>
<th>MITRE</th>
<th>05 Exception handling</th>
<th>Prominent CVEs</th>
</tr>

<tr><td>CWE-397</td><td><a href=05_exception_handling/pyscg-0014/README.md>pyscg-0014: Avoid Generic Exception Declarations</a></td><td></td></tr>
<tr><td>CWE-755</td><td><a href=05_exception_handling/pyscg-0015/README.md>pyscg-0015: Handle Exceptional Conditions</a></td><td><a href=https://www.cvedetails.com/cve/CVE-2024-39560>CVE-2024-39560</a>,<br>CVSSv3.1: <strong style='color:yellow'>6.5</strong>,<br>EPSS: <strong>0.04</strong> (01.11.2024)</td></tr>
<tr><td>CWE-390</td><td><a href=05_exception_handling/pyscg-0016/README.md>pyscg-0016: Act on Error Conditions</a></td><td></td></tr>
<tr><td>CWE-230</td><td><a href=05_exception_handling/pyscg-0017/README.md>pyscg-0017: Handle Missing Values</a></td><td></td></tr>
<tr><td>CWE-754</td><td><a href=05_exception_handling/pyscg-0018/README.md>pyscg-0018: Check Float Exceptional Conditions</a></td><td></td></tr>
<tr><td>CWE-460</td><td><a href=05_exception_handling/pyscg-0052/README.md>pyscg-0052: Clean Up on Exceptions</a></td><td></td></tr>

<tr>
<th>MITRE</th>
<th>06 Logging</th>
<th>Prominent CVEs</th>
</tr>

<tr>
<td>CWE-532</td>
  <td><a href=06_logging/pyscg-0019/README.md>pyscg-0019: Avoid Sensitive Data in Logs</a></td>
  <td><a href="https://www.cvedetails.com/cve/CVE-2023-45585">CVE-2023-45585</a>,<br>CVSSv3.1: <strong>9.8</strong>,<br>EPSS: <strong>0.04</strong> (01.11.2024)</td>
</tr>
<tr><td>CWE-778</td><td><a href=06_logging/pyscg-0020/README.md>pyscg-0020: Ensure Sufficient Logging</a></td><td></td></tr>
<tr><td>CWE-489</td><td><a href=06_logging/pyscg-0021/README.md>pyscg-0021: Remove Debug Code</a></td><td><a href=https://www.cvedetails.com/cve/CVE-2018-14649>CVE-2018-14649</a>,<br>CVSSv3.1: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>69.64</strong> (12.12.2023)</td></tr>
<tr><td>CWE-117</td><td><a href=06_logging/pyscg-0022/README.md>pyscg-0022: Neutralize Log Output</a></td><td></td></tr>
<tr><td>CWE-209</td><td><a href=06_logging/pyscg-0050/README.md>pyscg-0050: Avoid Sensitive Error Messages</a></td><td></td></tr>

<tr>
<th>MITRE</th>
<th><a href="07_concurrency/readme.md">07 Concurrency</a></th>
<th>Prominent CVE</th>
</tr>
<tr><td>CWE-400</td><td><a href=07_concurrency/pyscg-0024/README.md>pyscg-0024: Control Resource Consumption</a></td><td></td></tr>
<tr><td>CWE-410</td><td><a href=07_concurrency/pyscg-0025/README.md>pyscg-0025: Size Resource Pools</a></td><td></td></tr>
<tr><td>CWE-833</td><td><a href=07_concurrency/pyscg-0026/README.md>pyscg-0026: Prevent Deadlock</a></td><td></td></tr>
<tr><td>CWE-362</td><td><a href=07_concurrency/pyscg-0027/README.md>pyscg-0027: Synchronize Shared Resources</a></td><td></td></tr>
<tr><td>CWE-584</td><td><a href=07_concurrency/pyscg-0028/README.md>pyscg-0028: Avoid Returns in Finally</a></td><td></td></tr>
<tr><td>CWE-665</td><td><a href=07_concurrency/pyscg-0029/README.md>pyscg-0029: Initialize Properly</a></td><td></td></tr>
<tr><td>CWE-392</td><td><a href=07_concurrency/pyscg-0030/README.md>pyscg-0030: Report Thread Pool Errors</a></td><td></td></tr>
<tr><td>CWE-404</td><td><a href=07_concurrency/pyscg-0051/README.md>pyscg-0051: Release Resources Properly</a></td><td></td></tr>
<tr><td>CWE-366</td><td><a href=07_concurrency/pyscg-0054/README.md>pyscg-0054: Prevent Thread Race Conditions</a></td><td></td></tr>

<tr>
<th>MITRE</th>
<th>08 Coding Standards</th>
<th>Prominent CVE</th>
</tr>

<tr><td>CWE-1095</td><td><a href=08_coding_standards/pyscg-0031/README.md>pyscg-0031: Avoid Loop Condition Updates</a></td><td></td></tr>
<tr><td>CWE-1109</td><td><a href=08_coding_standards/pyscg-0032/README.md>pyscg-0032: Use Variables for Single Purpose</a></td><td></td></tr>
<tr><td>CWE-595</td><td><a href=08_coding_standards/pyscg-0033/README.md>pyscg-0033: Compare Object Contents</a></td><td></td></tr>
<tr><td>CWE-476</td><td><a href=08_coding_standards/pyscg-0034/README.md>pyscg-0034: Check for None Values</a></td><td></td></tr>
<tr><td>CWE-459</td><td><a href=08_coding_standards/pyscg-0035/README.md>pyscg-0035: Complete Resource Cleanup</a></td><td></td></tr>
<tr><td>CWE-252</td><td><a href=08_coding_standards/pyscg-0036/README.md>pyscg-0036: Check Return Values</a></td><td></td></tr>
<tr><td>CWE-617</td><td><a href=08_coding_standards/pyscg-0037/README.md>pyscg-0037: Avoid Reachable Assertions</a></td><td></td></tr>

<tr>
<th>MITRE</th>
<th>09 Cryptography</th>
<th>Prominent CVE</th>
</tr>

<tr><td>CWE-330</td><td><a href=09_cryptography/pyscg-0038/README.md>pyscg-0038: Use Secure Random Values</a></td><td><a href=https://www.cvedetails.com/cve/CVE-2020-7548>CVE-2020-7548</a>,<br>CVSSv3.1: <strong style='color:red'>9.8</strong>,<br>EPSS: <strong>0.22</strong> (12.12.2024)</td></tr>
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

## License

* [CC-BY 4.0](../../LICENSES/CC-BY-4.0.txt) for documentation
* [MIT](../../LICENSES/MIT.txt) for code snippets
