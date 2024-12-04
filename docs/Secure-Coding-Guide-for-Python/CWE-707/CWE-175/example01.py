# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Code Example """
import locale
WORD = "Title"
print(WORD.upper())
locale.setlocale(locale.LC_ALL, "tr_TR.utf8")
print(WORD.upper())
