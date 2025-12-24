# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Python code validation tests.

This module validates that all Python code examples in the Secure Coding Guide
are syntactically valid and free from deprecation warnings.
"""

import ast
import subprocess
import sys
from pathlib import Path

import pytest


@pytest.mark.python
def test_python_syntax_valid(python_file: Path):
    """
    Validate that Python files can be parsed without syntax errors.

    This test uses ast.parse() to verify each Python file has valid syntax
    for the current Python version.

    Args:
        python_file: Path to a Python file to validate

    Raises:
        AssertionError: If the file contains syntax errors
    """
    try:
        with open(python_file, encoding="utf-8") as f:
            source_code = f.read()

        # Parse the file to check for syntax errors
        ast.parse(source_code, filename=str(python_file))

    except SyntaxError as e:
        pytest.fail(
            f"Syntax error in {python_file}:\n  Line {e.lineno}: {e.msg}\n  {e.text}"
        )
    except Exception as e:
        pytest.fail(f"Failed to read or parse {python_file}: {e}")


@pytest.mark.python
def test_python_no_deprecation_warnings(python_file: Path):
    """
    Validate that Python files produce no deprecation warnings when executed.

    This test executes each Python file in a subprocess with warnings set to
    error mode, catching DeprecationWarning and PendingDeprecationWarning.

    Expected failure markers can be added to files to indicate known issues:
    - # EXPECTED_TIMEOUT: File is expected to timeout
    - # EXPECTED_FAILURE: <reason>: File is expected to fail
    - # EXPECTED_ERROR: <error_type>: File is expected to raise an error

    Args:
        python_file: Path to a Python file to validate

    Raises:
        AssertionError: If the file produces unexpected warnings/errors,
                       or if an expected failure marker exists but file succeeds
    """
    from tests.utils.expected_failures import (
        parse_expected_failure_marker,
        should_expect_failure,
        should_expect_timeout,
    )

    # Check for expected failure markers
    expected_marker = parse_expected_failure_marker(python_file)
    has_expected_timeout = should_expect_timeout(python_file)
    has_expected_failure = should_expect_failure(python_file)

    # Command to execute the Python file with warnings as errors
    cmd = [
        sys.executable,
        "-W",
        "error::DeprecationWarning",
        "-W",
        "error::PendingDeprecationWarning",
        str(python_file),
    ]

    try:
        # Execute with timeout to prevent hanging
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=5,
            cwd=python_file.parent,  # Run in the file's directory
        )

        # Check if execution failed due to warnings or errors
        if result.returncode != 0:
            error_output = result.stderr.strip()

            # Check if it's a deprecation warning
            if (
                "DeprecationWarning" in error_output
                or "PendingDeprecationWarning" in error_output
            ):
                # If we expected a failure, this is OK
                if has_expected_failure or has_expected_timeout:
                    return  # Test passes - expected failure occurred

                # Unexpected deprecation warning
                pytest.fail(f"Deprecation warning in {python_file}:\n{error_output}")
            else:
                # Other error (not deprecation warning)
                # If we expected a failure, this is OK
                if has_expected_failure or has_expected_timeout:
                    return  # Test passes - expected failure occurred
                # Otherwise, we only fail on deprecation warnings, not other errors

    except subprocess.TimeoutExpired:
        # If we expected a timeout, this is OK
        if has_expected_timeout or has_expected_failure:
            return  # Test passes - expected timeout occurred

        # Unexpected timeout
        pytest.fail(
            f"Execution timeout (5s) for {python_file}. "
            f"File may contain infinite loops or blocking operations."
        )
    except Exception as e:
        str(e)

        # If we expected a failure, this is OK
        if has_expected_failure or has_expected_timeout:
            return  # Test passes - expected failure occurred

        pytest.fail(f"Failed to execute {python_file}: {e}")

    # If we reach here, execution succeeded
    # Check if we had an expected failure marker but the file succeeded
    if expected_marker is not None:
        marker_type, reason = expected_marker
        reason_text = f": {reason}" if reason else ""
        pytest.fail(
            f"File {python_file} has "
            f"EXPECTED_{marker_type.upper()} marker{reason_text}, "
            f"but execution succeeded. The issue may have been fixed - "
            f"please remove the marker."
        )


@pytest.mark.python
def test_python_output_validation(python_file: Path):
    """
    Validate that example Python files produce expected output.

    This test checks if the Python file has documented expected output in its
    README.md file, and if so, validates that the actual output matches.

    Only validates files that have documented expected output in README.
    Uses fuzzy matching to allow for minor formatting differences.

    Args:
        python_file: Path to a Python file to validate

    Raises:
        AssertionError: If the file's output doesn't match expected output
    """
    from tests.utils.expected_failures import (
        should_expect_failure,
        should_expect_timeout,
    )
    from tests.utils.output_validator import (
        extract_expected_output,
        validate_output_match,
    )

    # Check if this file has expected failure markers - skip output validation
    if should_expect_failure(python_file) or should_expect_timeout(python_file):
        pytest.skip(
            f"Skipping output validation for {python_file.name} "
            f"(has expected failure marker)"
        )

    # Look for README.md in the same directory
    readme_path = python_file.parent / "README.md"
    if not readme_path.exists():
        pytest.skip(f"No README.md found for {python_file.name}")

    # Extract expected outputs from README
    expected_outputs = extract_expected_output(readme_path)

    # Check if this specific file has documented expected output
    if python_file.name not in expected_outputs:
        pytest.skip(f"No expected output documented for {python_file.name}")

    expected_output = expected_outputs[python_file.name]

    # Execute the Python file and capture output
    cmd = [sys.executable, str(python_file)]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=5,
            cwd=python_file.parent,  # Run in the file's directory
        )

        # Combine stdout and stderr for comparison
        actual_output = result.stdout.strip()
        if result.stderr.strip():
            # If there's stderr, include it (but warnings might be expected)
            actual_output = actual_output + "\n" + result.stderr.strip()

        # Validate output match
        is_match, message = validate_output_match(actual_output, expected_output)

        if not is_match:
            pytest.fail(
                f"Output mismatch for {python_file}:\n"
                f"  {message}\n\n"
                f"Expected output:\n{expected_output}\n\n"
                f"Actual output:\n{actual_output}"
            )

    except subprocess.TimeoutExpired:
        pytest.fail(
            f"Execution timeout (5s) for {python_file}. Cannot validate output."
        )
    except Exception as e:
        pytest.fail(f"Failed to execute {python_file}: {e}")


def pytest_generate_tests(metafunc):
    """
    Dynamically parametrize tests with discovered Python files.

    This hook is called during test collection to inject the python_files
    fixture into parametrized tests.
    """
    if "python_file" in metafunc.fixturenames:
        # Discover Python files
        from tests.utils.file_scanner import find_python_files

        project_root = Path(__file__).parent.parent
        python_files = find_python_files(str(project_root))

        # Parametrize the test with the discovered files
        metafunc.parametrize(
            "python_file", python_files, ids=lambda p: str(p.relative_to(project_root))
        )
