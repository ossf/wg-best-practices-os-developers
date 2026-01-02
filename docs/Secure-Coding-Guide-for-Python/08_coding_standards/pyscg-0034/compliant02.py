# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def print_number_of_students(classroom: list[str]):
    """Print the number of students in a classroom"""
    if isinstance(classroom, list):
        print(f"The classroom has {len(classroom)} students.")
    else:
        print("Given object is not a classroom.")


#####################
# Attempting to exploit above code example
#####################
print_number_of_students(None)
