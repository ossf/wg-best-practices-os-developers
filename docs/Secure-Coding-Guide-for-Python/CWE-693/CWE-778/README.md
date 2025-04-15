# CWE-778: Insufficient Logging

Ensure you have sufficient logging in order to adequately record important events within an application and/or system.

This can leave applications vulnerable to undetected attacks, as malicious users are able to perform harmful activities without leaving a trace in the logs. Without comprehensive and sufficient logging, it becomes challenging to identify and respond to security incidents, leading to delayed and/or inefficient incident response efforts.

Insufficient logging also negatively affects forensic analysis, hindering the ability to reconstruct events accurately after a breach.

Writing exceptions to stdout, stderr or local files is not sufficient as:

* The stdout or stderr buffer may be exhausted or closed, preventing subsequent writes
* Trust level of stdout or stderr may be the end-user or attacker
* Logfiles which are only on a local filesystem can be deleted by an attacker

If errors occur while recording logs, they can hinder the logging process unless preventive measures are implemented. Security risks can occur when these errors occur. For example, an attacker hiding crucial security issues by refraining the attacker from being logged. Therefore it is essential that logging functions in applications are effective, even when exceptions arise when completing the logging process.

## Non-Compliant Code Example

In noncompliant01.py, if a risky operation occurs such as the division by zero, the try block catches the ZeroDivisionError exception and prints it to the console without logging it, leaving the system vulnerable to undetected issues. The error print is also vague.

*[noncompliant01.py](noncompliant01.py):*

```python
""" Non-compliant Code Example """
 
try:
    result = 10 / 0
except ZeroDivisionError as e:
    print("Error occurred:", e)
#Continues to execute
```

## Compliant Solution

The security exception output in compliant01.py is using the logger. The program catches the ZeroDivisionError exception and logs it with the "critical" level, ensuring that errors are properly recorded. Production projects should setup log forwarding to a remote logging service.

*[compliant01.py](compliant01.py):*

```python
""" Compliant Code Example """
 
import logging
 
try:
    result = 10 / 0
except ZeroDivisionError:
    logging.critical("Error occurred: Division by zero")
#Continues to execute
```

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.6.2|No Detection||

## Related Guidelines

|||
|:---|:---|
|MITRE CWE Pillar|[CWE-693: Protection Mechanism Failure (4.16) (mitre.org)](https://cwe.mitre.org/data/definitions/693.html)|
|MITRE CWE Base|[CWE-778: Numeric Truncation Error](https://cwe.mitre.org/data/definitions/778.html)|
|[SEI CERT](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[ERR02-J. Prevent exceptions while logging data](https://wiki.sei.cmu.edu/confluence/display/java/ERR02-J.+Prevent+exceptions+while+logging+data)|
