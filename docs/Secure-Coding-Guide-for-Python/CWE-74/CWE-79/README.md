# CWE-79: Improper Neutralization of Input During Web Page Generation ('Cross-site Scripting')

Ensure that web pages, when generated, completely neutralize untrusted input. One of the most common vulnerabilities today is cross-site scripting (XSS), caused by failure to neutralize untrusted input. This is especially common when generating HTML, but can also occur in URLs, CSS, and JavaScript if they are generated from untrusted input.

This vulnerability is common because it is easy to use string concatenation and format strings to combine constant values with data from a potential attacker.

The proper solution is to use a template system that automatically neutralizes (escapes) all data except for data that is trusted (e.g., constant data) and data *specifically* identified and marked as being trusted. Python does not include, in its built-in libraries, such a template system. There are many such libraries available via PyPI; we encourage you to use one of them. Selecting such a library is outside the scope of this document.

Be certain that the template system you use is configured to automatically escape data. For example, the Jinja2 template engine *can* escape HTML data, and is configured to do so by Flask, but when Jinja2 is used in isolation its default is to *not* escape data by default. You should ensure it's properly escaping data by default. Include tests in your automated test suite to verify this.

Python 3's built-in libraries include [`html.escape`](https://docs.python.org/3/library/html.html#html.escape), which escapes HTML characters in a string. If your Python program is only a few lines long, and you carefully ensure that all untrusted input goes through `html.escape` before being included in HTML, this can also counter HTML generation issues. However, this approach is ineffective as programs get larger. The fundamental flaw is that it requires developers to always call the escape function on every use, so any time a developer forgets to make the call, it becomes a vulnerability. Put another way, this approach makes the default insecure, and as the program is maintained a mistake is bound to happen. Templating systems, in contrast, make the default the secure result.


## Non-Compliant Code Example

The `noncompliant01.py` code example demonstrates this:

*[noncompliant01.py](noncompliant01.py):*

```py
```

## Compliant Solution

A compliant solution uses a templating engine. Selecting a templating engine is out of scope for this document.

## Automated Detection

unknown

## Related Guidelines


## Biblography

