# CWE-838: Inappropriate Encoding for Output Context

Inappropriate handling of an encoding from untrusted sources or unexpected encoding can lead to unexpected values, data loss, or become the root cause of an attack.

Mixed encoding can lead to unexpected results and become a root cause for attacks as showcased in [CWE-180: Incorrect behavior order: Validate before Canonicalize](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/CWE-707/CWE-180) and [CWE-175: Improper Handling of Mixed Encoding.](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/CWE-707/CWE-175/README.md) This rule showcases capturing the root cause by untrusted source its original binary without compromising the logging system for forensics.

> [!CAUTION]
> Processing any type of forensic data requires an environment that is sealed off to an extent that prevents any exploit from reaching other systems, including hardware!

## Non-Compliant Code Example - Forensic logging

The `noncompliant01.py` code is trying to process data that contains a byte outside the valid range of UTF-8 encoding, resulting in unexpected behavior.

*[noncompliant01.py](noncompliant01.py):*

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

In the `compliant01.py` code example, the same error is introduced in the encoded text, however this time, if there is a `UnicodeDecodeError`, we encode the stream using `Base64` and log it for forensic analysis. This results in no loss of data while highlighting an attempted attack with a potentially dangerous payload.

*[compliant01.py](compliant01.py):*

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

No detection.

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-707: Improper Neutralization](https://cwe.mitre.org/data/definitions/707.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-838: Inappropriate Encoding for Output Context](https://cwe.mitre.org/data/definitions/838.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[STR03-J. Do not encode noncharacter data as a string](https://wiki.sei.cmu.edu/confluence/display/java/STR03-J.+Do+not+encode+noncharacter+data+as+a+string)|

## Bibliography

|||
|:---|:---|
|\[Python docs - unicode\]|Python Software Foundation. (2023). Unicode HOWTO. \[online\]. Available from: <https://docs.python.org/3/howto/unicode.html> \[accessed 28 April 2025\]|
|\[RFC 4648\]|Simon, J. Internet Engineering Task Force (2006). The Base16, Base32, and Base64 Data Encodings.\[online\]. Available from: <https://datatracker.ietf.org/doc/html/rfc4648.html> \[accessed 28 April 2025\]|
|\[Python docs - base64\]|Python Software Foundation. (2023). base64 - Base16, Base32, Base64, Base85 Data Encodings.\[online\]. Available from: <https://docs.python.org/3/library/base64.html> \[accessed 28 April 2025\]|
|\[Batchelder 2022\]|Ned Batchelder, Pragmatic Unicode, or, How do I stop the pain? \[online\]. Available from: <https://www.youtube.com/watch?v=sgHbC6udIqc> \[accessed 28 April 2025\]|
