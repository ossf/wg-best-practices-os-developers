# pyscg-0042: Ensure Correct Operator Precedence

Failing to understand the order of precedence in expressions that read and write to the same object can lead to unintended side effects.

Python has distinct different concepts for:

<table>
<tr>
<th>
type
</th>
<th>examples</th>
<th>Typical direction</th>
</tr>
<tr>
<td>Assignments</td><td>to store a value such as x = 1</td><td>right-to-left.</td>
</tr>
<tr>
<td>Expressions</td><td>3+4 or x*2</td><td>left-to-right</td>
</tr>
<tr>
<td>Augmented assignments</td><td>a += 1</td><td>left-to-right <a href="https://docs.python.org/3/reference/simple_stmts.html?highlight=augmented%20assignment%20operators#augmented-assignment-statements">[Python docs 2025 - simple statements]</a></td>
</tr>
</table>

Expressions such as `2 ** 3`, or two to the power of three, are evaluated from right to left [[python power 2025](https://docs.python.org/3/reference/expressions.html#index-59)] as demonstrated in `example01.py`

_[example01.py:](example01.py)_

```py
"""Code Example"""

print(2**3**2)  # prints 512
print((2**3) ** 2)  # prints 64
print(2**9)

```

The first expression would print `64` if Python would resolve from left-to-right but prints `512` as it calculates `3**2` before using its result with `2**9`.
The `example02.py` behaves 'normal' for a programmer but makes no  sense as a mathematical formular.

_[example02.py:](example02.py)_

```py
z = 2
z *= 2 + 1
print(f"z *= 2 + 1    ={z}")
```

If a method changes an object’s state (has side effects) and is called multiple times within one expression, the result can be surprising and incorrect. For further info on python's order of precedence refer to The Python Language Specification , §6.16, "Evaluation Order" [[PLR 2022](https://docs.python.org/3/reference/expressions.html#evaluation-order)].

## Non-Compliant Code Example

`noncompliant01.py` demonstrates an operator precedence logic error that can lead to a buffer overflow vulnerability. This code example is based on a real vulnerability ([CVE-2026-7270](https://nvd.nist.gov/vuln/detail/CVE-2026-7270)) that occurred in 'FreeBSD's' execve argument handling. The code fails to use parentheses to clarify the intended order of operations, causing the bounds check to pass when it should fail.

_[noncompliant01.py](noncompliant01.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-Compliant Code Example"""

ARG_MAX_BYTES = 16  # small buffer
argbuf = bytearray(ARG_MAX_BYTES)

USED = 10                       # 10 bytes already used
ARG = b"AAAAAAAA"               # attacker-controlled, needs 8 + 1 = 9 bytes
LENGTH = len(ARG) + 1           # 9 (include NUL terminator)

REMAINING = ARG_MAX_BYTES - USED + LENGTH  # Wrong: 15, expected -3

if LENGTH > REMAINING:
    print("Rejected: not enough space")
else:
    print(f"Bounds check passed: remaining={REMAINING}")

```

_Example output of `noncompliant01.py`:_

```bash
Bounds check passed: remaining=15
```

The bounds check incorrectly passes because the expression evaluates left-to-right as `(16 - 10) + 9 = 15` instead of the intended `16 - (10 + 9) = -3`. This allows the attacker-controlled data to overflow the buffer.

## Compliant Solution

The compliant solution fixes the operator precedence by comparing additions instead of subtracting, making the code clear, with no precedence trap. While adding parentheses like `ARG_MAX_BYTES - (USED + LENGTH)` would fix the precedence issue also, restructuring to `USED + LENGTH > ARG_MAX_BYTES` is clearer and avoids confusing negative values.

_[compliant01.py](compliant01.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

ARG_MAX_BYTES = 16
argbuf = bytearray(ARG_MAX_BYTES)

USED = 10
ARG = b"AAAAAAAA"
LENGTH = len(ARG) + 1  

# Compare additions instead of subtracting: clear, and no precedence trap
if USED + LENGTH > ARG_MAX_BYTES:
    print("Rejected: not enough space")
else:
    print(f"Bounds check passed: remaining={ARG_MAX_BYTES - USED - LENGTH}")

```

_Example output of `compliant01.py`:_

```bash
Rejected: not enough space
```

Now the bounds check correctly rejects the operation because `USED + LENGTH = 10 + 9 = 19`, which exceeds `ARG_MAX_BYTES = 16`.

## Automated Detection

<table>
    <tr>
        <th>Tool</th>
        <th>Version</th>
        <th>Checker</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Bandit</td>
        <td>1.7.4 on Python 3.10.4</td>
        <td>Not Available</td>
        <td></td>
    </tr>
</table>

## Related Guidelines

<table>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Pillar: <a href="https://cwe.mitre.org/data/definitions/691.html"> [CWE-691: Insufficient Control Flow Management]</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base <a href="https://cwe.mitre.org/data/definitions/783.html">CWE-783: Operator Precedence Logic Error</a></td>
    </tr>
    <tr>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java">SEI CERT Oracle Coding Standard for Java</a></td>
    <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/EXP05-J.+Do+not+follow+a+write+by+a+subsequent+write+or+read+of+the+same+object+within+an+expression"></a>EXP05-J. Do not follow a write by a subsequent write or read of the same object within an expression</td>
    </tr>
    <tr>
        <td><a href="https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard">CERT C Coding Standard</a></td>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/c/EXP30-C.+Do+not+depend+on+the+order+of+evaluation+for+side+effects">EXP30-C. Do not depend on the order of evaluation for side effects</a></td>
    </tr>
    <tr>
        <td><a href="https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682">SEI CERT C++ Coding Standard</a></td>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/cplusplus/EXP50-CPP.+Do+not+depend+on+the+order+of+evaluation+for+side+effects">EXP50-CPP. Do not depend on the order of evaluation for side effects</a></td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>[Python docs 2025 - simple statements]</td>
        <td>7.2.1. Augmented assignment statements [online]. Available from: <a href="https://docs.python.org/3/reference/simple_stmts.html?highlight=augmented%20assignment%20operators#augmented-assignment-statements">https://docs.python.org/3/reference/simple_stmts.html?highlight=augmented%20assignment%20operators#augmented-assignment-statement</a>,  [Accessed 19 September 2025]</td>
    </tr>
    <tr>
        <td>[python power 2025]</td>
        <td>6. Expressions [online]. Available from: <a href="https://docs.python.org/3/reference/expressions.html#index-59">https://docs.python.org/3/reference/expressions.html#index-59</a>,  [Accessed 19 September 2025]</td>
    </tr>
    <tr>
        <td>[PLR 2022]</td>
        <td>6.16. Evaluation order [online]. Available from: <a href="https://docs.python.org/3/reference/expressions.html#evaluation-order">https://docs.python.org/3/reference/expressions.html#evaluation-order</a>,  [Accessed 19 September 2025]</td>
    </tr>
    <tr>
        <td>[CVE-2026-7270]</td>
        <td>FreeBSD execve argument handling buffer overflow [online]. Available from: <a href="https://nvd.nist.gov/vuln/detail/CVE-2026-7270">https://nvd.nist.gov/vuln/detail/CVE-2026-7270</a></td>
    </tr>
</table>
