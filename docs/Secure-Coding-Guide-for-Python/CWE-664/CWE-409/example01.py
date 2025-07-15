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
