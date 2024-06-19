# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
userset = {'Alice', 'Bob', 'Charlie'}
print(f'Unmodified set: {userset}')
for user in userset:
    if user == 'Bob':
        userset.remove(user)
