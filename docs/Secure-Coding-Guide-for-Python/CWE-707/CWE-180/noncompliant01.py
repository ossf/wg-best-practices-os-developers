""" Non-compliant Code Example """
import re
import unicodedata


def api_with_ids(suspicious_string):
    """Fancy intrusion detection system(IDS)"""
    if re.search("./", suspicious_string):
        normalized_string = unicodedata.normalize("NFKC", suspicious_string)
        print(f"detected an attack sequence {normalized_string}")
    else:
        print("Nothing suspicious")


#####################
# attempting to exploit above code example
#####################
# The MALICIOUS_INPUT is using:
# \u2024 or "ONE DOT LEADER"
# \uFF0F or 'FULLWIDTH SOLIDUS'
api_with_ids("\u2024\u2024\uFF0F" * 10 + "passwd")
