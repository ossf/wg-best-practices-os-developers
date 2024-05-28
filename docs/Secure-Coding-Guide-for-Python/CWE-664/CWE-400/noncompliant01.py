""" Non-compliant Code Example """
import time
from concurrent.futures import ThreadPoolExecutor


def take_time(x):
    print(f"Started Task: {x}")
    # Simulate work
    for i in range(10):
        time.sleep(1)
    print(f"Completed Task: {x}")


def run_thread(_executor, var):
    future = _executor.submit(take_time, var)
    return future


def interrupt(future):
    print(future.cancel())
    print(f"Interrupted: {future}")


#####################
# Exploiting above code example
#####################


with ThreadPoolExecutor() as executor:
    task = run_thread(executor, "A")
    interrupt(task)
