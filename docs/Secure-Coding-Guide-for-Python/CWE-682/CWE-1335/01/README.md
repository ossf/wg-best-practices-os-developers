# CWE-1335: Promote readability and compatibility by using mathematical written code with arithmetic operations instead of bit-wise operations

`C` and `C++` used to have two design patterns in order to optimize resource utilization:

* Bit-wise operations for divisions or multiplication shifting the whole content of a variable to left or right for increased speed.
* Flag registers, or Boolean's stored in a single bit of an int or byte  for space reduction.

`C` and `C++` no longer promote these design patterns. The use of bit-wise operations for arithmetic or flag registers can reduce readability, predictability of the code and can also cause compatibility issues. Some bit-wise operations can reduce performance. Python tries to safeguard changes between positive and negative numbers by storing the sign separately. It tries to prevent overflows by using either `32-bit unsigned integer` arrays with `30-bit` digits or `16-bit` unsigned integer arrays with `15-bit` digit [[Rusher 2017]](https://rushter.com/blog/python-integer-implementation/). In other words, Python changes and adapts on the fly.

The `example01.py` code demonstrates bit-wise operators available in Python.

*[example01.py](example01.py):*

```py
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

The `example02.py` code demonstrates how Python 2 changes an int to long to prevent an overflow condition while Python 3 is always storing an `int` as `long` [[Python 3.10.5 2022]](https://rushter.com/blog/python-integer-implementation/).

*[example02.py](example02.py):*

```py
for shift in [16, 32, 64]:
    bar = 5225 << shift
    print("foo << " + str(shift) + ": type " + str(type(bar)) + " " + str(bin(bar)))
```

Left shift in `example02.py` changes type to long class in Python 2:

```bash
foo << 16: type <type 'int'> 0b10100011010010000000000000000
foo << 32: type <type 'int'> 0b101000110100100000000000000000000000000000000
foo << 64: type <type 'long'> 0b10100011010010000000000000000000000000000000000000000000000000000000000000000
```

Left shift in `example02.py` stays type int class but stores as long Python 3:

```bash
foo << 16: type <class 'int'> 0b10100011010010000000000000000
foo << 32: type <class 'int'> 0b101000110100100000000000000000000000000000000
foo << 64: type <class 'int'> 0b10100011010010000000000000000000000000000000000000000000000000000000000000000
```

## Non-compliant Code Example (Left Shift)

Multiplication by `4` can be archived by a `2x` left. The `noncompliant01.py` code demonstrates an attempt to calculate `8 * 4 + 10` in one line.

*[noncompliant01.py](noncompliant01.py):*

```py
""" Non-compliant Code Example """

print(8 << 2 + 10)
```

The `noncompliaint01.py` code results in printing `32768` instead of `42`. Adding brackets `print((8 << 2) + 10)` would fix this specific issue whilst still remaining prune to other issues.

## Compliant Solution (Left Shift)

The statement in `compliant01.py` clarifies the programmer's intention.

*[compliant01.py](compliant01.py):*

```py
""" Compliant Code Example """

print(8 * 4 + 10)
```

It is recommended by *[CWE-191, Integer Underflow (Wrap or Wraparound)](../CWE-191/README.md)* to also check for under or overflow.

## Non-compliant Code Example (Right Shift)

In this non-compliant code example is using an arithmetic right shift >>= operator in an attempt to optimize performance for dividing x  by 4 without floating point.

*[noncompliant02.py](noncompliant02.py):*

```py
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
""" Compliant Code Example """

foo: int
foo = -50
foo /= 4
print(foo)
```

## Automated Detection

unknown

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE-1335: Incorrect Bitwise Shift of Integer (4.12)](https://cwe.mitre.org/data/definitions/1335.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM00-J. Detect or prevent integer overflow](https://wiki.sei.cmu.edu/confluence/display/java/NUM00-J.+Detect+or+prevent+integer+overflow)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[INT32-C. Ensure that operations on signed integers do not result in overflow](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)|
|[ISO/IEC TR 24772:2010](http://www.aitcnet.org/isai/)|Wrap-around Error \[XYY]|

## Biblography

|||
|:---|:---|
|\[Rusher 2017]|Python internals: Arbitrary-precision integer implementation \[online]. Available from: <https://rushter.com/blog/python-integer-implementation/> \[accessed 8 May 2024]|
|[Python 3.9 2022]|Build-in Types \[online]. Available from: <https://docs.python.org/3.9/library/stdtypes.html> \[accessed 8 May 2024]|
