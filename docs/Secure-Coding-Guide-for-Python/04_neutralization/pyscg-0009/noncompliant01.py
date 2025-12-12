# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
from subprocess import Popen
import os


class FileOperations:
    """Helper class for file system operations"""

    def list_dir(self, dirname: str):
        """List the contents of a directory"""
        if "nt" in os.name:
            Popen("dir " + dirname, shell=True).communicate()
        if "posix" in os.name:
            Popen("ls " + dirname, shell=True).communicate()


#####################
# Trying to exploit above code example
#####################
if "nt" in os.name:
    FileOperations().list_dir("%HOMEPATH% & net user")
if "posix" in os.name:
    FileOperations().list_dir("/etc/shadow; head -1 /etc/passwd")
