# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import logging
import sys
from threading import Thread

logging.basicConfig(level=logging.INFO)


class Number():
    """
    Multithreading incompatible class missing locks.
    Issue only occures with more than 1 million repetitions.
    """
    value = 0
    repeats = 1000000

    def add(self):
        """Simulating hard work"""
        for _ in range(self.repeats):
            logging.debug("Number.add: id=%i int=%s size=%s", id(self.value), self.value, sys.getsizeof(self.value))
            self.value += self.read_amount()

    def remove(self):
        """Simulating hard work"""
        for _ in range(self.repeats):
            self.value -= self.read_amount()

    def read_amount(self):
        """ Simulating reading amount from an external source, i.e. a file, a database, etc. """
        return 100


if __name__ == "__main__":
    #####################
    # exploiting above code example
    #####################
    number = Number()
    logging.info("id=%i int=%s size=%s", id(number.value), number.value, sys.getsizeof(number.value))
    add = Thread(target=number.add)
    substract = Thread(target=number.remove)
    add.start()
    substract.start()

    logging.info('Waiting for threads to finish...')
    add.join()
    substract.join()

    logging.info("id=%i int=%s size=%s", id(number.value), number.value, sys.getsizeof(number.value))
