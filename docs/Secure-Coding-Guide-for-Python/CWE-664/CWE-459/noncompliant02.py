# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import os
from tempfile import mkstemp
 
fd, path = mkstemp()
with os.fdopen(fd, 'w') as f:
    f.write('TEST\n')
 
print(path)
