# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Tests for expected failure marker parsing functionality.
"""

import tempfile
from pathlib import Path

from tests.utils.expected_failures import (
    get_expected_failure_reason,
    parse_expected_failure_marker,
    should_expect_failure,
    should_expect_timeout,
)


def test_parse_expected_timeout_marker():
    """Test parsing EXPECTED_TIMEOUT marker."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write("# EXPECTED_TIMEOUT\n")
        f.write("print('test')\n")
        temp_path = Path(f.name)

    try:
        marker = parse_expected_failure_marker(temp_path)
        assert marker is not None
        assert marker[0] == "timeout"
        assert marker[1] == ""

        assert should_expect_timeout(temp_path) is True
        assert should_expect_failure(temp_path) is False
    finally:
        temp_path.unlink(missing_ok=True)


def test_parse_expected_failure_marker():
    """Test parsing EXPECTED_FAILURE marker with reason."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write("# EXPECTED_FAILURE: Known issue with module import\n")
        f.write("print('test')\n")
        temp_path = Path(f.name)

    try:
        marker = parse_expected_failure_marker(temp_path)
        assert marker is not None
        assert marker[0] == "failure"
        assert marker[1] == "Known issue with module import"

        assert should_expect_timeout(temp_path) is False
        assert should_expect_failure(temp_path) is True
        assert (
            get_expected_failure_reason(temp_path) == "Known issue with module import"
        )
    finally:
        temp_path.unlink(missing_ok=True)


def test_parse_expected_error_marker():
    """Test parsing EXPECTED_ERROR marker with error type."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write("# EXPECTED_ERROR: ImportError\n")
        f.write("print('test')\n")
        temp_path = Path(f.name)

    try:
        marker = parse_expected_failure_marker(temp_path)
        assert marker is not None
        assert marker[0] == "error"
        assert marker[1] == "ImportError"

        assert should_expect_timeout(temp_path) is False
        assert should_expect_failure(temp_path) is True
        assert get_expected_failure_reason(temp_path) == "ImportError"
    finally:
        temp_path.unlink(missing_ok=True)


def test_no_marker():
    """Test file without any expected failure marker."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        f.write("print('test')\n")
        temp_path = Path(f.name)

    try:
        marker = parse_expected_failure_marker(temp_path)
        assert marker is None

        assert should_expect_timeout(temp_path) is False
        assert should_expect_failure(temp_path) is False
        assert get_expected_failure_reason(temp_path) == ""
    finally:
        temp_path.unlink(missing_ok=True)


def test_marker_beyond_first_10_lines():
    """Test that markers beyond line 10 are not detected."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        for i in range(11):
            f.write(f"# Line {i}\n")
        f.write("# EXPECTED_TIMEOUT\n")
        temp_path = Path(f.name)

    try:
        marker = parse_expected_failure_marker(temp_path)
        assert marker is None
    finally:
        temp_path.unlink(missing_ok=True)


def test_marker_in_first_10_lines():
    """Test that markers within first 10 lines are detected."""
    with tempfile.NamedTemporaryFile(mode="w", suffix=".py", delete=False) as f:
        for i in range(9):
            f.write(f"# Line {i}\n")
        f.write("# EXPECTED_TIMEOUT\n")
        temp_path = Path(f.name)

    try:
        marker = parse_expected_failure_marker(temp_path)
        assert marker is not None
        assert marker[0] == "timeout"
    finally:
        temp_path.unlink(missing_ok=True)
