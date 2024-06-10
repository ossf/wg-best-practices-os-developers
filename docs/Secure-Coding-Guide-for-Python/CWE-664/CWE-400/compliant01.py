""" Compliant Code Example """
import time
from concurrent.futures import ThreadPoolExecutor
from threading import Event


def take_time(x, _event):
    print(f"Started Task: {x}")
    # Simulate work
    for _ in range(10):
        if _event.is_set():
            print(f"Interrupted Task: {x}")
            # Save partial results
            return
        time.sleep(1)
    print(f"Completed Task: {x}")


def run_thread(_executor, var):
    e = Event()
    future = _executor.submit(take_time, var, e)
    return future, e


def interrupt(future, e):
    """Cancel the task, just in case it is not yet running, and set the Event flag"""
    future.cancel()
    e.set()


#####################
# Exploiting above code example
#####################


with ThreadPoolExecutor() as executor:
    task, event = run_thread(executor, "A")
    interrupt(task, event)
