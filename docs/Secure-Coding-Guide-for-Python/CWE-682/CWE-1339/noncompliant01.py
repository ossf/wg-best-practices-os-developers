balance = 3.00
item_cost = 0.33
item_count = 5

#####################
# exploiting above code example
#####################
print(
    f"{str(item_count)} items bought, ${item_cost} each. "
    f"Current account balance: ${str(balance - item_count * item_cost)}"
)
