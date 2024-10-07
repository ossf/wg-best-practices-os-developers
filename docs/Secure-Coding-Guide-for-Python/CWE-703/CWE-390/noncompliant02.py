# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import logging
from pathlib import Path


def exception_example(args: list):
    """Non-compliant Code Example missing handling"""
    file_path = Path(Path.home(), args[0])
    try:
        file_handle = open(file_path, "r", encoding="utf-8")
        _ = file_handle.readlines()
    except Exception as exception:
        logging.exception(exception)


#####################
# exploiting above code example
#####################
exception_example(["goblegoblegoble"])
