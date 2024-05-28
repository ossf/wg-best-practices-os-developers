foo = 50
bar = 42
print(f"foo = {foo} = {foo:08b}") # :08b is just for pretty print
print(f"foo = {bar} = {bar:08b}\n")

# bit wise operations in Python:
print(f"foo << 2 = {(foo << 2):08b}")   # binary shift left
print(f"foo >> 2 = {(foo >> 2):08b}")   # binary shift right
print(f"~foo     = {(~foo):08b}")       # flipping bits
print(f"foo & bar  = {(foo & bar):08b}")    # binary AND
print(f"foo | bar  = {(foo | bar):08b}")    # binary OR
print(f"foo ^ bar  = {(foo ^ bar):08b}")    # binary XOR
