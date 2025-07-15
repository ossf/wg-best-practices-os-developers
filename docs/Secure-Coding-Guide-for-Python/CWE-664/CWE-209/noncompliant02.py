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
            fh = open(path, 'r', encoding="utf-8")
            fh.readlines()
        except OSError as e:
            # TODO: log the original exception
            # For more details, check CWE-693/CWE-778: Insufficient Logging

            # Throw a generic exception instead
            sys.tracebacklimit = 0
            raise Exception("Unable to retrieve file " + str(e.filename)) from None


#####################
# exploiting above code example
#####################
fr = FileReader(["Documents"])
