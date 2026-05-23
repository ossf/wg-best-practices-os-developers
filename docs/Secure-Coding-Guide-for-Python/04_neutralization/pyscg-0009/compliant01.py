# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import os
from pathlib import Path

class FileOperations:
    """Helper class for file system operations"""

    def list_dir(self, dirname: str):
        """List the contents of a directory"""
        path = Path(dirname)
        # TODO: input sanitation
        # TODO: Add secure logging
        if path.is_dir():
            for item in path.iterdir():
                print(item)


#####################
# Trying to exploit above code example
#####################
if "nt" in os.name:
    FileOperations().list_dir("%HOMEPATH% & net user")
if "posix" in os.name:
    FileOperations().list_dir("/etc/shadow; head -1 /etc/passwd")
