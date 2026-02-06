# pyscg-0003: Use Arithmetic Over Bitwise Operations

Avoid mixing bitwise shifts with arithmetic operations, instead, use clear mathematical expressions instead to maintain predictable behavior, readability, and compatibility

Ensure to know what bit-wise shift operators do in case you can not avoid them as recommended in NUM01-J. Do not perform bitwise and arithmetic operations on the same data [[SEI CERT JAVA 2024](https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data)] and use math instead.

There are two `C` and `C++` design patterns for resource optimisation that are no longer promoted:

* Bit-wise operations for divisions or multiplication shifting the whole content of a variable to left or right for increased speed.
* Flag registers, or Boolean's stored in a single bit of an int or byte  for space reduction.

The use of bit-wise operations for arithmetic or flag registers can reduce readability, predictability of the code and can also cause compatibility issues. Some bit-wise operations can reduce performance. Python tries to safeguard changes between positive and negative numbers by storing the sign separately. It tries to prevent overflows by using either `32-bit unsigned integer` arrays with `30-bit` digits or `16-bit` unsigned integer arrays with `15-bit` digit [[Rusher 2017]](https://rushter.com/blog/python-integer-implementation/). In other words, Python changes and adapts on the fly.

A need to use bit-wise operations in Python can be due to translations or dealings with `C`, `C++` or `Java`, system libraries, raw binary data, or cryptographic algorithms. Existing Python modules hooking into system `C` libraries for cryptographic functions or math all to avoid the need to implement bit-shifting on a Python level. Bit-shifting can have unexpected outcomes. Python's ctypes module allows integration of `C` based system libraries into Python and direct access to C-backed numbers that can have different behavior than using high-level Python. Understanding `ctypes` or `C` requires understanding the *CERT C Coding Standard* [[SEI CERT C 2025]](https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard) and setting boundaries manually in Python.

The `example01.py` code demonstrates bit-wise operators available in Python.

*[example01.py](example01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""
foo = 50
bar = 42
print(f"foo = {foo} = {foo:08b}") # :08b is just for pretty print
print(f"foo = {bar} = {bar:08b}\n")

# bit wise operations in Python:
print(f"foo << 2 = {(foo << 2):08b}")   # binary shift left
print(f"foo >> 2 = {(foo >> 2):08b}")   # binary shift right
print(f"~foo     = {(~foo):08b}")       # flipping bits
print(f"foo & bar  = {(foo & bar):08b}")    # binary AND
print(f"foo | bar  = {(foo | bar):08b}")    # binary OR
print(f"foo ^ bar  = {(foo ^ bar):08b}")    # binary XOR
```

Output from above example01.py:

```bash
foo = 50 = 00110010
foo = 42 = 00101010

foo << 2 = 11001000
foo >> 2 = 00001100
~foo     = -0110011
foo & bar  = 00100010
foo | bar  = 00111010
foo ^ bar  = 00011000
```

The `example02.py` code demonstrates how Python 2 changes an `int` to `long` to prevent an overflow condition while Python 3 is always storing an `int` as `long` [[Python 3.10.5 2022]](https://rushter.com/blog/python-integer-implementation/).

*[example02.py](example02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""
for shift in [16, 32, 64]:
    bar = 5225 << shift
    print("foo << " + str(shift) + ": type " + str(type(bar)) + " " + str(bin(bar)))
```

Left shift in `example02.py` changes type to `long` class in Python 2:

```bash
foo << 16: type <type 'int'> 0b10100011010010000000000000000
foo << 32: type <type 'int'> 0b101000110100100000000000000000000000000000000
foo << 64: type <type 'long'> 0b10100011010010000000000000000000000000000000000000000000000000000000000000000
```

Left shift in `example02.py` stays type `int` class but stores as `long` Python 3:

```bash
foo << 16: type <class 'int'> 0b10100011010010000000000000000
foo << 32: type <class 'int'> 0b101000110100100000000000000000000000000000000
foo << 64: type <class 'int'> 0b10100011010010000000000000000000000000000000000000000000000000000000000000000
```

## Bit-shifting Positive vs Negative Numbers

Python tries to avoid issues around signed numbers by storing the sign in a separate data field. Bit-shifting a whole negative number will always remain negative in Python. Positive whole numbers will remain positive in Python or zero. Shifting a positive whole number to the right will never go below zero and shifting a negative number to the left will never go above minus one. Shifting to the left behaves differently between positive and negative numbers.

The `example03.py` code demonstrates how positive and negative numbers are stored in Python.

[*example03.py:*](example03.py)

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""

positive_int: int = 1
print(f"+{positive_int} = ", end="")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))

