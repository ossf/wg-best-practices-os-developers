# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

from pathlib import Path


class FileReader:
    """ Class that reads files"""
    def __init__(self, args: list[str]):
        path = Path(Path.home(), args[0])
        fh = open(path, 'r', encoding="utf-8")
        fh.readlines()


#####################
# exploiting above code example
#####################
fr = FileReader(["Documents"])
