""" Compliant Code Example """
import zipfile
from pathlib import Path

MAXSIZE = 100 * 1024 * 1024  # limit is in bytes
MAXAMT = 5  # max amount of files, includes directories in the archive


class ZipExtractException(Exception):
    """Custom Exception"""


def path_validation(input_path, base_path, permit_subdirs=True):
    """Ensure to have only allowed path names"""
    test_path = (Path(base_path) / input_path).resolve()
    if permit_subdirs:
        if not Path(base_path).resolve() in test_path.resolve().parents:
            raise ZipExtractException(f"Filename {test_path} not in {Path(base_path)} directory")
    else:
        if test_path.parent != Path(base_path).resolve():
            raise ZipExtractException(f"Filename {test_path} not in {Path(base_path)} directory")


def extract_files(file, base_path):
    """Unpack zip file into base_path"""
    with zipfile.ZipFile(file, mode="r") as archive:
        dirs = []
        # Validation:
        if len(archive.infolist()) > MAXAMT:
            raise ZipExtractException(f"Metadata check: too many files, limit is {MAXAMT}")
        for zm in archive.infolist():
            if zm.file_size > MAXSIZE:
                raise ZipExtractException(f"Metadata check: {zm.filename} is too big, limit is {MAXSIZE}")
            path_validation(zm.filename, base_path)
            with archive.open(zm.filename, mode='r') as mte:
                read_data = mte.read(MAXSIZE + 1)
                if len(read_data) > MAXSIZE:
                    raise ZipExtractException(f"File {zm.filename} bigger than {MAXSIZE}")

        if not Path(base_path).resolve().exists():
            Path(base_path).resolve().mkdir(exist_ok=True)

        for zm in archive.infolist():
            # Extraction - create directories
            if zm.is_dir():
                dirs.append(Path(base_path).resolve().joinpath(zm.filename))

        for directory in dirs:
            Path.mkdir(directory)

        for zm in archive.infolist():
            with archive.open(zm.filename, mode='r') as mte:
                xpath = Path(base_path).joinpath(mte.name).resolve()
                print(f"Writing file {xpath}")
                # Skip if directory
                if xpath not in dirs:  # check if file is a directory
                    with open(xpath, mode="wb") as filehandle:
                        filehandle.write(read_data)


extract_files("zip_attack_test.zip", "ziptemp")