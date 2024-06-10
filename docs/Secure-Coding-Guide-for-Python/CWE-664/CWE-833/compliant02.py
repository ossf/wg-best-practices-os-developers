""" Compliant Code Example """

from concurrent.futures import ThreadPoolExecutor, wait
from threading import Lock
from typing import Callable


class BankingService(object):
    def __init__(self, n: int):
        self.executor = ThreadPoolExecutor()
        self.number_of_times = n
        self.count = 0
        self.all_tasks = []
        self.lock = Lock()

    def for_each_client(self):
        print("Per client")
        self.invoke_method(self.for_each_account)

    def for_each_account(self):
        print("Per account")
        self.invoke_method(self.for_each_card)

    def for_each_card(self):
        print("Per card")
        self.invoke_method(self.check_card_validity)

    def check_card_validity(self):
        with self.lock:
            self.count += 1
            print(f"Number of checked cards: {self.count}")

    def invoke_method(self, method: Callable):
        futures = []
        for _ in range(self.number_of_times):
            if self.can_fit_in_executor():
                self.lock.acquire()
                future = self.executor.submit(method)
                self.all_tasks.append(future)
                self.lock.release()
                futures.append(future)
            else:
                # Execute the method in the thread that invokes it
                method()
        wait(futures)

    def can_fit_in_executor(self):
        running = 0
        for future in self.all_tasks:
            if future.running():
                running += 1
        print(f"Max workers: {self.executor._max_workers}, Used workers:  {running}")
        # Depending on the order of submitted subtasks, the script can sometimes deadlock
        # if we don't leave a spare worker.
        return self.executor._max_workers > running + 1


#####################
# exploiting above code example
#####################
browser_manager = BankingService(5)
browser_manager.for_each_client()
