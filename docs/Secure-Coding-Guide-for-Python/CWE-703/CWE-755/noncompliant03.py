""" Non-compliant Code Example """

import pathlib
import uuid


def delete_temporary_file(file):
    """Function for deleting a temporary file from a certain location"""
    resource_path = pathlib.Path(file)
    resource_path.unlink(missing_ok=True)


#####################
# exploiting above code example
#####################
# Attempting to remove a random non-existent file
delete_temporary_file(f"{uuid.uuid4()}.txt")
