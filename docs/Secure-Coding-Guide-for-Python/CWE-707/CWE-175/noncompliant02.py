# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import locale
ORIGINAL_NUMBER = 12.345  # This will read as 12,345 in German
 
def compare_number(number):
    locale.setlocale(locale.LC_ALL, 'de_DE.utf8')
    input_number = locale.atof(input("Enter a number: "))
    # Test if inputted number equals current number
    if number == input_number:
        return True
    else:
        return False


#####################
# Trying to exploit above code example
#####################

print(f"Locale is {locale.getlocale()}")
print(f"Do the numbers match? {compare_number(ORIGINAL_NUMBER)}")

## Locale is ('English_Ireland', '1252')
## Enter a number: 12.345
## Do the numbers match? False