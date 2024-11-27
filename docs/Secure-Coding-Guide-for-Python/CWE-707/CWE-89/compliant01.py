# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import logging
import sqlite3
from typing import Union

logging.basicConfig(level=logging.DEBUG)


class Records:
    """
    Compliant code, providing protection against injection.
    Missing input sanitation as such.
    """
    # TODO: add input sanitation
    # TODO: add appropriate logging
    # TODO: add appropriate error handling

    def __init__(self):
        self.connection = sqlite3.connect("school.db")
        self.cursor = self.connection.cursor()
        self.cursor.execute("CREATE TABLE IF NOT EXISTS Students(student TEXT)")
        self.connection.commit()

    def get_record(self, name: str) -> Union[list[tuple[str]], None]:
        """
        Fetches a student record from the table for given name
            Parameters:
                name (string): A string with the student name
            Returns:
                name (string): A string with the student name
                (None): if nothing was found
        """

        data_tuple = (name,)
        get_values = "SELECT * FROM Students WHERE student = ?"
        try:
            self.cursor.execute(get_values, data_tuple)
            return self.cursor.fetchall()
        except sqlite3.OperationalError as operational_error:
            logging.warning(operational_error)
        return None

    def add_record(self, name: str):
        """
        Adds a student name to the table
            Parameters:
                name (string): A string with the student name
        """

        data_tuple = (name,)
        logging.debug("Adding student %s", name)
        add_values = """INSERT INTO Students VALUES (?)"""
        try:
            self.cursor.execute(add_values, data_tuple)
            self.connection.commit()
        except sqlite3.OperationalError as operational_error:
            logging.warning(operational_error)


#####################
# exploiting above code example
#####################
print("sqlite3.sqlite_version=" + sqlite3.sqlite_version)

records = Records()
records.add_record("Alice")
records.add_record("Robert'); DROP TABLE students;--")
records.add_record("Malorny")

print(records.get_record("Alice"))
# normal as "Robert" has not been added as "Robert":
print(records.get_record("Robert'); DROP TABLE students;--"))
print(records.get_record("Malorny"))
