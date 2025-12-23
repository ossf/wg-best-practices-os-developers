# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
counter = 1
target = 10
while counter <= target:
    print(f"counter={counter / 10**16 :.20f}")
    print(f" target={target / 10**16:.20f}")
    counter += 1
