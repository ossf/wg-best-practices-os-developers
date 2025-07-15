# CWE-209: Generation of Error Message Containing Sensitive Information

Prevent an attacker from discovering internal or sensitive system information by filtering, splitting and applying brute force prevention tactics when displaying error messages to a user.
This rule is closely related to [CWE-532: Insertion of Sensitive Information into Log File](../CWE-532/README.md).

Ensure that detailed troubleshooting and security sensitive error information can only reach authorized personnel while avoiding overload from brute force attacks.

Purposefully triggered errors can help an attacker to find out system details, such as:

* Whether a file-based or database (DB) storage system is used
* Specific filesystem or DB layout
* Existing users
* Components in use and their versions
* How to correctly format requests and use an internal API
* Other sensitive information such as keys or passwords.

Sensitive data can be leaked on both ends of the client-server architecture. Not only can the attackers can gather sensitive information from vulnerable web servers, but they can do so from victims who use vulnerable web browsers as well. Cases of such vulnerabilities have been described in [CVE-2013-0773](https://www.cvedetails.com/cve/CVE-2013-0773/) or [CVE-2021-43536](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-43536).

Aside from a direct attack on a clients browser cache, it also must be assumed that any URL visited by an authorized user may become available to an unauthorized party. HTTP_REFERER  is a HTTP header containing the previous visited URL. It can become available to any untrusted entity without an active attack. This header could potentially be used to leak a URL that would allow the attacker to reset the password to the victim's account, as described in [[Mozilla Developers 2025](https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns)].

Some online system's fail at protecting authenticated and unauthenticated users from reading each others error messages or details.

URLs producing user errors or any user data must ensure that only the intended user can read their error message. For instance, a URL containing query such as [https://my.service.org/util/fileupload.php?usersession=42f2h2c452ef3a9b23?file=something.txt](https://my.service.org/util/fileupload.php?usersession=42f2h2c452ef3a9b23?file=something.txt) must not allow attackers to iterate over the usersession number or change the file variable to expose another users name "Access error for user John Smith" or uploaded files "file something.txt already uploaded".

Below are examples of build-in exceptions and sensitive data that can be leaked through errors:

|||
|:---|:---|
|[`FileNotFoundError`](https://docs.python.org/3.9/library/exceptions.html?highlight=filenotfounderror#FileNotFoundError)|Underlying file system structure, list of usernames (e.g. in case folders dedicated to each user have the same names as the usernames)|
|[`sqlite3.DataError`](https://docs.python.org/3.9/library/sqlite3.html)|Database structure, user name enumeration|
|[`socket.error`](https://docs.python.org/3.9/library/socket.html?highlight=socket%20error#socket.error)|List of open ports (e.g. when the port can be chosen by the client)|
|[`concurrent.futures`](https://docs.python.org/3.9/library/concurrent.futures.html#concurrent.futures.TimeoutError)|Possibility of deadlocks and other concurrent applications risks|
|[`resource.error`](https://docs.python.org/3.9/library/resource.html?highlight=resource%20exception)|Server's bandwidth (useful for DoS), Resource enumeration|

## Non-Compliant Code Example - Exception Leaking Sensitive Data

In the `noncompliant01.py` code class `FileReader` simulates the back-end and `FileReader(["Documents"])` is a service front-end client.
Typically, a back-end service runs under its own user, such as `httpd` with its home directory set to `/var/www/`, or by using a hard-coded path. The back-end must read a file supplied by the client, but the behavior of its file system has not been considered in this example.

*[noncompliant01.py](noncompliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

from pathlib import Path


class FileReader:
    """ Class that reads files"""
    def __init__(self, args: list[str]):
        path = Path(Path.home(), args[0])
        fh = open(path, 'r', encoding="utf-8")
        fh.readlines()


#####################
# exploiting above code example
#####################
fr = FileReader(["Documents"])

```

The client requests a nonexistent file from the server, which results in an exception that expose the internal file structure. An attacker can explore the back-end filesystem layout by probing for different directories or files and the `PermissionError` or `FileNotFoundError` error messages. The attacker can also find out the exact source-code file location and path if tracelog is presented.

 **Example output of `noncompliant01.py`:**

```bash
Traceback (most recent call last):
  File "c:\Users\user1\Documents\linuxworkspace\python3.9.6\src\Rule07.ERR\ERR01\noncompliant01.py", line 15, in <module>
    fr = FileReader(["Documents"])
  File "c:\Users\user1\Documents\linuxworkspace\python3.9.6\src\Rule07.ERR\ERR01\noncompliant01.py", line 8, in __init__
    fh = open(path, 'r')
PermissionError: [Errno 13] Permission denied: 'C:\\Users\\user1\\Documents'
```

## Non-Compliant Code Example - Insufficiently Wrapping the Exception

The `noncompliant02.py` code example logs the exception, disables tracelog to hide the source-code file location, and then raises a generic `Exception` to conceal the specific exception type:

*[noncompliant02.py](noncompliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

from pathlib import Path
import sys


class FileReader:
    """ Class that reads files"""
    def __init__(self, args: list):
        path = Path(Path.home(), args[0])
        try:
            fh = open(path, 'r', encoding="utf-8")
            fh.readlines()
        except OSError as e:
            # TODO: log the original exception
            # For more details, check CWE-693/CWE-778: Insufficient Logging

            # Throw a generic exception instead
            sys.tracebacklimit = 0
            raise Exception("Unable to retrieve file " + str(e.filename)) from None


#####################
# exploiting above code example
#####################
fr = FileReader(["Documents"])

```

Despite throwing a generic exception, `e.filename` from the original exception still contains the absolute path to the desired file, which leads to sensitive data still being leaked.

**Example output of `noncompliant02.py`:**

```bash
Exception: Unable to retrieve file C:\Users\user1\Documents
```

## Non-Compliant Code Example - Re-throwing a New Exception

To avoid leaking the filepath, this non-compliant code example throws a `BaseException` exception that does not wrap the `PermissionError` exception:

*[noncompliant02.py](noncompliant02.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

from pathlib import Path
import sys


class FileReader:
    """ Class that reads files"""
    def __init__(self, args: list):
        path = Path(Path.home(), args[0])
        try:
            file_handle = open(path, 'r', encoding="utf-8")
            file_handle.readlines()
        except (PermissionError, FileNotFoundError, IsADirectoryError):
            # Re-throw exception without details
            sys.tracebacklimit = 0
            raise BaseException() from None


#####################
# exploiting above code example
#####################
fr = FileReader(["Documents"])

```

**Output of `noncompliant03.py`:**

```bash
BaseException
```

Despite the fact that `BaseException` doesn't contain any specific data, the fact that it may be thrown still informs the attacker that the requested file cannot be accessed. The server returns different responses depending on whether the given file exists or not. The attacker can then attempt to guess the names of existing files by issuing multiple requests, performing a brute-force attack until they discover which filenames result in an exception, and which don't.

## Compliant Solution - Split and Filter

The compliant solution assumes that:

1. The `file_reader` method is at the outer boundary of a system interfacing with a client
2. There is a need for the client to receive an adequate enough error message to fulfill the use case
3. Authorized back-end administrators need the ability to troubleshoot errors in detail on

[CWE-600](http://cwe.mitre.org/data/definitions/600.html), [CWE-209](http://cwe.mitre.org/data/definitions/209.html), and [CWE-497](http://cwe.mitre.org/data/definitions/497.html) all suggests preventing all sensitive information from reaching a less trusted client while CWE-209 also proposes to store detailed information separately.

The `compliant01.py` code example only demonstrates basic control over errors displayed to a client. It uses a generic error with information already known to the client. A unique hash allows the user to send in error reports that an authorized operator can link to the detailed logs in the back-end. To further prevent attackers from exploring the internal file system of the server, a `PermissionError` is raised when accessing files outside of the `Path.home()` directory, e.g. via a path traversal attack.

Details on other best practices are only mentioned as a TODO comment such as:

* [CWE-180: Incorrect Behavior Order: Validate Before Canonicalize](../../CWE-707/CWE-180/README.md)
* [CWE-390: Detection of Error Condition without Action](../../CWE-703/CWE-390/README.md)
* Rules related to logging ([CWE-117](../../CWE-707/CWE-117/README.md), [CWE-532](../CWE-532/README.md))
* File access, log access control
* Log level, log format in accordance with [rfc5424](https://www.rfc-editor.org/rfc/rfc5424)
* [CWE-778: Insufficient Logging](../../CWE-693/CWE-778/README.md)

Useful internal logging must be resilient against brute force attacks currently not covered in `compliant01.py`.

*[compliant01.py](compliant01.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

from pathlib import Path
import random
import logging
import os


def file_reader(args: list):
    """
    Compliant example demonstrates split and filter error to the user
    It will not go into details on:
    - Proper logging
    - Proper exception handling for each exception scenario.
    """
    filepath = Path(Path.home(), args[0])
    # To avoid path traversal attacks,
    # use the realpath method
    filepath = Path(os.path.realpath(filepath))
    # TODO: follow CWE-180: Incorrect Behavior Order: Validate Before Canonicalize.
    # Depending on the use case, it can include removing special characters
    # from the filename, ensuring it adheres to a predefined regex, etc.
    try:
        # Restrict provided filepath to a chosen directory
        # and throw an exception if user attempt to access confidential areas
        if Path.home() not in filepath.parents:
            raise PermissionError("Invalid file")
        _ = filepath.read_text(encoding='utf8')
    except (PermissionError, IsADirectoryError):
        error_id = f"{random.getrandbits(64):16x}"

        print("***** Backend server-side logging: *****")
        logging.exception("ERROR %s", error_id)

        # TODO: handle the exception in accordance with
        # - CWE-390: Detection of Error Condition without Action
        # TODO: log the error with a unique error_id and apply:
        # - CWE-117: Improper Output Neutralization for Logs
        # - CWE-532: Insertion of Sensitive Information into Log File

        # Present a simplified error to the client
        print("\n***** Frontend 'client' error: *****")
        print(f"ERROR {error_id}: Unable to retrieve file '{filepath.stem}'")


#####################
# Exploiting above code example
#####################
file_reader(["Documents"])

```

When running `compliant01.py`, both the server-side, as well as the client logs will be printed. In this case, it has been done so to clearly display the split between both sides of the communication, but in a real world situation, the server would have its own logger.

**Output of `compliant01.py`:**

```bash
***** Backend server-side logging: *****
ERROR:root:ERROR 457265beb9a5b910
Traceback (most recent call last):
  File "c:\Users\someone\linuxworkspace\SEI_CERT_PYTHON3\Rule07.ERR\ERR01\compliant01.py", line 21, in exception_example
    _ = filepath.read_text(encoding='utf8')
  File "C:\Users\someone\Anaconda3\lib\pathlib.py", line 1266, in read_text
    with self.open(mode='r', encoding=encoding, errors=errors) as f:
  File "C:\Users\someone\Anaconda3\lib\pathlib.py", line 1252, in open
    return io.open(self, mode, buffering, encoding, errors, newline,
  File "C:\Users\someone\Anaconda3\lib\pathlib.py", line 1120, in _opener
    return self._accessor.open(self, flags, mode)
PermissionError: [Errno 13] Permission denied: 'C:\\Users\\someone\\Documents'

***** Frontend 'client' error: *****
ERROR 457265beb9a5b910: Unable to retrieve file 'Documents'
```

## Compliant Solution - Security Policy

The first objective of an implementation must be do allow observing a brute force attack through a centralized logging in accordance with [rfc5424](https://www.rfc-editor.org/rfc/rfc5424). It must be possible to detect a brute force attack automatically.
Consider using one of OWASP's [Blocking_Brute_Force_Attacks](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks) tactics such as gradual delays for human accounts if the need arises.

## Automated Detection

<table>
    <tr>
        <th>Tool</th>
        <th>Version</th>
        <th>Checker</th>
        <th>Description</th>
    </tr>
    <tr>
        <td>Bandit</td>
        <td>1.7.4 on Python 3.10.4</td>
        <td><b>Not available</b></td>
        <td></td>
    </tr>
    <tr>
        <td>Flake8</td>
        <td>8-4.0.1 on Python 3.10.4</td>
        <td><b>Not available</b></td>
        <td></td>
    </tr>
</table>

## Related Vulnerabilities

[[CVE-2013-0773](https://www.cvedetails.com/cve/CVE-2013-0773/)] The Chrome Object Wrapper (COW) in numerous browsers did not prevent prototype modification, which allowed attackers to obtain sensitive data from chrome objects as well as inject JavaScript code.

[[CVE-2021-43536](http://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2021-43536)] Under certain circumstances, asynchronous functions could have caused a navigation to fail but expose the target URL.

[[CVE-2022-27177](https://nvd.nist.gov/vuln/detail/CVE-2022-27177)] A Python format string issue leading to information disclosure and potentially remote code execution in ConsoleMe [[GitHub 2022](https://github.com/Netflix/security-bulletins/blob/master/advisories/nflx-2022-001.md)].
ConsoleMe is a web service that makes AWS IAM [[AWS 2022](https://aws.amazon.com/solutions/case-studies/netflix-aws-reinvent2020-video/)] permissions and credential management easier for end-users and cloud administrators [[PyPi 2022](https://pypi.org/project/consoleme/)].

## Related Guidelines

<table>
    <tr>
        <td>
        <a href="http://cwe.mitre.org/">MITRE CWE</a>
        </td>
        <td>
        Pillar: <a href="https://cwe.mitre.org/data/definitions/664.html">CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)</a>
        </td>
    </tr>
    <tr>
        <td>
        <a href="http://cwe.mitre.org/">MITRE CWE</a>
        </td>
        <td>
        Base: <a href="https://cwe.mitre.org/data/definitions/209.html">CWE-209: Generation of Error Message Containing Sensitive Information (4.13) (mitre.org)</a>
        </td>
    </tr>
    <tr>
        <td>
        <a href="http://cwe.mitre.org/">MITRE CWE</a>
        </td>
        <td>
        <a href="https://cwe.mitre.org/data/definitions/532.html">CWE-532: Insertion of Sensitive Information into Log File (4.13) (mitre.org)</a>
        <br>
        <a href="https://cwe.mitre.org/data/definitions/497.html">CWE-497: Exposure of System Data to an Unauthorized Control Sphere (4.13) (mitre.org)</a>
        <br>
        <a href="https://cwe.mitre.org/data/definitions/600.html">CWE-600: Uncaught Exception in Servlet (4.13) (mitre.org)</a>
        <br>
        <a href="https://cwe.mitre.org/data/definitions/598.html">CWE-598: Use of GET Request Method with Sensitive Query Strings (4.13) (mitre.org)</a>
        <br>
        <a href="https://cwe.mitre.org/data/definitions/524.html">CWE-524: Use of Web Browser Cache Containing Sensitive Information (4.13) (mitre.org)</a>
        </td>
    </tr>
    <tr>
        <td>
        <a href="https://www.rfc-editor.org/rfc/rfc5424">Request for Comments</a>
        </td>
        <td>
        <a href="https://www.rfc-editor.org/rfc/rfc5424">rfc5424: The Syslog protocol</a>
        </td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>
        [<a href="https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns">Mozilla Developers 2025</a>]
        </td>
        <td>
        Mozilla Foundation. (2025). Referer header: Privacy and security concerns [online].<br>
        Available from: <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns">https://developer.mozilla.org/en-US/docs/Web/Security/Referer_header:_privacy_and_security_concerns</a><br>
        [accessed 26 May 2025]
        </td>
    </tr>
    <tr>
        <td>
        [<a href="https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks">OWASP 2022</a>]
        </td>
        <td>
        Open Worldwide Application Security Project. (2022).  Blocking Brute Force Attacks [online].<br>
        Available from: <a href="https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks">https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks</a><br>
        [accessed 26 May 2025]
        </td>
    </tr>
    <tr>
        <td>
        [<a href="https://nvd.nist.gov/vuln/detail/CVE-2022-27177">CVE-2022-27177</a>]
        </td>
        <td>
        National Vulnerability Database. (2022). CVE-2022-27177 Detail [online].<br>
        Available from: <a href="https://nvd.nist.gov/vuln/detail/CVE-2022-27177">https://nvd.nist.gov/vuln/detail/CVE-2022-27177</a><br>
        [accessed 26 May 2025]
        </td>
    </tr>
    <tr>
        <td>
        [<a href="https://github.com/Netflix/security-bulletins/blob/master/advisories/nflx-2022-001.md">GitHub 2022</a>]
        </td>
        <td>
        Netflix Open Source Platform. (2022). Format String Vulnerability in ConsoleMe [online].<br>
        Available from: <a href="https://github.com/Netflix/security-bulletins/blob/master/advisories/nflx-2022-001.md">https://github.com/Netflix/security-bulletins/blob/master/advisories/nflx-2022-001.md</a><br>
        [accessed 26 May 2025]
        </td>
    </tr>
    <tr>
        <td>
        [<a href="https://pypi.org/project/consoleme/">PyPi 2022</a>]
        </td>
        <td>
        Netflix Security. (2022). ConsoleMe [online].<br>
        Available from: <a href="https://pypi.org/project/consoleme/">https://pypi.org/project/consoleme/</a><br>
        [accessed 26 May 2025]
        </td>
    </tr>
    <tr>
        <td>
        [<a href="https://aws.amazon.com/solutions/case-studies/netflix-aws-reinvent2020-video/">AWS 2022</a>]
        </td>
        <td>
        Amazon Web Services. (2022). Untangling multi-account management with ConsoleMe [online].<br>
        Available from: <a href="https://aws.amazon.com/solutions/case-studies/netflix-aws-reinvent2020-video/">https://aws.amazon.com/solutions/case-studies/netflix-aws-reinvent2020-video/</a><br>
        [accessed 26 May 2025]
        </td>
    </tr>
<table>
