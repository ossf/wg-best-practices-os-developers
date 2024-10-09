# CWE-833: Deadlock

The number of threads that can simultaneously run within a `ThreadPoolExecutor` is limited by the `_max_workers` parameter. Submitting tasks whose execution is dependent on other tasks submitted to the same `ThreadPoolExecutor` may result in a *thread-starvation* deadlock. An example of this type of deadlock is shown in the following article [Brownlee, 2021], which describes it as "Deadlock 1: Submit and Wait for a Task Within a Task". Submitting a task will add it to an internal `ThreadPoolExecutor` queue. The task will be removed from the queue when one of the worker threads becomes available, i.e., after finishing its current task. If all workers are busy and all their current tasks are waiting for results from tasks that are waiting in the queue, the program will run indefinitely as no worker will be able to complete its task and take one of the blocking tasks from the queue.

> [!NOTE]
> Prerequisite to understand this page:
> [Intro to multiprocessing and multithreading](../../Intro_to_multiprocessing_and_multithreading/readme.md)

## Non-Compliant Code Example (Interdependent Subtasks)

The `noncompliant01.py` code example shows how a thread-starvation deadlock could happen when one task depends on the results of other, nested tasks. The `ReportTableGenerator` class creates a table out of the input data by building each row concurrently. The client can call the `generate_string_table()` method by providing a list of String arguments. Each argument is parsed in a separate thread that executes the inner method `_create_table_row()`. Creation of the row may consist of multiple steps, such as reformating the string, which could be performed in separate sub-threads. The `_reformat_string()` method is submitted within `_create_table_row()` and uses the same executor. Before the row is built, all of the building threads must return the results.

*[noncompliant01.py](noncompliant01.py):*

```python
{% include_relative noncompliant01.py %}
```

The problem arises when the number of concurrently built rows exceeds the number of `_max_workers`. In this example, each worker thread could be occupied with the execution of the `_create_table_row()` method, while the tasks of `executing _reformat_string()` are waiting in the queue. Since the `_create_table_row()` method spawns a `_reformat_string()` thread and waits for its result, every worker will wait for another worker to finish their part of the row-building process. Because all workers are busy with the `_create_table_row()` task, no worker will be able to take the string reformatting out of the queue, causing a deadlock.

## Compliant Solution (No Interdependent Tasks)

The `compliant01.py` code example illustrates how interdependent tasks could be removed. In order to avoid thread-starvation deadlocks, one task should not submit nested tasks to the same thread pool and then wait for their results.

*[compliant01.py](compliant01.py):*

```python
{% include_relative compliant01.py %}
```

Now, the `_create_table_row()` method is executed in a separate thread but does not spawn any more threads, instead reformatting the string sequentially. Because each input argument can have its row built separately, no thread will need to wait for another to finish, which avoids thread-starvation deadlocks.

## Non-Compliant Code Example (Nested Interdependent Subtasks)

This code example introduces the idea of *fork-join* parallelism. Here, each task can spawn a number of parallel subtasks. The concept of *fork-join* parallelism has been described with code examples in Java [Gafter, 2006].
The BankingService class allows to concurrently validate the cards of all of the registered clients. Each level of granularity is represented by a separate method. First, the `for_each_client()` method is called to fetch the data of all of the clients. Then, in order to check the clients' accounts, each call of the `for_each_client()` method spawns several threads that run the  method. The for_each_account() method creates several threads for the `for_each_card()` method and finally, the `for_each_card()` method creates several threads for the `check_card_validity()` method. Overall, we have 4 layers of tasks, among which the 3 highest ones `(for_each_client(), for_each_account(), and for_each_card())` can "fork" a number of subtasks depending on the value of the `number_of_times` variable. If each thread waits for its sub-threads to finish while sharing the same `ThreadPoolExecutor`, they may cause a thread-starvation deadlock.

*[noncompliant02.py](noncompliant02.py):*

```python
{% include_relative noncompliant02.py %}
```

For the sake of the example, let's assume we have 5 clients, with 5 accounts and 5 cards for each account `number_of_times = 5`. In that case, we end up calling `check_card_validity() 125` times, exhausting `_max_workers` which is typically at around `32`. [Source: Python Docs] You can additionally call `self.executor._work_queue.qsize()` to get the exact number of tasks that are waiting in the queue, unable to be executed by the already busy workers.

## Compliant Solution (Caller runs when there are no available workers)

Python, as opposed to Java, does not provide `CallerRunsPolicy`, which was suggested as a solution in [Gafter, 2006]. It is possible to recreate that functionality by manually keeping a count of currently executed tasks.

*[compliant02.py](compliant02.py):*

```python
{% include_relative compliant02.py %}
```

This compliant code example adds a list of all submitted tasks to the `BankingService` class. The lock, apart from controlling the counter, now ensures that only one thread can access the `all_tasks` list at a time. Before a new task is submitted, `can_fit_in_executor()` checks if submitting a new task will exhaust the thread pool. If so, the task is executed in the thread that tried to submit it.

## Automated Detection

unknown

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE-833, Deadlock](https://cwe.mitre.org/data/definitions/833.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[TPS01-J. Do not execute interdependent tasks in a bounded thread pool](https://wiki.sei.cmu.edu/confluence/display/java/TPS01-J.+Do+not+execute+interdependent+tasks+in+a+bounded+thread+pool?src=contextnavpagetreemode)|

## Biblography

|||
|:---|:---|
|[Brownlee, 2021]|Brownlee, J. (2021). How To Identify Deadlocks With The ThreadPoolExecutor in Python [online]. Available from: [https://superfastpython.com/threadpoolexecutor-deadlock/](https://superfastpython.com/threadpoolexecutor-deadlock/) [accessed 12 April 2023]|
|[[Python docs]](https://docs.python.org/)|Python Software Foundation. (2023). concurrent.futures - Launching parallel tasks [online]. Available from: [https://docs.python.org/3/library/concurrent.futures.html?highlight=threadpoolexecutor#module-concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html?highlight=threadpoolexecutor#module-concurrent.futures) [accessed 26 April 2023]|
|[[Gafter, 2006]](http://gafter.blogspot.com/2006/11/thread-pool-puzzler.html)|Gafter, N. (2006). A Thread Pool Puzzler [online]. Available from: [http://gafter.blogspot.com/2006/11/thread-pool-puzzler.html](http://gafter.blogspot.com/2006/11/thread-pool-puzzler.html) [accessed 2 November 2023]|
