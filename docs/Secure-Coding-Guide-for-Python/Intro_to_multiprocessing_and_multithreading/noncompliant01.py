# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import threading
 
 
def wait_for_other(x: str, other: threading.Thread):
    print(f"{x}: waiting for other")
    other.join()
    print(f"{x}: finished waiting")
 
 
t = threading.Thread(target=wait_for_other, args=("A", threading.current_thread()))
t.start()
print("B: waiting for other")
t.join()
print("B: finished waiting")