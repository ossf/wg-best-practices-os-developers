# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
userdict = {'Alice': 'active', 'Bob': 'inactive', 'Charlie': 'active'}
print(f'Unmodified dict: {userdict}')

# Create a copy
for user, status in userdict.copy().items():
    if status == 'inactive':
        del userdict[user]

print(f'Modified dict: {userdict}')

# Create new dict
userdict2 = {'Alice': 'active', 'Bob': 'inactive', 'Charlie': 'active'}
activeuserdict = {}
for user, status in userdict2.items():
    if status != 'inactive':
        activeuserdict.update({user: status})

print(f'New dict: {activeuserdict}')
