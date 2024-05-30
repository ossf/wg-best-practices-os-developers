""" Compliant Code Example """
from time import sleep
from enum import Enum
from threading import local, current_thread
from concurrent.futures import ThreadPoolExecutor, wait


class User(Enum):
    GUEST = 1
    ADMIN = 2


class Session(object):
    def __init__(self):
        self.user = local()
        self.set_user_as_guest()

    def set_user_as_guest(self):
        self.user.value = User.GUEST

    def set_user(self, user):
        self.user.value = user

    def work_thread(self):
        """ Perform a task for the user in its own thread """
        thread = current_thread()
        print(f"{thread.name}: Working concurrently as {self.user.value}")
        sleep(1)  # To allow for worker threads to be reused


class SessionPool(object):
    def __init__(self):
        self.num_of_threads = 2
        self.session = Session()
        self.executor = ThreadPoolExecutor(initializer=self.initializer,
                                           max_workers=self.num_of_threads
                                           )

    def initializer(self):
        thread = current_thread()
        print(f"+++ {thread.name} initializer +++")
        self.session.set_user_as_guest()

    def work_as_admin(self):
        try:
            self.session.set_user(User.ADMIN)
            self.session.work_thread()
        finally:
            self.session.set_user_as_guest()

    def work_as_guest(self):
        """Uses the default user (GUEST) to perform a task"""
        self.session.work_thread()

    def execute_task(self, task):
        return self.executor.submit(task)


#####################
# exploiting above code example
#####################
sp = SessionPool()
futures = [
    sp.execute_task(sp.work_as_admin),  # Thread 1, works as ADMIN
    sp.execute_task(sp.work_as_guest),  # Thread 2, should work as GUEST
    sp.execute_task(sp.work_as_guest),  # Thread 3, should work as GUEST
]

# To prevent the main thread from stopping before worker threads finish
wait(futures)
for future in futures:
    future.result()
