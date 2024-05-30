""" Non-compliant Code Example """
import zipfile

with zipfile.ZipFile("zip_attack_test.zip", mode="r") as archive:
    archive.extractall()
