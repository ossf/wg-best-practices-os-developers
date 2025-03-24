# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
"""Compliant Code Example"""

from time import sleep
import logging
import threading
import secrets

LOCK = threading.Lock()


def thread_function(animal: "Animal", animal_name: str, animal_sound: str):
    """Function that changes animal's characteristics using method chaining"""
    for _ in range(3):
        LOCK.acquire()
        logging.info(
            "Thread: starting - %s goes %s",
            animal.name,
            animal.sound,
        )
        # First time, name and sound will be blank because
        # the object isn't initialized yet.
        animal.set_name(animal_name).set_sound(animal_sound)
        logging.info(
            "Thread: finishing - %s goes %s",
            animal.name,
            animal.sound,
        )
        LOCK.release()
        # Simulate a longer operation on non-shared resources
        for i in range(10, 1000):
            _ = (secrets.randbelow(i) + 1) / i


class Animal:
    """Class that represents an animal"""

    # The characteristics of the animal (optional fields)
    def __init__(self):
        self.name = ""
        self.sound = ""

    def set_name(self, name: str):
        """Sets the animal's name"""
        self.name = name
        # force the thread to lose the lock on the object by
        # simulating a long running operation
        sleep(0.1)
        return self

    def set_sound(self, sound: str):
        """Sets the sound that the animal makes"""
        self.sound = sound
        sleep(0.2)
        return self


#####################
# Exploiting above code example
#####################

if __name__ == "__main__":
    MESSAGE_FORMAT = "%(asctime)s: %(message)s"
    logging.basicConfig(
        format=MESSAGE_FORMAT, level=logging.INFO, datefmt="%H:%M:%S"
    )

    animal = Animal()
    dog = threading.Thread(
        target=thread_function,
        args=(animal, "DOG", "WOOF"),
    )
    cat = threading.Thread(
        target=thread_function, args=(animal, "CAT", "MEOW")
    )
    dog.start()
    cat.start()
