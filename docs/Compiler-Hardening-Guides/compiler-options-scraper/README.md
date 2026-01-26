# Compiler Options Scraper

Technical utility for scraping compiler flags from OSSF hardening guides.

## Data Source

The scraper normalizes content from the [OSSF Compiler Options Hardening Guide for C/C++](https://raw.githubusercontent.com/ossf/wg-best-practices-os-developers/refs/heads/main/docs/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C%2B%2B.md).

## Usage

The project utilizes a `Makefile` for standard operations.

```bash
make help  # Show all available commands
make run   # Execute the scraper (bootstrapping venv if required)
```

## Dependency Management

Dependencies are locked via `requirements.txt` to support Dependabot analysis (which currently lacks `uv.lock` parsing support).

To add, update or remove dependencies, do not manually edit `requirements.txt`. Instead:

1. Install or update the package in your local environment.
2. Run the lock command to regenerate the lock file: `make lock`
