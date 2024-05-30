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