# CWE-595: Comparison of Object References Instead of Object Contents

Prevent unexpected results by knowing the differences between comparison operators such as `==` and `is`.

In Python, the `==` operator is implemented by the `__eq__` method on an object [[python.org data model 2023](https://docs.python.org/3/reference/datamodel.html?highlight=__eq__#object.__eq__)]. For built-in types like `int` and `str`, the comparison is implemented in the interpreter. The main issue comes when implementing custom classes, where the default implementation compares object references using the `is` operator. The `is` operator compares the identities of the objects, equivalent to `id(obj1) == id(obj2)`.
In CPython, this is their memory address. Everything in Python is an object, and each object is stored at a specific memory location [[de Langen 2023](https://realpython.com/python-is-identity-vs-equality/)].

You want to implement the `__eq__` method on a class if you believe you ever want to compare it to another object or find it in a list of objects. Actually, it is so common that the `dataclasses.dataclass` decorator by default implements it for you [[dataclasses — Data Classes — Python 3.11.4 documentation](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass)].

Be aware of Python's memory optimization for strings and numbers as demonstrated in `example01.py` code.
Python tries to avoid allocating more memory for the same string. The process of reusing already existing strings is a Python optimization technique known as **String interning** [[sys — System-specific parameters and functions — Python 3.11.4 documentation](https://docs.python.org/3/library/sys.html#sys.intern)] According to the documentation, "CPython keeps an array of integer objects for all integers between `-5` and `256`. When you create an `int` in that range you actually just get back a reference to the existing object." [[Integer objects — Python 3.11.4 documentation](https://docs.python.org/3/c-api/long.html#c.PyLong_FromLong)]

_[example01.py:](example01.py)_

```py
""" Code Example """

print("-" * 10 + "Memory optimization with strings" + 10 * "-")
a = "foobar"
b = "foobar"
c = ''.join(["foo", "bar"])
print(f"a is b: {a} is {b}?", a is b)
print(f"a is c: {a} is {c}?", a is c)
print(f"a == c: {a} == {c}?", a == c)
print(f"size? len(a)={len(a)} len(b)={len(b)} len(c)={len(c)}")

print("-" * 10 + "Memory optimization with numbers" + 10 * "-")
a = b = 256
print (f"{a} is {b}?", a is b)
a = b = 257
print (f"{a} is {b}?", a is b)

print("-" * 10 + "Memory optimization with numbers in a loop" + 10 * "-")
a = b = 255
while(a is b):
    a += 1
    b += 1
    print (f"{a} is {b}?", a is b)
```

 **Output of example01.py:**

```bash
----------Memory optimization with strings----------
a is b: foobar is foobar? True
a is c: foobar is foobar? False
a == c: foobar == foobar? True
size? len(a)=6 len(b)=6 len(c)=6
----------Memory optimization with numbers----------
256 is 256? True
257 is 257? True
----------Memory optimization with numbers in a loop----------
256 is 256? True
257 is 257? False
```

The first set of print statements illustrates string interning. While `a` and `b` reuse the same object, `c` is created by joining two new strings, which results in an object with a different `id()`. The variables in the middle example both point to the same number object, which is why comparing them after `a = b = 257` still returns `True` even though `257` falls outside of the cached range. However, when assigning values in a loop, Python needs to allocate new objects for numbers greater than `256` and thus will create two separate objects as soon as it hits `257`. The way caching and interning works may differ between running a Python script from a file and using REPL, which may produce different results when running `example01.py` in Python's interactive mode.

## Non-Compliant Code Example

The `noncompliant01.py` code demonstrates potentially unexpected outcomes when using different comparisons.

* The `==` operator using `__eq__`, checks value equality for most build-in types, checks for reference equality if the `__eq__` is missing  in a custom class. So `12 == 12` is `True` and `Integer(12) == Integer(12)` is `False`.
* The `==` comparing lists of objects, that also applies to other types of collections.
* The `in` operator also depends on the behavior of the `__eq__` method
* The `is` operator that checks the references point to the same object regardless of the stored value.

_[noncompliant01.py:](noncompliant01.py)_

```py
""" Non-compliant Code Example """

class Integer:
    def __init__(self, value):
        self.value = value


#####################
# exploiting above code example
#####################
print(Integer(12) == Integer(12))
# Prints False, as == operator compares id(self) == id(other) when __eq__ isn't implemented
# As a result, the same will be true for comparing lists as they delegate comparison to the objects.
print([Integer(12)] == [Integer(12)])
# And this is equally this will always be False as well
print(Integer(12) in [Integer(10), Integer(12)])
# The 'is' will return True only if both references point to the same object
a = Integer(12)
b = a
# Here, a and b point to the same Integer, so 'is' returns True
print(a is b)

b = Integer(12)
# Even though b still points to an Integer of the same value, it is a new object, so 'is' returns False
print(a is b)

```

**Output of noncompliant01.py:**

```bash
False
False
False
True
False
```

## Compliant Solution

In this compliant solution, the `__eq__` method is implemented and the comparisons that not use `is` now correctly compare the object values, rather than the object reference. The `is` operator does not call `__eq__`, hence the last print will still display `False`.

_[compliant01.py:](compliant01.py)_

```py
""" Compliant Code Example """


class Integer:
    def __init__(self, value):
        self.value = value

    def __eq__(self, other):
        if isinstance(other, type(self)):
            return self.value == other.value
        if isinstance(other, int):
            return self.value == other
        return False


#####################
# exploiting above code example
#####################
# All these scenarios will now show True
print(Integer(12) == Integer(12))
print([Integer(12)] == [Integer(12)])
print(Integer(12) in [Integer(10), Integer(12)])

# By adding the handling for int we also support
print(Integer(12) == 12)
# The 'is' will return True only if both references point to the same object
a = Integer(12)
b = a
# Here, a and b point to the same Integer, so 'is' returns True
print(a is b)

b = Integer(12)
# Since the 'is' operator does not call __eq__, print below will still return False
print(a is b)

```

 **Output of compliant01.py:**

```bash
True
True
True
True
True
False
```

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar:<br>[CWE-697: Incorrect Comparison](https://cwe.mitre.org/data/definitions/697.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Variant:<br>[CWE-595](https://cwe.mitre.org/data/definitions/197.html), Comparison of Object References Instead of Object Contents|
|[SEI CERT for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[EXP02-J. Do not use the Object.equals() method to compare two arrays](https://wiki.sei.cmu.edu/confluence/display/java/EXP02-J.+Do+not+use+the+Object.equals%28%29+method+to+compare+two+arrays)|

## Bibliography

|||
|:---|:---|
|[[python.org data model 2023](https://docs.python.org/3/reference/datamodel.html?highlight=__eq__#object.__eq__)]|[3. Data model — Python 3.11.3 documentation](https://docs.python.org/3/reference/datamodel.html?highlight=__eq__#object.__eq__)|
|[[de Langen 2023](https://realpython.com/python-is-identity-vs-equality/)]|[Python '!=' Is Not 'is not': Comparing Objects in Python – Real Python](https://realpython.com/python-is-identity-vs-equality/)|
|[[dataclasses — Data Classes — Python 3.11.4 documentation](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass)]|[9. Classes — Python 3.11.3 documentation](https://docs.python.org/3/tutorial/classes.html)|
|[[sys — System-specific parameters and functions — Python 3.11.4 documentation](https://docs.python.org/3/library/sys.html#sys.intern)]|[sys — System-specific parameters and functions — Python 3.11.3 documentation](https://docs.python.org/3/library/sys.html#sys.intern)|
|[[Integer objects — Python 3.11.4 documentation](https://docs.python.org/3/c-api/long.html#c.PyLong_FromLong)]|[Integer objects — Python 3.11.4 documentation](https://docs.python.org/3/c-api/long.html#c.PyLong_FromLong)|
