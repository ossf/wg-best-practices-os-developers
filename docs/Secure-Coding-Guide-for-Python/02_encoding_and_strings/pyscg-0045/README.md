# pyscg-0045: Enforce Consistent Encoding

Handling data between different encodings or while filtering out untrusted characters and strings can cause malicious content to slip through input sanitation.

Encoding changes, such as changing from `UTF-8` to pure `ASCII`, can result in turning non-functional payloads, such as `<script生>`, into functional `<script>` tags. Mixed encoding modes [pyscg-0044: Canonicalize Input Before Validating](../pyscg-0044/README.md) can also play a role. The recommendation by [Batchelder 2022](https://www.youtube.com/watch?v=sgHbC6udIqc) to use a single type of encoding and mode is only applicable for a single project or supplier. The recommendation to always choose the `UTF-8` by [W3c.org 2025](https://www.w3.org/International/questions/qa-what-is-encoding) provides no guarantee and is already flawed by Windows having `Windows-1252` encoding for some Python installations.

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

* [pyscg-0044: Canonicalize Input Before Validating](../pyscg-0044/README.md)
* [pyscg-0047: Incomplete List Of Disallowed Input](../../04_neutralization/pyscg-0047/README.md)

Reduction of data into a subset is not limited to strings and characters.

## Non-Compliant Code Example (Encoding)

The developer should be aware of the text encoding that is used for input data and output data in the program. The code example attempts to use `UTF-16 LE` encoding to read the LOREM `TextIOWrapper` stream which raises a `UnicodeDecodeError` exception as it was created with `UTF-8`.

*[noncompliant01.py](noncompliant01.py):*

```python
""" Non-compliant Code Example """
import io

LOREM = """Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."""

output = io.BytesIO()
wrapper = io.TextIOWrapper(output, encoding='utf-8', line_buffering=True)
wrapper.write(LOREM)
wrapper.seek(0, 0)
# Below outputs UnicodeDecodeError: 'utf-16-le' codec can't decode byte 0x2e in position 1336: truncated data
print(f"{len(output.getvalue().decode('utf-16le'))} characters in string")

```

## Compliant Solution (Encoding)

The correct text encoding, `UTF-8` for the LOREM `TextIOWrapper` stream has been included in the program. Ensure the encoding of data is known and explicitly stated when parsing and creating data.

*[compliant01.py](compliant01.py):*

```python
""" Compliant Code Example """
import io

LOREM = """Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."""

output = io.BytesIO()
wrapper = io.TextIOWrapper(output, encoding='utf-8', line_buffering=True)
wrapper.write(LOREM)
wrapper.seek(0, 0)
# 1337 characters in string
print(f"{len(output.getvalue().decode('utf-8'))} characters in string")

```

## Non-Compliant Code Example - Forensic logging

Mixed encoding can lead to unexpected results and become a root cause for attacks as showcased in [pyscg-0044: Canonicalize Input Before Validating](../pyscg-0044/README.md) and [pyscg-0043: Specify Locale Explicitly](../pyscg-0043/README.md).

> [!CAUTION]
> Processing any type of forensic data requires an environment that is sealed off to an extent that prevents any exploit from reaching other systems, including hardware!

The `noncompliant02.py` code is trying to process data that contains a byte outside the valid range of UTF-8 encoding, resulting in unexpected behavior.

*[noncompliant02.py](noncompliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""


def report_record_attack(stream: bytearray):
    print("important text:", stream.decode("utf-8"))


#####################
# attempting to exploit above code example
#####################
payload = bytearray("user: 毛泽东先生 attempted a directory traversal".encode("utf-8"))
# Introducing an error in the encoded text, a byte
payload[3] = 128
report_record_attack(payload)

```

Trying to decode the modified encoded text in UTF-8 will result in the following exception:

```bash
UnicodeDecodeError: 'utf-8' codec can't decode byte 0x80 in position 3: invalid start byte
```

Python is expected to use the `UTF-8` charset by default, which is backward compatible with `ASCII` [Python docs - unicode](https://docs.python.org/3/howto/unicode.html). Depending on the Python installation it may also be configured with any other encoding. It is recommended to always stick to `UTF-8` inside your program and do not bend the configuration of the OS [Batchelder 2022](https://www.youtube.com/watch?v=sgHbC6udIqc).

## Compliant Solution - Forensic Logging

We can use the `Base64` encoding to allow for a lossless conversion of binary data to String  and back. `Base64`, alongside `Base32` and `Base16`, are encodings specified in [RFC 4648](https://datatracker.ietf.org/doc/html/rfc4648.html). Data encoded with one of these encodings can be safely sent by email, used as parts of URLs, or included as part of an `HTTP POST` request [Python docs - base64](https://docs.python.org/3/library/base64.html).
Python provides a `base64` library that provides easy ways to encode and decode byte lists using the `RFC 4648` encodings.

In the `compliant02.py` code example, the same error is introduced in the encoded text, however this time, if there is a `UnicodeDecodeError`, we encode the stream using `Base64` and log it for forensic analysis. This results in no loss of data while highlighting an attempted attack with a potentially dangerous payload.

*[compliant02.py](compliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import base64


def report_record_attack(stream: bytearray):
    try:
        decoded_text = stream.decode("utf-8")
    except UnicodeDecodeError as e:
        # Encode the stream using Base64 if there is an exception
        encoded_payload = base64.b64encode(stream).decode("utf-8")
        # Logging encoded payload for forensic analysis
        print("Base64 Encoded Payload for Forensic Analysis:", encoded_payload)
        print("Error decoding payload:", e)
    else:
        print("Important text:", decoded_text)


#####################
# attempting to exploit above code example
#####################
payload = bytearray("user: 毛泽东先生 attempted a directory traversal".encode("utf-8"))
# Introducing an error in the encoded text, a byte
payload[3] = 128
report_record_attack(payload)
```

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: CWE-693, Protection Mechanism Failure \[online\], available from <https://cwe.mitre.org/data/definitions/693.html> \[Accessed April 2025\]|
|[MITRE CWE](http://cwe.mitre.org/)|Base: CWE-176: Improper Handling of Unicode Encoding \[online\], available from <https://cwe.mitre.org/data/definitions/176.html> \[Accessed January 2026\]|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-707: Improper Neutralization](https://cwe.mitre.org/data/definitions/707.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-838: Inappropriate Encoding for Output Context](https://cwe.mitre.org/data/definitions/838.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[STR03-J. Do not encode noncharacter data as a string](https://wiki.sei.cmu.edu/confluence/display/java/STR03-J.+Do+not+encode+noncharacter+data+as+a+string)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|IDS11-J. Perform any string modifications before validation\[online\], available from: <https://wiki.sei.cmu.edu/confluence/display/java/IDS11-J.+Perform+any+string+modifications+before+validation> \[Accessed April 2025\]|
|[OpenSSF Secure Coding in Python](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)|pyscg-0044: Canonicalize Input Before Validating], available from <https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/02_encoding_and_strings/pyscg-0044/README.md> \[Accessed April 2025\]|
|[OpenSSF Secure Coding in Python](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)|pyscg-0047: Use Allow Lists Over Deny Lists \[online\], available from <https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/04_neutralization/pyscg-0047/README.md> \[Accessed April 2025\]|

## Bibliography

|||
|:---|:---|
|\[Batchelder 2022\]|Ned Batchelder, Pragmatic Unicode, or, How do I stop the pain? \[online\], Available from: <https://www.youtube.com/watch?v=sgHbC6udIqc> \[Accessed 4 April 2025\]|
|\[W3c.org 2015\]|Character encodings for beginners \[online\], Available from: <https://www.w3.org/International/questions/qa-what-is-encoding>, \[Accessed 4 April 2025\]|
|\[Python docs - unicode\]|Python Software Foundation. (2023). Unicode HOWTO. \[online\]. Available from: <https://docs.python.org/3/howto/unicode.html> \[accessed 28 April 2025\]|
|\[RFC 4648\]|Simon, J. Internet Engineering Task Force (2006). The Base16, Base32, and Base64 Data Encodings.\[online\]. Available from: <https://datatracker.ietf.org/doc/html/rfc4648.html> \[accessed 28 April 2025\]|
|\[Python docs - base64\]|Python Software Foundation. (2023). base64 - Base16, Base32, Base64, Base85 Data Encodings.\[online\]. Available from: <https://docs.python.org/3/library/base64.html> \[accessed 28 April 2025\]|
