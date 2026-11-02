# pyscg-0034: Check for None Values

Check for `None` values before accessing attributes or invoking instance methods whenever `None` is a legitimate or possible value, avoiding runtime `AttributeError` and `TypeError` exceptions (CWE-476).

- Verify that an object is not `None` when a parameter or variable legitimately accepts `None` (annotated as `Optional[T]` or `T | None`).
- Do not add indiscriminate `None` checks to parameters annotated as non-optional types under PEP 484; rely on static type checkers to enforce non-optional contracts.
- Recognize that Python does not enforce type annotations at runtime; apply runtime input validation at untrusted boundaries.
- Distinguish `None` checking from comprehensive input validation; a `None` check alone does not validate data types, formats, or business constraints, and does not prevent security vulnerabilities.
- Confirm an object is not `None` and is a valid collection before querying its length or indexing elements.
- Raise only exceptions that properly inherit from the `BaseException` class; never execute `raise None`.

## Understanding PEP 484 and None Checking

Under PEP 484 type annotations, a parameter typed as a non-optional type (such as `s: str`) explicitly declares that `None` is not an acceptable argument. Static type checkers (such as Mypy and Pyright) verify these annotations across call sites during analysis. Cluttering internal functions with defensive `if param is None:` checks on every non-optional parameter creates redundant boilerplate, degrades readability, and bypasses the benefits of static typing.

However, Python remains a dynamically typed language and does **not** enforce type annotations at runtime. If an untrusted caller, dynamic payload, or external interface invokes a function with `None`, Python will not intercept the call at the function signature boundary. At untrusted system boundaries (e.g., HTTP APIs, CLI parsers, database deserialization), defensive runtime validation should be applied to verify inputs. Within typed codebases, `None` checks should specifically target values that legitimately accept `None`, such as:

- Parameters explicitly annotated as optional (e.g., `s: Optional[str]` or `s: str | None = None`).
- Functions or methods that return `None` to indicate absence (e.g., `dict.get()`, `re.search()`, database queries).
- Attributes or state variables that are lazily initialized or nullable.

## Distinguishing None Checking from Input Validation

A `None` check only determines whether a reference points to the `None` singleton. It is **not** a substitute for input validation:

- Checking `s is not None` does not verify that `s` is a string; an attacker or caller could pass an integer, an arbitrary object, or a malicious subclass that bypasses `None` checks.
- A `None` check alone does not prevent security vulnerabilities such as injection, privilege escalation, or unauthorized access.
- The primary consequence of unchecked `None` dereference in Python (CWE-476: NULL Pointer Dereference) is **availability loss** (Denial of Service) caused by unhandled `AttributeError: 'NoneType' object has no attribute ...` or `TypeError: object of type 'NoneType' has no len()` crashes.

Comprehensive input validation at trust boundaries requires validating types (using `isinstance()` or schema validation libraries), values, lengths, and formats.

## Non-Compliant Code Example - Verify that the object is not None before accessing or modifying its fields

`noncompliant01.py` defines a function `is_valid_name()` that legitimately accepts an optional string (`Optional[str]`), but immediately attempts to call `.split()` without verifying whether `s` is `None`:

_[noncompliant01.py](noncompliant01.py):_

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

from typing import Optional


def is_valid_name(s: Optional[str]) -> bool:
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

Because `s` is annotated as `Optional[str]`, passing `None` is acceptable to static type checkers at the call site. However, calling `is_valid_name(None)` raises an unhandled `AttributeError: 'NoneType' object has no attribute 'split'` at runtime. Static type checkers flag `names = s.split()` because `s` can be `None`.

If `s` were not intended to accept `None`, the function should instead be annotated with the non-optional type `s: str`, communicating to callers and static type checkers that `None` is invalid without requiring redundant `None` checks inside the function.

## Compliant Code Example - Verify that the object is not None before accessing or modifying its fields

`compliant01.py` retains the `Optional[str]` signature to permit optional names, but explicitly checks `if s is None:` before accessing string methods:

_[compliant01.py](compliant01.py):_

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

The check `if s is None:` guards the optional parameter against `AttributeError` when `None` is supplied, safely returning `False`. Note that if this function sits at an untrusted boundary where arbitrary non-string objects could be supplied, runtime type validation (e.g. `isinstance(s, str)`) should also be performed.

## Non-Compliant Code Example - Confirm the object is an array or similar data structure before taking its length

`noncompliant02.py` demonstrates checking the number of students in a classroom. When grade roster data is absent, the parameter may legitimately be passed as `None`:

_[noncompliant02.py](noncompliant02.py):_

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

from typing import Optional


def print_number_of_students(classroom: Optional[list[str]]):
    """Print the number of students in a classroom"""
    print(f"The classroom has {len(classroom)} students.")


#####################
# Attempting to exploit above code example
#####################
print_number_of_students(None)

