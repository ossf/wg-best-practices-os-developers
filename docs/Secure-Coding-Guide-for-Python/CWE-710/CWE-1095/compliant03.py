# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
userset = {'Alice', 'Bob', 'Charlie'}
print(f'Unmodified set: {userset}')

# Create a copy
for user in userset.copy():
    if user == 'Bob':
        userset.remove(user)

print(f'Modified set: {userset}')

# Create a new set
userset2 = {'Alice', 'Bob', 'Charlie'}
activeuserset = set()
for user in userset2:
    if user != 'Bob':
        activeuserset.add(user)

print(f'Modified set: {activeuserset}')
