""" Non-compliant Code Example """
import logging


def log_authentication_failed(user):
    """Simplified audit logging missing RFC 5424 details"""
    logging.warning("User login failed for: '%s'", user)


#####################
# attempting to exploit above code example
#####################
log_authentication_failed("""foo
WARNING:root:User login failed for: administrator""")
