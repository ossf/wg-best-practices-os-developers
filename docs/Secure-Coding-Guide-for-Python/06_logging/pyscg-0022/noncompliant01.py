# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Non-compliant Code Example"""

import logging


def log_authentication_failed(user):
    """Simplified audit logging missing RFC 5424 details"""
    logging.warning("User login failed for: '%s'", user)


#####################
# attempting to exploit above code example
#####################
log_authentication_failed("guest'\nWARNING:root:User login failed for: 'administrator")
