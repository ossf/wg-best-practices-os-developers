# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

class DbConnection:
    """Class representing a database connection"""
    def __init__(self):
        self.connected = False

    def connect(self):
        """Sets the connection to True"""
        self.connected = True

    def disconnect(self):
        """Sets the connection to False"""
        self.connected = False

    def read(self):
        """Simulates an operation resulting in an error"""
        if self.connected:
            print("Reading from the database...")
            raise RuntimeError("Database could not be read from!")

def read_from_database(database):
    """Simulates usage of a stateful resource"""
    database.connect()
    database.read()
    database.disconnect()


#####################
# Exploiting above code example
#####################


my_db = DbConnection()
try:
    read_from_database(my_db)
except RuntimeError as e:
    print("Error while trying to read: ", e)

print("Is the connection open: ", my_db.connected)
