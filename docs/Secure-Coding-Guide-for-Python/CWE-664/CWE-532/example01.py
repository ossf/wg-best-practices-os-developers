# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
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
