# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

import re
import unicodedata


def api_with_ids(suspicious_string: str):
    """Fancy intrusion detection system(IDS)"""
    normalized_string = unicodedata.normalize("NFKC", suspicious_string)
    if re.search("./", normalized_string):
        print("detected an attack sequence with . or /")
    else:
        print("Nothing suspicious")


#####################
# attempting to exploit above code example
#####################
# The MALICIOUS_INPUT is using:
# \u2024 or "ONE DOT LEADER"
# \uFF0F or 'FULLWIDTH SOLIDUS'
api_with_ids("\u2024\u2024\uff0f" * 10 + "passwd")
