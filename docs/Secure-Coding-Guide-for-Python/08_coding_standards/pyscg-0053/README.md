# pyscg-0053: Ensure Functions Are Current and Not Deprecated

Ensure that the functions, classes, and modules you use are up to date and not deprecated or obsolete in the Python standard library.

Use `DeprecationWarning` and static code analysis tools to avoid outdated functions, classes, and modules blocking security fixes. `DeprecationWarning` messages are hidden unless enabled. A developer can run the interpreter with `-W error::DeprecationWarning` to promote them to errors so they surface during development and testing [[docs.python.org warnings 2026](https://docs.python.org/3/library/warnings.html)]. The same promotion can be done in code with `warnings.simplefilter("error", DeprecationWarning)`, but the filter must be installed before the deprecated feature is used, which is impossible for a warning raised at import time. The interpreter flag is preferred because it applies uniformly and matches how CI runs.

Python libraries and frameworks evolve over time and their maintainers phase out features through a defined lifecycle [[PSF Devguide 2026](https://devguide.python.org/versions/)]. A feature is first marked *deprecated* and continues to work while emitting a `DeprecationWarning`, then in a later release it becomes *obsolete* and is removed. Depending on deprecated features is a maintainability, stability, and security risk:

* Code that runs today can stop importing or executing on a newer interpreter once the feature is removed, which can strand it on an older interpreter that no longer receives security patches.
* A `DeprecationWarning` is silent by default, so the latent defect it warns about can stay hidden until an upgrade breaks the code or the flaw is exploited.
* The replacement API often has clearer or safer behaviour, and only the replacement continues to receive bug and security fixes.
* A security patch is often only released for current versions, so code pinned to an old interpreter or a removed feature can be left unable to take the fix.

See also [pyscg-0023: Secure Deserialization](../../04_neutralization/pyscg-0023/README.md) for a deprecated function that is also unsafe.

## Non-Compliant Code Example (Removed Import Location)

The `noncompliant01.py` example imports the abstract base class `Mapping` straight from `collections`. That import path was deprecated back in Python 3.3 and removed for good in Python 3.10 [[docs.python.org collections.abc 2026](https://docs.python.org/3.9/library/collections.abc.html)]. So the same three lines behave differently depending on the interpreter: a `DeprecationWarning` on Python 3.9, an `ImportError` on Python 3.10 and later.

*[noncompliant01.py](noncompliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
from collections import Mapping


def count_keys(mapping):
    """ Check the argument is a mapping and return how many keys it has """
    if not isinstance(mapping, Mapping):
        raise TypeError("expected a mapping")
    return len(mapping)


print(count_keys({"a": 1, "b": 2}))
```

On Python 3.9 this runs but prints `DeprecationWarning: Using or importing the ABCs from 'collections' instead of from 'collections.abc' is deprecated`. On Python 3.10+ the import fails outright with `ImportError: cannot import name 'Mapping' from 'collections'`.

Try running `noncompliant01.py` on more than one interpreter. You can watch the whole lifecycle of an obsolete feature play out:

* *Python 3.9:* the script prints the `DeprecationWarning` shown above, then finishes anyway and prints `2`. That warning is your only hint the code is living on borrowed time.
* *Python 3.9 with `-W error::DeprecationWarning`:* now the same warning is promoted to a fatal error, so the script stops before it ever prints `2`. This is how you catch the problem in development and CI while the feature still technically works.
* *Python 3.10 or higher:* the `from collections import Mapping` line raises `ImportError` immediately. The script never runs at all, because the name was removed in 3.10.

A `DeprecationWarning` is a deadline, not a suggestion. Code that merely warns today is code that fails to import after the next interpreter upgrade.

## Compliant Solution (Removed Import Location)

The `compliant01.py` solution imports `Mapping` from `collections.abc`, its supported home, and does the exact same job. No warning on 3.9, no error on 3.10+.

*[compliant01.py](compliant01.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from collections.abc import Mapping


def count_keys(mapping):
    """ Check the argument is a mapping and return how many keys it has """
    if not isinstance(mapping, Mapping):
        raise TypeError("expected a mapping")
    return len(mapping)


print(count_keys({"a": 1, "b": 2}))
```

The code produces the same result with no `DeprecationWarning` and continues to work on current interpreters.

## Non-Compliant Code Example (Deprecated but Not Yet Removed)

Not every obsolete feature has been removed yet. Some are still present and perfectly functional, just marked with a `DeprecationWarning` and slated for removal down the line. They matter just as much, because the reason a feature gets deprecated usually points straight at a latent defect in the code that relies on it.

Take `datetime.utcnow()`, used in `noncompliant02.py` and deprecated since Python 3.12 [[docs.python.org datetime 2026](https://docs.python.org/3/library/datetime.html#datetime.datetime.utcnow)]. It hands back a *naive* `datetime`, one with no `tzinfo` attached, even though the value inside it really is UTC. The trouble is that Python treats naive datetimes as local time nearly everywhere, so the object quietly lies about the moment it represents:

* `datetime.utcnow().timestamp()` assumes the naive value is local time, producing a POSIX timestamp that is wrong by the machine's UTC offset on any non-UTC host.
* Comparing the result against a timezone-aware `datetime` raises `TypeError: can't compare offset-naive and offset-aware datetimes`.

*[noncompliant02.py](noncompliant02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
from datetime import datetime, timezone


def utc_timestamp():
    """ Return the current UTC time as a POSIX timestamp """
    moment = datetime.utcnow()
    return moment.timestamp()


print(utc_timestamp())

# The naive value returned by utcnow() cannot be compared against a
# timezone-aware datetime, raising TypeError at runtime.
deadline = datetime(2038, 1, 19, tzinfo=timezone.utc)
try:
    print(datetime.utcnow() < deadline)
except TypeError as error:
    print(f"TypeError: {error}")
```

On Python 3.12+ this prints `DeprecationWarning: datetime.datetime.utcnow() is deprecated and scheduled for removal in a future version. Use timezone-aware objects to represent datetimes in UTC: datetime.datetime.now(datetime.UTC).`, then a timestamp offset from true UTC by the host's local timezone, and finally `TypeError: can't compare offset-naive and offset-aware datetimes` from the comparison. On Python 3.9 the same code runs with no warning at all, silently returning the incorrect timestamp before raising the same `TypeError`; the deprecation was added precisely to make this hidden defect visible.

## Compliant Solution (Deprecated but Not Yet Removed)

The `compliant02.py` solution switches to `datetime.now(timezone.utc)`. This returns a timezone-aware value that carries `tzinfo=UTC`, so `.timestamp()` produces the correct POSIX time and comparisons against other aware datetimes succeed instead of raising `TypeError`. No warning on any supported version either. On Python 3.11+ this may also be written as `datetime.now(datetime.UTC)`.

*[compliant02.py](compliant02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
from datetime import datetime, timezone


def utc_timestamp():
    """ Return the current UTC time as a POSIX timestamp """
    moment = datetime.now(timezone.utc)
    return moment.timestamp()


print(utc_timestamp())

# The timezone-aware value compares correctly against another aware datetime.
deadline = datetime(2038, 1, 19, tzinfo=timezone.utc)
print(datetime.now(timezone.utc) < deadline)
```

The code returns the correct UTC-based timestamp on every supported version, compares without raising, and produces no `DeprecationWarning`.

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|[Ruff](https://docs.astral.sh/ruff/)|0.16.6|[deprecated-import (UP035)](https://docs.astral.sh/ruff/rules/deprecated-import/)|Import from `collections.abc` instead: `Mapping`|
|[Pylint](https://pylint.pycqa.org/)|4.0.5|[W4904:deprecated-class](https://pylint.readthedocs.io/en/latest/user_guide/messages/warning/deprecated-class.html)|Using deprecated class Mapping of module collections|
|[Pylint](https://pylint.pycqa.org/)|4.0.5|[E0611:no-name-in-module](https://pylint.readthedocs.io/en/latest/user_guide/messages/error/no-name-in-module.html)|No name 'Mapping' in module 'collections'|
|[Ruff](https://docs.astral.sh/ruff/)|0.16.6|[call-datetime-utcnow (DTZ003)](https://docs.astral.sh/ruff/rules/call-datetime-utcnow/)|`datetime.datetime.utcnow()` used; use `datetime.datetime.now(tz=...)` instead|
|[pylance](https://marketplace.visualstudio.com/items?itemName=ms-python.vscode-pylance)|2025.6.2||The method "utcnow" in class "datetime" is deprecated|
|CPython|3.9+|`-W error::DeprecationWarning`|Turns a `DeprecationWarning` into an error at runtime.|

On Python 3.9, only `W4904:deprecated-class` applies to `noncompliant01.py` because the name still resolves; `E0611:no-name-in-module` and Ruff's `UP035` reflect that the ABC was removed from `collections` in Python 3.10. The `utcnow()` detections (`DTZ003`, pylance) apply on any version, but the `-W error::DeprecationWarning` runtime signal for `noncompliant02.py` only appears on Python 3.12 and later.

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-710: Improper Adherence to Coding Standards](https://cwe.mitre.org/data/definitions/710.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-477: Use of Obsolete Function](https://cwe.mitre.org/data/definitions/477.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[MET02-J. Do not use deprecated or obsolete classes or methods](https://wiki.sei.cmu.edu/confluence/display/java/MET02-J.+Do+not+use+deprecated+or+obsolete+classes+or+methods)|

## Bibliography

|||
|:---|:---|
|[[PSF Devguide 2026](https://devguide.python.org/versions/)]|Python Software Foundation. Status of Python versions [online]. Available from: <https://devguide.python.org/versions/> [Accessed 7 September 2026].|
|[[docs.python.org collections.abc 2026](https://docs.python.org/3.9/library/collections.abc.html)]|Python Software Foundation. collections.abc — Abstract Base Classes for Containers [online]. Available from: <https://docs.python.org/3.9/library/collections.abc.html> [Accessed 7 September 2026].|
|[[docs.python.org datetime 2026](https://docs.python.org/3/library/datetime.html#datetime.datetime.utcnow)]|Python Software Foundation. datetime — Basic date and time types [online]. Available from: <https://docs.python.org/3/library/datetime.html#datetime.datetime.utcnow> [Accessed 7 September 2026].|
|[[docs.python.org warnings 2026](https://docs.python.org/3.9/library/warnings.html)]|Python Software Foundation. warnings — Warning control [online]. Available from: <https://docs.python.org/3.9/library/warnings.html> [Accessed 7 September 2026].|
