""" Non-compliant Code Example """

from concurrent.futures import ThreadPoolExecutor, wait
from threading import Lock
from typing import Callable


class BankingService(object):
    def __init__(self, n: int):
        self.executor = ThreadPoolExecutor()
        self.number_of_times = n
        self.count = 0
        self.lock = Lock()

    def for_each_client(self):
        print("For each client")
        self.invoke_method(self.for_each_account)

    def for_each_account(self):
        print("For each account")
        self.invoke_method(self.for_each_card)

    def for_each_card(self):
        print("For each card")
        self.invoke_method(self.check_card_validity)

    def check_card_validity(self):
        with self.lock:
            self.count += 1
            print(f"Number of checked cards: {self.count}")

    def invoke_method(self, method: Callable):
        futures = []
        for _ in range(self.number_of_times):
            futures.append(self.executor.submit(method))
        wait(futures)


#####################
# exploiting above code example
#####################
browser_manager = BankingService(5)
browser_manager.for_each_client()