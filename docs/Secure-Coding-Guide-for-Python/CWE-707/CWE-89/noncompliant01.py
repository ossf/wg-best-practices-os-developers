""" Non-compliant Code Example """
import sqlite3


class Records:
    """ Non-compliant code.
        Possible SQL injection vector through string-based query construction
    """

    def __init__(self, data_base):
        self.connection = sqlite3.connect(data_base)
        self.cursor = self.connection.cursor()
        self.cursor.execute("CREATE TABLE IF NOT EXISTS Students(student TEXT)")
        self.connection.commit()

    def get_record(self, name):
        '''
        Fetches a student record from the table for given name
            Parameters:
                name (string): A string with the student name
            Returns:
                object (fetchall): sqlite3.cursor.fetchall() object
        '''
        get_values = "SELECT * FROM Students WHERE student = '{name}'".format(name=name)
        self.cursor.execute(get_values)
        return self.cursor.fetchall()

    def add_record(self, name=""):
        '''
        Adds a student name to the table
            Parameters:
                name (string): A string with the student name
        '''

        add_values = "INSERT INTO Students(student) VALUES('{name}');"
        add_values_query = add_values.format(name=name)
        try:
            self.cursor.executescript(add_values_query)
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
