# CWE-665: Improper Initialization

Prevent unexpected states by applying correct initialized of local objects as they remain available when a thread's resources are re-used in a thread-pool.

> [!NOTE]
> Prerequisite to understand this page:
> [Intro to multiprocessing and multithreading](../../Intro_to_multiprocessing_and_multithreading/readme.md)

The `TheadPoolExecutor` provides an interface to a thread pool and resources which it reserved from the Operating System (OS). A thread in a thread-pool also known as "workers" can share an instance of a local object without overwriting each other's values inside of it [[Python docs 2023]](https://docs.python.org/3/library/threading.html#thread-local-data).

> Thread-local data is data whose values are thread specific. To manage
> thread-local data, just create an instance of local (or a subclass) and store attributes on it:
> `mydata = threading.local()`
> `mydata.x = 1`
> The instance’s values will be different for separate threads.

## Non-Compliant Code Example

The `noncompliant01.py` code is simulating the spawning of processes with the different access rights.
The `Session(object)` class simulates access control via `User(Enum)thread` defining a `User` object to be either `GUEST = 1` (default) or `ADMIN = 2`. The `set_user()` method  changes access level and `set_user_as_guest()` is to reset access.

In `SessionPool()` we spawn tasks and access control in the following order:

1) `ADMIN`
2) `GUEST`
3) `GUEST`

Configuring `self.num_of_threads = 2` in `SessionPool` reduces the sample size to make  it easier to spot the unwanted behaviour in the output.

*[noncompliant01.py](noncompliant01.py):*

```py
""" Non-compliant Code Example """
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
        self.session.set_user(User.ADMIN)
        self.session.work_thread()

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

```

Due to the re-use of worker threads and failure to reset state we can end up with random access control on each worker. **The initializer method is not called when a worker thread is reused**, it is only called on the worker thread's creation!

Example `noncompliant01.py` output:

```bash

+++ ThreadPoolExecutor-0_0 initializer +++
+++ ThreadPoolExecutor-0_1 initializer +++
ThreadPoolExecutor-0_1: Working concurrently as User.ADMIN
ThreadPoolExecutor-0_0: Working concurrently as User.GUEST
ThreadPoolExecutor-0_1: Working concurrently as User.ADMIN
```

The two worker threads have been initialized only once using the initializer method. `ThreadPoolExecutor-0_1` has completed the `work_as_admin()` task and has been reused to complete one of the `work_as_guest()`. Because the local values have been changed by the first task, the changed values persisted to the second task.

Table listing a possible execution order:
|Task|Workder Thread|Executed Method|User|
|:---|:---|:---|:---|
|1|0|`work_as_admin()`|ADMIN|
|2|1|`work_as_admin()`|GUEST|
|3|0|`work_as_admin()`|ADMIN|

> [!NOTE]
> The initializer parameter has been introduced in Python 3.7 [[Python_docs_2_2023]](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor).

## Non-Compliant Code Example (Increase Thread Pool Size)

In `noncompliant02.py` the `self.num_of_threads` is increased by one in an attempt to mitigate the issue:

*[noncompliant02.py](noncompliant02.py):*

```py
""" Non-compliant Code Example """
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
        self.num_of_threads = 3
        self.session = Session()
        self.executor = ThreadPoolExecutor(initializer=self.initializer,
                                           max_workers=self.num_of_threads
                                           )

    def initializer(self):
        thread = current_thread()
        print(f"+++ {thread.name} initializer +++")
        self.session.set_user_as_guest()

    def work_as_admin(self):
        self.session.set_user(User.ADMIN)
        self.session.work_thread()

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
```

The increased thread pool size circumvents the problem for this specific example. However, the problem has not been resolved since expanding the number of submitted tasks will cause it to reoccur. For example, if we change the `fututes` list as follows:

*[example01.py](example01.py):*

