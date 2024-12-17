# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

counter = 1.0 + 1e-16
target = 1.0 + 1e-15
while counter <= target:  # never ends
    print(f"counter={counter / 10**16 :.20f}")
    print(f" target={target / 10**16:.20f}")
    counter += 1e-16
