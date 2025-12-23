# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
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