```

The function calls `len()` directly on `classroom`. Passing `None` raises a runtime `TypeError: object of type 'NoneType' has no len()`, leading to an application crash or denial of service impacting availability.

## Compliant Code Example - Confirm the object is an array or similar data structure before taking its length

`compliant02.py` safely verifies that `classroom` is an actual `list` before calling `len()`, ensuring that `None` or missing data does not trigger a runtime error:

_[compliant02.py](compliant02.py):_

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from typing import Optional


def print_number_of_students(classroom: Optional[list[str]]):
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

The `isinstance(classroom, list)` check validates both that the object is not `None` and that it implements the expected list interface, preventing runtime `TypeError` exceptions.

## Non-Compliant Code Example - Raise only exceptions that properly inherit from the BaseException class, never raise "None"

`noncompliant03.py` validates whether the supplied argument is a list. If the argument is invalid (such as `None`), the function incorrectly attempts to execute `raise None`:

_[noncompliant03.py](noncompliant03.py):_

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

from typing import Optional


def print_number_of_students(classroom: Optional[list[str]]):
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

In Python, the `raise` statement requires an exception class or instance derived from `BaseException`. Executing `raise None` results in `TypeError: exceptions must derive from BaseException`. This masks the original validation error, prevents informative error reporting, and complicates debugging.

## Compliant Code Example - Raise only exceptions that properly inherit from the BaseException class, never raise "None"

`compliant03.py` raises a standard exception class inheriting from `BaseException` (`TypeError`), providing clear diagnostics:

_[compliant03.py](compliant03.py):_

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from typing import Optional


def print_number_of_students(classroom: Optional[list[str]]):
    """Print the number of students in a classroom"""
    if not isinstance(classroom, list):
        raise TypeError("classroom is not a list")
    # TODO: also check each entry
    print(f"The classroom has {len(classroom)} students.")


#####################
# Attempting to exploit above code example
#####################
print_number_of_students(["student 1", "student 2", "student 3"])
print_number_of_students(None)

```

Raising `TypeError` with a descriptive message clearly informs callers why the argument was rejected, facilitating proper error handling as outlined in [pyscg-0016: Propagate Exceptions and Preserve Context](../../05_exception_handling/pyscg-0016/README.md).

## Automated Detection

| Tool                                            | Version                | Checker                                                                                                           | Description                                                                                                                                                                                                                                      |
| :---------------------------------------------- | :--------------------- | :---------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [mypy](https://mypy-lang.org/)                  | 0.960 on python 3.10.4 |                                                                                                                   | Item "None" of "Optional\[str\]" has no attribute "split"                                                                                                                                                                                        |
| [pylint](https://pylint.pycqa.org/)             | 3.3.4                  | [E0702-raising bad-type](https://pylint.readthedocs.io/en/latest/user_guide/messages/error/raising-bad-type.html) | Raising NoneType while only classes or instances are allowed                                                                                                                                                                                     |
| [pyright](https://github.com/microsoft/pyright) | 1.1.402                |                                                                                                                   | noncompliant01.py:11:15 - error: "split" is not a known attribute of "None" (reportOptionalMemberAccess); noncompliant03.py:12:15 - error: Invalid exception class or object "None" does not derive from BaseException (reportGeneralTypeIssues) |
| [Flake8](https://flake8.pycqa.org/)             | 6.0.0 / flake8-bugbear | [B016](https://github.com/PyCQA/flake8-bugbear)                                                                   | Cannot raise a literal. Did you intend to return it or raise an Exception?                                                                                                                                                                       |

## Related Guidelines

|                                                                                                                                       |                                                                                                                                                                 |
| :------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)                                | [EXP34-C. Do not dereference null pointers](https://wiki.sei.cmu.edu/confluence/display/c/EXP34-C.+Do+not+dereference+null+pointers)                            |
| [SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java) | [ERR00-J. Do not suppress or ignore checked exceptions](https://wiki.sei.cmu.edu/confluence/display/java/ERR00-J.+Do+not+suppress+or+ignore+checked+exceptions) |
| [ISO/IEC TR 24772:2010](http://www.aitcnet.org/isai/)                                                                                 | Null Pointer Dereference \[XYH\]                                                                                                                                |
| [MITRE CWE Pillar](http://cwe.mitre.org/)                                                                                             | [CWE-703, Improper Check or Handling of Exceptional Conditions](https://cwe.mitre.org/data/definitions/703.html)                                                |
| [MITRE CWE Base](http://cwe.mitre.org/)                                                                                               | [CWE-476, NULL Pointer Dereference](http://cwe.mitre.org/data/definitions/476.html)                                                                             |

## Bibliography

|                                                                          |                                                                                    |
| :----------------------------------------------------------------------- | :--------------------------------------------------------------------------------- |
| [[Python 3.10 docs](https://docs.python.org/3/c-api/none.html)]          | [The None Object](https://docs.python.org/3/c-api/none.html)                       |
| [[Van Rossum, Lehtosalo, Langa 2014](https://peps.python.org/pep-0484/)] | [PEP 484 – Type Hints](https://peps.python.org/pep-0484/)                          |
| [[Levkivskyi 2021](https://peps.python.org/pep-0604/)]                   | [PEP 604 – Allow writing union types as X \| Y](https://peps.python.org/pep-0604/) |
