# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-Compliant Code Example"""

my_list = []


def append_resource(name):
    print(f"Allocating resource {name}")
    resource = {"name": name, "active": True}  # Simulated resource
    my_list.append(resource)


append_resource("A")
append_resource("B")

# Forgot to release resources
#####################
# attempting to exploit above code example
#####################
for resource in my_list:
    print(resource["name"], "active?", resource["active"])

if not any(resource["active"] for resource in my_list):
    print("All resources released.")
