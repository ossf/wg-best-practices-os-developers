# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
userlist = ['Alice', 'Bob', 'Charlie']
print(f'Unmodified list: {userlist}')

for user in userlist:
    if user == 'Bob':
        userlist.remove(user)

print(f'Modified list: {userlist}')
