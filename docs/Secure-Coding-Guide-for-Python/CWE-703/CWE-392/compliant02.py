""" Compliant Code Example """
import math
from concurrent.futures import ThreadPoolExecutor


def get_sqrt(a):
    return math.sqrt(a)


def run_thread(var):
    with ThreadPoolExecutor() as executor:
        future = executor.submit(get_sqrt, var)
        try:
            res = future.result()
            return res
        except ValueError as e:
            # handle exception...
            raise ValueError(f"Invalid argument: {var}") from None


#####################
# exploiting above code example
#####################
arg = -1
result = run_thread(arg)  # Now code execution will be interrupted by ValueError
