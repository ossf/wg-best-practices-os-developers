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
