# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
userlist = ['Alice', 'Bob', 'Charlie']
print(f'Unmodified list: {userlist}')

# Create a copy
for user in userlist.copy():
    if user == 'Bob':
        userlist.remove(user)

print(f'Modified list: {userlist}')

# Create a sample collection: list
userlist2 = ['Alice', 'Bob', 'Charlie']
print(f'Unmodified list: {userlist2}')

# Create new list
activeusers = []
for user in userlist2:
    if user != 'Bob':
        activeusers.append(user)
print(f'New list: {activeusers}')
