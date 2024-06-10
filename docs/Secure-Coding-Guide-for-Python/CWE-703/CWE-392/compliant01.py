""" Compliant Code Example """
import math
from concurrent.futures import ThreadPoolExecutor


def get_sqrt(a):
    return math.sqrt(a)


def run_thread(var):
    with ThreadPoolExecutor() as executor:
        future = executor.submit(get_sqrt, var)
        if future.exception() is not None:
            # handle exception...
            raise ValueError(f"Invalid argument: {var}")
        return future


#####################
# exploiting above code example
#####################
arg = -1
result = run_thread(arg)  # Now code execution will be interrupted by ValueError
