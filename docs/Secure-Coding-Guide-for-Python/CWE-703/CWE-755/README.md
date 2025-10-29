# CWE-755: Improper Handling of Exceptional Conditions

Always catch and explicitly handle exceptions, then respond, log or recover appropriately instead of letting operations fail silently.

There are two built-in Python modules that allow for file manipulation. The original module is called `os`. It provides the ability to perform various functions related to the operating system, among which are creating, updating, and deleting files [[Python docs - os]](https://docs.python.org/3/library/os.html). Python 3.4 introduced the `pathlib`  module, which represents file paths as objects as opposed to string variables [[Python docs - pathlib]](https://docs.python.org/3/library/pathlib.html).

Both modules use the same OS exceptions for file-related errors. Here are some of the common file-related exceptions:

|Exception name|Description|
|:----|:----|
|`OSError`|Base exception for all OS-related error.|
|`FileExistsError`|Raised when trying to create a file or directory which already exists.|
|`FileNotFoundError`| Raised when a file or directory is requested but doesn’t exist.|
|`IsADirectoryError`|Raised when a file operation is requested on a directory.|
|`NotADirectoryError`|Raised when a directory operation is requested on something which is not a directory.|
|`PermissionError`|Raised when trying to run an operation without adequate access rights - for example, filesystem permissions.|

The full list of OS exceptions can be found in the Python documentation [[Python docs - OS Exceptions](https://docs.python.org/3/library/exceptions.html#os-exceptions)].

It is important to handle those exceptions when performing file I/O operations.

## Non-Compliant Code Example (`os.remove()`/`os.unlink()`)

This code example demonstrates an attempt to read a non-existent file using the `os` module. The `read_file()` function opens a file and reads its content using `os.open()` and `os.read()`. If the file does not exist, an `OSError`  or `FileNotFoundError` will be raised when trying to access the randomly generated file name.

*[noncompliant01.py](noncompliant01.py):*

```py
""" Non-compliant Code Example """
 
import os
import uuid
 
 
def read_file(file):
    """Function for opening a file and reading it's content."""
    fd = os.open(file, os.O_RDONLY)
    content = os.read(fd)
    return content.decode()
 
 
#####################
# exploiting above code example
#####################
# Attempting to read a random non-existent file
read_file(f"{uuid.uuid4()}.txt")
```

## Compliant Solution (`try/except` blocks)

The file opening and reading should be surrounded by the `try/except` block. This way, we can catch the generic `OSError` and handle the error differently depending on its cause (such as the file not existing or it being a directory instead).

*[compliant01.py](compliant01.py):*

```py
""" Compliant Code Example """
  
import os
import uuid
  
  
def read_file(file):
    """Function for opening a file and reading its content."""
    try:
        fd = os.open(file, os.O_RDONLY)
        try:
            content = os.read(fd, 1024)
        finally:
            os.close(fd)
        return content.decode()
    except OSError as e:
        if not os.path.exists(file):
            print(f"File not found: {file}")
        elif os.path.isdir(file):
            print(f"Is a directory: {file}")
        else:
            print(f"An error occurred: {e}")
  
  
#####################
# exploiting above code example
#####################
# Attempting to read a random non-existent file
read_file(f"{uuid.uuid4()}.txt")
```

## Non-Compliant Code Example (`pathlib.Path.unlink()`)

The `pathlib` module also provides functions for opening and reading files. The `Path.read_text()` method attempts to read the content of the file represented by the `Path` object. If the file does not exist, it will raise a `FileNotFoundError`. In this code example, this exception is expected when attempting to read a randomly generated non-existent file.

*[noncompliant02.py](noncompliant02.py):*

```py
""" Non-compliant Code Example """
 
import uuid
from pathlib import Path
 
 
def read_file(file):
    """Function for opening a file and reading its content."""
    path = Path(file)
    content = path.read_text(encoding="utf-8")
    return content
 
 
#####################
# exploiting above code example
#####################
# Attempting to read a random non-existent file
read_file(f"{uuid.uuid4()}.txt")
```

The `pathlib.Path.unlink()` function has an optional parameter `missing_ok` that will suppress the `FileNotFoundError` on file deletion, if the parameter's value is `True` . However, without proper handling, using this parameter will cause the script to fail silently.

*[noncompliant03.py](noncompliant03.py):*

```py
""" Non-compliant Code Example """
 
import pathlib
import uuid
 
 
def delete_temporary_file(file):
    """Function for deleting a temporary file from a certain location"""
    resource_path = pathlib.Path(file)
    resource_path.unlink(missing_ok=True)
 
 
#####################
# exploiting above code example
#####################
# Attempting to remove a random non-existent file
delete_temporary_file(f"{uuid.uuid4()}.txt")
```

## Compliant Solution (`pathlib` module)

Since the `pathlib` module uses the same exceptions as the `os` module, error handling can be implemented in the same way.

*[compliant02.py](compliant02.py):*

```py
""" Non-compliant Code Example """
 
import uuid
from pathlib import Path
 
 
def read_file(file):
    """Function for opening a file and reading its content."""
    path = Path(file)
    try:
        content = path.read_text(encoding="utf-8")
        return content
    except OSError as e:
        if path.is_dir():
            print(f"Is a directory: {file}")
        elif not path.exists():
            print(f"File not found: {file}")
        else:
            print(f"An error occurred: {e}")
        return None
 
 
#####################
# exploiting above code example
#####################
# Attempting to read a random non-existent file
read_file(f"{uuid.uuid4()}.txt")
```

## Automated Detection

|||||
|:---|:---|:---|:---|
|Tool|Version|Checker|Description|
|no detection||||

## Related Guidelines

|||
|:---|:---|
|[SEI CERT C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)|[VOID FIO04-CPP. Detect and handle input and output errors](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046775)|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[FIO02-J. Detect and handle file-related errors - SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/FIO02-J.+Detect+and+handle+file-related+errors)|
|[CWE MITRE Pillar](https://cwe.mitre.org/)|[CWE-703](https://cwe.mitre.org/data/definitions/703.html), Improper Check or Handling of Exceptional Conditions|
|[CWE MITRE Class](https://cwe.mitre.org/)|[CWE-755](https://cwe.mitre.org/data/definitions/755.html), Improper Handling of Exceptional Conditions|

## Biblography

|||
|:---|:---|
|[Python-docs - os](https://docs.python.org/3/library/os.html)|[Python Software Foundation. (2023). os - Miscellaneous operating system interfaces [online]](https://docs.python.org/3/library/os.html) [accessed 27 July 2023].|
|[Python docs - pathlib](https://docs.python.org/3/library/pathlib.html)|[Python Software Foundation. (2023). pathlib - Object-oriented filesystem paths [online]](https://docs.python.org/3/library/pathlib.html) [accessed 27 July 2023]|
|[Python docs - OS Exceptions](https://docs.python.org/3/library/exceptions.html#os-exceptions)|[Python Software Foundation. (2023). Built-in Exceptions - OS Exceptions [online]](https://docs.python.org/3/library/exceptions.html#os-exceptions) [accessed 27 July 2023]|
