# CWE-134: Use of Externally-Controlled Format String

Ensure that all format string functions are passed a static string which cannot be controlled by the user [[MITRE 2023]](https://cwe.mitre.org/data/definitions/134.html)

In Python, the use of string formatting combined with the ability to access a function's `__globals__` attribute can exposing internal variables and methods unless properly guarded.

## Non-Compliant Code Example

This [noncompliant01.py](noncompliant01.py) leaks the global `ENCRYPTION_KEY`  variable due to `MESSAGE + customer` creating a new `message_format` template that is then used as a template during print.

*[noncompliant01.py](noncompliant01.py):*

```python
""" Non-compliant Code Example """
import sys

# Simulating a global include of sensitive information:
ENCRYPTION_KEY = "FL4G1"

# Simulating a include per language:
MESSAGE = "Contract '{0.instance_name}' created for "


class MicroService:
    """Fancy MicroService"""
    def __init__(self, instance_name):
        self.instance_name = instance_name


def front_end(customer):
    """Display service instance"""
    message_format = MESSAGE + customer
    mc = MicroService("big time microservice")
    print(message_format.format(mc))


#####################
# exploiting above code example
#####################
if __name__ == "__main__":
    if len(sys.argv) > 1:  # running from command line
        # you can print the global encryption key by using '{0.__init__.__globals__[ENCRYPTION_KEY]}' as
        # argument.
        front_end(sys.argv[1])
    else:
        # running in your IDE, simulating command line:
        # Printing the ENCRYPTION_KEY via the global accessible object
        front_end("{0.__init__.__globals__[ENCRYPTION_KEY]}")

```

When `front_end("{0.__init__.__globals__[ENCRYPTION_KEY]}")` is called:

* `str.format()` method is called on the `message_format` string.
* The `{0}` in the format string is replaced with the first argument of `format()`, which is mc, an instance of `MicroService`.
* `__init__` accesses the constructor method of the MicroService class from the mc object.
* `__globals__` accesses the global variables available to the `__init__` method, which includes `ENCRYPTION_KEY`.
* `[ENCRYPTION_KEY]` fetches the value of `ENCRYPTION_KEY` from the `__globals__` dictionary.

## Compliant Solution

The `compliant01.py` solution uses the string template module and avoids mixing different ways of assembling the text. It is considered the safest option for string templates [[Bader 2023]](https://realpython.com/python-string-formatting/)|. It also provides a getter for instance name `get_instance_name` to reduce mixed access to members of `MicroService`.

*[compliant01.py](compliant01.py):*

```python
""" Compliant Code Example """
import sys
from string import Template

# Simulating a global include of sensitive information:
ENCRYPTION_KEY = "FL4G1"

# Simulating a include per language for international support:
MESSAGE = Template("Contract '$instance_name' created for '$customer'")


class MicroService:
    """Fancy MicroService"""
    def __init__(self, instance_name):
        self.instance_name = instance_name

    def get_instance_name(self) -> str:
        """return instance_name as string"""
        return self.instance_name


def front_end(customer) -> str:
    """Display service instance"""
    mc = MicroService("big time microservice")
    print(MESSAGE.substitute(instance_name=mc.get_instance_name(),
                             customer=customer))


#####################
# exploiting above code example
#####################
if __name__ == "__main__":
    if len(sys.argv) > 1:  # running from command line
        # you can print the global encryption key by using '{0.__init__.__globals__[ENCRYPTION_KEY]}' as
        # argument.
        front_end(sys.argv[1])
    else:
        # running in your IDE, simulating command line:
        # Printing the ENCRYPTION_KEY via the global accessible object
        front_end("{0.__init__.__globals__[ENCRYPTION_KEY]}")

```

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Pylint|2.13.9 on Python 3.10.4|Formatting a regular string which could be a f-stringpylint(consider-using-f-string)||
|flake8|flake8-4.0.1 on python 3.10.4||FS002 '.format' used|
|[pycharm-python-security-scanner](https://github.com/marketplace/actions/pycharm-python-security-scanner)|1.25.1|STR100|Calling format with insecure string|

## Related Vulnerabilities

|Product|CVE|Description|CVSS Rating|Comment|
|:----|:----|:----|:----|:----|
|ConsoleMe < 1.2.2|[CVE-2022-27177](https://www.cvedetails.com/cve/CVE-2022-27177/)|v3.1:9.8|A Python format string issue leading to information disclosure and potentially remote code execution.||
|Zenoss Core < 4.2.5|[CVE-2014-6262](https://www.cvedetails.com/cve/CVE-2014-6262/) ZEN-15415|Multiple format string vulnerabilities in the python module in RRDtool allow remote attackers to execute arbitrary code or cause a denial of service using the rrdtool.graph function.|v3.1:7.5|related issue to CVE-2013-2131.|
|RRDTool < 1.4.6|[CVE-2013-2131](https://www.cvedetails.com/cve/CVE-2013-2131/)|Format string vulnerability in the rrdtool module 1.4.7 for Python, allows context-dependent attackers to cause a denial of service (crash) via format string specifiers to the rrdtool.graph function.|||

## Related Guidelines

|||
|:---|:---|
|[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[FIO30-C Exclude user input from format strings](https://wiki.sei.cmu.edu/confluence/display/c/FIO30-C.+Exclude+user+input+from+format+strings)|
|[SEI CERT Perl Coding Standard](https://www.securecoding.cert.org/confluence/display/perl/CERT+Perl+Secure+Coding+Standard)|[IDS30-PL. Exclude user input from format strings](https://www.securecoding.cert.org/confluence/display/perl/IDS30-PL.+Exclude+user+input+from+format+strings)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[IDS06-J. Exclude unsanitized user input from format strings](https://wiki.sei.cmu.edu/confluence/display/java/IDS06-J.+Exclude+unsanitized+user+input+from+format+strings)|
|[ISO/IEC TR 24772:2013](https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-ISO/IECTR24772-2013)|Injection [RST]|
|[MITRE CWE Pillar](http://cwe.mitre.org/)|[CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-134, Uncontrolled Format String](http://cwe.mitre.org/data/definitions/134.html)|

## Bibliography

|||
|:---|:---|
|[[Python 3.10.4 docs]](https://docs.python.org/3/library/string.html#formatstrings)|Format String Syntax. Available from: <https://docs.python.org/3/library/string.html#formatstrings> \[Accessed 5 May 2024]|
|[[MITRE 2023]](https://cwe.mitre.org/data/definitions/134.html)|CWE - CWE-134: Use of Externally-Controlled Format String (4.13) (mitre.org) Available from: <https://cwe.mitre.org/data/definitions/134.html> \[Accessed 5 May 2024]|
|[[Bader 2023]](https://realpython.com/python-string-formatting/)|Python String Formatting Best Practices – Real Python. Available from: <https://realpython.com/python-string-formatting/> \[Accessed 5 May 2024]|
