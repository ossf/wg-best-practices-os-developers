# CWE-1095: Loop Condition Value Update within the Loop

Promote predictable and secure for loops by iterating over a copy or new collection item as described in 4.2 `for` Statements [Python 3.9 2024](https://docs.python.org/3.9/tutorial/controlflow.html#for-statements).

In-place modification of mutable types such as `list`, `dict`, or `set` that are part of a for loop can result in unpredictable outcomes.

## Non-Compliant Code Example (List)

This `noncompliant01.py` example will successfully remove the Bob from `userlist` but this modifies the original list `userlist` and is not recommended.

[*noncompliant01.py:*](noncompliant01.py)

```py
""" Non-compliant Code Example """
userlist = ['Alice', 'Bob', 'Charlie']
print(f'Unmodified list: {userlist}')

for user in userlist:
    if user == 'Bob':
        userlist.remove(user)

print(f'Modified list: {userlist}')
```

## Non-Compliant Code Example (Dict)

This `noncompliant02.py` example attempts to delete a dictionary entry, which will result in a `RuntimeError:  Dictionary changed size during iteration error` being thrown.

[*noncompliant02.py:*](noncompliant02.py)

```py
""" Non-compliant Code Example """
userdict = {'Alice': 'active', 'Bob': 'inactive', 'Charlie': 'active'}
print(f'Unmodified dict: {userdict}')

for user, status in userdict.items():
    if status == 'inactive':
        del userdict[user]

print(f'Modified dict: {userdict}')
```

## Non-Compliant Code Example (Set)

The `noncompliant03.py` example attempts to remove Bob from `userset`, which will result in a `RuntimeError: Set changed size during iteration error` being thrown.

[*noncompliant03.py:*](noncompliant03.py)

```py
""" Non-compliant Code Example """
userset = {'Alice', 'Bob', 'Charlie'}
print(f'Unmodified set: {userset}')
for user in userset:
    if user == 'Bob':
        userset.remove(user)
```

## Compliant Solution (List)

The `compliant01.py` solution demonstrates both strategies. The first example creates a copy of the `userlist` list to be iterated over, and then removes the item from the original userlist . The second examples creates a new list `activeusers` and adds all users except Bob to `activeusers`.

[*compliant01.py:*](compliant01.py)

```py
""" Compliant Code Example """
userlist = ['Alice', 'Bob', 'Charlie']
print(f'Unmodified list: {userlist}')
 
# Create a copy
for user in userlist.copy():
    if user == 'Bob':
        userlist.remove(user)
 
print(f'Modified list: {userlist}')
 
# Create a sample collection: list
userlist2 = ['Alice', 'Bob', 'Charlie']
print(f'Unmodified list: {userlist2}')
 
# Create new list
activeusers = []
for user in userlist2:
    if user != 'Bob':
        activeusers.append(user)
print(f'New list: {activeusers}')
```

The requirement to use `copy()` or `deepcopy()` will vary depending on the problem that needs to be solved.

## Compliant Solution (Dict)

The `compliant02.py` code demonstrates both strategies. The first example creates a copy of the userdict dict to be iterated over, and then removes the item from the original `userdict`. The second examples creates a new dict `activeusersdict`, and adds the active users to `activeusers`.

[*compliant02.py:*](compliant02.py)

```py
""" Compliant Code Example """
userdict = {'Alice': 'active', 'Bob': 'inactive', 'Charlie': 'active'}
print(f'Unmodified dict: {userdict}')

# Create a copy
for user, status in userdict.copy().items():
    if status == 'inactive':
        del userdict[user]

print(f'Modified dict: {userdict}')

# Create new dict
userdict2 = {'Alice': 'active', 'Bob': 'inactive', 'Charlie': 'active'}
activeuserdict = {}
for user, status in userdict2.items():
    if status != 'inactive':
        activeuserdict.update({user: status})

print(f'New dict: {activeuserdict}')
```

The requirement to use `copy()` or `deepcopy()` will vary depending on the problem that needs to be solved.

## Compliant Solution (Set)

The `compliant03.py` code demonstrates both strategies. The first example creates a copy of the `userset` set to be iterated over, and then removes the item from the original `userset`. The second examples creates a new set `activeusersset`, and adds all users except for Bob to `activeusers`.

[*compliant03.py:*](compliant03.py)

```py
""" Compliant Code Example """
userset = {'Alice', 'Bob', 'Charlie'}
print(f'Unmodified set: {userset}')

# Create a copy
for user in userset.copy():
    if user == 'Bob':
        userset.remove(user)

print(f'Modified set: {userset}')

# Create a new set
userset2 = {'Alice', 'Bob', 'Charlie'}
activeuserset = set()
for user in userset2:
    if user != 'Bob':
        activeuserset.add(user)

print(f'Modified set: {activeuserset}')
```

The requirement to use `copy()` or `deepcopy()` will vary depending on the problem that needs to be solved.

## Automated Detection

`Pylint` version `2.9.6` can detect an issue with the `noncompliant01.py` and `nocompliant03.py` code but is unable to detect an issue with `noncompliant02.py`.

|||||
|:---|:---|:---|:---|
|Tool|Version|Checker|Description|
|Pylint|2.9.6|[W4701:modified-iterating-list](https://pylint.readthedocs.io/en/latest/user_guide/messages/warning/modified-iterating-list.html)|Iterated list `userlist` is being modified inside for loop body, consider iterating through a copy of it instead.|
|Pylint|2.9.6|[E4703:modified-iterating-set](https://pylint.readthedocs.io/en/latest/user_guide/messages/error/modified-iterating-set.html)|Iterated set `userset` is being modified inside for loop body, iterate through a copy of it instead.|

## Related Guidelines

|||
|:---|:---|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[DCL02-J. Do not modify the collection's elements during an enhanced for statement](https://wiki.sei.cmu.edu/confluence/display/java/DCL02-J.+Do+not+modify+the+collection%27s+elements+during+an+enhanced+for+statement)|
|[MITRE CWE Pillar](http://cwe.mitre.org/)|[CWE-710: Improper Adherence to Coding Standards](https://cwe.mitre.org/data/definitions/710.html)|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-1095: Loop Condition Value Update within the Loop](https://cwe.mitre.org/data/definitions/1095.html)|

## Bibliography

|||
|:---|:---|
|[[Python 3.9 2024]](https://docs.python.org/3.9/tutorial/controlflow.html#for-statements)|4.2. for Statements. Available from: <https://docs.python.org/3.9/tutorial/controlflow.html#for-statements> \[Accessed 7 June 2024]|
