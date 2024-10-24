# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """

import logging


def process_order(address):
    """Function for processing some online order"""
    logging.basicConfig(format='%(asctime)s %(levelname)s:%(message)s',
                        level=logging.DEBUG)
    logger = logging.getLogger(__name__)
    logger.info("Initial logging level: %s",
                logging.getLevelName(logger.getEffectiveLevel()))
    logger.debug("Processing order for address: %s", address)

    # Continue to process the order.


process_order("10 Grafton Street")
