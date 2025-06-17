# CWE-252: Unchecked Return Value

Return values of methods and functions should always be checked to ensure operations have been performed correctly.

When immutable objects are used, methods that aim to modify them have to create a new object with the desired changed and return it. For the results of such methods to take place, the developer must remember to assign the new value to a variable, otherwise it won't be accessible. They can also be used to handle unexpected behaviors by returning specific values (such as `None` or a other default values) that may require additional safety checks.

## Non-Compliant Code Example - Immutable objects

This non-compliant code example shows a common mistake when trying to update an immutable object. Since `str` is an immutable type, `str.replace()` creates a new `str` object with the desired change [[Python Docs - str.replace](https://docs.python.org/3.9/library/stdtypes.html#str.replace)]. This object must be then assigned, typically in place of the original string. If not, the new value remains unused.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def sanitize_string(user_input):
    """Function that ensure a given string is safe"""
    user_input.replace("un", "very ")


my_string = "unsafe string"
sanitize_string(my_string)

#####################
# exploiting above code example
#####################
print(my_string)

```

Despite calling `sanitize_string()`, the value of my_string remains unchanged because the return value of str.replace() has been ignored.

## Compliant Solution - Immutable objects

This compliant solution correctly returns the value from `str.replace()` and assigns it to `my_string`:

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """


def sanitize_string(user_input):
    """Function that ensure a given string is safe"""
    return user_input.replace("un", "very ")


my_string = "unsafe string"
my_string = sanitize_string(my_string)

#####################
# exploiting above code example
#####################
print(my_string)

```

## Non-Compliant Code Example - Invalid value handling

Return values are also important when they may be used as an alternative to raising exceptions. `str.find()`, unlike `str.index()` return -1 [[Python Docs - str.find](https://docs.python.org/3/library/stdtypes.html#str.find)] instead of raising a `ValueError` [[Python Docs - str.index](https://docs.python.org/3/library/stdtypes.html#str.index)] when it cannot find the given sub-string.
This non-compliant code example shows that using this value will point to the last element of the string regardless of what it is.

*[noncompliant02.py](noncompliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def find_in_string(full_string, sub_string):
    """Function that searches for a sub-string in a given string"""
    index = full_string.find(sub_string)
    print(f"""Sub-string '{sub_string}' appears for the first time in
          '{full_string}' at index {index}: '{full_string[index:]}'""")


#####################
# exploiting above code example
#####################
my_string = "Secure Python coding"
find_in_string(my_string, "Python")
find_in_string(my_string, "I'm evil")

```

Even though `I'm evil` is clearly not a part of Secure Python coding, the `find_in_string()` method will suggest otherwise.

## Compliant Solution - Invalid value handling

Since `str.find()` indicates the fact that the sub-string couldn't be found with a negative index, a simple `if` check is enough to tackle the issue from the previous code example.

*[compliant02.py](compliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """


def find_in_string(full_string, sub_string):
    """Function that searches for a sub-string in a given string"""
    index = full_string.find(sub_string)
    if index >= 0:
        print(f"""Sub-string '{sub_string}' appears for the first time in
              '{full_string}' at index {index}: '{full_string[index:]}'""")
    else:
        print(f"There is no '{sub_string}' in '{full_string}'")


#####################
# exploiting above code example
#####################
my_string = "Secure Python coding"
find_in_string(my_string, "Python")
find_in_string(my_string, "I'm evil")

```

Now, the latter print will correctly indicate the lack of `I'm evil` in `Secure Python coding`.

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-703: Improper Check or Handling of Exceptional Conditions (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/703.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-252: Unchecked Return Value](https://cwe.mitre.org/data/definitions/252.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[EXP00-J. Do not ignore values returned by methods](https://wiki.sei.cmu.edu/confluence/display/java/EXP00-J.+Do+not+ignore+values+returned+by+methods)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[EXP12-C. Do not ignore values returned by functions](https://wiki.sei.cmu.edu/confluence/display/c/EXP12-C.+Do+not+ignore+values+returned+by+functions)|
|ISO/IEC TR 24772:2019|Passing Parameters and Return Values [CSJ]|

## Bibliography

|||
|:---|:---|
|[[Python Docs - str.replace](https://docs.python.org/3.9/library/stdtypes.html#str.replace)]<br>[[Python Docs - str.find](https://docs.python.org/3/library/stdtypes.html#str.find)]<br>[[Python Docs - str.index](https://docs.python.org/3/library/stdtypes.html#str.index)]|Python Software Foundation. (2025). Built-in Types [online]. Available from: [https://docs.python.org/3.9/library/stdtypes.html](https://docs.python.org/3.9/library/stdtypes.html) [accessed 17 June 2025] |
