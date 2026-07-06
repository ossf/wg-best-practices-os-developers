# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

ARG_MAX_BYTES = 16
argbuf = bytearray(ARG_MAX_BYTES)

USED = 10
ARG = b"AAAAAAAA"
LENGTH = len(ARG) + 1

# Compare additions instead of subtracting: clear, and no precedence trap
if USED + LENGTH > ARG_MAX_BYTES:
    print("Rejected: not enough space")
else:
    print(f"Bounds check passed: remaining={ARG_MAX_BYTES - USED - LENGTH}")
