# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from contextlib import contextmanager

class DbConnection:
    """Class representing a house"""
    def __init__(self):
        self.connected = False

    @contextmanager
    def connect(self):
        """Manages the connection"""
        self.connected = True
        try:
            yield self
        finally:
            self._disconnect()

    def _disconnect(self):
        self.connected = False

    def read(self):
        """Simulates an operation resulting in an error"""
        if self.connected:
            print("Reading from the database...")
            raise RuntimeError("Database could not be read from!")



def read_from_database(database):
    """Simulates usage of a stateful resource"""
    with database.connect():
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
