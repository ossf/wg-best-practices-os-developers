# pyscg-0034: NULL Pointer Dereference

Avoiding NULL Pointer Dereference is crucial for preventing runtime errors, and ensuring that your code executes successfully.

* Ensure that you have a valid object before callings its instance methods.
* Verify that the object is not None before accessing or modifying its fields.
* Confirm the object is an array or similar data structure before taking its length.
* Check the object is an array before accessing or modifying its elements.
* Raise only exceptions that properly inherit from the BaseException class, never raise "None".

If the data originates from a lesser trusted source, verifying that objects are not None becomes a mandatory security measure to prevent potential vulnerabilities such as unauthorized access or unexpected behavior. However, when dealing with data from trusted and well-controlled sources, the primary concern shifts from a security one, to more of a stability issue as per [pyscg-0016: Detection of Error Condition Without Action](../../05_exception_handling/pyscg-0016/README.md).

## Non-Compliant Code Example - Verify that the object is not None before accessing or modifying its fields

`Noncompliant01.py` defines a function `is_valid_name()` that checks if a certain name is properly defined (contains exactly two words, both capitalized):

*[noncompliant01.py](noncompliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def is_valid_name(s: str) -> bool:
    """ Check if the input is a name with 2 capitalised Strings """
    names = s.split()
    if len(names) != 2:
        return False
    return s.istitle()


#####################
# Attempting to exploit above code example
#####################
name = is_valid_name(None) 


print(name)

```

The `is_valid_name()` function could get called with a null argument, which raises an `AttributeError` due to the `NoneType` object not having any `split` attribute.

## Compliant Code Example - Verify that the object is not None before accessing or modifying its fields

The `compliant01.py` code includes the same implementation as the previous `noncompliant01.py` but now checks if the string is `None`.

The type hint `Optional [str]` can be added to the method signature to show that it could be called with `None` (where `Optional[X]` is equivalent to `X` | `None` or `Union[X, None]`).

*[compliant01.py](compliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

from typing import Optional


def is_valid_name(s: Optional[str]) -> bool:
    """ Check if the input is a name with 2 capitalised Strings """
    if s is None:
        return False
    names = s.split()
    if len(names) != 2:
        return False
    return s.istitle()


#####################
# Attempting to exploit above code example
#####################
name = is_valid_name(None)


print(name)

```

## Non-Compliant Code Example - Confirm the object is an array or similar data structure before taking its length

`Noncompliant02.py` demonstrates the process of checking the number of students in a given classroom. In certain scenarios, such as a small school without a certain grade, the number of students in a classroom may legitimately be represented as `None`.

*[noncompliant02.py](noncompliant02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""


def print_number_of_students(classroom: list[str]):
    """Print the number of students in a classroom"""
    print(f"The classroom has {len(classroom)} students.")


#####################
# Attempting to exploit above code example
#####################
print_number_of_students(None)

```

The code example attempts to directly call `len()` on a non-array value, in this case on `None`, which will raise a `TypeError`. Such unchecked dereferencing of a `None` value could result in an application crash or denial of service, impacting system availability.

## Compliant Code Example - Confirm the object is an array or similar data structure before taking its length

The `compliant02.py` solution safely checks whether the classroom object is an array (or list) before calling the `len()` thereby preventing a potential `TypeError` and avoiding loss of availability.

*[compliant02.py](compliant02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def print_number_of_students(classroom: list[str]):
    """Print the number of students in a classroom"""
    if isinstance(classroom, list):
        print(f"The classroom has {len(classroom)} students.")
    else:
        print("Given object is not a classroom.")


#####################
# Attempting to exploit above code example
#####################
print_number_of_students(None)

```

## Non-Compliant Code Example - Raise only exceptions that properly inherit from the BaseException class, never raise "None"

`Noncompliant03.py` demonstrates an incorrect example of checking for whether the variable passed is a list. If the variable is not a list, then the code example attempts to raise `None`.

*[noncompliant03.py](noncompliant03.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""
 
 
def print_number_of_students(classroom: list[str]):
    """Print the number of students in a classroom"""
    if not isinstance(classroom, list):
        raise None
    print(f"The classroom has {len(classroom)} students.")
 
 
#####################
# Attempting to exploit above code example
#####################
print_number_of_students(["student 1", "student 2", "student 3"])
print_number_of_students(None)

```

This code example returns: `TypeError: exceptions must derive from BaseException`. This is problematic because raising `None` does not provide any useful error information or traceback, leading to less informative error handling and potentially causing the program to crash unexpectedly without clear diagnostic details.

## Compliant Code Example - Raise only exceptions that properly inherit from the BaseException class, never raise "None"

The `compliant03.py` solution raises a `ValueError` rather than `None`, ensuring clear error reporting.

*[compliant03.py](compliant03.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def print_number_of_students(classroom: list[str]):
    """Print the number of students in a classroom"""
    if not isinstance(classroom, list):
        raise ValueError("classroom is not a list")
    # TODO: also check each entry
    print(f"The classroom has {len(classroom)} students.")


#####################
# Attempting to exploit above code example
#####################
print_number_of_students(["student 1", "student 2", "student 3"])
print_number_of_students(None)

```

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|[mypy](https://mypy-lang.org/)|0.960 on python 3.10.4||Item "None" of "Optional\[str\]" has no attribute "split"|
|[pylint](https://pylint.pycqa.org/)|3.3.4|[E0702-raising bad-type](https://pylint.readthedocs.io/en/latest/user_guide/messages/error/raising-bad-type.html)|Raising NoneType while only classes or instances are allowed|
|[pyright](https://github.com/microsoft/pyright)|1.1.402||noncompliant01.py:17:22 - error: Argument of type "None" cannot be assigned to parameter "s" of type "str" in function "is_valid_name" None" is not assignable to "str" (reportArgumentType) noncompliant03.py:21:19 - error: Invalid exception class or object "None" does not derive from BaseException (reportGeneralTypeIssues) 2 errors, 0 warnings, 0 informations|
|[pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)|2025.6.2||Argument of type "None" cannot be assigned to parameter "s" of type "str" in function "is_valid_name"|

## Related Guidelines

|||
|:---|:---|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[EXP34-C. Do not dereference null pointers](https://wiki.sei.cmu.edu/confluence/display/c/EXP34-C.+Do+not+dereference+null+pointers)|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[ERR00-J. Do not suppress or ignore checked exceptions](https://wiki.sei.cmu.edu/confluence/display/java/ERR00-J.+Do+not+suppress+or+ignore+checked+exceptions)|
|[ISO/IEC TR 24772:2010](http://www.aitcnet.org/isai/)|Null Pointer Dereference \[XYH\]|
|[MITRE CWE Pillar](http://cwe.mitre.org/)|[CWE-703, Improper Check or Handling of Exceptional Conditions](https://cwe.mitre.org/data/definitions/703.html)|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-476, NULL Pointer Dereference](http://cwe.mitre.org/data/definitions/476.html)|

## Bibliography

|||
|:---|:---|
|[[Python 3.10.4 docs](https://docs.python.org/3/library/string.html#formatstrings)]|[The None Object](https://docs.python.org/3/c-api/none.html)|
