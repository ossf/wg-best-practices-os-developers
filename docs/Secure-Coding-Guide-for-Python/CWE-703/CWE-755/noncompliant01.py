# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import os
import uuid


def read_file(file):
    """Function for opening a file and reading it's content."""
    fd = os.open(file, os.O_RDONLY)
    content = os.read(fd)
    return content.decode()


#####################
# exploiting above code example
#####################
# Attempting to read a random non-existent file
read_file(f"{uuid.uuid4()}.txt")
