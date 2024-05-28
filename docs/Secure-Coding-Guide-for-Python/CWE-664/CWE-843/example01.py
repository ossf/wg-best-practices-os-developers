""" Code Example """

# https://docs.python.org/3/library/struct.html#format-characters
# https://docs.python.org/3/library/ctypes.html

import io
from struct import pack, unpack


def read_from_stream(stream):
    value = unpack(">H", stream.getvalue())[0]
    return value


#####################
# attempting to exploit above code example
#####################
file_sim = io.BytesIO(pack("<H", 1))
print(read_from_stream(file_sim))
