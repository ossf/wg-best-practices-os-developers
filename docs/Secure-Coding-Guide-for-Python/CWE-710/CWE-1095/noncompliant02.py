# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
userdict = {'Alice': 'active', 'Bob': 'inactive', 'Charlie': 'active'}
print(f'Unmodified dict: {userdict}')

for user, status in userdict.items():
    if status == 'inactive':
        del userdict[user]

print(f'Modified dict: {userdict}')
