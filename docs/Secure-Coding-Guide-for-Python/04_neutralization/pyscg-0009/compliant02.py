# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import os
from pathlib import Path

IS_WINDOWS = "nt" in os.name
IS_LINUX = "posix" in os.name

def list_dir(dirname: str):
    """List the contents of a directory recursively

    Parameters:
        dirname (string): Directory name
    """
    path = Path(dirname)
    allowed_directory = Path.home()
    # TODO: input sanitation
    # TODO: Add secure logging
    if Path(
        allowed_directory.joinpath(dirname)
        .resolve()
        .relative_to(allowed_directory.resolve())
    ):
        for item in path.rglob("*"):
            print(item)


#####################
# Trying to exploit above code example
#####################
os.makedirs("temp", exist_ok=True)
print("Testing Corrupted Directory")
if IS_WINDOWS:
    os.makedirs("temp\\temp; Start-Process calc", exist_ok=True)
if IS_LINUX:
    with open("temp/toast.sh", "w", encoding="utf-8") as file_handle:
        file_handle.write("uptime\n")
    os.makedirs("temp/. -exec bash toast.sh {} +", exist_ok=True)
list_dir("temp")
