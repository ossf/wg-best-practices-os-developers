# CWE-409: Improper Handling of Highly Compressed Data (Data Amplification)

Prevent slip and bomb attacks when decompressing and unpacking compressed data such as `ZIP`, `TAR.GZ`, `JAR`, `WAR`, `RPM`  or `DOCX`.

Zip is used reprehensively in this rule for all compression formats.

Zip Slip, or directory traversal attacks, use files with a relative path such as `../../../../../bin/bash` or full path `/bin/bash` in order to extract malicious code into an unwanted location [[2018  Snyk](https://snyk.io/blog/zip-slip-vulnerability/)]. Zip slip attacks can be prevented by sanitizing path names as described in _[CWE-180: Incorrect behavior order: Validate before Canonicalize](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Secure-Coding-Guide-for-Python/CWE-707/CWE-180/README.md)_.

Zip bomb attacks try to overload a system that tries to unpack it for a denial-of-service attack by either containing:

* Files with easy to compress patterns such as continuation of zeros [[Luisfontes19 2021](https://thesecurityvault.com/attacks-with-zip-files-and-mitigations/)]
* Ridiculously deep folder structures
* Nested symbolic or hard-links
* Nested zip files
* Manipulated zip headers [[Woot 2019](https://www.bamsoftware.com/talks/woot19-zipbomb/)]

Language specific packaging formats, such as Java `.jar` or Python `.whl`, also use zip for compression.

To run the examples in the page, you can prepare a file by running the script on the page.

_Simple zip bomb generator in [example01.py](example01.py):_

```py
"""Code Example"""
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Code to create a simple zip bomb in python for test purposes"""

import os
import zipfile


def create_zip_slip_and_bomb(zip_filename: str):
    """Create a zip file with zip slip and zip bomb content for testing

    Args:
        zip_filename (str): name of zip file
    """
    with zipfile.ZipFile(zip_filename, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        # Adding a normal safe file at the start
        zip_normal = "safe_dir/zip_normal.txt"
        print(f"Adding a harmless normal file {zip_normal}")
        zf.writestr(zip_normal, b"Just a safe file\n")

        print("Creating zip_slip example files")
        #####################################################
        # Zip Slip attempts:
        # - file with path traversal for unix
        slip_file_name = "../" * 10 + "tmp/zip_slip_posix.txt"
        slip_file_data = b"This test file tries to escape the extraction directory!\n"
        zf.writestr(slip_file_name, slip_file_data)

        # - File with path traversal for Windows
        #   Internally we have zip use slash, even for Windows
        slip_file_name = "../" * 10 + "tmp/zip_slip_windows0.txt"
        zf.writestr(slip_file_name, slip_file_data)

        # - File with path traversal for Windows
        #   Old extractors mishandle backslash
        slip_file_name = ".." * 10 + "Temp\\zip_slip_windows1.txt"
        zf.writestr(slip_file_name, slip_file_data)

        # - Traversal attack with mixed slashes for Windows
        #   Old extractors mishandling mixed slashes
        slip_file_name = "..\\/" * 10 + "Temp\\zip_slip_windows2.txt"
        zf.writestr(slip_file_name, slip_file_data)

        # - Absolute path with drive letter for Windows
        slip_file_name = "C:/Temp/zip_slip_windows3.txt"
        zf.writestr(slip_file_name, slip_file_data)

        ##################################################
        # Zip Bomb Attempts:
        # - With 150MB files filled with zeros
        bomb_uncompressed_size = 150 * 1024 * 1024  # 150 MB
        large_data = b"\0" * bomb_uncompressed_size
        filename = "zipbombfile"

        # - trying to fake the metadata size to 1KB for the first one
        print(f"trying to add fake 1KB metadata for {filename}0.txt")
        info = zipfile.ZipInfo(f"{filename}0.txt)")
        info.compress_type = zipfile.ZIP_DEFLATED
        info.file_size = 1024  # 1 KB (fake size)
        zf.writestr(f"{filename}0.txt", large_data)

        # - Some more large files
        print("Writing more large zipbombfile's")
        for i in range(1, 4):
            zf.writestr(f"{filename}{i}.txt", large_data)

    filesize = os.path.getsize(zip_filename) / float(1024 * 1024)
    print(f"created \n{zip_filename} : {filesize:.2f} MB")


if __name__ == "__main__":
    create_zip_slip_and_bomb("zip_attack_test.zip")
```

Prefabricated zip bombs and zip slip archives for testing can be found on: [[port9org 2025](https://github.com/port9org/SecLists/tree/master/Payloads/Zip-Bombs)]

## Non-Compliant Code Example - No File Validation

The `extractall()` method in `noncompliant01.py` will attempt to normalize the path name while making no attempt to control where the files are extracted to. The script uses the current working directory as a starting point and allows to escape the default path. Any archive from an untrusted source must be inspected prior to extraction and extracted forced below a specific path in order to prevent traversal attacks.

_[noncompliant01.py](noncompliant01.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import zipfile

with zipfile.ZipFile("zip_attack_test.zip", mode="r") as archive:
    archive.extractall()
```

The `noncompliant01.py` code will extract any quantity of payloads. With a unmodified `example01.py` we get only `4 x 150MB` `zipbombfileX.txt`'s that are much bigger than the `0.58MB` `zip_attack_test.zip` archive.

The directory traversal payload will try to extract a `\Temp\zip_slip_windows.txt` for Windows and a `/tmp/zip_slip_posix.txt` for Unix based systems. Depending on the zip library in use the files may either end up in their intended target, under the same directory as the `zipbombfile.txt` files, or not at all.

## Non-Compliant Code Example - Incorrect File Validation

Experiment with the code by varying the `MAXSIZE`.

The `noncompliant02.py` code example tries to check the `file_size` from the `ZipInfo`  instances provided by the `infolist()` method from `ZipFile`. This information is read from the `zip` archive metadata, so it is not reliable and can be forged by an attacker. The `extract()` method will attempt to normalize the path name. Again, there is no attempt to control where the files are extracted to in order to prevent traversal attacks. The underlying zip library may or may not prevent traversal attacks.

_[noncompliant02.py](noncompliant02.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import zipfile

MAXSIZE = 100 * 1024 * 1024  # limit is in bytes

with zipfile.ZipFile("zip_attack_test.zip", mode="r") as archive:
    for member in archive.infolist():
        if member.file_size >= MAXSIZE:
            print(f"Unable to extract {member.filename}, exceeds size {MAXSIZE}")
        else:
            print(f"Extracting {member.filename}")
            archive.extract(member.filename)

```

Depending on the underlying zip library we should see `noncompliant02.py` prevent a zip bomb but not a traversal attack.

__Example `noncompliant02.py` output:__

```bash
Extracting safe_dir/zip_normal.txt
Extracting ../../../../../../../../../../tmp/zip_slip_posix.txt
Extracting ../../../../../../../../../../tmp/zip_slip_windows0.txt
Extracting ....................Temp\zip_slip_windows1.txt
Extracting ..\/..\/..\/..\/..\/..\/..\/..\/..\/..\/Temp\zip_slip_windows2.txt
Extracting C:/Temp/zip_slip_windows3.txt
Unable to extract zipbombfile0.txt, exceeds size 104857600
Unable to extract zipbombfile1.txt, exceeds size 104857600
Unable to extract zipbombfile2.txt, exceeds size 104857600
Unable to extract zipbombfile3.txt, exceeds size 104857600
```

A well manipulated zip archive may be able to fool the `noncompliant02.py` code.

## Compliant Solution

In this example, a base path location needs to be provided from the back-end. This should be isolated on the server using an appropriate mechanism such as a separate partition. To limit the amount of files extracted, the amount of entries is incremented after each file and is monitored until it reaches the limit `MAXAMT`. If `MAXAMT` is reached, an exception is thrown. To check the file size of each file as it is being extracted, the `IO` interface `read()` is used. It will attempt to read until `MAXSIZE` plus one byte. If the length of the read data exceeds `MAXSIZE`, the file is deemed to be too large and an exception is raised.

Please note that the following aspects of the compliant solution:

* The `path_validation()` function will check if the path of each ZIP archive member is in the `base_path`, and if it is not an exception is thrown, A less strict option has also been included to permit subdirectories.
* `MAXSIZE` will need enough RAM dimensioned on the host to hold it in memory
* The code will not retain any permissions on the archive members (for example, some implementations such as `unzip` will store permissions in the external attributes field)

Change the `MAXSIZE` and `MAXAMT` variables to explorer the protection code.

_[compliant01.py](compliant01.py):_

```python
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import zipfile
from pathlib import Path

MAXSIZE = 100 * 1024 * 1024  # limit is in bytes
MAXAMT = 1000  # max amount of files, includes directories in the archive


class ZipExtractException(Exception):
    """Custom Exception"""


def path_validation(filepath: Path, base_path: Path):
    """Ensure to have only allowed path names

    Args:
        filepath (Path): path to archive
        base_path (Path): path to folder for extracting archives

    Raises:
        ZipExtractException: if a directory traversal is detected
    """
    input_path_resolved = (base_path / filepath).resolve()
    base_path_resolved = base_path.resolve()

    if not str(input_path_resolved).startswith(str(base_path_resolved)):
        raise ZipExtractException(
            f"Filename {str(input_path_resolved)} not in {str(base_path)} directory"
        )


def extract_files(filepath: str, base_path: str, exist_ok: bool = True):
    """Extract archive below base_path

    Args:
        filepath (str): path to archive
        base_path (str): path to folder for extracting archives
        exist_ok (bool, optional): Overwrite existing. Defaults to True.

    Raises:
        ZipExtractException: If there are too many files
        ZipExtractException: If the files are too big
        ZipExtractException: If a directory traversal is detected
    """
    # TODO: avoid CWE-209: Generation of Error Message Containing Sensitive Information
    with zipfile.ZipFile(filepath, mode="r") as archive:
        # limit number of files:
        if len(archive.infolist()) > MAXAMT:
            raise ZipExtractException(
                f"Metadata check: too many files, limit is {MAXAMT}"
            )

        # validate by iterating over meta data:
        for item in archive.infolist():
            # limit file size using meta data:
            if item.file_size > MAXSIZE:
                raise ZipExtractException(
                    f"Metadata check: {item.filename} is bigger than {MAXSIZE}"
                )

            path_validation(Path(item.filename), Path(base_path))

        # create target folder
        Path(base_path).mkdir(exist_ok=exist_ok)

        # preparing for extraction, need to create directories first
        # as they may come in random order to the files
        for item in archive.infolist():
            if item.is_dir():
                xpath = Path(base_path).joinpath(item.filename).resolve()
                xpath.mkdir(exist_ok=exist_ok)

        # start of extracting files:
        for item in archive.infolist():
            if item.is_dir():
                continue
            # we got a file
            with archive.open(item.filename, mode="r") as filehandle:
                read_data = filehandle.read(MAXSIZE + 1)
                if len(read_data) > MAXSIZE:
                    # meta data was lying to us, actual size is bigger:
                    raise ZipExtractException(
                        f"Reality check, {item.filename} bigger than {MAXSIZE}"
                    )
                xpath = Path(base_path).joinpath(filehandle.name).resolve()
                with open(xpath, mode="wb") as filehandle:
                    filehandle.write(read_data)
        print(f"extracted successfully below {base_path}")


#####################
# Trying to exploit above code example
#####################

extract_files("zip_attack_test.zip", "ziptemp")

```

The `compliant01.py` code will extract everything below the provided `base_path` unless it detects a to big file or attempt to extract to a different parent then `base_path`.

## Automated Detection

<table>
    <hr>
        <td>Tool</td>
        <td>Version</td>
        <td>Checker</td>
        <td>Description</td>
    </hr>
    <tr>
        <td>SonarQube</td>
        <td>6.7</td>
        <td><a href="https://rules.sonarsource.com/python/RSPEC-5042">S5042</a></td>
        <td>Expanding archive files without controlling resource consumption is security-sensitive</td>
    </tr>
</table>

## Related Guidelines

<table>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Pillar: <a href="https://cwe.mitre.org/data/definitions/664.html"> [CWE-664, Improper Control of a Resource Through its Lifetime]</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/409.html">CWE-409, Improper Handling of Highly Compressed Data (Data Amplification)</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/180.html">CWE-180: Incorrect behavior order: Validate before Canonicalize</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/209.html">CWE-209: Generation of Error Message Containing Sensitive Information</a></td>
    </tr>
    <tr>
        <td>Secure Coding in Python</td>
        <td>Base: <a href="../../CWE-707/CWE-180/README.md">CWE-180: Incorrect behavior order: Validate before Canonicalize</a></td>
    </tr>
    <tr>
        <td>Secure Coding in Python</td>
        <td>Base: <a href="../../CWE-664/CWE-209/README.md">CWE-209: Generation of Error Message Containing Sensitive Information</a></td>
    </tr>
    <tr>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java">[SEI CERT Oracle Coding Standard for Java]</a></td>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/IDS04-J.+Safely+extract+files+from+ZipInputStream">IDS04-J, Safely extract files from ZipInputStream</a></td>
    </tr>
    <tr>
        <td>OWASP Foundation</td>
    <td>WSTG-BUSL-09 Test Upload of Malicious Files, Available from: <a href="https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/09-Test_Upload_of_Malicious_Files">https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/10-Business_Logic_Testing/09-Test_Upload_of_Malicious_Files</a></td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
    <td>[Snyk 2018]</td>
    <td>Public Disclosure of a Critical Arbitrary File Overwrite Vulnerability: Zip Slip | Snyk [online]. Available from: <a href="https://snyk.io/blog/zip-slip-vulnerability/">hhttps://snyk.io/blog/zip-slip-vulnerability/</a>,  [Accessed 15 July 2025]</td>
    </tr>
    <tr>
        <td><a href="https://docs.python.org/">Python Docs</a></td>
        <td>zipfile — Work with ZIP archives — Python 3.10.5 documentation [online]. Available from: <a href="https://docs.python.org/3/library/zipfile.html">https://docs.python.org/3/library/zipfile.html</a> [Accessed 15 July 2025]</td>
    </tr>
    <tr>
        <td>[Woot 2019]</td>
        <td><a href="https://www.bamsoftware.com/talks/woot19-zipbomb/">https://thesecurityvault.com/attacks-with-zip-files-and-mitigations/</a></td>
    </tr>
    <tr>
        <td>[Luisfontes19 2021]</td>
        <td><a href="https://thesecurityvault.com/attacks-with-zip-files-and-mitigations/">https://thesecurityvault.com/attacks-with-zip-files-and-mitigations/</a></td>
    </tr>
    <tr>
        <td>[port9org 2025]</td>
        <td><a href="https://github.com/port9org/SecLists/tree/master/Payloads/Zip-Bombs">https://github.com/port9org/SecLists/tree/master/Payloads/Zip-Bombs</a></td>
    </tr>
</table>
