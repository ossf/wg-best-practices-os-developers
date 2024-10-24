# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import uuid
from pathlib import Path


def read_file(file):
    """Function for opening a file and reading its content."""
    path = Path(file)
    try:
        content = path.read_text(encoding="utf-8")
        return content
    except OSError as e:
        if path.is_dir():
            print(f"Is a directory: {file}")
        elif not path.exists():
            print(f"File not found: {file}")
        else:
            print(f"An error occurred: {e}")
        return None


#####################
# exploiting above code example
#####################
# Attempting to read a random non-existent file
read_file(f"{uuid.uuid4()}.txt")
