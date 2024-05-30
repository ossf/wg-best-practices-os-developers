""" Compliant Code Example """

from concurrent.futures import ThreadPoolExecutor
from typing import List


class ReportTableGenerator(object):
    def __init__(self):
        self.executor = ThreadPoolExecutor()

    def generate_string_table(self, inputs: List[str]) -> str:
        futures = []
        aggregated = "|Data|Length|\n"
        for i in inputs:
            futures.append(self.executor.submit(self._create_table_row, i))
        for future in futures:
            aggregated += future.result()
        return aggregated

    def _create_table_row(self, row: str) -> str:
        print(f"Creating a row out of: {row}")
        return f"|{self._reformat_string(row)}|{len(row)}|\n"

    def _reformat_string(self, row: str) -> str:
        print(f"Reformatting {row}")
        row_reformated = row.capitalize()
        return row_reformated


#####################
# exploiting above code example
#####################
report_table_generator = ReportTableGenerator()
attacker_messages = [str(msg) for msg in range(1000)]
print("ATTACKER: start sending messages")
result = report_table_generator.generate_string_table(attacker_messages)
print(
    f"ATTACKER: done sending {len(attacker_messages)} messages, got {len(result)} messages "
    f"back")
print(f"ATTACKER: result = {result}")