```py
futures = [
    sp.execute_task(sp.work_as_admin),  # Thread 1, works as ADMIN
    sp.execute_task(sp.work_as_guest),  # Thread 2, should work as GUEST
    sp.execute_task(sp.work_as_admin),  # Thread 1, works as ADMIN
    sp.execute_task(sp.work_as_guest),  # Thread 3, should work as GUEST
    sp.execute_task(sp.work_as_guest),  # Thread 2, should work as GUEST
    sp.execute_task(sp.work_as_guest),  # Thread 3, should work as GUEST
]
```

The worker threads will execute the tasks as the incorrect user again, working as ADMIN in four of the tasks instead of the two we want to use the ADMIN role in:

```bash
+++ ThreadPoolExecutor-0_0 initializer +++
ThreadPoolExecutor-0_0: Working concurrently as User.ADMIN
+++ ThreadPoolExecutor-0_1 initializer +++
ThreadPoolExecutor-0_1: Working concurrently as User.GUEST
+++ ThreadPoolExecutor-0_2 initializer +++
ThreadPoolExecutor-0_2: Working concurrently as User.ADMIN
ThreadPoolExecutor-0_0: Working concurrently as User.ADMIN
ThreadPoolExecutor-0_1: Working concurrently as User.GUEST
ThreadPoolExecutor-0_2: Working concurrently as User.ADMIN
```

## Compliant Solution - Using finally

The `finally` block in `SessionPoolwork_as_admin()` restores the initial state of the user value from the Session class by calling `set_user_as_guest()` in the `compliant01.py` code.

*[compliant01.py](compliant01.py):*

```py
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
```

Now, once the worker thread finishes work_as_admin(), it restores the initial value so that it will be used in the next task executed by the same worker thread:

```bash
+++ ThreadPoolExecutor-0_0 initializer +++
ThreadPoolExecutor-0_0: Performing thread specific tasks as User.ADMIN
+++ ThreadPoolExecutor-0_1 initializer +++
ThreadPoolExecutor-0_1: Performing thread specific tasks as User.GUEST
ThreadPoolExecutor-0_1: Performing thread specific tasks as User.GUEST
```

## Compliant Solution  (reinitialize before performing a task)

In the `compliant02.py` example, the user variable is reinitialized at the beginning of the `work_as_guest()`. Like the `try-finally` clause, reinitializing the local values before the execution of a proper task will ensure the worker thread contains the desired values.

*[compliant02.py](compliant02.py):*

```py
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
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
        self.session.set_user(User.ADMIN)
        self.session.work_thread()

    def work_as_guest(self):
        """Uses the default user (GUEST) to perform a task"""
        self.session.set_user_as_guest()
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
    sp.execute_task(sp.work_as_admin),  # Thread 1, works as ADMIN
    sp.execute_task(sp.work_as_guest),  # Thread 3, should work as GUEST
    sp.execute_task(sp.work_as_guest),  # Thread 2, should work as GUEST
    sp.execute_task(sp.work_as_guest),  # Thread 3, should work as GUEST
]
# To prevent the main thread from stopping before worker threads finish
wait(futures)
for future in futures:
    future.result()

```

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE-665, Improper Initialization](https://cwe.mitre.org/data/definitions/665.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[TPS04-J. Ensure ThreadLocal variables are reinitialized when using thread pools](https://wiki.sei.cmu.edu/confluence/display/java/TPS04-J.+Ensure+ThreadLocal+variables+are+reinitialized+when+using+thread+pools)|

## Biblography

|||
|:---|:---|
|[Python docs 2023](https://docs.python.org/3/library/threading.html#thread-local-data)|Thread-Local Data, available from [https://docs.python.org/3/library/threading.html#thread-local-data](https://docs.python.org/3/library/threading.html#thread-local-data) [accessed 8 August 2024]|
|[Python_docs_2_2023](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor)|ThreadPoolExecutor, available from [https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor) [accessed 8 August 2024]|
