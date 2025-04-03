# CWE-78: Improper Neutralization of Special Elements Used in an OS Command ("OS Command Injection")

Avoid input from untrusted sources to be used directly as part of an OS command and use specialized Python modules where possible instead.

Python can run shell commands either with an active `shell=True` where an actual shell is invoked to run a line of commands such `/bin/bash -c "ls -la *.txt"` or via non-interactive `shell=False` expecting a Python list object.

Using `shell=False` is recommended but is not going to prevent all attacks.

Examples of reduced functionality with `shell=False`:

* Asterisks `ls -1 *.txt` get surrounded by single quotes `ls -1 '*.txt'` so that some Unix commands to no longer work.
* Piping commands  `ls -1 |grep *.txt` is prohibited.
* Escape sequences can be difficult to manage

Specialized Python modules, such as `pathlib` or `shutil`, provide a platform-independent solution for most needs and should generally be preferred.

Following table 00 provides a limited list of Unix shell commands to Python module mapping, see [Python Module index](https://docs.python.org/3/py-modindex.html) for more.

|Action|Unix|Python|
|:---|:---|:---|
|Compress or decompress files|gzip, unzip|zlib, gzip, bz2, lzma|
|Filesystem operations|`find .`<br>`tree`<br>`ls -1 *.txt`<br>`test -d`<br>`test -f`<br>`cp`|`Path.rglob("*.txt")`<br>`Path.glob("*.txt")`<br>`Path.is_dir()`<br>`Path.is_file()`<br>`shutil.copy()`|
|Access control operations|`chown`<br>`chmod`|`shutil.chown()`<br>`shutil.chmod()`<br>`stat`|
|Environment variables|`export`<br>`set`|`os.getenv()`<br>`os.setenv()`|
|Get user/group id|id|`os.getuid()`<br>`os.setuid()`|
|Get OS and/or kernel type and name|uname -as|`os.uname()`|

<sub>table 00, example list of Unix commands and their Python equivalents.</sub>

Any variation of using input from a lesser trusted source as part of a command line program has a very high probability of resulting in a potential attack including the use of specialized modules. Consider:

* *CWE-184: Incomplete List of Disallowed Input.*
* *CWE-209: Generation of Error Message Containing Sensitive Information.*
* *[CWE-501: Trust Boundary Violation](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/CWE-664/CWE-501/README.md)*

## Non-Compliant Code Example (Read Only)

This scenario demonstrates a potential remote command execution. The `FileOperations.list_dir()` method allows an attacker to inject commands into the string dirname such as `head -1 /etc/passwd` under Linux or `net user` under Windows. Older versions of `Python < 3.9.12` allow to turn a non-interactive shell into an active shell in Windows by providing `cmd.exe /C` as an argument [[python.org 3.12.5 - Subprocess management]](https://docs.python.org/3/library/subprocess.html).

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
from subprocess import Popen
import os


class FileOperations:
    """Helper class for file system operations"""

    def list_dir(self, dirname: str):
        """List the contents of a directory"""
        if "nt" in os.name:
            Popen("dir " + dirname, shell=True).communicate()
        if "posix" in os.name:
            Popen("ls " + dirname, shell=True).communicate()


#####################
# Trying to exploit above code example
#####################
if "nt" in os.name:
    FileOperations().list_dir("%HOMEPATH% & net user")
if "posix" in os.name:
    FileOperations().list_dir("/etc/shadow; head -1 /etc/passwd")

```

The code in `noncompliant01.py` prints the first line of `/etc/passwd` on Linux or starts `net user` under Windows.
The `FileOperations().list_dir()` method allows an attacker to add commands via `;` in Linux and `&` in Windows.

## Non-Compliant Code Example (Read, Write)

The attack surface increases if a user is also allowed to upload or create files or folders.

The `noncompliant02.py` example demonstrates the injection via file or folder name that is created prior to using the `list_dir()` method. We assume here that an untrusted user is allowed to create files or folders named `& calc.exe or ;ps aux` as part of another service such as upload area, submit form, or as a result of a zip-bomb as per *CWE-409: Improper Handling of Highly Compressed Data (Data Amplification)*. Encoding issues as described in *[CWE-180: Incorrect Behavior Order: Validate Before Canonicalize](../CWE-180/README.md)* must also be considered.

The issue occurs when mixing shell commands with data from a lesser trusted source.

Some shell commands, such as `find` with `-exec`, allow running secondary commands via arguments [[CTFOBins]](https://gtfobins.github.io/) [[LOLBAS]](https://lolbas-project.github.io/) that can be misused for shell injections if no shell is provided `shell=False`. The `shlex.split()` method is frequently used to split a string into a list for `subprocess.run()` in order to run a non-interactive shell such as `ls -la`  into `["ls", "-la"]` and plays a minor role in simplifying the attack. The `noncompliant02.py` code only works on Linux, in this example calling a rather harmless uptime.

*[noncompliant02.py](noncompliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import os
import shlex
from subprocess import run


def list_dir(dirname: str):
    """Lists only 2 levels of folders in a default directory"""
    os.chdir(dirname)
    cmd = "find . -maxdepth 1 -type d"
    result = run(shlex.split(cmd), check=True, capture_output=True)

    for subfolder in result.stdout.decode("utf-8").splitlines():
        cmd = "find " + subfolder + " -maxdepth 1 -type d"
        subresult = run(shlex.split(cmd), check=True, capture_output=True)
        for item in subresult.stdout.decode("utf-8").splitlines():
            print(item)


#####################
# Trying to exploit above code example
#####################
# just to keep it clean we create folder for this test
os.makedirs("temp", exist_ok=True)

# simulating upload area (payload):
print("Testing Corrupted Directory")
if "posix" in os.name:
    with open("temp/toast.sh", "w", encoding="utf-8") as file_handle:
        file_handle.write("uptime\n")
    os.makedirs("temp/. -exec bash toast.sh {} +", exist_ok=True)

# running the query:
list_dir("temp")

```

In `noncompliant02.py` the attacker creates a `toast.sh` file that contains the commands to run. The attacker also creates a folder named `. -exec bash toast.sh {} +` that will later become part of the shell `find` command forming `find . -exec bash toast.sh {} +`.

The result is that `list_dir(dirname)` will run the `toast.sh` as a shell script. The `toast.sh` file does not require execute rights and can contain any quantity of shell command complexity.

## Compliant Solution

The `compliant01.py` code using the cross-platform compatible pathlib module and restricting filesystem area. The `pathlib` on its own will not prevent all attacks.

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import os
from pathlib import Path


def list_dir(dirname: str):
    """List the contents of a directory recursively

    Parameters:
        dirname (string): Directory name
    """
    path = Path(dirname)
    allowed_directory = Path.home()
    # TODO: input sanitation
    # TODO: Add secure logging
    if Path(
        allowed_directory.joinpath(dirname)
        .resolve()
        .relative_to(allowed_directory.resolve())
    ):
        for item in path.glob("*"):
            print(item)


#####################
# Trying to exploit above code example
#####################
# just to keep it clean we create folder for this test
os.makedirs("temp", exist_ok=True)

# simulating upload area (payload):
print("Testing Corrupted Directory")
if "posix" in os.name:
    with open("temp/toast.sh", "w", encoding="utf-8") as file_handle:
        file_handle.write("uptime\n")
    os.makedirs("temp/. -exec bash toast.sh {} +", exist_ok=True)

# running the query:
list_dir("temp")

```

The `compliant01.py` does not use data that origins from a lesser trusted source in order to form a shell command and would throw an error for an attempt to list content outside of the allowed area. The code is actually not "neutralizing" data itself from an untrusted source as such, the attack is "neutralized" by no longer using `subprocess` or `os` to run `find`.

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Pycharm|2022.3.3 Python 3.11.6|[PR100](https://pycharm-security.readthedocs.io/en/latest/checks/PR100.html)|Calling `subprocess.call`, `subprocess.run`, or `subprocess.Popen` with `shell=True` can leave the host shell open to local code execution or remote code execution attacks|
|bandit|1.7.9 on python 3.11.4|[B404](https://bandit.readthedocs.io/en/latest/blacklists/blacklist_imports.html#b404-import-subprocess)|Consider possible security implications associated with these modules|
|bandit|1.7.9 on python 3.11.4|[B602](https://bandit.readthedocs.io/en/latest/plugins/b602_subprocess_popen_with_shell_equals_true.html)|Bsubprocess call with `shell=True` identified, security issue.bandit|
|bandit|1.7.9 on python 3.11.4|[B603](https://bandit.readthedocs.io/en/latest/plugins/b603_subprocess_without_shell_equals_true.html)|`subprocess` call - check for execution of untrusted input.|
|bandit|1.7.9 on python 3.11.4|[B604](https://bandit.readthedocs.io/en/latest/plugins/b604_any_other_function_with_shell_equals_true.html)|Consider possible security implications associated with the `subprocess` module|
|bandit|1.7.9 on python 3.11.4|[B605](https://bandit.readthedocs.io/en/1.7.4/plugins/b605_start_process_with_a_shell.html)|Bandit seems to detect any use of `os.system()` whether sanitized or not.|

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-707: Improper Neutralization](hhttps://cwe.mitre.org/data/definitions/707.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base: [CWE-78, Improper Neutralization of Special Elements Used in an OS Command ("OS Command Injection")](https://cwe.mitre.org/data/definitions/000.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[IDS07-J. Sanitize untrusted data passed to the Runtime.exec() method](https://wiki.sei.cmu.edu/confluence/display/java/IDS07-J.+Sanitize+untrusted+data+passed+to+the+Runtime.exec%28%29+method)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[ENV03-C. Sanitize the environment when invoking external programs](https://wiki.sei.cmu.edu/confluence/display/c/ENV03-C.+Sanitize+the+environment+when+invoking+external+programs)|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[ENV33-C. Do not call system()](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=87152177)|
|[SEI CERT C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)|[ENV03-CPP. Sanitize the environment when invoking external programs VOID ENV02-CPP. Do not call system() if you do not need a command processor](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046815)|
|[ISO/IEC TR 24772:2013](https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-ISO/IECTR24772-2013)|Injection [RST]|

## Bibliography

|||
|:---|:---|
|[[Python docs](https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations)]|subprocess — Subprocess management — Python 3.10.4 documentation [online]. Available from: [https://docs.python.org/3/library/subprocess.html](https://docs.python.org/3/library/subprocess.html), [accessed 1 November 2024] |
|[[Python docs](https://docs.python.org/3/reference/expressions.html#binary-arithmetic-operations)]|os — Miscellaneous operating system interfaces — Python 3.10.4 documentation [online]. Available from: [https://docs.python.org/3/library/os.html#os.system](https://docs.python.org/3/library/os.html#os.system), [accessed 1 November 2024] |
|[CTFOBins]|GTFOBins is a curated list of Unix binaries that can be used to bypass local security restrictions in misconfigured systems. [online]. Available from: [https://gtfobins.github.io/](https://gtfobins.github.io/), [accessed 1 November 2024] |
|[LOLBAS]|LOLBAS Living Off The Land Binaries, Scripts and Libraries. [online]. Available from: [https://lolbas-project.github.io/](https://lolbas-project.github.io/), [accessed 1 November 2024] |
