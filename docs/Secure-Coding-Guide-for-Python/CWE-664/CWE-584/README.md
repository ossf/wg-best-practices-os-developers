# CWE-584: Return Inside Finally Block

Do not use `return`, `break` or `continue` statements in a try-finally block, as the exception will not be processed. The Python documentation [[Python 3.9]](https://docs.python.org/3.9/reference/compound_stmts.html#finally) notes, "If the `finally` clause executes a [`return`](https://docs.python.org/3.9/reference/simple_stmts.html#return), [`break`](https://docs.python.org/3.9/reference/simple_stmts.html#break) or [`continue`](https://docs.python.org/3.9/reference/simple_stmts.html#continue) statement, the saved exception is discarded."

## Non-Compliant Code Example

The `return` statement is within the finally block, which means the exception will have no effect.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

""" Non-compliant Code Example """
 
 
def do_logic():
    try:
        raise Exception
    finally:
        print("logic done")
        return True
 
 
#####################
# exploiting above code example
#####################
do_logic()
```

This code sample will print: `logic done`.

## Compliant Solution

The `return` statement has been moved to the end of the method, so the code sample will successfully raise the exception.

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

""" Compliant Code Example """
 
 
def do_logic():
    try:
        raise Exception
    finally:
        print("logic done")
    # return statement goes here
    # when exception is raised conditionally
    return True
 
 
#####################
# exploiting above code example
#####################
do_logic()
```

## Compliant Solution - `break` inside a loop

It is permissible to use control flow statements that lead into a finally block, as long as they do not attempt to exit from within it. For example, the following code complies with this rule because the break statement is used to exit a while loop and does not attempt to break out of the finally block itself.

*[compliant02.py](compliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
 """ Compliant Code Example """


def do_logic():
    try:
        raise Exception
    finally:
        c = 0
        while c < 5:
            print(f"c is {c}")
            c += 1
            if c == 3:
                break
    # return statement goes here
    # when exception is raised conditionally
    return True
 
 
#####################
# exploiting above code example
#####################
do_logic()

```

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|[Pylint](https://pylint.pycqa.org/)|3.3.4|W0150|return statement in finally block may swallow exception (lost-exception)|
|[Pylint](https://pylint.pycqa.org/)|3.3.4|W0134|'return' shadowed by the 'finally' clause.|

## Related Guidelines

|||
|:---|:---|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java?src=breadcrumbs)|[ERR04-J. Do not complete abruptly from a finally block - SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/ERR04-J.+Do+not+complete+abruptly+from+a+finally+block)|
|[MITRE CWE](http://cwe.mitre.org/)|[CWE-459, Incomplete Cleanup](http://cwe.mitre.org/data/definitions/459.html)|
|[MITRE CWE](http://cwe.mitre.org/)|[CWE-584, Return Inside  finally  Block](http://cwe.mitre.org/data/definitions/584.html)|

## Bibliography

|||
|:---|:---|
|[[Python 3.9]](https://docs.python.org/3.9/reference/compound_stmts.html#finally)|[Compound statements — Python 3.9.13 documentation](https://docs.python.org/3.9/reference/compound_stmts.html#finally)|
