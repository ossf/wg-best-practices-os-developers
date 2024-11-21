# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import datetime
import locale
 
dt = datetime.datetime(2022, 3, 9, 12, 55, 35, 000000)

#####################
# Trying to exploit above code example
#####################

locale.setlocale(locale.LC_ALL, CURRENT_LOCALE)
# Month is 'March'
currmonth = dt.month
locale.setlocale(locale.LC_ALL, OTHER_LOCALE)
# Month is 'березень', i.e. berezen’
othermonth = dt.month
 
if currmonth == othermonth:
    print("Locale-independent months are equal")
else:
    print("Locale-independent months are not equal")