negative_int: int = -1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))
```

**Output of example03.py:**

```bash
+1 = b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01'
-1 = b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff'
```

Code `example03.py` shows that a `-1` is stored as hexadecimal `\xff` or binary `11111111`s. Storing a decimal `-2` ends with Hex `xFE` or binary `1110`. Storing decimal `+1` ends as binary `0001`. Knowing this allows understanding of some of the side effects.

A right shift `>>=` on a positive number fills zeros from the left and a negative number would fill one's. A continuation of right shifts will reach a point where there is no more change in both cases.

This behaves differently for a left shift `<<=` operation. As a positive number can reach zero it can remain at zero. A negative whole number can never reach zero and is therefore bound to stay at `-1`.

The `example04.py` code illustrates the different behavior of positive and negative whole numbers during shifting.

[*example04.py:*](example04.py)

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""

print("\nstay positive")
positive_int: int = 1
print(f"+{positive_int} = ", end="")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))

positive_int >>= 1
positive_int >>= 1
print(f"+{positive_int} = ", end="")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))

positive_int <<= 1
positive_int <<= 1
positive_int <<= 1000000000
print(f"+{positive_int} = ", end="")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))


print("\nstaying negative")
negative_int: int = -1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))

negative_int >>= 1
negative_int >>= 1
negative_int >>= 1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))

negative_int <<= 1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))

negative_int <<= 1
print(f"{negative_int} = ", end="")
print(negative_int.to_bytes(negative_int.__sizeof__(), byteorder="big", signed=True))

```

**Output of example04.py:**

```bash
stay positive
+1 = b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01'
+0 = b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
+0 = b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'

staying negative
-1 = b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff'
-1 = b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff'
-2 = b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xfe'
-4 = b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xfc'
```

A continuation of shifting a positive whole number to the right and back to the left can remain at zero. This is not true for a negative whole number as they can only reach `-1` and never zero. Moving a negative number back and forth can continue to change.

## Overflow Protection

Continuously shifting a Python `int` class variable will change the storage size while keeping the variable type as class int as demonstrated in the following code `example05.py`:

[*example05.py:*](example05.py)

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""example code"""

positive_int: int = 1
print(f"Before: {type(positive_int)}")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))
print("\nShifting 1000x\n")
positive_int <<= 1000
print(f"After: {type(positive_int)}")
print(positive_int.to_bytes(positive_int.__sizeof__(), byteorder="big", signed=True))
```

**Output of example05.py:**

```bash
Before: <class 'int'>
b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01'

Shifting 1000x

After: <class 'int'>
b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
```

Code `example05.py` demonstrates how Python is changing required storage in the background while keeping the class of type `int`. While this does prevent overflow in Python it can have some unexpected issues interacting with other languages. A mistake in a loop can cause Python to just continue to eat up memory while finding a natural ending in other languages.

## Non-compliant Code Example (Left Shift)

Multiplication by `4` can be archived by a `2x` left. The `noncompliant01.py` code demonstrates an attempt to calculate `8 * 4 + 10` in one line.

*[noncompliant01.py](noncompliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

print(8 << 2 + 10)
```

The `noncompliant01.py` code results in printing `32768` instead of `42`. Adding brackets `print((8 << 2) + 10)` would fix this specific issue whilst still remaining prune to other issues.

## Compliant Solution (Left Shift)

The statement in `compliant01.py` clarifies the programmer's intention.

*[compliant01.py](compliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

print(8 * 4 + 10)
```

It is recommended by *[pyscg-0002: Guard C-Backed Numbers Against Overflow](../pyscg-0002/README.md)* to also check for under or overflow.

## Non-compliant Code Example (Right Shift)

The `noncompliant02.py` code example is using an arithmetic right shift `>>=` operator in an attempt to optimize performance for dividing `x`  by `4` without floating point.

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

The expectation of the `>>= 2` right shift operator is that it fills the leftmost bits of `0011 0010` with two zeros resulting in `0000 1100` or decimal twelve. Instead a potentially expected `-12` in `foo` we have internal processing truncating the values from `-12.5` to `-13`.

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

## Biblography

|||
|:---|:---|
|\[Rusher 2017]|Python internals: Arbitrary-precision integer implementation \[online]. Available from: <https://rushter.com/blog/python-integer-implementation/> \[accessed 8 May 2024]|
|\[Python 3.9 2022\]|Build-in Types \[online]. Available from: <https://docs.python.org/3.9/library/stdtypes.html> \[accessed 8 May 2024]|
|\[SEI CERT JAVA 2024\]|NUM01-J. Do not perform bitwise and arithmetic operations on the same data \[online]. Available from: <https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data> \[Accessed 6 May 2025]|
|\[SEI CERT C 2025\]|CERT C Coding Standard \[online]. Available from: <https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard> \[Accessed 6 May 2025]|
