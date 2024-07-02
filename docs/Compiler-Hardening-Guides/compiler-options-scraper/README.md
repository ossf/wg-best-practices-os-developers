# Compiler Options Scraper

This directory contains a Python3 script that can fetch the latest OpenSSF Compiler Hardening Guide
from the website, obtain the recommended options tables and convert them to a machine readable format (JSON).
The output is saved in a JSON file: `compiler-options.json`
This can be changed by changing the global variable at the top of the script.

## Usage

`python3 main.py`

## Dependencies

Dependencies are specified in `requirements.txt`. The main dependencies are:

1. requests: To fetch the HTML page from the given OpenSSF URL.
2. BeautifulSoup4: To parse the HTML page to convert it to JSON
