# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import tempfile

with tempfile.NamedTemporaryFile() as temp_file:
    temp_file.write(b'This temporary file will be deleted.')
    temp_file_path = temp_file.name

with open(temp_file_path, 'rb') as temp_file:
    print(temp_file.read())
