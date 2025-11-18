# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
File discovery utilities for the testing framework.

This module provides functions to recursively scan the Secure Coding Guide
directory structure and discover Python files and README.md files for validation.
"""

from pathlib import Path


def find_python_files(root_dir: str) -> list[Path]:
    """
    Recursively find all Python (.py) files under the root directory.

    Excludes:
    - Files in the templates/ directory
    - Files in the tests/ directory
    - Files in the .venv/ directory
    - __pycache__ directories
    - Build/cache directories (.tox, .pytest_cache, etc.)

    Args:
        root_dir: Root directory to search
            (typically docs/Secure-Coding-Guide-for-Python)

    Returns:
        List of Path objects for all discovered Python files
    """
    root_path = Path(root_dir)
    python_files = []

    # Directories to exclude
    exclude_dirs = {
        "templates",
        "tests",
        ".venv",
        "venv",
        "__pycache__",
        ".tox",
        ".pytest_cache",
        "build",
        "dist",
        ".eggs",
        "*.egg-info",
    }

    for py_file in root_path.rglob("*.py"):
        # Check if any excluded directory is in the path
        if any(excluded in py_file.parts for excluded in exclude_dirs):
            continue

        python_files.append(py_file)

    return sorted(python_files)


def find_readme_files(root_dir: str) -> list[Path]:
    """
    Recursively find all README.md files in CWE directories.

    Excludes:
    - README.md in the templates/ directory
    - Top-level readme.md (index file)
    - Build/cache directories (.tox, .pytest_cache, tests/, etc.)

    Args:
        root_dir: Root directory to search
            (typically docs/Secure-Coding-Guide-for-Python)

    Returns:
        List of Path objects for all discovered README.md files in CWE directories
    """
    root_path = Path(root_dir)
    readme_files = []

    # Directories to exclude
    exclude_dirs = {
        "templates",
        "tests",
        ".venv",
        "venv",
        "__pycache__",
        ".tox",
        ".pytest_cache",
        "build",
        "dist",
        ".eggs",
    }

    for readme_file in root_path.rglob("README.md"):
        # Check if any excluded directory is in the path
        if any(excluded in readme_file.parts for excluded in exclude_dirs):
            continue

        # Exclude top-level readme.md (it's the index, not a CWE article)
        if readme_file.parent == root_path:
            continue

        readme_files.append(readme_file)

    return sorted(readme_files)


def get_cwe_directories(root_dir: str) -> list[Path]:
    """
    Identify all CWE-specific directories.

    A CWE directory is identified by having a name that starts with "CWE-"
    followed by digits.

    Args:
        root_dir: Root directory to search
            (typically docs/Secure-Coding-Guide-for-Python)

    Returns:
        List of Path objects for all CWE directories
    """
    root_path = Path(root_dir)
    cwe_directories = []

    for item in root_path.rglob("*"):
        if item.is_dir() and item.name.startswith("CWE-"):
            # Check if the name follows CWE-### pattern
            cwe_part = item.name[4:]  # Remove "CWE-" prefix
            if cwe_part.isdigit():
                cwe_directories.append(item)

    return sorted(cwe_directories)
