# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""


def print_number_of_students(classroom: list[str]):
    """Print the number of students in a classroom"""
    print(f"The classroom has {len(classroom)} students.")


#####################
# Attempting to exploit above code example
#####################
print_number_of_students(None)
