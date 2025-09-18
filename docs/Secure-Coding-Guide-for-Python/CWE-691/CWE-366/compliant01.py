# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Non-compliant Code Example """
import logging
import sys
import threading
from threading import Thread

logging.basicConfig(level=logging.INFO)


class Number():
    """
    Multithreading compatible class with locks.
    """
    value = 0
    repeats = 1000000

    def __init__(self):
        self.lock = threading.Lock()

    def add(self):
        """Simulating hard work"""
        for _ in range(self.repeats):
            logging.debug("Number.add: id=%i int=%s size=%s", id(self.value), self.value, sys.getsizeof(self.value))
            self.lock.acquire()
            self.value += self.read_amount()
            self.lock.release()

    def remove(self):
        """Simulating hard work"""
        for _ in range(self.repeats):
            self.lock.acquire()
            self.value -= self.read_amount()
            self.lock.release()

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