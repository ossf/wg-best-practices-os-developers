# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import zipfile

with zipfile.ZipFile("zip_attack_test.zip", mode="r") as archive:
    archive.extractall()
