""" Non-compliant Code Example """
  
def report_record_attack(stream: bytearray):
    print("important text:", stream.decode("utf-8"))
  
#####################
# attempting to exploit above code example
#####################
payload = bytearray("user: 毛泽东先生 attempted a directory traversal".encode("utf-8"))
# Introducing an error in the encoded text, a byte
payload[3] = 128
report_record_attack(payload)