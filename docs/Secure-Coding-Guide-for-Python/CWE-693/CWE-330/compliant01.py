# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import secrets


def generate_web_token():
    """Better cryptographic number generator"""
    return secrets.token_urlsafe()


#####################
# attempting to exploit above code example
#####################
TOKEN = generate_web_token()
print(f"Your secure token is: {TOKEN}")
