import unicodedata

print("\N{FULL STOP}" * 10)
print("." == unicodedata.normalize("NFC", "\u2024") == "\N{FULL STOP}" == "\u002E")
print("." == unicodedata.normalize("NFD", "\u2024") == "\N{FULL STOP}" == "\u002E")
print("." == unicodedata.normalize("NFKC", "\u2024") == "\N{FULL STOP}" == "\u002E")
print("." == unicodedata.normalize("NFKD", "\u2024") == "\N{FULL STOP}" == "\u002E")
print("\N{FULL STOP}" * 10)
