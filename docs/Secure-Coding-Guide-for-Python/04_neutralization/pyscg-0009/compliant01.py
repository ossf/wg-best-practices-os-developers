# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import os
from pathlib import Path


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
        for item in path.glob("*"):
            print(item)


#####################
# Trying to exploit above code example
#####################
# just to keep it clean we create folder for this test
os.makedirs("temp", exist_ok=True)

# simulating upload area (payload):
print("Testing Corrupted Directory")
if "posix" in os.name:
    with open("temp/toast.sh", "w", encoding="utf-8") as file_handle:
        file_handle.write("uptime\n")
    os.makedirs("temp/. -exec bash toast.sh {} +", exist_ok=True)

# running the query:
list_dir("temp")
