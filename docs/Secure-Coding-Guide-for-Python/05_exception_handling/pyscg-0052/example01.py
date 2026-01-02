# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

import threading

lock = threading.Lock()
lock.acquire()
try:
    ...
finally:
    lock.release()
