""" Non-compliant Code Example """
import zipfile

MAXSIZE = 100 * 1024 * 1024 # limit is in bytes

with zipfile.ZipFile("zip_attack_test.zip", mode="r") as archive:
    for member in archive.infolist():
        if member.file_size >= MAXSIZE:
            print(f"Unable to extract {member.filename}, exceeds size {MAXSIZE}")
        else:
            print(f"Extracting {member.filename}")
            archive.extract(member.filename)
