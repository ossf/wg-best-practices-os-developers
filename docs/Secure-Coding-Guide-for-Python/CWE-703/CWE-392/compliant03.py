""" Compliant Code Example """

import math
from concurrent.futures import ThreadPoolExecutor


def get_sqrt(a):
    return math.sqrt(a)


def map_threads(x):
    with ThreadPoolExecutor() as executor:
        result_gen = executor.map(get_sqrt, x)
        ret = list()
        invalid_arg = 0
        try:
            for res in result_gen:
                ret.append(res)
                invalid_arg += 1
            return res
        except ValueError as e:
            # handle exception...
            raise ValueError(
                f"Invalid argument: {x[invalid_arg]} at list index {invalid_arg}"
            ) from None


#####################
# exploiting above code example
#####################
args = [2, -1, 4]
results = map_threads(args)
for result in results:
    print(
        result
    )  # The exception is handled, but the rest of the results are still unavailable
