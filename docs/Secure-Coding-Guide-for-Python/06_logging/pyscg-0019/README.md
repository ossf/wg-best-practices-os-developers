# pyscg-0019: Avoid Sensitive Data in Logs

Do not log any sensitive information such as passwords or credit card numbers. Encrypt or anonymize personal information such as user names, and date of birth in plain text.

Logging is crucial for tasks like debugging, forensic analysis, and the general management of various incidents, however, it poses significant challenges when it comes to personal information and sensitive information.

National authorities have fines for data protection violations such as:

* California Consumer Privacy Act (CCPA) USA [CCPA DIVISION 3. OBLIGATIONS [1427 - 3273.16]](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.150)
* General Data Protection Regulation (GDPR) [Fines / Penalties - General Data Protection Regulation (GDPR) (gdpr-info.eu)](https://gdpr-info.eu/issues/fines-penalties/)

Cross-border data transfer regulations limit what type of data can be transferred across borders even within a single company or organization such as the [Rules on international data transfers - European Commission (europa.eu)](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/rules-international-data-transfers_en)

Software applications often offer different levels of data protection. Certain data, such as access times, can be logged without concern. Other data can be logged but should be accessible only to specific administrators. Sensitive information, such as credit card numbers, should be logged only in encrypted form, while passwords should never be logged. [[SEI CERT 2021 FIO13-J. Do not log sensitive information outside a trust boundary]](https://wiki.sei.cmu.edu/confluence/display/java/FIO13-J.+Do+not+log+sensitive+information+outside+a+trust+boundary)

## Noncompliant Code Example (Logging)

In the `noncompliant01.py` code example the user is asked to input sensitive information during login, and the entered information is logged.

In a real-world scenario, the logging data printed by the `noncompliant01.py` would have to be forwarded to a central logging system.

Storing or displaying a password typically exposes it to a wider audience and must be avoided.

*[noncompliant01.py](noncompliant01.py):*

```py
""" Non-compliant Code Example """
 
import logging
 
 
def login_user(username, password, security_question):
    """Function to login user with username password, and security question"""
    logging.info(
        "User %s login attempt: password=%s, security answer=%s",
        username, password, security_question
    )
 
    # Continue to other login functionality
 
 
def main():
    """Main function showing login functionality"""
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    username = input("Enter your username: ")
    password = input("Enter your password: ")
    security_question = input("What is the name of your favorite pet?: ")
    login_user(username, password, security_question)
 
 
main()
```

## Example Solution

The `example01.py` solution uses a custom filter in Python's logging module to automatically mask sensitive data in the logs. While this is a good solution for central handling in large software project it does require that all modules use the same string such as `password=`, variations such as `pass=` or pass: won't work and continue to print the plain text password.

*[example01.py](example01.py):*

```py
""" Code Example """
 
import logging
import re
 
 
class RedactingFilter(logging.Filter):
    """Function to redact any sensitive information from getting logged"""
    def filter(self, record):
        message = record.getMessage()
 
        # Perform redactions on copy of message
        message = re.sub(r"password=\S+", "password=REDACTED", message)
        message = re.sub(r"security_question_answer=\S+",
                         "security_question_answer=REDACTED", message)
 
        record.msg = message
        record.args = ()  # Clear args to prevent further formatting attempts
 
        return True
 
 
def login_user(username, password, security_question):
    """Function to login user with username password, and security question"""
    logging.info(
        "User %s login attempt: password=%s, security_question_answer=%s",
        username,
        password,
        security_question,
    )
 
    # Continue to other login functionality
 
 
def main():
    """Main function showing login functionality"""
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
 
    # Add the custom filter to the logger
    redacting_filter = RedactingFilter()
    logger.addFilter(redacting_filter)
    username = input("Enter your username: ")
    password = input("Enter your password: ")
    security_question = input("What is the name of your favorite pet?: ")
 
    login_user(username, password, security_question)
 
 
main()
```

## Compliant Solution (Logging)

The `compliant01.py` solution doesn't log any sensitive information in the first place, which is a more ideal solution and position to be in.  Instead of trying to conceal logged strings at a later stage, control over "classification" is decided during the collection/creation of the data.

*[compliant01.py](compliant01.py):*

```py
""" Compliant Code Example """
 
import logging
 
 
def login_user(username, password, security_question):
    """Function to login user with username password, and security question"""
    logging.info("User %s login attempt", username)
 
    # Continue to other login functionality
 
 
def main():
    """Main function showing login functionality"""
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    username = input("Enter your username: ")
    password = input("Enter your password: ")
    security_question = input("What is the name of your favorite pet?: ")
    login_user(username, password, security_question)
 
 
main()
```

## Non-Compliant Code Example (Debugging)

For security purposes, sensitive information should never be printed to the console in log messages (for instance, a passenger's age). In Python's logging module, there are five logging levels:

* `DEBUG`
* `INFO`
* `WARNING` (default)
* `ERROR`
* `CRITICAL`

If we set the level to `DEBUG` or `INFO` we will see the info and debug logs being printed to the console.
The `noncompliant02.py` code has the log level set to DEBUG is causing the customer's address to appear in the console.

*[noncompliant02.py](noncompliant02.py):*

```py
""" Non-compliant Code Example """
 
import logging
 
 
def process_order(address):
    """Function for processing some online order"""
    logging.basicConfig(format='%(asctime)s %(levelname)s:%(message)s',
                        level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    logger.info("Initial logging level: %s",
                logging.getLevelName(logger.getEffectiveLevel()))
    logger.debug("Processing order for address: %s", address)
 
    # Continue to process the order.
 
 
process_order("10 Grafton Street")
```

## Compliant Solution (Debugging)

In the `compliant02.py` solution we set the log level to INFO , this ensures that only Info logs will get outputted to the console. The log level should only be set to DEBUG when the code is not on a live deployment. This configuration should be managed at the service or deployment level, not within individual code files.

*[compliant02.py](compliant02.py):*

```py
""" Compliant Code Example """
 
import logging
 
 
def process_order(address):
    logging.basicConfig(
        format="%(asctime)s %(levelname)s:%(message)s", level=logging.INFO
    )
    logger = logging.getLogger(__name__)
 
    logger.info("Initial logging level: %s", logger.getEffectiveLevel())
 
    logger.debug("Processing order for address: %s", address)
 
    # Continue to process the order.
 
 
process_order("10 Grafton Street")
```

## Related Guidelines

|||
|:---|:---|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java?src=breadcrumbs)|[FIO13-J. Do not log sensitive information outside a trust boundary - SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/FIO13-J.+Do+not+log+sensitive+information+outside+a+trust+boundary)|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-359](http://cwe.mitre.org/data/definitions/359.html), Privacy Violation|
|[MITRE CWE Base](http://cwe.mitre.org/)|[CWE-532](http://cwe.mitre.org/data/definitions/532.html), Information Exposure through Log Files|
|[MITRE CWE Pillar](http://cwe.mitre.org/)| [CWE-664](https://cwe.mitre.org/data/definitions/664.html), Improper Control of a Resource Through its Lifetime|
|[RFC](https://www.rfc-editor.org/)| [RFC 5424: The Syslog Protocol](https://www.rfc-editor.org/rfc/rfc5424.html)|

## Automated Detection

|Tool|Version|Checker|Description|
|:----|:----|:----|:----|
|[Pylint](https://pylint.pycqa.org/)|2023.10.1|[W1203:logging-fstring-interpolation](https://pylint.readthedocs.io/en/latest/user_guide/messages/warning/logging-fstring-interpolation.html)|Use lazy % formatting in logging functions|

## Biblography

|||
|:---|:---|
|(Python Software Foundation 2023)|[logging - Logging facility for Python](https://docs.python.org/3/library/logging.html) [accessed 11 May 2023]|
|California Consumer Privacy Act (CCPA) USA|[CCPA DIVISION 3. OBLIGATIONS [1427 - 3273.16]](https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=CIV&sectionNum=1798.150) [accessed 16 October 2024]|
|General Data Protection Regulation (GDPR)|[Fines / Penalties - General Data Protection Regulation (GDPR) (gdpr-info.eu)](https://gdpr-info.eu/issues/fines-penalties/) [accessed 16 October 2024]|
|European Commission International Data Protection|[Rules on international data transfers](https://commission.europa.eu/law/law-topic/data-protection/international-dimension-data-protection/rules-international-data-transfers_en) [accessed 16 October 2024]|
