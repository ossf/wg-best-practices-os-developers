balance = 300
item_cost = 33
item_count = 5

#####################
# exploiting above code example
#####################
print(
    f"{str(item_count)} items bought, ${item_cost / 100} each. "
    f"Current account balance: ${str((balance - item_count * item_cost) / 100)}"
)
