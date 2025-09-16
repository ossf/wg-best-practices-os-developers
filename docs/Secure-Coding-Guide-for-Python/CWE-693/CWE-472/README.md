# CWE-472: External Control of Assumed-Immutable Web Parameter

Ensuring user roles are determined on the server side prevents attackers from manipulating permissions through client-side data.

## Example Code Example

In `example01.py` the `post` function accepts username and action values directly from client-submitted `form_data` without any form of authentication or server-side verification. Non-admin users should only have read permissions, but because the role is taken directly from the user input without verification, an attacker can modify it using browser tools, intercepting proxies like burp suite, or custom scripts to escalate their privileges. The application assumed that the `roles` parameters are immutable and trustworthy, but it is externally controlled and easily manipulated.

[*example01.py:*](example01.py)

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Example Code Example """
from typing import Dict, List


class WebserverConnection:
    """_Simulates grossly simplified webserver_"""
    users = ["admin", "Alice", "Bob"]
    roles: Dict[str, List[str]] = {
        "read": ["admin", "Alice", "Bob"],
        "write": ["admin"],
    }

    def __init__(self, username: str):
        # TODO: implement authentication logic
        pass

    def post(
        self, form_data: Dict[str, str] = {"session_user": "", "action": ""}
    ) -> tuple[Dict[str, str], str]:
        """
        form_data: Represents request data send in by the client
        """
        action = form_data.get("action", "")
        session_user = form_data.get("session_user", "")
        if session_user not in self.users:
            return form_data, "401: Please login"
        action_data = self._submit(session_user, action)
        return form_data, action_data

    def _submit(self, username: str, action: str) -> str:
        if action in self.roles and username in self.roles[action]:
            return f"200: user '{username}' has '{action}' access"
        return f"401: user '{username}' does not have '{action}' access"


#####################
# Attempting to exploit above code example
#####################

# Alice is logged in server-side (session_user is 'Alice')
# User should be authenticated server-side via a session token, cookie or JWT.
USER = "Alice"
web = WebserverConnection(USER)

# expected 'normal' operation with no data:
html_form, body = web.post()
print(f"html_form={html_form}, body={body}")

html_form = {"session_user": USER, "action": "write"}
html_form, body = web.post(html_form)
print(f"html_form={html_form}, body={body}")

# Attacker tries to tamper by adding 'session_user': 'admin' to the html_form
html_form = {"action": "write", "session_user": "admin"}
html_form, body = web.post(html_form)
print(f"html_form={html_form}, body={body}")

```

In the code example, Alice increases her privileges using some browser developer tool, and the service now views her as an admin, with write permissions.

A secure implementation should avoid relying on client-supplied fields like `session_user` for authentication. Instead, session state should be managed securely on the server side using mechanisms like session cookies, JSON Web Tokens with proper validation, or integration with an identity and access management solution (IdAM) such as OpenID Connect (OIDC).

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|MITRE CWE Pillar| [CWE-693: Protection Mechanism Failure (4.12) (mitre.org)](https://cwe.mitre.org/data/definitions/693.html)|
|MITRE CWE Class|[CWE-472: External Control of Assumed-Immutable Web Parameter](http://cwe.mitre.org/data/definitions/472.html)|
|[SEI CERT Oracle Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[IDS14-J. Do not trust the contents of hidden form fields](https://wiki.sei.cmu.edu/confluence/display/java/IDS14-J.+Do+not+trust+the+contents+of+hidden+form+fields)|
