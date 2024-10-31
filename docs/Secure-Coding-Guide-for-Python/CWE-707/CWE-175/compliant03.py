# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import locale
locale.setlocale(locale.LC_ALL, 'de_DE.utf8')
ORIGINAL_NUMBER = 12.345  # This will read as 12,345 in German
 
def compare_number(number):
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

## Locale is ('de_DE', 'UTF-8')
## Enter a number: 12,345
## Do the numbers match? True