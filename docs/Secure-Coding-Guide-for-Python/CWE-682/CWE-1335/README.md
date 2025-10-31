# CWE-1335: Incorrect Bitwise Shift of Integer

Avoid mixing bitwise shifts with arithmetic operations, instead, use clear mathematical expressions instead to maintain predictable behavior, readability, and compatibility.

Ensure to know what bit-wise shift operators do in case you can not avoid them as recommended in *NUM01-J. Do not perform bitwise and arithmetic operations on the same data* [[SEI CERT JAVA 2024]](https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data) and use math instead.

A need to use bit-wise operations in Python can be due to translations or dealings with `C`, `C++` or `Java`, system libraries, raw binary data, or cryptographic algorithms.  Existing Python modules hooking into system `C` libraries for cryptographic functions or math all to avoid the need to implement bit-shifting on a Python level. Bit-shifting can have unexpected outcomes. Python's ctypes  module allows integration of `C` based system libraries into Python and direct access to C-type variables that can have different behavior than using high-level Python.

For the sake of simplicity, we only want to look at whole numbers and only understand the output of provided code examples illustrating Python's behavior.

## Bit-shifting Positive vs Negative Numbers

Python tries to avoid issues around signed numbers by storing the sign in a separate data field. Bit-shifting a whole negative number will always remain negative in Python. Positive whole numbers will remain positive in Python or zero. Shifting a positive whole number to the right will never go below zero and shifting a negative number to the left will never go above minus one. Shifting to the left behaves differently between positive and negative numbers.

[*example01.py:*](example01.py)

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

**Output of example01.py:**

```bash
+1 = b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01'
-1 = b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff'
```

Code `example01.py` shows that a `-1` is stored as hexadecimal `\xff`  or binary `11111111`s. Storing a decimal `-2`  ends with Hex `xFE` or binary `1110`. Storing decimal `+1` ends as binary `0001`. Knowing this allows understanding of some of the side effects.

A right shift `>>=`  on a positive number fills zeros from the left and a negative number would fill one's. A continuation of right shifts will reach a point where there is no more change in both cases.

This behaves differently for a left shift `<<=`  operation. As a positive number can reach zero it can remain at zero. A negative whole number can never reach zero and is therefore bound to stay at `-1`.

[*example02.py:*](example02.py)

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

**Output of example02.py:**

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

Code `example02.py` illustrates the different behavior of positive and negative whole number's during shifting. A continuation of shifting a positive whole number to the right and back to the left can remain at zero. This is not true for a negative whole number as they can only reach `-1`  and never zero. Moving a negative number back and forth can continue to change.

## Overflow Protection

Continuously shifting a Python `int`class variable will change the storage size while keeping the variable type as class int as demonstrated in the following code `example03.py`:

[*example03.py:*](example03.py)

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

**Output of example03.py:**

```bash
Before: <class 'int'>
b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01'

Shifting 1000x

After: <class 'int'>
b'\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00'
```

Code `example03.py` demonstrates how Python is changing required storage in the background while keeping the class of type `int`. While this does prevent overflow in Python it can have some unexpected issues interacting with other languages. A mistake in a loop can cause Python to just continue to eat up memory while finding a natural ending in other languages.

## Non-Compliant Code Example

Method `shift_right` in `noncompliant01.py` can reach zero for positive numbers but loops forever on negative inputs.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example."""
from time import sleep


def shift_right(value: int) -> int:
    while (value != 0):
        print(f"{value}", flush=True)
        value >>= 1
        sleep(1)
    return value


value = shift_right(10)
print("Returned", value)
shift_right(-10)
print("Will never reach here")
```

## Compliant Solution

Bit-shifting is an optimization pattern that works better for languages closer to the CPU than Python. Math in Python is better done by arithmetical functions in Python as stated by *CWE-1335: Promote readability and compatibility by using mathematical written code with arithmetic operations instead of bit-wise operations* [[OpenSSF Secure Coding in Python 2025]](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/CWE-682/CWE-1335/01/README.md).
Understanding `ctypes` or `C` requires understanding the *CERT C Coding Standard* [[SEI CERT C 2025]](https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard)and setting boundaries manually in Python.

## Automated Detection

Not available

## Related Guidelines

<table>
<tr>
<td>
<a href="https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python">[OpenSSF Secure Coding in Python 2025]</a>
</td>
<td>
<a href="https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/CWE-682/CWE-1335/01/README.md">CWE-1335: Promote readability and compatibility by using mathematical written code with arithmetic operations instead of bit-wise operations</a>
</td>
</tr>
<tr>
<tr>
<td>
<a href="http://cwe.mitre.org/">MITRE CWE</a>
</td>
<td>
Pillar: <a href="https://cwe.mitre.org/data/definitions/682.html"> [CWE-682: Incorrect Calculation]</a>
</td>
</tr>
<tr>
<td>
<a href="http://cwe.mitre.org/">MITRE CWE</a>
</td>
<td>
Base: <a href="https://cwe.mitre.org/data/definitions/1335.html">[CWE-1335: Incorrect Bitwise Shift of Integer (4.12)]</a>
</td>
</tr>
<tr>
<td>
<a href="https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java">[SEI CERT Oracle Coding Standard for Java]</a>
</td>
<td>
<a href="https://wiki.sei.cmu.edu/confluence/display/java/NUM14-J.+Use+shift+operators+correctly">[NUM14-J. Use shift operators correctly]</a>
</td>
</tr>
<tr>
<td>
<a href="https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard">[CERT C Coding Standard]</a>
</td>
<td>
<a href="https://wiki.sei.cmu.edu/confluence/display/c/INT34-C.+Do+not+shift+an+expression+by+a+negative+number+of+bits+or+by+greater+than+or+equal+to+the+number+of+bits+that+exist+in+the+operand">[INT34-C. Do not shift an expression by a negative number of bits or by greater than or equal to the number of
bits that exist in the operand]</a>
</td>
</tr>
</table>

## Bibliography

<table>
<tr>
<td>
[SEI CERT JAVA 2024]
</td>
<td>
NUM01-J. Do not perform bitwise and arithmetic operations on the same data [online]. Available from: <a href="https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data">https://wiki.sei.cmu.edu/confluence/display/java/NUM01-J.+Do+not+perform+bitwise+and+arithmetic+operations+on+the+same+data</a>,  [Accessed 6 May 2025]
</td>
</tr>
<tr>
<td>
[SEI CERT C 2025]
</td>
<td>
CERT C Coding Standard [online]. Available from: <a href=https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard>https://www.securecoding.cert.org/confluence/display/seccode/CERT+C+Coding+Standard</a> [Accessed 6 May 2025]
</td>
</tr>
<table>
