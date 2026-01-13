import json
import re
import sys
import urllib.request
from pathlib import Path
from typing import Any, Dict, List, Tuple

import markdown
from bs4 import BeautifulSoup


def extract_versions(input_string: str) -> Dict[str, str]:
    version_patterns = {
        "gcc": r"GCC\s+(\d+\.\d+\.\d)",
        "clang": r"Clang\s+(\d+\.\d+\.\d)",
        "binutils": r"Binutils\s+(\d+\.\d+\.\d)",
        "libc++": r"libc\+\+\s+(\d+\.\d+\.\d)",
        "libstdc++": r"libstdc\+\+\s+(\d+\.\d+\.\d)",
    }
    return {
        key: match.group(1)
        for key, pattern in version_patterns.items()
        if (match := re.search(pattern, input_string))
    }


def get_desc_preq_pair(desc: str) -> Tuple[str, str]:
    split_index = desc.find("Requires")
    return (desc[:split_index], desc[split_index:]) if split_index != -1 else (desc, "")


def create_option_dict(row_data: Dict[str, str]) -> Dict[str, Any]:
    description, prerequisite = get_desc_preq_pair(row_data["Description"])

    option_dict = {
        "opt": row_data["Compiler Flag"],
        "description": description,
        "requires": extract_versions(row_data["Supported since"]),
    }

    if prerequisite:
        option_dict["prerequisite"] = prerequisite

    return option_dict


def table_to_dict(table: BeautifulSoup) -> List[Dict[str, Any]]:
    headers = [header.get_text().strip() for header in table.find_all("th")]
    rows = table.find_all("tr")[1:]

    clean = lambda c: (
        [(br.insert_before(" "), br.unwrap()) for br in c.find_all("br")],
        " ".join(c.get_text().split()),
    )[1]

    header_value_dicts = [
        dict(zip(headers, [clean(cell) for cell in row.find_all("td")])) for row in rows
    ]

    return [create_option_dict(row_data) for row_data in header_value_dicts]


def get_content() -> str:
    filename = "Compiler-Options-Hardening-Guide-for-C-and-C++.md"
    cwd_files = list(Path().cwd().glob(filename))
    if cwd_files:
        return cwd_files[0].read_text()

    # remote fallback if not found in current working directory
    fallback = "https://raw.githubusercontent.com/ossf/wg-best-practices-os-developers/refs/heads/main/docs/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C%2B%2B.md"
    with urllib.request.urlopen(fallback) as response:
        assert response.getcode() == 200
        return response.read().decode("utf-8")


if __name__ == "__main__":
    content = get_content()

    html = markdown.markdown(content, extensions=["tables"])
    soup = BeautifulSoup(html, "html.parser")
    tables = soup.find_all("table")

    version = re.search(r"\b\d{4}-\d{2}-\d{2}\b", content).group(0)
    compile_time_options = table_to_dict(tables[1])
    runtime_options = table_to_dict(tables[2])

    output = {
        "version": version,
        "options": {"recommended": compile_time_options + runtime_options},
    }
    json.dump(output, fp=sys.stdout, indent=4)
