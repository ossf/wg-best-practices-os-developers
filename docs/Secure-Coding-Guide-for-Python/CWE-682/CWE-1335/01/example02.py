for shift in [16, 32, 64]:
    bar = 5225 << shift
    print("foo << " + str(shift) + ": type " + str(type(bar)) + " " + str(bin(bar)))