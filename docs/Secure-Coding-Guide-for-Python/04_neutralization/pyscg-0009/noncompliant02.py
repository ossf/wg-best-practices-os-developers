# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import os
import shlex
from subprocess import run

IS_WINDOWS = "nt" in os.name
IS_LINUX = "posix" in os.name


def list_dir(dirname: str):
    """Lists folders and their subfolders using shell commands"""
    os.chdir(dirname)
    if IS_WINDOWS:
        cmd = "powershell -NoProfile -Command Get-ChildItem -Directory -Name | Sort-Object -Descending"
    elif IS_LINUX:
        cmd = "find . -maxdepth 1 -type d"
    else:
        raise NotImplementedError("Detected OS is not supported")

    result = run(shlex.split(cmd), check=True, capture_output=True)
    for subfolder in result.stdout.decode("utf-8").splitlines():
        if IS_WINDOWS:
            cmd = "powershell -NoProfile -Command Get-ChildItem " + subfolder
        elif IS_LINUX:
            cmd = "find " + subfolder + " -maxdepth 1 -type d"
        subresult = run(shlex.split(cmd), check=True, capture_output=True)
        for item in subresult.stdout.decode("utf-8").splitlines():
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