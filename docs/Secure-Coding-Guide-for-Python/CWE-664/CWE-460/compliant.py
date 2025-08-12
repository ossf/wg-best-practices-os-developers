
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import threading

lock = threading.Lock()

def compliant_example():
    with lock:
        # the lock has been acquired using the 'with' statement and will be released when the block exits; even if an exception occurs
        print("Lock acquired, performing critical operation...")
        # raising an exception
        raise ValueError("Something went wrong!")
        # This line will not be reached because of the exception above,
    print("Lock released.")

try:
    compliant_example()
except ValueError as e:
    print(f"Caught exception: {e}")
