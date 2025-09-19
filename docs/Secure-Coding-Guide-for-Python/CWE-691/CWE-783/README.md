# CWE-783: Operator Precedence Logic Error

Failing to understand the order of precedence in expressions that read and write to the same object can lead to unintended side effects.

Python has distinct different concepts for:

<table>
<tr>
<th>
type
</th>
<th>examples</th>
<th>Typical direction</th>
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

This `noncompliant01.py` code is expected to provide labels for numbers obfuscates the evaluation and logic.

_[noncompliant01.py](noncompliant01.py):_

```python
"""Non-Compliant Code Example"""


def label(number: int) -> str:
    a = int(number < 0)  # negative flag
    b = (number & 1) ^ 1  # even flag (1 for even, 0 for odd)
    c = int(number < 5)  # small flag

    key = (a << 2) | (b << 1) | c  # pack flags into a single key

    parts = ("big", "small", "even", "even", "neg", "neg", "neg", "neg")

    permuted = tuple(parts[(i * 5) & 7] for i in range(8))

    idx = (key * 5) & 7
    return permuted[idx]


for number in range(-3, 3):
    print(f"{number} = {label(number)}")

```

_Example output of `noncompliant01.py`:_

```bash
-3 = neg
-2 = neg
-1 = neg
0 = even
1 = small
2 = even
```

Attempting to add a label for `zero` will be challenging.

## Compliant Solution

This compliant solution, uses equivalent logic and performs at most one write operation per expression, which makes the code easier to understand and maintain.

_[compliant01.py](compliant01.py):_

```python
"""Compliant Code Example"""


def label(number: int):
    if number < 0:
        return "neg"
    if number % 2 == 0:
        return "even"
    if number < 5:
        return "small"
    return "big"


for number in range(-3, 3):
    print(f"{number} = {label(number)}")

```

## Automated Detection

<table>
    <hr>
        <td>Tool</td>
        <td>Version</td>
        <td>Checker</td>
        <td>Description</td>
    </hr>
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
        <td>7.2.1. Augmented assignment statements [online]. Available from: <a href="https://docs.python.org/3/reference/simple_stmts.html?highlight=augmented%20assignment%20operators#augmented-assignment-statements">https://docs.python.org/3/reference/simple_stmts.html?highlight=augmented%20assignment%20operators#augmented-assignment-statement</a>,  [Accessed 19 September 2025]</td>
    </tr>
    <tr>
        <td>[PLR 2022]</td>
        <td>6.16. Evaluation order [online]. Available from: <a href="https://docs.python.org/3/reference/expressions.html#evaluation-orde">https://docs.python.org/3/reference/expressions.html#evaluation-orde</a>,  [Accessed 19 September 2025]</td>
    </tr>
</table>
