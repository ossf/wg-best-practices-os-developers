# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

from pathlib import Path
import random
import logging
import os


def file_reader(args: list):
    """
    Compliant example demonstrates split and filter error to the user
    It will not go into details on:
    - Proper logging
    - Proper exception handling for each exception scenario.
    """
    filepath = Path(Path.home(), args[0])
    # To avoid path traversal attacks,
    # use the realpath method
    filepath = Path(os.path.realpath(filepath))
    # TODO: follow CWE-180: Incorrect Behavior Order: Validate Before Canonicalize.
    # Depending on the use case, it can include removing special characters
    # from the filename, ensuring it adheres to a predefined regex, etc.
    try:
        # Restrict provided filepath to a chosen directory
        # and throw an exception if user attempt to access confidential areas
        if Path.home() not in filepath.parents:
            raise PermissionError("Invalid file")
        _ = filepath.read_text(encoding='utf8')
    except (PermissionError, IsADirectoryError):
        error_id = f"{random.getrandbits(64):16x}"

        print("***** Backend server-side logging: *****")
        logging.exception("ERROR %s", error_id)

        # TODO: handle the exception in accordance with
        # - CWE-390: Detection of Error Condition without Action
        # TODO: log the error with a unique error_id and apply:
        # - CWE-117: Improper Output Neutralization for Logs
        # - CWE-532: Insertion of Sensitive Information into Log File

        # Present a simplified error to the client
        print("\n***** Frontend 'client' error: *****")
        print(f"ERROR {error_id}: Unable to retrieve file '{filepath.stem}'")


#####################
# Exploiting above code example
#####################
file_reader(["Documents"])
