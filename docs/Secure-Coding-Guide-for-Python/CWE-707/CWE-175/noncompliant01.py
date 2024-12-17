# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import datetime
import locale

dt = datetime.datetime(2022, 3, 9, 12, 55, 35, 000000)


def get_date(date):
    # Return year month day tuple e.g. 2022, March, 09
    return date.strftime("%Y"), date.strftime("%B"), date.strftime("%d")

#####################
# Trying to exploit above code example
#####################


CURRENT_LOCALE = 'en_IE.utf8'
OTHER_LOCALE = 'uk_UA.utf8'

locale.setlocale(locale.LC_ALL, CURRENT_LOCALE)
# Month is 'March'
curryear, currmonth, currdate = get_date(dt)

locale.setlocale(locale.LC_ALL, OTHER_LOCALE)
# Month is 'березень', i.e. berezen’
otheryear, othermonth, otherdate = get_date(dt)

if currmonth == othermonth:
    print("Locale-dependent months are equal")
else:
    print("Locale-dependent months are not equal")
