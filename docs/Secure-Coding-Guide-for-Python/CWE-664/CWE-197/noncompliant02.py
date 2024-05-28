""" Non-compliant Code Example """
value = float(1.0) + float("1e-18")
target = float(1.0) + float("1e-17")
while value <= target:
    print(value)
    value = value + float("1e-18")
