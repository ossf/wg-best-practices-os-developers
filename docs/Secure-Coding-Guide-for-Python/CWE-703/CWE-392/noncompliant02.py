""" Non-compliant Code Example """

import math
from concurrent.futures import ThreadPoolExecutor


def get_sqrt(a):
    return math.sqrt(a)


def map_threads(x):
    with ThreadPoolExecutor() as executor:
        return executor.map(get_sqrt, x)


#####################
# exploiting above code example
#####################

# get_sqrt will raise ValueError that will be suppressed by the ThreadPoolExecutor
args = [2, -1, 4]
results = map_threads(args)
for result in results:
    print(result)  # Unhandled ValueError will be raised before all results are read
