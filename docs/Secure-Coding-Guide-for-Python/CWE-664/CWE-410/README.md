# CWE-410: Insufficient Resource Pool

Ensure load control during traffic bursts or Denial of Service (DoS) by using a limited amount of threads in a pool. An attacker can cause a DoS by flooding a system with too many requests. Services with time-consuming, I/O-bound, or session-based sequential execution make limited use of available resources and can be blocked by a single hanging process or by overloading the queue.

Thread pools combine:

* Limiting the total amount of worker threads that are re-used in a pool
* Protecting the input queue from being overloaded by providing optional time-out functions
* Handling of failures that occur in a thread without impacting the re-usability of threads [Brownlee 2022]

## Non-Compliant Code Example (Thread-Per-Message)

The `noncompliant01.py` code example demonstrates the Thread-Per-Message design pattern. Each request sent to MessageAPI results in a creation of a new thread.

*[noncompliant01.py](noncompliant01.py):*

```py
""" Non-compliant Code Example """
import logging
import threading
import time

logging.basicConfig(level=logging.INFO)


def process_message(message: str, processed_messages: list):
    """ Method simulating mediation layer i/o heavy work"""
    logging.debug("process_message: started message   %s working %is", message, int(message) / 10)
    for _ in range(int(message)):
        time.sleep(0.01)
    logging.debug("process_message: completed message %s", message)
    processed_messages.append(f"processed {message}")


class MessageAPI(object):
    """Class simulating the front end facing API"""

    def add_messages(self, messages: list) -> list:
        """ Receives a list of messages to work on """
        logging.info("add_messages: got %i messages to process", len(messages))
        processed_messages = []
        threads = []
        for message in messages:
            threads.append(
                threading.Thread(target=process_message, args=[message, processed_messages]))
            threads[-1].start()
        logging.debug("add_messages: submitted %i messages", len(messages))
        for thread in threads:
            thread.join()
        logging.info("add_messages: messages_done=%i", len(processed_messages))
        return processed_messages


#####################
# exploiting above code example
#####################
mapi = MessageAPI()
attacker_messages = [str(msg) for msg in range(1000)]
print("ATTACKER: start sending messages")
result_list = mapi.add_messages(attacker_messages)
print(
    f"ATTACKER: done sending {len(attacker_messages)} messages, got {len(result_list)} messages "
    f"back")
print(f"ATTACKER: result_list = {result_list}")

```

The `noncompliant01.py` code creates a risk of having a single component exhaust all available hardware resources even when used by a single user for a single use-case. When running the code, the Unix `top` command can show a significant increase in CPU usage (%CPU exceeds 100% because multiple cores are being used):

```bash
PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND

10806 user   20   0 9618068  18080   3516 S 238.2  0.1   0:08.16 python
```

## Compliant Solution (Thread Pool)

