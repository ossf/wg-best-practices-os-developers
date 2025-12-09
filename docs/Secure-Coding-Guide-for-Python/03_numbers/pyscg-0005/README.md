# pyscg-0005: Control rounding when converting to less precise numbers

While defensive coding requires enforcing types, it is important to make conscious design decisions on how conversions are rounded.

The `example01.py` code demonstrates how `int()` behaves differently to `round()`.

[*example01.py:*](example01.py)

```py
""" Code Example """

print(int(0.5))   # prints 0
print(int(1.5))   # prints 1
print(int(1.45))  # prints 1
print(int(1.51))  # prints 1
print(int(-1.5))  # prints -1

print(round(0.5))   # prints 0
print(round(1.5))   # prints 2
print(round(1.45))  # prints 1
print(round(1.51))  # prints 2
print(round(-1.5))  # prints -2

print(type(round(0.5)))  # prints <class 'int'>

```

The build in `round()` does not allow to specify the type of rounding in use [[python round( ) 2024]](https://docs.python.org/3/library/functions.html#round). In Python 3 the `round()` function uses "bankers' rounding" (rounds to the nearest even number in case of ties). This is different to Python 2 which always rounds away from zero. Rounding provided by the `decimal` module allows a choice between 8 rounding modes [[python decimal 2024]](https://docs.python.org/3/library/decimal.html#rounding-modes). Rounding in mathematics and science is not discussed here as it requires a deeper knowledge of computer floating-point arithmetic's.

## Non-Compliant Code Example (float to int)

In `noncompliant01.py` there is no conscious choice of rounding mode.

[*noncompliant01.py:*](noncompliant01.py)

```py
""" Non-compliant Code Example """

print(int(0.5))    # prints 0
print(int(1.5))    # prints 1
print(round(0.5))  # prints 0
print(round(1.5))  # prints 2
```

## Compliant Solution (float to int)

Using the `Decimal` class from the `decimal` module allows more control over rounding by choosing one of the `8` rounding modes [[python decimal 2024]](https://docs.python.org/3/library/decimal.html#rounding-modes).

[*compliant01.py:*](compliant01.py)

```py
""" Compliant Code Example """
from decimal import Decimal, ROUND_HALF_UP, ROUND_HALF_DOWN
 
print(Decimal("0.5").quantize(Decimal("1"), rounding=ROUND_HALF_UP))  # prints 1
print(Decimal("1.5").quantize(Decimal("1"), rounding=ROUND_HALF_UP))  # prints 2
print(Decimal("0.5").quantize(Decimal("1"), rounding=ROUND_HALF_DOWN))  # prints 0
print(Decimal("1.5").quantize(Decimal("1"), rounding=ROUND_HALF_DOWN))  # prints 1
```

The `.quantize(Decimal("1")`, determines the precision to be `integer` and `rounding=ROUND_HALF_UP` determines the type of rounding applied. Specifying numbers as strings avoids issues such as floating-point representations in binary.

That `Decimal` can have unexpected results when operated without `Decimal.quantize()` on floating point numbers is demonstrated in `example02.py`.

[*example02.py:*](example02.py)

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """
from decimal import ROUND_HALF_UP, Decimal

print(Decimal("0.10")) # prints 0.10
print(Decimal(0.10))   # prints 0.1000000000000000055511151231257827021181583404541015625
print(Decimal("0.10").quantize(Decimal("0.10"), rounding=ROUND_HALF_UP)) # prints 0.10
print(Decimal(0.10).quantize(Decimal("0.10"), rounding=ROUND_HALF_UP)) # prints 0.10
```

Initializing `Decimal` with an actual `float`, such as `0.10`, and without rounding creates an imprecise number `0.1000000000000000055511151231257827021181583404541015625` in `Python 3.9.2`.

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-682, Incorrect Conversion between Numeric Types (mitre.org)](http://cwe.mitre.org/data/definitions/682.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Class [CWE-197, Numeric Truncation Error](https://cwe.mitre.org/data/definitions/197.html)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[INT31-C. Ensure that integer conversions do not result in lost or misinterpreted data](https://wiki.sei.cmu.edu/confluence/display/c/INT31-C.+Ensure+that+integer+conversions+do+not+result+in+lost+or+misinterpreted+data)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[FLP34-C. Ensure that floating-point conversions are within range of the new type](https://wiki.sei.cmu.edu/confluence/display/c/FLP34-C.+Ensure+that+floating-point+conversions+are+within+range+of+the+new+type)|
|[ISO/IEC TR 24772:2019](https://www.iso.org/standard/71091.html)|Programming languages — Guidance to avoiding vulnerabilities in programming languages, available from [https://www.iso.org/standard/71091.html](https://www.iso.org/standard/71091.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM12-J. Ensure conversions of numeric types to narrower types do not result in lost or misinterpreted data](https://wiki.sei.cmu.edu/confluence/display/java/NUM12-J.+Ensure+conversions+of+numeric+types+to+narrower+types+do+not+result+in+lost+or+misinterpreted+data)|

## Biblography

|||
|:---|:---|
|[python round( ) 2024](https://docs.python.org/3/library/functions.html#round)|python round( ), available from: [https://docs.python.org/3/library/functions.html#round](https://docs.python.org/3/library/functions.html#round), [Last  accessed June 2024] |
|[python decimal 2024](https://docs.python.org/3/library/decimal.html#rounding-modes)|Python decimal module, available from: [https://docs.python.org/3/library/decimal.html#rounding-modes](https://docs.python.org/3/library/decimal.html#rounding-modes)|