# CWE-681: Avoid an uncontrolled loss of precision when passing floating-point literals to a Decimal constructor

When working with decimal numbers in Python, using floating-point literals as input to the `Decimal` constructor can lead to unintended imprecision due to the limitations of `IEEE 754` [Wikipedia 2025](https://en.wikipedia.org/wiki/IEEE_754) floating-point representation; therefore, to ensure accurate decimal representation, it is advisable to avoid using floating-point literals.

## Noncompliant Code Example

In the `noncompliant01.py` code example, a floating-point value is given to the Decimal constructor. The decimal `0.45` cannot be exactly represented by a floating-point literal, and hence the output of the decimal is imprecise. This is because `0.45` as a floating-point representation deals with the number in binary. In binary, many decimal fractions cannot be represented exactly. As a result, `0.45` is stored as an approximate binary fraction in a `float`, and when this approximation is converted to a Decimal, the inexactness is preserved, can result in `0.450000000000000011102230246251565404236316680908203125`.

*[noncompliant01.py](noncompliant01.py):*

```py
"""Non-compliant Code Example"""

from decimal import Decimal

print(Decimal(0.45))
```

## Compliant Solution

In the `compliant01.py` code example, the floating-point value is passed as a string, allowing the value to be directly converted to a `Decimal` object with the exact decimal value. This is because the string representation is interpreted exactly as it appears, maintaining all the specified digits.

*[compliant01.py](compliant01.py):*

```py
"""Compliant Code Example"""

from decimal import Decimal

print(Decimal("0.45"))
```

## Related Guidelines

|||
|:---|:---|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java?src=breadcrumbs)|[NUM10-J. Do not construct BigDecimal objects from floating-point literals](https://wiki.sei.cmu.edu/confluence/display/java/NUM10-J.+Do+not+construct+BigDecimal+objects+from+floating-point+literals)|
|[MITRE CWE Base](http://cwe.mitre.org/)| [CWE-681](https://cwe.mitre.org/data/definitions/681.html)|
|[MITRE CWE Pillar](http://cwe.mitre.org/)|[CWE-664: Improper Control of a Resource Through its Lifetime](https://cwe.mitre.org/data/definitions/664.html)|

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|[Bandit](https://bandit.readthedocs.io/en/latest/)|1.7.4 on python 3.10.4|Not Available||
|[Flake8](https://flake8.pycqa.org/en/latest/)|8-4.0.1 on python 3.10.4|Not Available||

## Biblography

|||
|:---|:---|
|[Wikipedia 2025](https://en.wikipedia.org)|IEEE 754 [online]. Available from: [https://en.wikipedia.org/wiki/IEEE_754](https://en.wikipedia.org/wiki/IEEE_754)|
|[Python docs](https://docs.python.org/3/)|decimal — Decimal fixed-point and floating-point arithmetic [online]. Available from: [https://docs.python.org/3/library/decimal.html](https://docs.python.org/3/library/decimal.html) [accessed 2 February 2025]|
