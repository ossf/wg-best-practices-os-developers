# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
import unicodedata

print("\N{FULL STOP}" * 10)
print("." == unicodedata.normalize("NFC", "\u2024") == "\N{FULL STOP}" == "\u002e")
print("." == unicodedata.normalize("NFD", "\u2024") == "\N{FULL STOP}" == "\u002e")
print("." == unicodedata.normalize("NFKC", "\u2024") == "\N{FULL STOP}" == "\u002e")
print("." == unicodedata.normalize("NFKD", "\u2024") == "\N{FULL STOP}" == "\u002e")
print("\N{FULL STOP}" * 10)
