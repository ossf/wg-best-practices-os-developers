# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import os
import shlex
from subprocess import run

IS_WINDOWS = "nt" in os.name
IS_LINUX = "posix" in os.name

def list_dir(dirname: str):
    """Lists only 2 levels of folders in a default directory"""
    os.chdir(dirname)
    if IS_WINDOWS:
        cmd = "cmd /c dir {dir} /ad /b"
    elif IS_LINUX:
        cmd = "find . -maxdepth 1 -type d"
    else:
        raise NotImplementedError("Detected OS is not supported")

    print(shlex.split(cmd.format(dir=".")))
    result = run(shlex.split(cmd.format(dir=".")), check=True, capture_output=True)
    if IS_WINDOWS:
        for item in result.stdout.decode("utf-8").splitlines():
            print(item)

    for subfolder in result.stdout.decode("utf-8").splitlines():
        subresult = run(shlex.split(cmd.format(dir=subfolder)), check=True, capture_output=True)
        for item in subresult.stdout.decode("utf-8").splitlines():
            if IS_WINDOWS:
                print(f"{subfolder}\\{item}" if IS_WINDOWS else item)


#####################
# Trying to exploit above code example
#####################
# just to keep it clean we create folder for this test
os.makedirs("temp", exist_ok=True)

# simulating upload area (payload):
print("Testing Corrupted Directory")
if IS_WINDOWS:
    with open("temp/toast.bat", "w", encoding="utf-8") as file_handle:
        file_handle.write("start calc.exe")
    os.makedirs("temp\\temp & toast.bat ", exist_ok=True)
if IS_LINUX:
    with open("temp/toast.sh", "w", encoding="utf-8") as file_handle:
        file_handle.write("uptime\n")
    os.makedirs("temp/. -exec bash toast.sh {} +", exist_ok=True)

# running the query:
list_dir("temp")
