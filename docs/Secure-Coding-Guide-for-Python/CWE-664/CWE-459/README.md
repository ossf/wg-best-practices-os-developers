# CWE-459: Incomplete Cleanup

Leftover temporary files not properly cleaned up after the completion of any script, can lead to resource exhaustion and disable a service.

Temporary files can be used to store data, either between processes, or to preserve memory. Using temporary files comes with several challenges, we need to ensure that the temporary files are removed before the termination of the process. In the case of the process terminating abnormally, we can't rely on a finally block as it could fail to run. In the case that the program still fails to free up the execution, we need to ensure that the temporary files are created with the correct permissions and in the correct location so the OS can cleanup after the process finishes, while ensuring to restrict access to other processes.

In Python there is two documented ways to create temporary files using the `tempfile` library, `tempfile.mkstemp()` and `tempfile.NamedTemporaryFile()`.

`tempfile.mkstemp()` creates a secure file in the most secure fashion allowing only read and write to the user who executed the python script. The function returns a tuple containing a file descriptor and the file path, but since this tuple is not a context manager, it does not directly integrate with the `with` statement, which automatically manages resource cleanup. This means that the user is responsible for deleting the temporary file after use.  

`tempfile.NamedTemporaryFile()` is more advanced than the `mkstemp()` method as it returns a file-like object, which acts as a context manager, which works well with the `with` statement, although it creates the file with the same permissions as `mkstemp()`. The default behaviour is to delete the file once the `with` block is finished. If the file is needed outside of the with block, the `delete_on_close parameter` must be set to `false`.

## Non-Compliant Code Example

In the `noncompliant01.py` example, a temporary file is created but is not removed after completion.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
f = open("tempfile.txt", "w")
f.write("temporary file created!")
f.close()
```

In `noncompliant02.py`, we are using the `mkstemp` method to generate the temporary file. This will create a more secure temporary file but doesn't do clean-up of the file after the end of execution.

*[noncompliant02.py](noncompliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import os
from tempfile import mkstemp
 
fd, path = mkstemp()
with os.fdopen(fd, 'w') as f:
    f.write('TEST\n')
 
print(path)
```

Neither of the code examples removes the file after use, leaving cleanup to the user or the operating system.

## Compliant Solution

In `compliant01.py` we use the `tempfile` module to generate our temporary file. When not passing in `delete=false` the default behaviour is the file will be deleted after the corresponding file-like objects are closed.

Thanks to the use of the `with` statement we ensure that the file is closed after writing to it, even if an error is to occur.

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import tempfile
 
with tempfile.NamedTemporaryFile() as temp_file:
    temp_file.write(b'This temporary file will be deleted.')
    temp_file_path = temp_file.name
 
with open(temp_file_path, 'rb') as temp_file:
    print(temp_file.read())
```

In the first `with` block of `compliant01.py`, a temporary file is created, which will be automatically deleted once the block is exited. It is expected that the second `with` block will return a `FileNotFoundError` as the file will have been successfully deleted.

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Pylint|3.3.7 on python 3.10.4|[W1514:unspecified-encoding](https://pylint.readthedocs.io/en/latest/user_guide/messages/warning/unspecified-encoding.html)|Using open without explicitly specifying an encoding|

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-664: Improper Control of a Resource Through its Lifetime (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-459: Incomplete Cleanup](https://cwe.mitre.org/data/definitions/459.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[FIO03-J. Remove temporary files before termination](https://wiki.sei.cmu.edu/confluence/display/java/FIO03-J.+Remove+temporary+files+before+termination)|
