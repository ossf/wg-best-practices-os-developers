# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""


def print_number_of_students(classroom: list[str]):
    """Print the number of students in a classroom"""
    if not isinstance(classroom, list):
        raise ValueError("classroom is not a list")
    # TODO: also check each entry
    print(f"The classroom has {len(classroom)} students.")


#####################
# Attempting to exploit above code example
#####################
print_number_of_students(["student 1", "student 2", "student 3"])
print_number_of_students(None)