The `ThreadPoolExecutor` used in `compliant01.py` places a strict limit on concurrently executing threads. It takes `max_workers` as a constructor argument to determine the number of worker threads. Since `Python 3.8`, the default value for `max_workers` is `min(32, os.cpu_count() + 4)` [[Python docs]](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor). The `ThreadPoolExecutor` controls the Pool of worker threads created and what threads should do when they are not being used, such as making them wait without consuming computational resources [[Brownlee 2022]](https://superfastpython.com/threadpoolexecutor-in-python/). This example could be further developed by adding more sophisticated timeout handling, limiting the number of messages per request, and sanitizing the input data, however for the sake of simplicity, these aspects have been omitted in the example. In a real application, the timeout and limits should be based on what the mediation layer provides and shall not be hardcoded.
The attacker could still flood the server by creating multiple MessageAPI, each with their own pool. In order to prevent that, a proxy with an intrusion detection system would be necessary. In order to keep the scope of the rule manageable, the intrusion detection system was not implemented.

*[compliant01.py](compliant01.py)*

```py
""" Compliant Code Example """
import logging
import time
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import wait

logging.basicConfig(level=logging.INFO)


def process_message(message: str):
    """ Method simulating mediation layer i/o heavy work"""
    logging.debug("process_message: started message   %s working %is", message, int(message) / 10)
    for _ in range(int(message)):
        time.sleep(0.01)
    logging.debug("process_message: completed message %s", message)
    return f"processed {message}"


class MessageAPI(object):
    """Class simulating the front end facing API"""
    # TODO: Prevent the attacker from creating multiple MessageAPI objects

    def __init__(self):
        # TODO: set or handle timeout as it is provided by the mediation layer
        self.timeout = 1
        self.executor = ThreadPoolExecutor()

    def add_messages(self, messages: list) -> list:
        """ Receives a list of messages to work on """
        # TODO: limit on max messages from the mediation layer.
        # TODO: input sanitation.
        futures = []
        # with self.executor:
        for message in messages:
            futures.append(self.executor.submit(process_message, message))
        logging.debug("add_messages: submitted %i messages, waiting for %is to complete.", len(messages), self.timeout)
        messages_done, messages_not_done = wait(futures, timeout=self.timeout)
        for future in messages_not_done:
            future.cancel()

        logging.info("add_messages: messages_done=%i messages_not_done=%i", len(messages_done), len(messages_not_done))
        process_messages = []
        for future in messages_done:
            process_messages.append(future.result())
        return process_messages


#####################
# exploiting above code example
#####################
mapi = MessageAPI()
result_list = []
attacker_messages = [str(msg) for msg in range(100)]
print("ATTACKER: start sending messages")
result_list = mapi.add_messages(attacker_messages)
print(f"ATTACKER: done sending {len(attacker_messages)} messages, got {len(result_list)} messages back")
print(f"ATTACKER: result_list = {result_list}")
```

Now, after the timeout is reached, `MessageAPI` drops unprocessed messages and returns partial results:

```bash
ATTACKER: start sending messages
INFO:root:add_messages: messages_done=34 messages_not_done=66
ATTACKER: done sending 100 messages, got 34 messages back
ATTACKER: result_list = ['processed 5', 'processed 29', 'processed 16', 'processed 30', 'processed 23', 'processed 3', 'processed 0', 'processed 12', 'processed 17', 'processed 31', 'processed 24', 'processed 1', 'processed 10', 'processed 18', 'processed 32', 'processed 25', 'processed 8', 'processed 6', 'processed 19', 'processed 33', 'processed 26', 'processed 4', 'processed 20', 'processed 13', 'processed 27', 'processed 22', 'processed 2', 'processed 11', 'processed 21', 'processed 14', 'processed 28', 'processed 9', 'processed 7', 'processed 15']
```

## Non-Compliant Code Example (Thread Pool without cancellation)

The `executor.shutdown()`  method has a `cancel_futures` parameter, which by default is set to `False`. It is important to remember to cancel queued-up futures by either calling `cancel()` on a Future object or shutting down the `ThreadPoolExecutor`  with the cancel_futures set to `True`. Otherwise, despite the client receiving partial results upon the timeout, the server will continue to run the threads. This has been showcased in `noncompliant02.py`.

*[noncompliant02.py](noncompliant02.py):*

```py
""" Non-compliant Code Example """
import logging
import time
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import wait

logging.basicConfig(level=logging.INFO)


def process_message(message: str):
    """ Method simulating mediation layer i/o heavy work"""
    logging.debug("process_message: started message   %s working %is", message, int(message) / 10)
    for _ in range(int(message)):
        time.sleep(0.01)
    logging.debug("process_message: completed message %s", message)
    return f"processed {message}"


class MessageAPI(object):
    """Class simulating the front end facing API"""

    def __init__(self):
        self.executor = ThreadPoolExecutor()
        self.timeout = 1

    def add_messages(self, messages: list) -> list:
        """ Receives a list of messages to work on """
        futures = []
        for message in messages:
            futures.append(self.executor.submit(process_message, message))

        logging.debug("add_messages: submitted %i messages, waiting for %is to complete.",
                      len(messages), self.timeout)
        messages_done, messages_not_done = wait(futures, timeout=self.timeout)

        logging.info("add_messages: messages_done=%i messages_not_done=%i", len(messages_done),
                     len(messages_not_done))

        process_messages = []
        for future in messages_done:
            process_messages.append(future.result())
        return process_messages


#####################
# exploiting above code example
#####################
mapi = MessageAPI()
result_list = []
attacker_messages = [str(msg) for msg in range(1000)]
print("ATTACKER: start sending messages")
result_list = mapi.add_messages(attacker_messages)
print(
    f"ATTACKER: done sending {len(attacker_messages)} messages, got {len(result_list)} messages "
    f"back")
print(f"ATTACKER: result_list = {result_list}")
```

## Compliant Solution (Thread Pool with grace period)

The `compliant01.py` can be expanded by adding a grace period. Before dropping the messages, the application can warn the user about the long processing time and potentially unprocessed messages. In the `compliant02.py` example, two timeouts have been used - one for the grace period and another for canceling the request. Again, the timeout and limits should not be hardcoded and instead should be based on the input from the mediation layer.

*[compliant02.py](compliant02.py):*

```py
""" Compliant Code Example """
import logging
import time
from concurrent.futures import ThreadPoolExecutor
from concurrent.futures import wait

logging.basicConfig(level=logging.INFO)


def process_message(message: str):
    """ Method simulating mediation layer i/o heavy work"""
    logging.debug("process_message: started message   %s working %is", message, int(message) / 10)
    for _ in range(int(message)):
        time.sleep(0.01)
    logging.debug("process_message: completed message %s", message)
    return f"processed {message}"


class MessageAPI(object):
    """Class simulating the front end facing API"""
    # TODO: Prevent the attacker from creating multiple MessageAPI objects

    def __init__(self):
        # TODO: set or handle timeout as it is provided by the mediation layer
        self.timeout = 1
        self.executor = ThreadPoolExecutor()

    def add_messages(self, messages: list) -> list:
        """ Receives a list of messages to work on """
        # TODO: limit on max messages from the mediation layer.
        # TODO: input sanitation.
        futures = []
        # with self.executor:
        for message in messages:
            futures.append(self.executor.submit(process_message, message))
        logging.debug("add_messages: submitted %i messages, waiting for %is to complete.",
                      len(messages), self.timeout)
        messages_done, messages_not_done = wait(futures, timeout=self.timeout)
        logging.info("add_messages: messages_done=%i messages_not_done=%i", len(messages_done),
                     len(messages_not_done))
        if len(messages_not_done) > 0:
            # TODO: be graceful, warn a trusted client
            logging.warning("add_messages: %i messages taking longer than %is, %i more to process",
                            len(messages), self.timeout, len(messages_not_done))
            messages_done, messages_not_done = wait(futures, timeout=self.timeout)
            logging.info("add_messages: messages_done=%i messages_not_done=%i", len(messages_done),
                         len(messages_not_done))
        for future in messages_not_done:
            future.cancel()

        logging.info("add_messages: messages_done=%i messages_not_done=%i", len(messages_done),
                     len(messages_not_done))
        process_messages = []
        for future in messages_done:
            process_messages.append(future.result())
        return process_messages


#####################
# exploiting above code example
#####################
mapi = MessageAPI()
result_list = []
attacker_messages = [str(msg) for msg in range(100)]
print("ATTACKER: start sending messages")
result_list = mapi.add_messages(attacker_messages)
print(
    f"ATTACKER: done sending {len(attacker_messages)} messages, got {len(result_list)} messages "
    f"back")
print(f"ATTACKER: result_list = {result_list}")
```

## Automated Detection

unknown

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Base [CWE-410, Insufficient Resource Pool](http://cwe.mitre.org/data/definitions/410.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[TPS00-J. Use thread pools to enable graceful degradation of service during traffic bursts](https://wiki.sei.cmu.edu/confluence/display/java/TPS00-J.+Use+thread+pools+to+enable+graceful+degradation+of+service+during+traffic+bursts)|

## Biblography

|||
|:---|:---|
|[[Brownlee 2022]](https://superfastpython.com/threadpoolexecutor-in-python/)|Brownlee, J. (2022). ThreadPoolExecutor in Python: The Complete Guide \[online]. Available from: <https://superfastpython.com/threadpoolexecutor-in-python/> \[Accessed 2 February 2023].|
|[[Python docs]](https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor)|Python Software Foundation. (2023). concurrent.futures - Launching parallel tasks [online]. Available from: <https://docs.python.org/3/library/concurrent.futures.html#concurrent.futures.ThreadPoolExecutor> \[Accessed 2 February 2023].|
