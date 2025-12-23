# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import time
from threading import Thread


def waste_time(t: int):
    for _ in range(t):
        _ += 1


if __name__ == '__main__':
    BIG_NUMBER = 100000000
    start = time.time()
    waste_time(BIG_NUMBER)
    end = time.time()
    print(f"Time taken when executing sequentially (in seconds): {end - start}")
    t1 = Thread(target=waste_time, args=(BIG_NUMBER // 2,))
    t2 = Thread(target=waste_time, args=(BIG_NUMBER // 2,))
    start = time.time()
    t1.start()
    t2.start()
    t1.join()
    t2.join()
    end = time.time()
    print(f"Time taken when executing in 2 threads (in seconds): {end - start}")
