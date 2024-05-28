""" Code Example """

foo = float('NaN')
print(f"foo={foo} type = {type(foo)}")


print(foo == float("NaN") or
      foo is float("NaN") or
      foo < 3 or
      foo == foo or
      foo is None
      )
