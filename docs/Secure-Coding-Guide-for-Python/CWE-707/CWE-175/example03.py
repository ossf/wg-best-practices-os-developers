# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import locale
 
def compare_number(number):
    input_number = locale.atof(input(f"Enter a number {number}: "))
    print(f"Locale is {locale.getlocale()}, you entered {input_number}.")
    print(f"Does the number {number} match {input_number}? {number == input_number}")

locale.setlocale(locale.LC_ALL, 'de_DE.utf8')
compare_number(12.345)

# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import locale
ORIGINAL_NUMBER = 12.345  # This will read as 12,345 in German

 
def compare_number(number):
    input_number = locale.atof(input("Enter a number: "))
    # Test if inputted number equals current number
    return number == input_number
    

print(f"Locale is {locale.getlocale()}")
print(f"Do the numbers match? {compare_number(ORIGINAL_NUMBER)}")

## Locale is ('English_Ireland', '1252')
## Enter a number: 12,345
## Do the numbers match? False

# After setting the locale

locale.setlocale(locale.LC_ALL, 'de_DE.utf8')
print(f"Locale is {locale.getlocale()}")
print(f"Do the numbers match? {compare_number(ORIGINAL_NUMBER)}")

## Locale is ('de_DE', 'UTF-8')
## Enter a number: 12,345
## Do the numbers match? True
