# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

from pathlib import Path
import sys


class FileReader:
    """ Class that reads files"""
    def __init__(self, args: list):
        path = Path(Path.home(), args[0])
        try:
            file_handle = open(path, 'r', encoding="utf-8")
            file_handle.readlines()
        except (PermissionError, FileNotFoundError, IsADirectoryError):
            # Re-throw exception without details
            sys.tracebacklimit = 0
            raise BaseException() from None


#####################
# exploiting above code example
#####################
fr = FileReader(["Documents"])
