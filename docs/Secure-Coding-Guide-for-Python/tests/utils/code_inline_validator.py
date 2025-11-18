# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Utility functions for validating inlined code in README files.

This module provides functions to extract code blocks from README.md files
and compare them with the actual Python files they reference.
"""

import re
from pathlib import Path
from typing import Dict, List, Tuple


def strip_spdx_headers(code: str) -> str:
    """
    Remove SPDX copyright headers and test markers from code.

    Removes:
    - Lines starting with "# SPDX-"
    - Lines starting with "# EXPECTED_TIMEOUT:" or "# EXPECTED_FAILURE:"

    Args:
        code: Python code string

    Returns:
        Code with SPDX headers and test markers removed
    """
    lines = code.split("\n")
    result_lines = []

    for line in lines:
        # Skip SPDX lines
        if line.strip().startswith("# SPDX-"):
            continue
        # Skip EXPECTED_TIMEOUT and EXPECTED_FAILURE markers
        if line.strip().startswith("# EXPECTED_TIMEOUT:") or line.strip().startswith(
            "# EXPECTED_FAILURE:"
        ):
            continue
        result_lines.append(line)

    return "\n".join(result_lines)


def extract_inlined_code_blocks(readme_path: Path) -> Dict[str, str]:
    """
    Extract inlined code blocks from README.md that reference Python files.

    Looks for patterns like:
    *[noncompliant01.py](noncompliant01.py):*
    ```python
    ... code ...
    ```

    Args:
        readme_path: Path to README.md file

    Returns:
        Dictionary mapping filename to inlined code content
    """
    content = readme_path.read_text(encoding="utf-8")
    inlined_code = {}

    # Pattern to match: *[filename.py](filename.py):* followed by ```python code block
    # Using re.DOTALL to match across newlines
    pattern = r"\*\[([^\]]+\.py)\]\([^\)]+\):\*\s*```python\s*\n(.*?)\n```"

    matches = re.finditer(pattern, content, re.DOTALL)

    for match in matches:
        filename = match.group(1)
        code = match.group(2)
        inlined_code[filename] = code

    return inlined_code


def normalize_code(code: str) -> str:
    """
    Normalize code for comparison.

    - Strips leading/trailing whitespace
    - Normalizes line endings
    - Removes trailing whitespace from each line

    Args:
        code: Code string to normalize

    Returns:
        Normalized code string
    """
    lines = code.strip().split("\n")
    normalized_lines = [line.rstrip() for line in lines]
    return "\n".join(normalized_lines)


def compare_inlined_code(
    readme_path: Path,
) -> List[Tuple[str, str, str, str]]:
    """
    Compare inlined code in README with actual Python files.

    Args:
        readme_path: Path to README.md file

    Returns:
        List of tuples (filename, issue_type, expected, actual) for mismatches.
        Empty list if all code matches.
    """
    readme_dir = readme_path.parent
    inlined_code = extract_inlined_code_blocks(readme_path)
    mismatches = []

    for filename, inlined in inlined_code.items():
        py_file = readme_dir / filename

        if not py_file.exists():
            mismatches.append(
                (
                    filename,
                    "missing_file",
                    f"File referenced in README but not found: {filename}",
                    "",
                )
            )
            continue

        # Read actual file and strip SPDX headers
        actual_code = py_file.read_text(encoding="utf-8")
        actual_code_stripped = strip_spdx_headers(actual_code)

        # Normalize both for comparison
        inlined_normalized = normalize_code(inlined)
        actual_normalized = normalize_code(actual_code_stripped)

        if inlined_normalized != actual_normalized:
            # Store as (filename, issue_type, inlined_code, actual_code)
            mismatches.append(
                (filename, "content_mismatch", inlined_normalized, actual_normalized)
            )

    return mismatches


def format_diff(expected: str, actual: str, context_lines: int = 3) -> str:
    """
    Format a simple diff between expected and actual code.

    Args:
        expected: Expected code
        actual: Actual code
        context_lines: Number of context lines to show

    Returns:
        Formatted diff string
    """
    expected_lines = expected.split("\n")
    actual_lines = actual.split("\n")

    diff_lines = []
    max_lines = max(len(expected_lines), len(actual_lines))

    for i in range(max_lines):
        exp_line = expected_lines[i] if i < len(expected_lines) else ""
        act_line = actual_lines[i] if i < len(actual_lines) else ""

        if exp_line != act_line:
            diff_lines.append(f"Line {i + 1}:")
            diff_lines.append(f"  Expected: {exp_line}")
            diff_lines.append(f"  Actual:   {act_line}")

    return "\n".join(diff_lines[:20])  # Limit to first 20 diff lines

