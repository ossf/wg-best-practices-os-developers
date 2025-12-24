# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Utility functions for handling expected failure markers in Python files.

This module provides functions to parse and validate expected failure markers
that can be added to Python files to indicate known issues.
"""

from pathlib import Path
from typing import Optional


def parse_expected_failure_marker(file_path: Path) -> Optional[tuple[str, str]]:
    """
    Parse expected failure marker from the first 10 lines of a Python file.

    Supported markers:
    - # EXPECTED_TIMEOUT
    - # EXPECTED_FAILURE: <reason>
    - # EXPECTED_ERROR: <error_type>

    Args:
        file_path: Path to the Python file to check

    Returns:
        Tuple of (marker_type, reason) if marker found, None otherwise.
        marker_type is one of: 'timeout', 'failure', 'error'
        reason is the text after the colon, or empty string for EXPECTED_TIMEOUT
    """
    try:
        with open(file_path, encoding="utf-8") as f:
            # Only read first 10 lines for performance
            for i, line in enumerate(f):
                if i >= 10:
                    break

                line = line.strip()

                # Check for EXPECTED_TIMEOUT
                if line.startswith("# EXPECTED_TIMEOUT"):
                    return ("timeout", "")

                # Check for EXPECTED_FAILURE: <reason>
                if line.startswith("# EXPECTED_FAILURE:"):
                    reason = line.split(":", 1)[1].strip() if ":" in line else ""
                    return ("failure", reason)

                # Check for EXPECTED_ERROR: <error_type>
                if line.startswith("# EXPECTED_ERROR:"):
                    error_type = line.split(":", 1)[1].strip() if ":" in line else ""
                    return ("error", error_type)

        return None

    except Exception:
        # If we can't read the file, assume no marker
        return None


def should_expect_timeout(file_path: Path) -> bool:
    """
    Check if a file has an EXPECTED_TIMEOUT marker.

    Args:
        file_path: Path to the Python file to check

    Returns:
        True if the file has an EXPECTED_TIMEOUT marker, False otherwise
    """
    marker = parse_expected_failure_marker(file_path)
    return marker is not None and marker[0] == "timeout"


def should_expect_failure(file_path: Path) -> bool:
    """
    Check if a file has an EXPECTED_FAILURE or EXPECTED_ERROR marker.

    Args:
        file_path: Path to the Python file to check

    Returns:
        True if the file has an expected failure marker, False otherwise
    """
    marker = parse_expected_failure_marker(file_path)
    return marker is not None and marker[0] in ("failure", "error")


def get_expected_failure_reason(file_path: Path) -> str:
    """
    Get the reason/description from an expected failure marker.

    Args:
        file_path: Path to the Python file to check

    Returns:
        The reason text from the marker, or empty string if no marker
    """
    marker = parse_expected_failure_marker(file_path)
    if marker is None:
        return ""
    return marker[1]
