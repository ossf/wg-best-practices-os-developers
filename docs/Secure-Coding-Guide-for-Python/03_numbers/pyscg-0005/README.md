# pyscg-0005: Specify Rounding for Numeric Conversions

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

The built-in `round()` does not allow to specify the type of rounding in use [[python round() 2026]](https://docs.python.org/3/library/functions.html#round). In Python 3 the `round()` function uses "bankers' rounding" (rounds to the nearest even number in case of ties). This is different to Python 2 which always rounds away from zero. Rounding provided by the `decimal` module allows a choice between 8 rounding modes [[python decimal 2026]](https://docs.python.org/3/library/decimal.html#rounding-modes). Rounding in mathematics and science is not discussed here as it requires a deeper knowledge of computer floating-point arithmetic. By contrast, int() does not round at all, but rather, it truncates the fractional part, always rounding toward zero.

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

## Other Types of Rounding

Natively, Python supports only numeric rounding (apart from the `boolean` type, which, as a subclass of `int`, inherits its rounding implementation from `int` [[python boolean 2026](https://docs.python.org/3/library/stdtypes.html?utm_source=chatgpt.com#boolean-type-bool)]). However, you can theoretically want to "round" non-numeric data types. Here are examples of what "non-numeric rounding" might mean depending on the context:

* Collections and Array
  * Keeping only first N elements
  * Sampling
* Time and Date
  * Rounding timestamps to the nearest second/minute/hour
  * Bucketing events into time period
* Spatial Data
  * Reducing GPS coordinate precision
  * Rounding pixels when rendering graphics
  * Geohashing
* Color
  * Reducing color bit depth (e.g, converting 24-bit RGB to 16-bit)
  * Posterization
  * Anti-aliasing
* Frequency and Probability
  * Rounding probabilities to ensure they sum to 1
  * Frequency bucketing
* Categorical Data
  * Creating broader categories (e.g, categorizing employees by departments rather than job titles)
* Precision and Significant Figures
  * Scientific notation precision
  * Order-of-magnitude approximation
* Bitwise Rounding
  * Bit truncation
  * Floating-point bit manipulation (flush-to-zero modes)
* String and Text
  * Summary generation
  * Ellipsis truncation
  * Word wrapping

One way of implementing rounding in your own class is overriding the `__round__` magic method. The use of the `round` keyword invokes the implementation of `__round__` for the specific object type [[python round() 2026]](https://docs.python.org/3/library/functions.html#round). Your implementation of rounding also *must* be clear in its intended usage.

The following example presents the use of `__round__` to implement string truncation. The docstring explains the contract of the rounding operation, clarifying what output should be expected depending on the value of `ncharacters`:

[*example03.py:*](example03.py)

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """

class TruncateableString:
    """String wrapper that supports ellipsis truncation."""
    def __init__(self, text : str):
        self.text = text

    def __round__(self, ncharacters : int=None):
        """Truncates the string value to the given number of characters.
            If ncharacters is not provided, or if it equal or higher than
            the length of the text, he text won't be truncated.
            Raises ValueError if ncharacters is not a positive value"""
        if not ncharacters:
            return self
        if ncharacters <= 0:
            raise ValueError(f"The minimal number of characters must be greater than 0. Instead provided {ncharacters}")
        if ncharacters >= len(self.text):
            return self
        return TruncateableString(self.text[0:ncharacters] + '...')
   
    def __repr__(self):
        return self.text

my_text = TruncateableString("Particularly long text that you might want to truncate.")

# No truncation as per the docstring
print(round(my_text))
print(round(my_text, 2000))
# Raised exception
try:
    print(round(my_text, -10))
except ValueError as e:
    print(e)
# Truncated example
print(round(my_text, 22))

```

When rounding logic is more nuanced, avoid relying on the `round()` keyword and implement your own rounding methods instead. For example, when rounding timestamps, create a method that allows user to choose:

* Which part of the timestamp they want to round (seconds/minutes/hours)
* How it should be rounded (up, down half-up, half-down, etc.)

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

<table>
    <tr>
        <td>[python round() 2026]</td>
        <td>Python Software Foundation. (2026). Python Built-in Functions - round() [online]. Available from: <a href="https://docs.python.org/3/library/functions.html#round">https://docs.python.org/3/library/functions.html#round</a>, [Last accessed August 2026]</td>
    </tr>
    <tr>
        <td>[python decimal 2026]</td>
        <td>Python Software Foundation. (2026). Python decimal - Decimal fixed-point and floating-point arithmetic, Rounding modes [online]. Available from: <a href="https://docs.python.org/3/library/decimal.html#rounding-modes">https://docs.python.org/3/library/decimal.html#rounding-modes</a>, [Last accessed August 2026]</td>
    </tr>
    <tr>
        <td>[python boolean 2026]</td>
        <td>Python Software Foundation. (2026). Python Boolean Type - bool [online]. Available from: <a href="https://docs.python.org/3/library/stdtypes.html?utm_source=chatgpt.com#boolean-type-bool">https://docs.python.org/3/library/stdtypes.html?utm_source=chatgpt.com#boolean-type-bool</a>, [Last accessed August 2026]</td>
    </tr>
</table>
