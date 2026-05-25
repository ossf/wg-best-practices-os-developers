# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import logging


class PaymentProcessor:
    """Class to process payments"""

    def process_payment(self, amount):
        """Process a payment transaction"""
        logging.info("Processing payment of %s", amount)
        # Payment processing logic
        return True


def patched_process_payment(self, amount):
    """Monkey-patched method that logs sensitive details for debugging"""
    print(f"DEBUG: Payment amount: {amount}, processor state: {self.__dict__}")
    logging.debug("Full payment details: %s", self.__dict__)
    return True


# Monkey patching left in production code
PaymentProcessor.process_payment = patched_process_payment


#####################
# exploiting above code example
#####################

processor = PaymentProcessor()
processor.process_payment(99.99)
