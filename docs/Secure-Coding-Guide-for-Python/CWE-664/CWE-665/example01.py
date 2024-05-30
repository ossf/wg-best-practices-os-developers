futures = [
    sp.execute_task(sp.work_as_admin),  # Thread 1, works as ADMIN
    sp.execute_task(sp.work_as_guest),  # Thread 2, should work as GUEST
    sp.execute_task(sp.work_as_admin),  # Thread 1, works as ADMIN
    sp.execute_task(sp.work_as_guest),  # Thread 3, should work as GUEST
    sp.execute_task(sp.work_as_guest),  # Thread 2, should work as GUEST
    sp.execute_task(sp.work_as_guest),  # Thread 3, should work as GUEST
]
