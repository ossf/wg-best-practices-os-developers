# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
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
