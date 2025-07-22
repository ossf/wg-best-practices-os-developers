# CWE-000: Title goes here

Introduction sentence, this will be displayed in search engines.

Introduction paragraph, expanding on the introduction sentence...

* Use bullet points instead of commas.
* Be brief.
* Avoid duplicated content.

An `example01.py` code is optional and usefull to demonstrate behaviour that does __not__ work well in the compliant or noncompliant code.

_[example01.py:](example01.py)_

```py
"""Code Example"""

# Code goes here
```

 __Output of example01.py:__

```bash
Console output...
```

## Non-Compliant Code Example

Introduction to the code example...

_[noncompliant01.py](noncompliant01.py):_

```python
"""Non-compliant Code Example"""

# Code goes here

#####################
# Trying to exploit above code example
#####################

# Code goes here
```

Short explanation of expected outcome of running the code example, e.g. "The code will ... throw an exception, print x..., loop forever..."

## Compliant Solution

Introduction to the code example...

_[compliant01.py](compliant01.py):_

```python
"""Compliant Code Example"""

# Code goes here

#####################
# Trying to exploit above code example
#####################

# Code goes here
```

Short explanation of expected outcome of running the code example, e.g. "The code will ... throw an exception, print x..., loop forever..."

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
    <tr>
        <td>Flake8</td>
        <td>8-4.0.1 on Python 3.10.4</td>
        <td>Not Available</td>
        <td></td>
    </tr>
</table>

## Related Guidelines

<table>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Pillar: <a href="https://cwe.mitre.org/data/definitions/682.html"> [CWE-682: Incorrect Calculation]</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base or Class (choose which one it is based on the abstraction on the CWE page): <a href="https://cwe.mitre.org/data/definitions/1335.html">[CWE-1335: Incorrect Bitwise Shift of Integer (4.12)]</a></td>
    </tr>
    <tr>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java">[SEI CERT Oracle Coding Standard for Java]</a></td>
    <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/NUM14-J.+Use+shift+operators+correctly">[NUM14-J. Use shift operators correctly]</a></td>
    </tr>
    <tr>
        <td><a href="https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard">[CERT C Coding Standard]</a></td>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/c/INT34-C.+Do+not+shift+an+expression+by+a+negative+number+of+bits+or+by+greater+than+or+equal+to+the+number+of+bits+that+exist+in+the+operand">[INT34-C. Do not shift an expression by a negative number of bits or by greater than or equal to the number of bits that exist in the operand]</a></td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>[SEI CERT JAVA 2024]</td>
        <td>NUM01-J. Do not perform bitwise and arithmetic operations on the same data [online]. Available from: <a href="https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data">https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data</a>,  [Accessed 6 May 2025]</td>
    </tr>
    <tr>
        <td>[SEI CERT C 2025]</td>
        <td>CERT C Coding Standard [online]. Available from: <a href=https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard>https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard</a> [Accessed 6 May 2025]</td>
    </tr>
</table>
When writing bibliography, follow the [Harvard reference guide](https://dkit.ie.libguides.com/harvard/citing-referencing)
