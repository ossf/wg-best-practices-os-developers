# SPDX-FileCopyrightText: OpenSSF project contributors  
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import time
from threading import Thread


def waste_time(t: float):
    time.sleep(t)


WAIT_TIME = 4
start = time.time()
waste_time(WAIT_TIME)
end = time.time()
print(f"Time taken when executing sequentially (in seconds): {end - start}")
t1 = Thread(target=waste_time, args=(WAIT_TIME // 2,))
t2 = Thread(target=waste_time, args=(WAIT_TIME // 2,))
start = time.time()
t1.start()
t2.start()
t1.join()
t2.join()
end = time.time()
print(f"Time taken when executing in 2 threads (in seconds): {end - start}")
