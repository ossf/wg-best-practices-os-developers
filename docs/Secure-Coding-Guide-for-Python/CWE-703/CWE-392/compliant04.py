""" Compliant Code Example """

import math
from concurrent.futures import ThreadPoolExecutor


def get_sqrt(a):
    try:
        return math.sqrt(a)
    except ValueError as e:
        print(f"Invalid argument: {a}")
        return None


def map_threads(x):
    with ThreadPoolExecutor() as executor:
        return executor.map(get_sqrt, x)


#####################
# exploiting above code example
#####################
args = [2, -1, 4]
results = map_threads(args)
for result in results:
    print(result)  # Now no exception is raised and we can read all of the results
