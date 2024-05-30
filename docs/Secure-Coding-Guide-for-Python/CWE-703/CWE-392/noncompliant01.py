""" Non-compliant Code Example """
import math
from concurrent.futures import ThreadPoolExecutor


def get_sqrt(a):
    return math.sqrt(a)


def run_thread(var):
    with ThreadPoolExecutor() as executor:
        return executor.submit(get_sqrt, var)

#####################
# exploiting above code example
#####################
# get_sqrt will raise ValueError that will be suppressed by the ThreadPoolExecutor
arg = -1
result = run_thread(arg)  # The outcome of the task is unknown
