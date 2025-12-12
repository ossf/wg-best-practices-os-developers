# pyscg-0045: Enforce Consistent Encoding

Handling data between different encodings or while filtering out untrusted characters and strings can cause malicious content to slip through input sanitation.

Encoding changes, such as changing from `UTF-8` to pure `ASCII`, can result in turning non-functional payloads, such as `<script生>`, into functional `<script>` tags. Mixed encoding modes [pyscg-0044: Validate Before Canonicalize](../pyscg-0044/README.md) can also play a role. The recommendation by [Batchelder 2022](https://www.youtube.com/watch?v=sgHbC6udIqc) to use a single type of encoding and mode is only applicable for a single project or supplier. The recommendation to always choose the `UTF-8` by [W3c.org 2025](https://www.w3.org/International/questions/qa-what-is-encoding) provides no guarantee and is already flawed by Windows having `Windows-1252` encoding for some Python installations.

The `example01.py` is a crudely simplified version of two methods simulating two completely different systems using different encodings. We are simulating the data at rest and data in transit part in a variable named `floppy`. The write_message and read_message method would be delivered independently in a real world scenario, each with their own encoding.

[*example01.py:*](example01.py)

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Code Example"""

import re
import unicodedata


def write_message(input_string: str):
    """Normalize and validate untrusted string before storing

    Parameters:
        input_string(string): String to validate
    """
    message = unicodedata.normalize("NFC", input_string)

    # validate, exclude dangerous tags:
    for tag in re.findall("<[^>]*>", message):
        if tag in ["<script>", "<img", "<a href"]:
            raise ValueError("Invalid input tag")
    return message.encode("utf-8")


def read_message(message: bytes):
    """Simulating another part of the system displaying the content.

    Args:
        message (bytes): bytearray with some data
    """
    print(message.decode("ascii", "ignore"))


#####################
# attempting to exploit above code example
#####################

# attacker:
floppy = write_message("<script生>")

# victim:
read_message(floppy)
```

__Output of example01.py:__

```bash
<script>
```

The `example01.py` code reduces the `UTF-8` encoded data into `128 ASCII` subsequently turning a previously harmless string into a working `<script>` tag.

The `example01.py` turns a non-functional `UTF-8` encoded message `<script���>` or `<script生>`  string into a working `<script>` tag after collapsing the data into `ASCII`. Such an event taking place highly depends on the client, trust relation and chain of events.

A compliant solution will have to adhere to at least:

* [pyscg-0044: Validate Before Canonicalize](../pyscg-0044/README.md)
* [pyscg-0047: Use Allow Lists Over Deny Lists](../../04_neutralization/pyscg-0047/README.md)

Reduction of data into a subset is not limited to strings and characters.

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: CWE-693, Protection Mechanism Failure \[online\], available from <https://cwe.mitre.org/data/definitions/693.html> \[Accessed April 2025\]|
|[MITRE CWE](http://cwe.mitre.org/)|Base: CWE-182: Collapse of Data into Unsafe Value \[online\], available from <https://cwe.mitre.org/data/definitions/182.html> \[Accessed April 2025\]|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|IDS11-J. Perform any string modifications before validation\[online\], available from: <https://wiki.sei.cmu.edu/confluence/display/java/IDS11-J.+Perform+any+string+modifications+before+validation> \[Accessed April 2025\]|
|[OpenSSF Secure Coding in Python](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)|pyscg-0044: Validate Before Canonicalize \[online\], available from <https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/02_encoding_and_strings/pyscg-0044/README.md> \[Accessed April 2025\]|
|[OpenSSF Secure Coding in Python](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)|pyscg-0047: Use Allow Lists Over Deny Lists \[online\], available from <https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/04_neutralization/pyscg-0047/README.md> \[Accessed April 2025\]|

## Bibliography

|||
|:---|:---|
|\[Batchelder 2022\]|Ned Batchelder, Pragmatic Unicode, or, How do I stop the pain? \[online\], Available from: <https://www.youtube.com/watch?v=sgHbC6udIqc> \[Accessed 4 April 2025\] |
|\[W3c.org 2015\]|Character encodings for beginners \[online\], Available from: <https://www.w3.org/International/questions/qa-what-is-encoding>, \[Accessed 4 April 2025\] |
