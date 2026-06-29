# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Compliant Code Example """

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class PaymentProcessor:
    """Class to process payments"""

    def process_payment(self, amount):
        """Process a payment transaction"""
        logger.info("Processing payment of %s", amount)
        # Payment processing logic
        return True


#####################
# exploiting above code example
#####################

processor = PaymentProcessor()
processor.process_payment(99.99)
