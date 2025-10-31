# CWE-175: Improper Handling of Mixed Encoding

Locale-dependent programs may produce unexpected behavior or security bypasses in an environment whose locale is unset, or not set to an appropriate value.

In Python, the `locale` module will never perform case conversions or character classifications according to the locale [[Python 3.9 locale](https://docs.python.org/3.9/library/locale.html)]. Python follows the Unicode conventions for text [[Python Issue 34928](https://bugs.python.org/issue34928)], and this behavior may not match the user's expectation in their native language. Some characters, such as the German ß (eszett), Greek Σ (sigma) also have particular rules in Unicode that may not match native usage and need to be handled carefully. Also, be aware of differences in other languages that use right-to-left ordering (e.g. Arabic) and languages which use CJK characters.

>[!NOTE]
> Running the code examples for this rule might generate the following error message: `locale.Error: unsupported locale setting`
> It's usually thrown when the locales used for the examples are not available on the OS. For these examples, you will need the following locales:
>
> * de_DE.utf8
> * en_IE.utf8
> * tr_TR.utf8
> * uk_UA.utf8
>
> The method of installing locales depends on the OS. To install locales on Debian, do the following:
>
> 1. run `sudo dpkg-reconfigure locales`
> 2. select the needed locales (make sure they are uncommented in /etc/locale.gen)
> 3. run `sudo locale-gen`

For example, Python does not handle the Turkish dotted-i as expected.

[*example01.py:*](example01.py)

```py
""" Code Example """
import locale
WORD = "Title"
print(WORD.upper())
locale.setlocale(locale.LC_ALL, "tr_TR.utf8")
print(WORD.upper())

```

This code example incorrectly assumes that the uppercasing rules in Turkish will be followed. The expected output is "TİTLE" (with capital dotted-i), but instead the value outputted by the code is "TITLE" (with capital dotless-i). The only way to ensure capitalization is handled correctly is either manually mapping upper-case characters or using an external library, such as [PyICU](https://pypi.org/project/PyICU/).

A real-world example of this confusion occurred in an SMS message and featured in the tragic consequences. [[Language Log 2008](https://languagelog.ldc.upenn.edu/nll/?p=73)]

Other internationalization concerns, like date, time and currency formats need to be considered if parsing data external to the program. This is only a primer and it is expected that the developer will test all languages and locales where the program is designed to run.

## Non-Compliant Code Example (`datetime`)

The Gregorian calendar is used across the world, but there are different names for the months in different locations. `strftime()` returns the locale-dependent name of the month, and if this is mishandled it will result in bad comparisons.\
In this example, `strftime("%B")` in the English (Ireland) locale returns "March", whereas `strftime("%B")` in the Ukrainian (Ukraine) locale returns "березень". These values will not compare successfully.

*[noncompliant01.py](noncompliant01.py):*

```python
""" Non-compliant Code Example """
import datetime
import locale

dt = datetime.datetime(2022, 3, 9, 12, 55, 35, 000000)


def get_date(date):
    # Return year month day tuple e.g. 2022, March, 09
    return date.strftime("%Y"), date.strftime("%B"), date.strftime("%d")

#####################
# Trying to exploit above code example
#####################


CURRENT_LOCALE = 'en_IE.utf8'
OTHER_LOCALE = 'uk_UA.utf8'

locale.setlocale(locale.LC_ALL, CURRENT_LOCALE)
# Month is 'March'
curryear, currmonth, currdate = get_date(dt)

locale.setlocale(locale.LC_ALL, OTHER_LOCALE)
# Month is 'березень', i.e. berezen’
otheryear, othermonth, otherdate = get_date(dt)

if currmonth == othermonth:
    print("Locale-dependent months are equal")
else:
    print("Locale-dependent months are not equal")

```

## Compliant Solution (`datetime`)

It is better to avoid locale-dependent comparisons if possible. Using `datetime` without using locale-dependent functions allows the comparison to succeed.
When using `setlocale()`, ensure that it is not set in libraries or set more than once in multi-threaded programs. [[Python 3.9 locale](https://docs.python.org/3.9/library/locale.html)]

*[compliant01.py](compliant01.py):*

```python
""" Compliant Code Example """
import datetime
import locale

dt = datetime.datetime(2022, 3, 9, 12, 55, 35, 000000)

CURRENT_LOCALE = 'en_IE.utf8'
OTHER_LOCALE = 'uk_UA.utf8'

#####################
# Trying to exploit above code example
#####################

locale.setlocale(locale.LC_ALL, CURRENT_LOCALE)
# Month is 'March'
currmonth = dt.month
locale.setlocale(locale.LC_ALL, OTHER_LOCALE)
# Month is 'березень', i.e. berezen’
othermonth = dt.month

if currmonth == othermonth:
    print("Locale-independent months are equal")
else:
    print("Locale-independent months are not equal")

```

## Compliant Solution (Explicit Locale)

Set the locale to the locale the program was developed or validated against, to ensure that locale-dependent programs are not affected by running on a system with a different locale.

*[example02.py](example02.py):*

```python
""" Code Example """
import locale
CURRENT_LOCALE = 'en_IE.utf8'
locale.setlocale(locale.LC_ALL, CURRENT_LOCALE)

```

For example, reading values from a data file values might be misinterpreted if the developer is unaware that the program locale does not accommodate the data locale.

The `example03.py` code does not set a locale and sets `ORIGINAL_NUMBER` for comparison to 12.345 (twelve point three-four-five). In Ireland, a comma is a thousands separator and a dot is a decimal separator. In Germany these are reversed, so a comma is a decimal separator and a decimal is a thousands separator.
The user may assume they are using the English (Ireland) locale as it is not set. A German (Germany) locale is set in `compare_number()`. 12.345 is input at the prompt, they will not match as the German locale interprets this as 12,345 (twelve thousand, three hundred and forty-five).

Ensure that there is no mismatch between the locale of the running program and the input data. Agree on one locale to be used for data input or permit the user to specify a locale when parsing data.
In this case, after displaying the issue, the agreed upon locale is set and the number is interpreted correctly as long as the user follows the format of the locale.

When using `setlocale()`, ensure that it is not set in libraries or set more than once in multi-threaded programs. [[Python 3.9 locale](https://docs.python.org/3.9/library/locale.html)]

*[example03.py](example03.py):*

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """
import locale
ORIGINAL_NUMBER = 12.345  # This will read as 12,345 in German


def compare_number(number):
    input_number = locale.atof(input(f"Enter a number {ORIGINAL_NUMBER}: "))
    # Test if inputted number equals current number
    return number == input_number


locale.setlocale(locale.LC_ALL, 'English_Ireland.1252')
print(f"Locale is {locale.getlocale()}")
print(f"Do the numbers match? {compare_number(ORIGINAL_NUMBER)}")

# Console output:
# Locale is ('English_Ireland', '1252')
# Enter a number: 12.345
# Do the numbers match? True

# After setting the locale

locale.setlocale(locale.LC_ALL, 'de_DE.utf8')
print(f"Locale is {locale.getlocale()}")
print(f"Do the numbers match? {compare_number(ORIGINAL_NUMBER)}")

# Console output:
# Locale is ('de_DE', 'UTF-8')
# Enter a number: 12.345
# Do the numbers match? False

```

## Non-Compliant Code Example (Encoding)

The developer should be aware of the text encoding that is used for input data and output data in the program. The code example attempts to use `UTF-16 LE` encoding to read the LOREM `TextIOWrapper` stream which raises a `UnicodeDecodeError` exception as it was created with `UTF-8`.

*[noncompliant02.py](noncompliant02.py):*

```python
""" Non-compliant Code Example """
import io

LOREM = """Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."""

output = io.BytesIO()
wrapper = io.TextIOWrapper(output, encoding='utf-8', line_buffering=True)
wrapper.write(LOREM)
wrapper.seek(0, 0)
# Below outputs UnicodeDecodeError: 'utf-16-le' codec can't decode byte 0x2e in position 1336: truncated data
print(f"{len(output.getvalue().decode('utf-16le'))} characters in string")

```

## Compliant Solution (Encoding)

The correct text encoding, `UTF-8` for the LOREM `TextIOWrapper` stream has been included in the program. Ensure the encoding of data is known and explicitly stated when parsing and creating data.

*[compliant02.py](compliant02.py):*

```python
""" Compliant Code Example """
import io

LOREM = """Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."""

output = io.BytesIO()
wrapper = io.TextIOWrapper(output, encoding='utf-8', line_buffering=True)
wrapper.write(LOREM)
wrapper.seek(0, 0)
# 1337 characters in string
print(f"{len(output.getvalue().decode('utf-8'))} characters in string")

```

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Pylint|2.14.4|[W1514](https://pylint.pycqa.org/en/latest/user_guide/messages/warning/unspecified-encoding.html)|Using open without explicitly specifying an encoding (unspecified-encoding)|

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar: [CWE-707: Improper Neutralization (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/707.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Variant: [CWE-175: Improper Handling of Mixed Encoding (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/175.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[STR02-J. Specify an appropriate locale when comparing locale-dependent data](https://wiki.sei.cmu.edu/confluence/display/java/STR02-J.+Specify+an+appropriate+locale+when+comparing+locale-dependent+data)|

## Bibliography

|||
|:---|:---|
|[[Python 3.9 locale](https://docs.python.org/3.9/library/locale.html)]|Python Software Foundation. (2024). locale — Internationalization services [online]. Available from: [https://docs.python.org/3.9/library/locale.html](https://docs.python.org/3.9/library/locale.html) [accessed 31 October 2024] |
|[[Python Issue 34928](https://bugs.python.org/issue34928)]|Python Software Foundation. (2024). string method .upper() converts 'ß' to 'SS' instead of 'ẞ' [online]. Available from: [https://bugs.python.org/issue34928](https://bugs.python.org/issue34928) [accessed 31 October 2024] |
|[[Language Log 2008](https://languagelog.ldc.upenn.edu/nll/?p=73)]|Poser, B. (2008). Two Dots Too Many [online]. Available from: [https://languagelog.ldc.upenn.edu/nll/?p=73](https://languagelog.ldc.upenn.edu/nll/?p=73) [accessed 31 October 2024] |
