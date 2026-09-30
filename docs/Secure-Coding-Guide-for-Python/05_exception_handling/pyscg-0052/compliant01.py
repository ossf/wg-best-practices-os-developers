# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

class DbConnection:
    """Class representing a database connection"""
    def __init__(self):
        self.connected = False

    def _connect(self):
        self.connected = True

    def _disconnect(self):
        self.connected = False

    def read(self):
        """Simulates an operation resulting in an error"""
        if self.connected:
            print("Reading from the database...")
            raise RuntimeError("Database could not be read from!")

    def __enter__(self):
        """Perform operations when accessing the resource"""
        self._connect()

    def __exit__(self, exception_type, exception_value, traceback):
        """Perform clean-up after the resource is no longer needed"""
        self._disconnect()


def read_from_database(database):
    """Simulates usage of a stateful resource"""
    with database:
        database.read()


#####################
# Exploiting above code example
#####################


my_db = DbConnection()
try:
    read_from_database(my_db)
except RuntimeError as e:
    print("Error while trying to read: ", e)

print("Is the connection open: ", my_db.connected)
