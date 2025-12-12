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
