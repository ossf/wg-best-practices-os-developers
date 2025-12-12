# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import threading


def critical_func(x: str, l: threading.Lock):
    print(f"{x}: performing regular operations")
    with l:
        print(f"{x}: entered critical section")
        i = 0
        for _ in range(100000):
            i += 1
        print(f"{x}: exiting critical section")
    print(f"{x}: finished")
 
 
lock = threading.Lock()
t1 = threading.Thread(target=critical_func, args=("A", lock))
t2 = threading.Thread(target=critical_func, args=("B", lock))
t1.start()
t2.start()