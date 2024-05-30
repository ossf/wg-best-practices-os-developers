""" Compliant Code Example """
import sqlite3


class Records:
    """ Compliant code, providing protection against injection.
        Missing input sanitation as such.
    """

    def __init__(self, data_base: str):
        self.connection = sqlite3.connect(data_base)
        self.cursor = self.connection.cursor()
        self.cursor.execute("CREATE TABLE IF NOT EXISTS Students(student TEXT)")
        self.connection.commit()

    def get_record(self, name: str) -> list:
        '''
        Fetches a student record from the table for given name
            Parameters:
                name (string): A string with the student name
            Returns:
                object (fetchall): sqlite3.cursor.fetchall() object
        '''
        data_tuple = (name,)
        get_values = "SELECT * FROM Students WHERE student = ?"
        self.cursor.execute(get_values, data_tuple)
        return self.cursor.fetchall()

    def add_record(self, name: str):
        '''
        Adds a student name to the table
            Parameters:
                name (string): A string with the student name
        '''

        data_tuple = (name,)
        add_values = """INSERT INTO Students VALUES (?)"""
        try:
            self.cursor.execute(add_values, data_tuple)
        except sqlite3.OperationalError as operational_error:
            print(operational_error)
        self.connection.commit()


#####################
# exploiting above code example
#####################
print("sqlite3.sqlite_version=" + sqlite3.sqlite_version)
records = Records("school.db")

records.add_record("Alice")
records.add_record("Robert'); DROP TABLE students;--")
records.add_record("Malorny")

print(records.get_record("Alice"))
# normal as "Robert" has not been added as "Robert":
print(records.get_record("Robert'); DROP TABLE students;--"))
print(records.get_record("Malorny"))
