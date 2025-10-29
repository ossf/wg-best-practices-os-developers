# CWE-617: Reachable Assertion

Assertions are a useful developer tool, but they cannot be relied upon to be present in a production environment. Incorrect function arguments should be handled by an appropriate exception.

Python removes assertions when a script is run with the `-O`  and `-OO` options [[Python 3.9 Documentation](https://docs.python.org/3.9/using/cmdline.html?highlight=pythonoptimize#cmdoption-o)]. The `-O` options is for optimisation. It removes asserts statements from bytecode, removes docstrings from functions/classes and sets `__debug__` to False. It is used for slightly faster execution and smaller bytecode files. `-OO` does everything that `-O`does but it additionally removes module-level docstrings and creates an even more compact bytecode.

## Non-Compliant Code Example

The non-compliant code example is checking for invalid arguments by using assertions. In this example, any positive integer between `1-709` inclusive is valid, and any other argument is invalid.

If the script is run normally, the assertions will catch the invalid arguments. If the script is run in optimized mode, assertions are removed from the bytecode and the function will not work as intended. To simplify the exploit code, the specific exception raised by the argument is caught.

[*noncompliant01.py:*](noncompliant01.py)

```py
""" Non-compliant Code Example """
import math


def my_exp(x):
    assert x in range(
        1, 710
    ), f"Argument {x} is not valid"  # range(1, 709) produces 1-708
    return math.exp(x)


#####################
# exploiting above code example
#####################

try:
    print(my_exp(1))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(709))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(710))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(0))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp("b"))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

```

 __Output of noncompliant01.py:__

```bash
$ python3.9 noncompliant01.py
2.718281828459045
8.218407461554972e+307
Argument 710 is not valid
Argument 0 is not valid
Argument b is not valid
$ python3.9 -O noncompliant01.py
2.718281828459045
8.218407461554972e+307
math range error
1.0
must be real number, not str
```

## Compliant Solution

The `my_exp()` function raises a `ValueError` exception if an invalid argument is supplied. This works if the script is run in an optimized mode or not.

[*compliant01.py:*](compliant01.py)

```py
""" Compliant Code Example """
import math


def my_exp(x):
    if x not in range(1, 710):  # range(1, 709) produces 1-708
        raise ValueError(f"Argument {x} is not valid")
    return math.exp(x)


#####################
# exploiting above code example
#####################

try:
    print(my_exp(1))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(709))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(710))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp(0))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)

try:
    print(my_exp("b"))
except (AssertionError, OverflowError, TypeError, ValueError) as e:
    print(e)
 
```

 __Output of compliant01.py:__

```bash
$ python3.9 compliant01.py
2.718281828459045
8.218407461554972e+307
Argument 710 is not valid
Argument 0 is not valid
Argument b is not valid
$ python3.9 -O compliant01.py
2.718281828459045
8.218407461554972e+307
Argument 710 is not valid
Argument 0 is not valid
Argument b is not valid
```

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.6.2|B101:assert_used|Use of assert detected. The enclosed code will be removed when compiling to optimised byte code.|

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar<br>[CWE-691: Insufficient Control Flow Management (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/691.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base:<br>[CWE-617, Reachable Assertion](https://cwe.mitre.org/data/definitions/617.html)|

## Bibliography

|||
|:---|:---|
|[[Python 3.9 Documentation](https://docs.python.org/3.9/)]|Python Software Foundation. (2024). Command line and environment - cmdoption -o [online].<br>Available from: [https://docs.python.org/3.9/using/cmdline.html?highlight=pythonoptimize#cmdoption-o](https://docs.python.org/3.9/using/cmdline.html?highlight=pythonoptimize#cmdoption-o)<br>[accessed 10 October 2024].|
