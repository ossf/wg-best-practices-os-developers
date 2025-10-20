# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Compliant Code Example """
import time
from multiprocessing import Process


def waste_time(t: int):
    for _ in range(t):
        _ += 1


if __name__ == '__main__':
    BIG_NUMBER = 100000000
    start = time.time()
    waste_time(BIG_NUMBER)
    end = time.time()
    print(f"Time taken when executing sequentially (in seconds): {end - start}")
    p1 = Process(target=waste_time, args=(BIG_NUMBER // 2,))
    p2 = Process(target=waste_time, args=(BIG_NUMBER // 2,))
    start = time.time()
    p1.start()
    p2.start()
    p1.join()
    p2.join()
    end = time.time()
    print(f"Time taken when executing in 2 processes (in seconds): {end - start}")
