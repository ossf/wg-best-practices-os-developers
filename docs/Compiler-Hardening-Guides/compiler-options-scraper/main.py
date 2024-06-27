# compiler-options-scraper.py
# Author: mayank-ramnani
# Date: 2024-06-26
# Description: Python script to scrape recommended compiler options from the OpenSSF \
        # Compiler Options Hardening Guide HTML page
        # Scrapes the webpage and stores the options in JSON format in `compiler-options.json` \
        # file in the execution directory

import requests
from bs4 import BeautifulSoup
import json
import re
from typing import Optional, List, Dict, Tuple, Any


OPENSSF_URL = ("https://best.openssf.org/Compiler-Hardening-Guides/"
                "Compiler-Options-Hardening-Guide-for-C-and-C++.html")
DB_FILE = "compiler-options.json"


def scrape_document(url: str) -> Optional[BeautifulSoup]:
    """Scrape the document from the given URL."""
    response = requests.get(url)
    if response.status_code == 200:
        return BeautifulSoup(response.text, 'html.parser')
    print("Failed to fetch HTML content")
    return None

# Assumes version date is in the first paragraph element
def extract_version_from_soup(soup: BeautifulSoup) -> Optional[str]:
    """Extract version date from the document's subtitle."""
    subtitle = soup.find('p').get_text()
    if not subtitle:
        print("No subtitle found in the document")
        return None

    date_pattern = r'\b\d{4}-\d{2}-\d{2}\b'
    match = re.search(date_pattern, subtitle)
    if not match:
        print("No version date found in the subtitle of document.")
        return None

    version_date = match.group(0)
    return version_date


def table_to_dicts(table: BeautifulSoup) -> List[Dict[str, str]]:
    """Convert a BeautifulSoup table to a list of dictionaries."""
    # get table headers
    headers = [header.get_text() for header in table.find_all('th')]
    # get table rows
    rows = table.find_all('tr')[1:]  # Skip the header row, start from index 1

    # convert rows to dictionaries
    data = []
    for row in rows:
        row_data = []
        for cell in row.find_all('td'):
            for r in cell:
                if (r.string is None):
                    r.string = ' '
            row_data.append(cell.get_text())
        row_dict = dict(zip(headers, row_data))
        data.append(row_dict)

    return data


def split_description(desc: str) -> Tuple[str, str]:
    """Split description into main description and prerequisite."""
    index = desc.find("Requires")
    if index != -1:
        return desc[:index], desc[index:]
    return desc, ""


def convert_to_json(table_data: List[Dict[str, str]]) -> List[Dict[str, Any]]:
    """Convert table data to JSON format."""
    json_data = []
    for entry in table_data:
        flags = [entry['Compiler Flag']]
        for flag in flags:
            desc, prereq = split_description(entry['Description'])
            json_entry = {}
            json_entry["opt"] = flag
            json_entry["desc"] = desc
            if prereq:
                json_entry["prereq"] = prereq
            json_entry["requires"] = extract_versions(entry['Supported since'])

            json_data.append(json_entry)
    return json_data


def extract_versions(input_string: str) -> Dict[str, str]:
    """Extract version information of dependencies from the input string."""
    versions = {}
    # Regex for various dependencies
    # NOTE: the last version node is assumed to be single digit
    # if you need to support multiple digits, d+ can be added
    # however, it will start including the superscript references in the version number
    # example: -D_FORTIFY_SOURCE=3
    version_patterns = {
        'gcc': r'GCC\s+(\d+\.\d+\.\d)',
        'clang': r'Clang\s+(\d+\.\d+\.\d)',
        'binutils': r'Binutils\s+(\d+\.\d+\.\d)',
        'libc++': r'libc\+\+\s+(\d+\.\d+\.\d)',
        'libstdc++': r'libstdc\+\+\s+(\d+\.\d+\.\d)'
    }

    versions = {}
    for key, pattern in version_patterns.items():
        match = re.search(pattern, input_string)
        if match:
            versions[key] = match.group(1)

    return versions


def main():
    """Main function to scrape and process the document."""
    soup = scrape_document(OPENSSF_URL)
    if not soup:
        print("Error: Unable to scrape document")
        return

    # extract document version info
    version = extract_version_from_soup(soup)
    # extract all tables from soup: finds all <table> tags
    tables = soup.find_all('table')

    # NOTE: we only care about tables 1 and 2, since those contain recommended options
    # convert tables to list of dictionaries and merge entries
    recommended_data = table_to_dicts(tables[1]) + table_to_dicts(tables[2])

    # convert table to JSON format
    json_data = convert_to_json(recommended_data)

    output_db = {"version": version, "options": {"recommended": json_data}}

    with open(DB_FILE, "w") as fp:
        # json_formatted_str = json.dumps(output_db, indent=4)
        # fp.write(json_formatted_str)
        json.dump(output_db, fp, indent=4)
        print("Write compiler options in json to:", DB_FILE)


if __name__ == "__main__":
    main()
