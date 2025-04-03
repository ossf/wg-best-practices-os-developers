# CWE-180: Incorrect Behavior Order: Validate Before Canonicalize

Normalize/canonicalize strings before validating them to prevent risky strings such as  `../../../../passwd` allowing directory traversal attacks, and to reduce `XSS` attacks.

The need for supporting multiple languages requires the use of an extended list of characters encoding such as `UTF-8` supporting __1,112,064__ displayable characters.

Character Encoding systems such as `ASCII`, `Windows-1252`, or `UTF-8` consist of an agreed mapping between byte values and a human-readable character known as code points. Each code point represents a single relation between characters such as a fixed number "`\u002E`", its graphical representation "`.`", and name "`FULL STOP`"  [[Batchelder 2022]](https://www.youtube.com/watch?v=sgHbC6udIqc). Using the same encoding assures that equivalent strings have a unique binary representation Unicode Standard _annex #15, Unicode Normalization Forms_ [[Davis 2008]](https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-Davis08). Different or unexpected changes in encoding can allow attackers to workaround validation or input sanitation affords.

> ! NOTE:
> ! WARN: Ensure to use allow lists to avoid having to maintain an deny list on a continuous basis (as exclusion lists are a moving target) as per CWE-184: Incomplete List of Disallowed Input - Development Environment.

<table>
    <tr>
        <th colspan="3">NFKC normalized</th>
        <th colspan="3">UTF-16 (hex)</th>
    </tr>
    <tr>
        <th>Hex</th>
        <th>Print</th>
        <th>Name</th>
        <th>Print</th>
        <th>Hex</th>
        <th>Name</th>
    </tr>
    <tr>
        <td >.</td>
        <td>\u002E</td>
        <td>FULL STOP</td>
        <td>․</td>
        <td>\u2024</td>
        <td>ONE DOT LEADER</td>
    </tr>
    <tr>
        <td >..</td>
        <td>\u002E\u002E</td>
        <td>FULL STOPFULL STOP</td>
        <td>‥</td>
        <td>\u2025</td>
        <td>TWO DOT LEADER</td>
    </tr>
    <tr>
        <td >/</td>
        <td>\u003F</td>
        <td>SOLIDUS</td>
        <td>／</td>
        <td>\uFF0F</td>
        <td>FULLWIDTH SOLIDUS</td>
    </tr>
</table>

The `NFKC` and `NFKD`compatibility mode causes a `ONE DOT LEADER` to become a `FULL STOP` as demonstrated in `example01.py` [[python.org 2023]](https://docs.python.org/3/library/unicodedata.html)

__[example01.py](example01.py):__

```py
""" Code Example """

# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
import unicodedata

print("\N{FULL STOP}" * 10)
print("." == unicodedata.normalize("NFC", "\u2024") == "\N{FULL STOP}" == "\u002e")
print("." == unicodedata.normalize("NFD", "\u2024") == "\N{FULL STOP}" == "\u002e")
print("." == unicodedata.normalize("NFKC", "\u2024") == "\N{FULL STOP}" == "\u002e")
print("." == unicodedata.normalize("NFKD", "\u2024") == "\N{FULL STOP}" == "\u002e")
print("\N{FULL STOP}" * 10)
```

The first two lines in `example01.py` return `False` due to the missing compatibility mode and the last two lines return `True`. The issue depends on whether normalization is used, its mode, and when it is applied.

Using a compatibility mode `NFKC` and `NFKD` can allow attackers to disguise malicious strings by using characters that are beyond the `ASCII` range of `0-127` turning a `ONE DOT LEADER` `\u2024` into a `FULL STOP \u002E`.

Using non-compatibility `NFC` and `NFD` or stripping of characters can lead to a harmless string such as `<script生>` turn into `<script>` as per _CWE-182: Collapse of Data into Unsafe Value (4.16)_ [[MITRE CWE-182 2024]](https://cwe.mitre.org/data/definitions/182.html)

## Non-Compliant Code Example - Compatibility mode

Reducing the list of allowed characters or switching between different encodings can be required by design in order to stay compatible between different systems.

The `noncompliant01.py` code is attempting to detect a directory traversal attack but only normalizes for logging `unicodedata.normalize()`

__[noncompliant01.py](noncompliant01.py):__

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import re
import unicodedata


def api_with_ids(suspicious_string: str):
    """Fancy intrusion detection system(IDS)"""
    if re.search("./", suspicious_string):
        normalized_string = unicodedata.normalize("NFKC", suspicious_string)
        print(f"detected an attack sequence {normalized_string}")
    else:
        print("Nothing suspicious")


#####################
# attempting to exploit above code example
#####################
# The MALICIOUS_INPUT is using:
# \u2024 or "ONE DOT LEADER"
# \uFF0F or 'FULLWIDTH SOLIDUS'
api_with_ids("\u2024\u2024\uff0f" * 10 + "passwd")
```

The `re.search("./"` can not detect the "`ONE DOT LEADER`" or "`FULLWIDTH SOLIDUS`" because it is not normalized at the right time, which allows a directory traversal attack.

## Compliant Solution - Compatibility mode

This compliant solution normalizes the string before testing it and according to _annex #15_ [[Davis 2008]](https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-Davis08), and [[Batchelder 2022]](https://www.youtube.com/watch?v=sgHbC6udIqc) we want to ensure that strings have a unique binary representation within our code.

__[compliant01.py](compliant01.py):__

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import re
import unicodedata


def api_with_ids(suspicious_string: str):
    """Fancy intrusion detection system(IDS)"""
    normalized_string = unicodedata.normalize("NFKC", suspicious_string)
    if re.search("./", normalized_string):
        print("detected an attack sequence with . or /")
    else:
        print("Nothing suspicious")


#####################
# attempting to exploit above code example
#####################
# The MALICIOUS_INPUT is using:
# \u2024 or "ONE DOT LEADER"
# \uFF0F or 'FULLWIDTH SOLIDUS'
api_with_ids("\u2024\u2024\uff0f" * 10 + "passwd")

```

Developers should be aware of the encoding of data printed to `HTML`. For example, the following string was an `XSS` vulnerability in chrome `숍訊昱穿刷奄剔㏆穽侘㈊섞昌侄從쒜` [[issues.chromium.org 2025]](https://issues.chromium.org/issues/40076480); if the charset of the webpage was set to `ISO-2022-KR` or another unknown charset.
At the time the Korean language was unsupported so it attempted to fall back to Windows OS default encoding `Windows-1252` and executed the code [[Taylor 2009]](https://zaynar.co.uk/posts/charset-encoding-xss/).

Note that some operating systems (Windows, Mac) have system encodings for various characters which do get executed on a webpage regardless of charset. These should be avoided as they can cause issues with devices that don't support that charset. Other character sets should be avoided too, such as ascii, because mobile phones or old SMS generally has a very limited charset and behave unexpectedly.

## Automated Detection

None known

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|||||

## Related Guidelines

|||
|:---|:---|
|[ISO/IEC TR 24772:2013](https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-ISO/IECTR24772-2013)|Cross-site Scripting \[XYT\] \[online\], available from: <https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-ISO/IECTR24772-2013>, \[Accessed April 2025\]|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar CWE - CWE-707: Improper Neutralization \[online\], available from:<https://cwe.mitre.org/data/definitions/707.html> \[Accessed April 2025\]|
|[MITRE CWE](http://cwe.mitre.org/)|Variant: CWE-180, Incorrect behavior order: Validate before canonicalize \[online\], available from: <http://cwe.mitre.org/data/definitions/180.html>|
|[MITRE CWE](http://cwe.mitre.org/)|Base: CWE-182: Collapse of Data into Unsafe Value (4.16) \[online\], available from: <http://cwe.mitre.org/data/definitions/182.html>|
|[MITRE CWE](http://cwe.mitre.org/)|Base: CWE-184: Incomplete List of Disallowed Input - Development Environment. \[online\], available from: <http://cwe.mitre.org/data/definitions/184.html>|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|IDS01-J. Normalize strings before validating them \[online\], available from: <https://wiki.sei.cmu.edu/confluence/display/java/IDS01-J.+Normalize+strings+before+validating+them>|

## Bibliography

|||
|:---|:---|
|\[Davis 2008\]|Mark Davis and Ken Whistler, Unicode Standard Annex #15, Unicode Normalization Forms, 2008. \[online\], available from: <http://unicode.org/reports/tr15/> \[Accessed April 2025\]<br>Mark Davis and Michel Suignard, Unicode Technical Report #36, Unicode Security Considerations, 2008.\[online\], Available from:<http://www.unicode.org/reports/tr36/> \[Accessed 4 April 2025\] |
|\[Weber 2009\]|MUnraveling Unicode: A Bag of Tricks for Bug Hunting \[online\], available from: <http://www.lookout.net/wp-content/uploads/2009/03/chris_weber_exploiting-unicode-enabled-software-v15.pdf> \[Accessed April 2025\]|
|\[Ned Batchelder 2022\]|Pragmatic Unicode, or, How do I stop the pain? - YouTube \[online\], available from: <https://www.youtube.com/watch?v=sgHbC6udIqc> \[Accessed April 2025\]|
|\[Kuchling 2022\]|Unicode HOWTO \[online\], available from: <https://docs.python.org/3/howto/unicode.html> \[Accessed April 2025\]|
|\[python.org 2023\]|unicodedata — Unicode Database — Python 3.12.0 documentation \[online\], available from: <https://docs.python.org/3/library/unicodedata.html> \[Accessed April 2025\]|
|\[issues.chromium.org 2025\]|XSS issue due to the lack of support for ISO-2022-KR \[online\], available from: <https://issues.chromium.org/issues/40076480> \[Accessed April 2025\]|
|\[Taylor 2009\]|XSS vulnerabilities with unusual character encodings \[online\], available from: <https://zaynar.co.uk/posts/charset-encoding-xss/> \[Accessed April 2025\]|
