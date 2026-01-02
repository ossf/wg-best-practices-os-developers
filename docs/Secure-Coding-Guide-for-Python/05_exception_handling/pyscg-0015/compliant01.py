# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import os
import uuid


def read_file(file):
    """Function for opening a file and reading its content."""
    try:
        fd = os.open(file, os.O_RDONLY)
        try:
            content = os.read(fd, 1024)
        finally:
            os.close(fd)
        return content.decode()
    except OSError as e:
        if not os.path.exists(file):
            print(f"File not found: {file}")
        elif os.path.isdir(file):
            print(f"Is a directory: {file}")
        else:
            print(f"An error occurred: {e}")


#####################
# exploiting above code example
#####################
# Attempting to read a random non-existent file
read_file(f"{uuid.uuid4()}.txt")
