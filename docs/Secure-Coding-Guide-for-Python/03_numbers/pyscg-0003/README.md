# pyscg-0003: Use Arithmetic Over Bitwise Operations

Avoid mixing bitwise shifts with arithmetic operations, instead, use clear mathematical expressions instead to maintain predictable behavior, readability, and compatibility.

Ensure to know what bit-wise shift operators do in case you can not avoid them as recommended in NUM01-J. Do not perform bitwise and arithmetic operations on the same data [[SEI CERT JAVA 2024](https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data)] and use math instead.

There are two `C` and `C++` design patterns for resource optimisation that are no longer promoted:

* Bit-wise operations for divisions or multiplication shifting the whole content of a variable to left or right for increased speed.
* Flag registers, or Boolean's stored in a single bit of an int or byte  for space reduction.

The use of bit-wise operations for arithmetic or flag registers can reduce readability, predictability of the code and can also cause compatibility issues. Some bit-wise operations can reduce performance. Python tries to safeguard changes between positive and negative numbers by storing the sign separately. It tries to prevent overflows by using either `32-bit unsigned integer` arrays with `30-bit` digits or `16-bit` unsigned integer arrays with `15-bit` digit [[Rusher 2017]](https://rushter.com/blog/python-integer-implementation/). In other words, Python changes and adapts on the fly.

A need to use bit-wise operations in Python can be due to translations or dealings with `C`, `C++` or `Java`, system libraries, raw binary data, or cryptographic algorithms. Existing Python modules hooking into system `C` libraries for cryptographic functions or math all to avoid the need to implement bit-shifting on a Python level. Bit-shifting can have unexpected outcomes. Python's ctypes module allows integration of `C` based system libraries into Python and direct access to Fixed-Width numbers that can have different behavior than using high-level Python. Understanding `ctypes` or `C` requires understanding the *CERT C Coding Standard* [[SEI CERT C 2025]](https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard) and setting boundaries manually in Python.

## Why This Matters

* **Precedence traps:** `+`/`-` bind tighter than `<<`/`>>`, so `1 << n + 1` means `1 << (n + 1)`. Use parentheses when shifts appear in compound expressions.
* **Sign-extension surprise:** Right shift on negative values is arithmetic (sign-extending), not logical. People expecting zero-fill get caught out.
* **Unbounded growth:** Python `int` doesn't overflow, so `1 << n` in a loop can explode memory/performance.
* **Boundary code:** When working with fixed-width integers (`ctypes`, NumPy dtypes, packed binary formats), C/ABI-like fixed-width semantics apply—handle width, signedness, and wraparound explicitly.

## When Bitwise Is Appropriate

Bitwise operations are fine when data is actually a bit collection: flags/masks, serialization, binary protocols, cryptographic primitives. Keep such code localized, document the assumed bit width, and prefer helper functions for packing/unpacking.

## Non-compliant Code Example (Left Shift)

Multiplication by `4` can be archived by a `2x` left shift. The `noncompliant01.py` code demonstrates an attempt to calculate `8 * 4 + 10` in one line.

*[noncompliant01.py](noncompliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

print(8 << 2 + 10)
```

The `noncompliant01.py` code results in printing `32768` instead of `42`. Adding brackets `print((8 << 2) + 10)` would fix this specific issue whilst still remaining prone to other issues.

## Compliant Solution (Left Shift)

The statement in `compliant01.py` clarifies the programmer's intention.

*[compliant01.py](compliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

print(8 * 4 + 10)
```

It is recommended by *[pyscg-0002: Guard Fixed-Width Numbers Against Overflow](../pyscg-0002/README.md)* to also check for under or overflow.

## Non-compliant Code Example (Right Shift)

The `noncompliant02.py` code example is using an arithmetic right shift `>>=` operator in an attempt to optimize performance for dividing `x` by `4` without floating point.

*[noncompliant02.py](noncompliant02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

foo: int
foo = -50
foo >>= 2
print(foo)
```

This prints `-13` instead of the expected `-12`. Python's right shift on negative values is arithmetic (sign-extending) and truncates toward negative infinity, not toward zero as integer division would in many other languages.

## Compliant Solution (Right Shift)

The right shift is replaced by division in `compliant02.py`.

*[compliant02.py](compliant02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

foo: int = -50
bar: float = foo / 4
print(bar)

```

## Automated Detection

Not available

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE-1335: Incorrect Bitwise Shift of Integer (4.12)](https://cwe.mitre.org/data/definitions/1335.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM00-J. Detect or prevent integer overflow](https://wiki.sei.cmu.edu/confluence/display/java/NUM00-J.+Detect+or+prevent+integer+overflow)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM01-J. Do not perform bitwise and arithmetic operations on the same data](https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM14-J. Use shift operators correctly](https://wiki.sei.cmu.edu/confluence/display/java/NUM14-J.+Use+shift+operators+correctly)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[INT32-C. Ensure that operations on signed integers do not result in overflow](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[INT34-C. Do not shift an expression by a negative number of bits or by greater than or equal to the number of bits that exist in the operand](https://wiki.sei.cmu.edu/confluence/display/c/INT34-C.+Do+not+shift+an+expression+by+a+negative+number+of+bits+or+by+greater+than+or+equal+to+the+number+of+bits+that+exist+in+the+operand)|
|[ISO/IEC TR 24772:2010](http://www.aitcnet.org/isai/)|Wrap-around Error \[XYY]|

## Bibliography

|||
|:---|:---|
|\[Rusher 2017]|Python internals: Arbitrary-precision integer implementation \[online]. Available from: <https://rushter.com/blog/python-integer-implementation/> \[accessed 8 May 2024]|
|\[SEI CERT JAVA 2024\]|NUM01-J. Do not perform bitwise and arithmetic operations on the same data \[online]. Available from: <https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data> \[Accessed 6 May 2025]|
|\[SEI CERT C 2025\]|CERT C Coding Standard \[online]. Available from: <https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard> \[Accessed 6 May 2025]|
