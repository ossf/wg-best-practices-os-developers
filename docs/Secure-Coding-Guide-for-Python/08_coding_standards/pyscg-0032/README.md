# pyscg-0032: Use Of Same Variable For Multiple Purposes

Avoid reusing names of variables, functions, classes, built-in functions, packages, or standard Python modules

Redefining identifiers from *The Python Standard Library* \[[Python 2025](https://docs.python.org/3/library/index.html)\], any internals `str` and `os` or other parts of the project can result in unexpected behavior and errors. Issues can multiply when identifiers are made global in a project.

## Non-Compliant Code Example (Built-in Function)

The redefined built-in function `len()` in `noncompliant01.py` is incorrectly adding each element to a "sum" instead of calculating the length of an object.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

number_list = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(f"len({number_list}) == {len(number_list)}")


def len(numbers: list[int]) -> int:
    """implementing a custom version of len"""
    result = 0
    for number in numbers:
        result += number
    return result


#####################
# Trying to exploit above code example
#####################

print(f"len({number_list}) == {len(number_list)}")

```

The first `print(f"len({number_list}) == {len(number_list)}")` using the original `len()` is listing the correct number of `9` entries.
The second print statement using the redefined `len()` is listing `45`.  

**Example output:**

```bash
len([1, 2, 3, 4, 5, 6, 7, 8, 9]) == 9
len([1, 2, 3, 4, 5, 6, 7, 8, 9]) == 45
```

Redefining `len()` can break its usage for other data types such as strings causing crashes. The redefined `len()` will cause a `print(len("Hello World!"))` to throw a `TypeError` as we combine `int` with `char`.

## Compliant Solution (Built-in Function)

Ensure that all functions do not reuse the names as defined in Built-in Functions \[[Python built-in 2025](https://docs.python.org/3.9/library/functions.html)\] and do not reuse the identifiers as defined in The *The Python Standard Library* \[[Python 2025](https://docs.python.org/3/library/index.html)\].

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

number_list = [1, 2, 3, 4, 5, 6, 7, 8, 9]
print(f"len({number_list}) == {len(number_list)}")


def custom_len(numbers: list[int]) -> int:
    """implementing a custom version of len"""
    result = 0
    for number in numbers:
        result += number
    return result


#####################
# Trying to exploit above code example
#####################

print(f"len({number_list}) == {len(number_list)}")

```

## Non-Compliant Code Example (Class)

The standard module `os` and function `getpid()` are being redefined in `noncompliant02.py`.

*[noncompliant02.py](noncompliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import os

print(f"Process id='{os.getpid()}'")


class os:
    """redefining standard class"""

    @staticmethod
    def getpid():
        """redefining standard class method"""
        return "Not implemented"


#####################
# Trying to exploit above code example
#####################

print(f"Process id='{os.getpid()}'")

```

The `os.getpid()` method from the standard module is no longer called after redefining it and prints "Not implemented" instead of the process ID.

**Example output:**

```bash
Process id='19354'
Process id='Not implemented'
```

## Compliant Solution (Class)

Ensure that all packages, classes and functions do not reuse the identifiers as defined in *The Python Standard Library* \[[Python 2025](https://docs.python.org/3/library/index.html)\].

*[compliant02.py](compliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import os

print(f"Process id='{os.getpid()}'")


class custom_os:
    """redefining standard class"""

    @staticmethod
    def getpid():
        """redefining standard class method"""
        return "Not implemented"


#####################
# Trying to exploit above code example
#####################

print(f"Process id='{os.getpid()}'")

```

## Automated Detection

On the 'class' example we have `C0103` complains about missing PascalCase naming style, `R0801`: Similar lines in `2` files, and `R0903` we do not list as their detection is not in relation to the actual issue.

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|pylint|2.9.6|[W0622](https://pylint.pycqa.org/en/latest/user_guide/messages/warning/redefined-builtin.html?highlight=W0622)|Redefining built-in 'len' (redefined-builtin)|
|pylint|2.9.6|[E0102](https://pylint.pycqa.org/en/latest/user_guide/messages/error/function-redefined.html)|class already defined line 5 (function-redefined), detecting `class os`:|

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-710: Improper Adherence to Coding Standards)](https://cwe.mitre.org/data/definitions/710.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE - CWE-1109: Use of Same Variable for Multiple Purposes](https://cwe.mitre.org/data/definitions/1109.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[DCL01-J. Do not reuse public identifiers from the Java Standard Library](https://wiki.sei.cmu.edu/confluence/display/java/DCL01-J.+Do+not+reuse+public+identifiers+from+the+Java+Standard+Library)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[PRE04-C. Do not reuse a standard header file name](https://wiki.sei.cmu.edu/confluence/display/c/PRE04-C.+Do+not+reuse+a+standard+header+file+name)|

## Bibliography

|||
|:---|:---|
|\[Python 2025\].|*The Python Standard Library* \[online\]. Available from: <https://docs.python.org/3/library/index.html> \[accessed 24 June 2025\]|
|\[Python built-in 2025\].|*Built-in Functions* \[online\]. Available from: <https://docs.python.org/3.9/library/functions.html> \[accessed 24 June 2025\]|
