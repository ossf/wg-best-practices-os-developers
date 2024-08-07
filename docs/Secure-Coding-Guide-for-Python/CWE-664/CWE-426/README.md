# CWE-426: Untrusted Search Path

In an environment where an untrusted or less trusted entity can modify the environment variables, consider validating hash-based byte code [Python 2023 Command line and environment].

Python source code `.py` files need to be converted into "byte code" `.pyc` or `.pyo` in memory or in a filesystem `__pycache__` before running on the Python Virtual Machine (PVM) [Dec 2009 PEP 3147].
Python 3.8 [Dec 2009 PEP 3147] also has a backward compatibility mode supporting delivering only byte code.

Python 3.8 introduced the option to customize the `__pycache__` folder via `-X pycache_prefix=PATH`, or the `PYTHONPYCACHEPREFIX` environment variable. An attacker may manipulate the `PYTHONPYCACHEPREFIX` or `PYTHONPATH` to inject their code that can go unnoticed without hash-based verification. Without `--check-hash-based-pycs` Python only compares the byte code against the source code via a timestamp [Python 2023 The import system], potentially allowing an attack.

Python 2.6 also introduced the ability to stop Python from writing "byte code" files via the `-B` flag or `PYTHONDONTWRITEBYTECODE=1` environment variable. However, this does not guarantee full protection.

Byte code files contain a 32-bit 'magic number' to identify the byte code format to determine if the PVM matches. Byte code also uses a naming convention to match up the CPython interpreter down to its minor version, such as `sessions.cpython-39.pyc` for the sessions module compiled with CPython 3.9.

## Non-Compliant Code Example

Setting `--check-hash-based-pycs` to `default` or `never` skips integrity verification of the byte code against its source code and only compares timestamp and size.

The following `noncompliant01.bash` code uses the Python standard library `http.server` as an example of a Python process started from a bash script without hash-based verification:

*[noncompliant01.bash](noncompliant01.bash):*

```bash
# Non-compliant Code Example
python3 -m http.server -b 127.0.0.42 8080
```

An attacker can exploit this by manipulating the `PYTHONPATH` to inject their code that can go unnoticed without hash-based verification as shown in the following example:

*[example01.bash](example01.bash)*

```bash
cd
CWD=$(pwd)
mkdir -p temp/http
touch temp/http/__init__.py
echo "print('hello there')" > temp/http/server.py
export PYTHONPATH=$CWD/temp/

# and now launch again
python3 -m http.server -b 127.0.0.42 8080
```

The `http.server` module is now launched from the `PYTHONPATH` and only prints "hello there" instead of launching the web server.

## Compliant Solution

In the following compliant solution, a user custom `PYTHONPATH` is suppressed with the `-I` isolation flag. This isolates the environment to avoid malicious code injection via `PYTHONPATH`. Additionally, using `--check-hash-based-pycs always` enforces hash-based integrity verification of byte code files against their source code files.

compliant01.bash:

*[compliant01.bash](compliant01.bash):*

```bash
# Compliant Code Example
python3 -I --check-hash-based-pycs always -m http.server -b 127.0.0.42 8080
```

## Exceptions

**ENV-4P-EX0:** Untrusted entities are not able to change environmental variables or any Python files.

## Automated Detection

Currently None.

## Related Vulnerabilities

| Component | CVE | Description  | CVSS rating | Comment |
|:----------|:----|:-------------|:------------|:--------|
| python-dbusmock <=0.15.1 | [CVE-2015-1326](https://nvd.nist.gov/vuln/detail/CVE-2015-1326) | AddTemplate() D-Bus method call or DBusTestCase.spawn_server_template() method could be tricked into executing malicious code if an attacker supplies a .pyc file. | 3.x: 8.8 High | |
| catfish <= 0.6           | [CVE-2014-2095](https://nvd.nist.gov/vuln/detail/CVE-2014-2095) | Fedora package such as 0.8.2-1 is not used, allowing local users to gain privileges via a Trojan horse bin/catfish.pyc under the current working directory. | 2.0: 4.6 Med | |
| catfish <= 0.4.0.3       | [CVE-2014-2094](https://nvd.nist.gov/vuln/detail/CVE-2014-2094) | Local users can gain privileges via a Trojan horse catfish.pyc in the current working directory. | 2.0: 4.6 Med | |

## Related Guidelines

|||
|:---|:---|
|[SEI CERT JAVA](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[ENV04-J. Do not disable bytecode verification - SEI CERT Oracle Coding Standard for Java - Confluence (cmu.edu)](https://wiki.sei.cmu.edu/confluence/display/java/ENV04-J.+Do+not+disable+bytecode+verification)|
| [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard) | [STR02-C. Sanitize data passed to complex subsystems](https://wiki.sei.cmu.edu/confluence/display/c/STR02-C.+Sanitize+data+passed+to+complex+subsystems) |
| [SEI CERT C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682) | [VOID STR02-CPP. Sanitize data passed to complex subsystems](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046726) |
| [SEI CERT Perl Coding Standard](https://wiki.sei.cmu.edu/confluence/display/perl/SEI+CERT+Perl+Coding+Standard) | [IDS33-PL. Sanitize untrusted data passed across a trust boundary](https://wiki.sei.cmu.edu/confluence/display/perl/IDS33-PL.+Sanitize+untrusted+data+passed+across+a+trust+boundary) |
| MITRE | Pillar: [CWE-664: Improper Control of a Resource Through its Lifetime](https://cwe.mitre.org/data/definitions/664.html)<br>Base: [CWE-426: Untrusted Search Path](https://cwe.mitre.org/data/definitions/426.html)|
|[OWASP 2005](https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-OWASP05)|[A Guide to Building Secure Web Applications and Web Services](http://sourceforge.net/projects/owasp/files/Guide/2.0.1/OWASPGuide2.0.1.pdf/download) |

## Biblography

|||
|:---|:---|
|Dec 2009 PEP 3147|[PEP 3147 – PYC Repository Directories \| peps.python.org](https://peps.python.org/pep-3147/)|
|[Python 2023 Command line and environment](https://docs.python.org/3.9/using/cmdline.html#cmdoption-check-hash-based-pycs)|<https://docs.python.org/3.9/using/cmdline.html#cmdoption-check-hash-based-pycs>|
|[Python 2023 The import system](https://docs.python.org/3.9/reference/import.html#pyc-invalidation)|<https://docs.python.org/3.9/reference/import.html#pyc-invalidation>|
|CPython 2023|<https://github.com/python/cpython/blob/main/Lib/importlib/_bootstrap_external.py>|
