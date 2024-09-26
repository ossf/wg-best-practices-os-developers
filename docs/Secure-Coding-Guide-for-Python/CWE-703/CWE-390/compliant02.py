# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

from pathlib import Path


def exception_example(args: list):
    """Compliant code demonstrating a simplistic handling.
    input validation or architectural are not demonstrated.
    """
    file_exists = False
    path = Path(Path.home(), args[0])
    while not file_exists:
        try:
            file_handle = open(path, "r", encoding="utf-8")
            file_exists = True
            print(file_handle.readlines())
        except FileNotFoundError:
            print(f"Unable to find file '{path.name}'")
            filename = input("Please provide a valid filename: ")
            path = Path(Path.home(), filename)


#####################
# exploiting above code example
#####################
exception_example(["goblegoblegoble"])
