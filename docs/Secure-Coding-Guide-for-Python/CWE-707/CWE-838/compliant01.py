"""Compliant Code Example"""

import base64


def report_record_attack(stream: bytearray):
    try:
        decoded_text = stream.decode("utf-8")
    except UnicodeDecodeError as e:
        # Encode the stream using Base64 if there is an exception
        encoded_payload = base64.b64encode(stream).decode("utf-8")
        # Logging encoded payload for forensic analysis
        print("Base64 Encoded Payload for Forensic Analysis:", encoded_payload)
        print("Error decoding payload:", e)
    else:
        print("Important text:", decoded_text)


#####################
# attempting to exploit above code example
#####################
payload = bytearray("user: 毛泽东先生 attempted a directory traversal".encode("utf-8"))
# Introducing an error in the encoded text, a byte
payload[3] = 128
report_record_attack(payload)