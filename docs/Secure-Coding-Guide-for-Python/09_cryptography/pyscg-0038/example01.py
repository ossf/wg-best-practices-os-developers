# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Example Code Example"""
import random


def generate_web_token():
    """Poor random number generator"""
    return random.randrange(int("1" + "0" * 31), int("9" * 32), 1)


# Show that tokens are predictable with same seed
for seed_value in [12345, 67890]:
    print(f"\nUsing seed {seed_value}:")

    # Generate tokens with same seed twice
    for attempt in [1, 2]:
        random.seed(seed_value)
        tokens = [generate_web_token() for _ in range(3)]
        print(f"  Attempt {attempt}: {tokens}")
