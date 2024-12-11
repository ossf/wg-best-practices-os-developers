# CWE-1339: Insufficient Precision or Accuracy of a Real Number

Avoid floating-point and use integers or the `decimal` module to ensure precision in applications that require high accuracy, such as in financial or banking computations.

In Python, floating-point types are constrained by a fixed number of binary mantissa bits, typically allowing for around seven decimal digits of precision (24-bit values). Consequently, they are not well-suited for representing surds, such as `√7` or `π` with full accuracy. Additionally, due to their binary nature, floating-point types are incapable of exactly terminating decimals in `base 10`, such as `0.3`, which has a repeating binary representation.

To ensure precision in applications requiring high accuracy, such as in financial or banking computations, it is recommended to avoid using floating-point types. Instead, integers or more precise data types like the `Decimal` class should be employed.

## Non-compliant Code Example

This `noncompliant01.py` demonstrates the use of floating-point arithmetic to simulate purchasing items and subsequent

*[noncompliant01.py](noncompliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
BALANCE = 3.00
ITEM_COST = 0.33
ITEM_COUNT = 5
print(
    f"{str(ITEM_COUNT)} items bought, ${ITEM_COST} each. "
    f"Current account balance: "
    f"${str(BALANCE - ITEM_COUNT * ITEM_COST)}"
)
```

Because the value of `ITEM_COST` (0.33) cannot be precisely represented in Python due to its nature as a terminating decimal in base 10, the resulting output was as follows:
The unprecise `base 10` representation during the multiplication of `5` with `0.33`  results in an `account balance`  of  `$1.34999999999999993` in the `noncompliant01.py` code.

**Example noncompliant01.py output:**
```text
5 items bought, $0.33 each. Current account balance: $1.34999999999999993
```

## Compliant Solution (Integer)

This compliant solution adheres more to standards by representing the account balance and item cost as `integers` in cents instead of using dollars. This approach eliminates the imprecision associated with floating-point numbers:

*[compliant01.py](compliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
BALANCE = 300
ITEM_COST = 33
ITEM_COUNT = 5
 
print(
    f"{str(ITEM_COUNT)} items bought, ${ITEM_COST / 100} each. "
    f"Current account balance: "
    f"${str((BALANCE - ITEM_COUNT * ITEM_COST) / 100)}"
)
```

This code produces the following output accurately:

```text
5 items bought, $0.33 each. Current account balance: $1.35
```

## Compliant Solution (Decimal)

This compliant solution adheres to standards by utilizing the imported `Decimal` type, which allows for precise representation of decimal values. It's important to note that, on most platforms, calculations using `Decimal` tend to be less efficient compared to those using basic data types.

*[compliant02.py](compliant02.py):*

```py

# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from decimal import Decimal
BALANCE = Decimal("3.00")
ITEM_COST = Decimal("0.33")
ITEM_COUNT = 5
 
print(
    f"{str(ITEM_COUNT)} items bought, ${ITEM_COST} each. "
    f"Current account balance: "
    F"${str(BALANCE - ITEM_COUNT * ITEM_COST)}"
)
```

**Example `compliant02.py` output:**

```text
5 items bought, $0.33 each. Current account balance: $1.35
```

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|[Pylint](https://pylint.pycqa.org/)|2023.10.1|Not Available|Not detected|

## Related Guidelines

|||
|:---|:---|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java?src=breadcrumbs)|[NUM04-J. Do not use floating-point numbers if precise computation is required](https://wiki.sei.cmu.edu/confluence/display/java/NUM04-J.+Do+not+use+floating-point+numbers+if+precise+computation+is+required)|
|[The CERT C Secure Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|FLP02-C. Avoid using floating-point numbers when precise computation is needed, available from: [https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=87152394](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=87152394), [Accessed Dec 2024]|
|[ISO/IEC TR 24772:2010](https://www.iso.org/standard/61457.html)| Floating-Point Arithmetic [PLF]|
|[MITRE CWE Pillar]| [CWE-682: Incorrect Calculation](https://cwe.mitre.org/data/definitions/682.html)|
|[MITRE CWE Base]|[CWE - CWE-1339: Insufficient Precision or Accuracy of a Real Number](https://cwe.mitre.org/data/definitions/1339.html)|

## Bibliography

|||
|:---|:---|
|[Bloch 2008]|Item 48, "Avoid `float` and `double` If Exact Answers Are Required"|
|[Bloch 2005]|Puzzle 2, "Time for a Change"|
|[IEEE 754]||
