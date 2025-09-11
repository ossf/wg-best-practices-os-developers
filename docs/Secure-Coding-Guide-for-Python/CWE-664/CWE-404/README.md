# CWE-404: Improper Resource Shutdown or Release

Always close resources explicitly and ensure proper cleanup even if an error occurs.

Improper resource shutdown or release happens when a program allocates a resource, such as a file, socket, or database connection, and fails to release it when finished. Unlike normal objects (like numbers or strings), these resources are tied to the operating system and are not freed automatically by garbage collection. If left open, they can pile up and cause memory leaks, file handle exhaustion, or stalled network connections.

In Python, use the `with` statement to ensure handles are cleaned up automatically; note that `with` manages resource cleanup, not memory deallocation. Special care is required for long-running scripts, multiprocessing, or multithreading, where lingering handles can accumulate over time and exhaust system resources.

## Non-Compliant Code Example

In this `noncompliant01.py` code example, two elements are added to the list. Although the list continues to hold these two elements, they are never properly released, leading to retained memory that is never reclaimed. This can cause resource exhaustion or leaks.

[*noncompliant01.py:*](noncompliant01.py)

```py
"""Non-Compliant Code Example"""

my_list = []


def append_resource(name):
    print(f"Allocating resource {name}")
    resource = {"name": name, "active": True}  # Simulated resource
    my_list.append(resource)


append_resource("A")
append_resource("B")

# Forgot to release resources
#####################
# attempting to exploit above code example
#####################
for resource in my_list:
    print(resource["name"], "active?", resource["active"])

if not any(resource["active"] for resource in my_list):
    print("All resources released.")

```

## Compliant Solution

After adding two elements, to the list, the list in this `compliant01.py` code example now contains zero elements because they have been cleared and properly released.

[*compliant01.py:*](compliant01.py)

```py
"""Compliant Code Example"""

my_list = []


def append_resource(name):
    print(f"Allocating resource {name}")
    resource = {"name": name, "active": True}  # Simulated resource
    my_list.append(resource)


append_resource("A")
append_resource("B")

# Properly release resources
for resource in my_list:
    resource["active"] = False
my_list.clear()


#####################
# attempting to exploit above code example
#####################
for resource in my_list:
    print(resource["name"], "active?", resource["active"])

if not any(resource["active"] for resource in my_list):
    print("All resources released.")

```

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Class [CWE-404: Improper Resource Shutdown or Release (4.12)](https://cwe.mitre.org/data/definitions/404.html)|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[EXP04-J. Do not pass arguments to certain Java Collections Framework methods that are a different type than the collection parameter type](https://wiki.sei.cmu.edu/confluence/display/java/EXP04-J.+Do+not+pass+arguments+to+certain+Java+Collections+Framework+methods+that+are+a+different+type+than+the+collection+parameter+type)|

## Bibliography

|||
|:---|:---|
|\[Python Docs\]|<https://docs.python.org/3/tutorial/datastructures.html>|
