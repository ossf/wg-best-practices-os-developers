# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

my_list = []


def append_resource(name):
    print(f"Allocating resource {name}")
    resource = {"name": name, "active": True}  # Simulated resource
    my_list.append(resource)


append_resource("A")
append_resource("B")

# Properly release resources
for resource in my_list:
    resource["active"] = False
my_list.clear()


#####################
# attempting to exploit above code example
#####################
for resource in my_list:
    print(resource["name"], "active?", resource["active"])

if not any(resource["active"] for resource in my_list):
    print("All resources released.")
