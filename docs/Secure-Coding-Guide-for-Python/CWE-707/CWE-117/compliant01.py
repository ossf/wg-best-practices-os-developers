""" Compliant Code Example """
import logging
import re


def allowed_chars(user):
    """Verify only allowed characters are used"""
    if bool(re.compile(r"\w+").fullmatch(user)):
        return True
    return False


def log_authentication_failed(user):
    """Simplified audit logging missing RFC 5424 details"""
    if not allowed_chars(user):
        logging.critical("Login attempt with non-allowed characters in user name: '%s'", user)
    logging.warning("User login failed for: '%s'", user)


#####################
# attempting to exploit above code example
#####################
log_authentication_failed("""foo
WARNING:root:User login failed for: administrator""")
