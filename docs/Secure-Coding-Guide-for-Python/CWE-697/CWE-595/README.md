# CWE-595: Comparison of Object References Instead of Object Contents

In Python, the `==` operator is implemented by the `__eq__` method on an object [[python.org data model 2023](https://docs.python.org/3/reference/datamodel.html?highlight=__eq__#object.__eq__)]. For built-in types like `int` and `str`, the comparison is implemented in the interpreter. The main issue comes when implementing custom classes, where the default implementation compares object references using the `is` operator. The `is` operator compares the identities of the objects, equivalent to `id(obj1) == id(obj2)`. The `id` function is built into Python, and in the CPython interpreter, the standard implementation, it returns the object's memory address [[de Langen 2023](https://realpython.com/python-is-identity-vs-equality/)].

You want to implement the `__eq__` method on a class if you believe you ever want to compare it to another object or find it in a list of objects. Actually, it is so common that the `dataclasses.dataclass` decorator by default implements it for you [[dataclasses — Data Classes — Python 3.11.4 documentation](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass)].

## Non-Compliant Code Example

The non-compliant code shows how the default comparison operator compares object references rather than the object values. Furthermore, it displays how this causes issues when comparing lists of objects, although it applies to other types of collections as well. Finally, it shows how the `in` operator also depends on the behavior of the `__eq__` method and, therefore, also returns a non-desirable result.

[*noncompliant01.py:*](noncompliant01.py)

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

```

## Compliant Solution

In this compliant solution the `__eq__` method is implemented and all the comparisons now correctly compares the object values, rather than the object reference.

[*compliant01.py:*](compliant01.py)

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
# All these senarios will now show True
print(Integer(12) == Integer(12))
print([Integer(12)] == [Integer(12)])
print(Integer(12) in [Integer(10), Integer(12)])
 
# By adding the handling for int we also support
print(Integer(12) == 12)

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
