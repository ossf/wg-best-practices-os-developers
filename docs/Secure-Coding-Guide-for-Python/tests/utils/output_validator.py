# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Output validation utilities for the testing framework.

This module provides functions to extract expected output from README files
and validate actual output against expected output using fuzzy matching.
"""

import re
from pathlib import Path


def extract_expected_output(readme_path: Path) -> dict[str, str]:
    """
    Parse expected output from README code blocks.

    Searches for patterns like:
    - **Example <filename> output:**
    - **Example output of `<filename>`:**
    - Example <filename> output:
    - __Example <filename> output:__

    Followed by a code block (```bash or ```).

    Args:
        readme_path: Path to the README.md file

    Returns:
        Dictionary mapping filename to expected output string.
        Returns empty dict if no expected output is found.
    """
    try:
        with open(readme_path, encoding="utf-8") as f:
            content = f.read()
    except Exception:
        return {}

    expected_outputs = {}

    # Pattern to match various forms of "Example <filename> output:" headers
    # Matches:
    # - **Example noncompliant01.py output:**
    # - **Example `noncompliant01.py` output:**
    # - Example compliant01.py output:
    # - __Example compliant01.py output:__
    # - **Example output of `noncompliant01.py`:**
    header_pattern = (
        r"(?:\*\*|__)?Example\s+(?:output\s+of\s+)?"
        r"`?([a-zA-Z0-9_]+\.py)`?\s+output:?(?:\*\*|__)?"
    )

    # Find all matches
    matches = list(re.finditer(header_pattern, content, re.IGNORECASE))

    for match in matches:
        filename = match.group(1)
        start_pos = match.end()

        # Find the next code block after this header
        # Look for ```bash or ``` followed by content
        code_block_pattern = r"```(?:bash)?\s*\n(.*?)```"
        code_block_match = re.search(code_block_pattern, content[start_pos:], re.DOTALL)

        if code_block_match:
            output_text = code_block_match.group(1).strip()
            expected_outputs[filename] = output_text

    return expected_outputs


def validate_output_match(actual: str, expected: str) -> tuple[bool, str]:
    """
    Validate actual output against expected output using fuzzy matching.

    Uses key phrase detection and partial matching rather than exact equality.
    This allows for minor differences in whitespace, formatting, or dynamic
    content while still validating core functionality.

    Matching strategy:
    1. Normalize whitespace (collapse multiple spaces/newlines)
    2. Extract key phrases from expected output (non-trivial words)
    3. Check if all key phrases appear in actual output
    4. Allow for minor formatting differences

    Args:
        actual: Actual output from running the Python file
        expected: Expected output from README documentation

    Returns:
        Tuple of (is_match: bool, message: str)
        - is_match: True if output matches expectations
        - message: Description of match result or mismatch details
    """
    # Normalize whitespace for comparison
    actual_normalized = " ".join(actual.split())
    expected_normalized = " ".join(expected.split())

    # If normalized strings are equal, it's a perfect match
    if actual_normalized == expected_normalized:
        return True, "Output matches exactly"

    # Extract key phrases from expected output
    # Key phrases are sequences of 3+ characters that aren't just numbers or symbols
    key_phrases = re.findall(r"\b[a-zA-Z][a-zA-Z0-9_\-\.]{2,}\b", expected)

    # Remove duplicates while preserving order
    seen = set()
    unique_phrases = []
    for phrase in key_phrases:
        phrase_lower = phrase.lower()
        if phrase_lower not in seen:
            seen.add(phrase_lower)
            unique_phrases.append(phrase)

    # Check if all key phrases appear in actual output
    missing_phrases = []
    for phrase in unique_phrases:
        if phrase.lower() not in actual_normalized.lower():
            missing_phrases.append(phrase)

    if not missing_phrases:
        return True, f"Output matches (found all {len(unique_phrases)} key phrases)"

    # If we're missing phrases, check if it's a significant mismatch
    match_ratio = (
        (len(unique_phrases) - len(missing_phrases)) / len(unique_phrases)
        if unique_phrases
        else 0
    )

    if match_ratio >= 0.7:  # 70% of key phrases match
        return True, f"Output mostly matches ({match_ratio:.0%} of key phrases found)"

    # Significant mismatch
    missing_str = ", ".join(missing_phrases[:5])  # Show first 5 missing phrases
    if len(missing_phrases) > 5:
        missing_str += f", ... ({len(missing_phrases) - 5} more)"

    return False, f"Output mismatch: missing key phrases: {missing_str}"
