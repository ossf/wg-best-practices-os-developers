# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Code Example"""

import re
import unicodedata


def write_message(input_string: str):
    """Normalize and validate untrusted string before storing

    Parameters:
        input_string(string): String to validate
    """
    message = unicodedata.normalize("NFC", input_string)

    # validate, exclude dangerous tags:
    for tag in re.findall("<[^>]*>", message):
        if tag in ["<script>", "<img", "<a href"]:
            raise ValueError("Invalid input tag")
    return message.encode("utf-8")


def read_message(message: bytes):
    """Simulating another part of the system displaying the content.

    Args:
        message (bytes): bytearray with some data
    """
    print(message.decode("ascii", "ignore"))


#####################
# attempting to exploit above code example
#####################

# attacker:
floppy = write_message("<script生>")

# victim:
read_message(floppy)

