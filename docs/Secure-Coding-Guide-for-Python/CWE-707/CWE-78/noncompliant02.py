# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import os
import shlex
from subprocess import run


def list_dir(dirname: str):
    """Lists only 2 levels of folders in a default directory"""
    os.chdir(dirname)
    cmd = "find . -maxdepth 1 -type d"
    result = run(shlex.split(cmd), check=True, capture_output=True)

    for subfolder in result.stdout.decode("utf-8").splitlines():
        cmd = "find " + subfolder + " -maxdepth 1 -type d"
        subresult = run(shlex.split(cmd), check=True, capture_output=True)
        for item in subresult.stdout.decode("utf-8").splitlines():
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
