# CWE-681: Incorrect Conversion between Numeric Types

String representations of floating-point numbers must not be compared or inspected outside of specialized modules such as `decimal` or `math`.

For example, a `Decimal` object must be created from a `string`, but it is inaccurate to use the string representation of a floating-point number outside of `Decimal`. The `Decimal` module provides a `compare()` method that allows the calculation to stay within its configured precision.

## Non-Compliant Code Example (String)

Since Python 3.5, the division of integers yields a float [[Python docs](https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations)]. The string representation of such a division will contain a decimal point. In `noncompliant01.py`, the decimal point was omitted while comparing strings. `2.0` and `2` are two different strings, thus the `if` condition is not met.

[*noncompliant01.py:*](noncompliant01.py)

```py
""" Non-compliant Code Example """
s = str(4 / 2)
print(f"s: {s}")
# s is "2.0", a string
if s == "2":
    print("s equals 2")
# <no output>

```

## Compliant Solution (Decimal)

The compliant code uses `Decimal` as it offers alterable precision up to 28 decimal places and is more human-friendly. In the `compliant01.py`  example, the variable `t` is still `2.0`. Unlike `String`, `Decimal` realizes that `2.0` equals `2`.

[*compliant01.py:*](compliant01.py)

```py
""" Compliant Code Example """
from decimal import Decimal
 
t = Decimal(str(4 / 2))
print(f"t: {t}")
# t still prints "2.0", but now it's a Decimal
if Decimal("2").compare(t) == 0:
    print("t equals 2")
# prints "t equals 2"

```

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4|none|none|

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar<br>[CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base:<br>[CWE-681, Incorrect Conversion between Numeric Types](https://cwe.mitre.org/data/definitions/681.html)|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM11-J. Do not compare or inspect the string representation of floating-point values](https://wiki.sei.cmu.edu/confluence/display/java/NUM11-J.+Do+not+compare+or+inspect+the+string+representation+of+floating-point+values)|

## Related Guidelines

|||
|:---|:---|
|[[Python docs](https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations)]|Python Software Foundation. (2024). Expressions, Binary arithmetic operations [online].<br>Available from: [https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations](https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations)<br>[accessed 11 April 2024].|
