import threading


lock = threading.Lock()


def noncompliant_example():
    lock.acquire()
    print("Lock acquired, performing critical operation...")
    raise ValueError("Something went wrong!")
    lock.release()  # This line is never reached due to the exception


try:
    noncompliant_example()
except ValueError as e:
    print(f"Caught exception: {e}")


# Next attempt to acquire the lock will block forever; as there is a deadlock!
lock.acquire()
print("This will not print because the lock was never released.")


