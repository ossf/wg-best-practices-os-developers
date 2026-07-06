# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-Compliant Code Example"""

ARG_MAX_BYTES = 16  # small buffer
argbuf = bytearray(ARG_MAX_BYTES)

USED = 10                       # 10 bytes already used
ARG = b"AAAAAAAA"               # attacker-controlled, needs 8 + 1 = 9 bytes
LENGTH = len(ARG) + 1           # 9 (include NUL terminator)

REMAINING = ARG_MAX_BYTES - USED + LENGTH  # Wrong: 15, expected -3

if LENGTH > REMAINING:
    print("Rejected: not enough space")
else:
    print(f"Bounds check passed: remaining={REMAINING}")
