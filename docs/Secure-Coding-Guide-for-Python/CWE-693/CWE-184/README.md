# CWE-184: Incomplete List of Disallowed Input

Avoid Incomplete 'deny lists' that can lead to security vulnerabilities such as cross-site scripting (XSS) by using 'allow lists' instead.

## Non-Compliant Code Example

The `noncompliant01.py` code demonstrates the difficult handling of exclusion lists in a multi language support use case. `UTF-8` has __1,112,064__ mappings between `8-32` bit values and printable characters such as `生` known as "code points".

The `noncompliant01.py` `filterString()` method attempts to search for disallowed inputs and fails to find the `script` tag due to the non-English character `生`  in `<script生>`.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import re
import sys

if sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="UTF-8")


def filter_string(input_string: str):
    """Normalize and validate untrusted string

    Parameters:
        input_string(string): String to validate
    """
    # TODO Canonicalize (normalize) before Validating

    # validate, exclude dangerous tags:
    for tag in re.findall("<[^>]*>", input_string):
        if tag in ["<script>", "<img", "<a href"]:
            raise ValueError("Invalid input tag")


#####################
# attempting to exploit above code example
#####################
names = [
    "YES 毛泽东先生",
    "YES dash-",
    "NOK <script" + "\ufdef" + ">",
    "NOK <script生>",
]
for name in names:
    print(name)
    filter_string(name)

```

## Compliant Solution

The `compliant01.py` uses an allow list instead of a deny list and prevents the use of unwanted characters by raising an exception even without canonicalization. The missing canonicalization in `compliant01.py` according to [CWE-180: Incorrect Behavior Order: Validate Before Canonicalize](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python/CWE-707/CWE-180) must be added in order to make logging or displaying them safe!

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import re
import sys

if sys.stdout.encoding.lower() != "utf-8":
    sys.stdout.reconfigure(encoding="UTF-8")


def filter_string(input_string: str):
    """Normalize and validate untrusted string

    Parameters:
        input_string(string): String to validate
    """
    # TODO Canonicalize (normalize) before Validating

    # validate, only allow harmless tags
    for tag in re.findall("<[^>]*>", input_string):
        if tag not in ["<b>", "<p>", "</p>"]:
            raise ValueError("Invalid input tag")
    # TODO handle exception


#####################
# attempting to exploit above code example
#####################
names = [
    "YES 毛泽东先生",
    "YES dash-",
    "NOK <script" + "\ufdef" + ">",
    "NOK <script生>",
]
for name in names:
    print(name)
    filter_string(name)

```

The `compliant01.py` detects the unallowed character correctly and throws a `ValueError` exception. An actual production solution would also need to canonicalize and handle the exception correctly.

__Example compliant01.py output:__

```bash
/wg-best-practices-os-developers/docs/Secure-Coding-Guide-for-Python/CWE-693/CWE-184/compliant01.py
$ python3 compliant01.py
YES 毛泽东先生
YES dash-
NOK <script﷯>
Traceback (most recent call last):
  File "/workspace/wg-best-practices-os-developers/docs/Secure-Coding-Guide-for-Python/CWE-693/CWE-184/compliant01.py", line 38, in <module>
    filter_string(name)
  File "/workspace/wg-best-practices-os-developers/docs/Secure-Coding-Guide-for-Python/CWE-693/CWE-184/compliant01.py", line 23, in filter_string
    raise ValueError("Invalid input tag")
ValueError: Invalid input tag

```

According to *Unicode Technical Report #36, Unicode Security Considerations [Davis 2008b]*, `\uFFFD`  is usually unproblematic, as a replacement for unwanted or dangerous characters. That is, `\uFFFD` will typically just cause a failure in parsing. Where the output character set is not Unicode, though, this character may not be available.

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-693: CWE-693: Protection Mechanism Failure (mitre.org)](https://cwe.mitre.org/data/definitions/693.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base : [CWE-184, Incomplete List of Disallowed Inputs (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/184.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[IDS11-J. Perform any string modifications before validation](https://wiki.sei.cmu.edu/confluence/display/java/IDS11-J.+Perform+any+string+modifications+before+validation)|

## Bibliography

|||
|:---|:---|
|[Unicode 2024]|Unicode 16.0.0 [online]. Available from: [https://www.unicode.org/versions/Unicode16.0.0/](https://www.unicode.org/versions/Unicode16.0.0/) [accessed 20 March 2025] |
|[Davis 2008b]|Unicode Technical Report #36, Unicode Security Considerations, Section 3.5 "Deletion of Code Points" [online]. Available from: [https://www.unicode.org/reports/tr36/](https://www.unicode.org/reports/tr36/) [accessed 20 March 2025] |
|[Davis 2008b]|Unicode Technical Report #36, Unicode Security Considerations, Section 3.5 "Deletion of Code Points" [online]. Available from: [https://www.unicode.org/reports/tr36/](https://www.unicode.org/reports/tr36/) [accessed 20 March 2025] |
