# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Markdown validation tests for README.md files.

This module validates that README.md files in CWE directories conform
to the project's template structure and contain all required sections.
"""

from pathlib import Path

import pytest

from tests.utils.markdown_parser import parse_markdown


@pytest.mark.markdown
def test_readme_has_required_sections(readme_file: Path):
    """
    Validate that README.md files contain all required sections.

    Required sections:
    - Title heading (H1 starting with "CWE-")
    - Introduction paragraph (content before first ## heading)
    - "Non-Compliant Code Example"
    - "Compliant Solution"
    - "Automated Detection"
    - "Related Guidelines"
    - "Bibliography"

    Args:
        readme_file: Path to README.md file to validate
    """
    parsed = parse_markdown(readme_file)
    sections = parsed["sections"]

    # Check for title heading with CWE-
    has_cwe_title = False
    for section in sections:
        if section.startswith("CWE-"):
            has_cwe_title = True
            break

    # Required section names (case-insensitive matching)
    required_sections = [
        "Non-Compliant Code Example",
        "Compliant Solution",
        "Automated Detection",
        "Related Guidelines",
        "Bibliography",
    ]

    missing_sections = []
    for required in required_sections:
        found = False
        for section in sections:
            if required.lower() in section.lower():
                found = True
                break
        if not found:
            missing_sections.append(required)

    # Build error message
    errors = []
    if not has_cwe_title:
        errors.append("Missing title heading starting with 'CWE-'")
    if missing_sections:
        errors.append(f"Missing required sections: {', '.join(missing_sections)}")

    assert not errors, f"{readme_file}:\n" + "\n".join(f"  - {e}" for e in errors)


@pytest.mark.markdown
def test_readme_code_references_exist(readme_file: Path):
    """
    Validate that code files referenced in README.md actually exist.

    Checks for references to Python files like:
    - compliant01.py, compliant02.py, etc.
    - noncompliant01.py, noncompliant02.py, etc.
    - example01.py, example02.py, etc.

    Args:
        readme_file: Path to README.md file to validate
    """
    parsed = parse_markdown(readme_file)
    code_references = parsed["code_references"]

    # Get the directory containing the README
    readme_dir = readme_file.parent

    # Check which referenced files don't exist
    missing_files = []
    for code_file in code_references:
        code_path = readme_dir / code_file
        if not code_path.exists():
            missing_files.append(code_file)

    assert not missing_files, (
        f"{readme_file}:\n  Missing referenced code files: {', '.join(missing_files)}"
    )


@pytest.mark.markdown
def test_readme_has_required_tables(readme_file: Path):
    """
    Validate that README.md files contain required tables.

    Required tables:
    - Automated Detection (with table structure)
    - Related Guidelines (with table structure)
    - Bibliography (with table structure)

    Args:
        readme_file: Path to README.md file to validate
    """
    parsed = parse_markdown(readme_file)

    # Check for required tables
    missing_tables = []
    if not parsed["has_automated_detection_table"]:
        missing_tables.append("Automated Detection")
    if not parsed["has_related_guidelines_table"]:
        missing_tables.append("Related Guidelines")
    if not parsed["has_bibliography_table"]:
        missing_tables.append("Bibliography")

    assert not missing_tables, (
        f"{readme_file}:\n  Missing required tables: {', '.join(missing_tables)}"
    )


def pytest_generate_tests(metafunc):
    """
    Dynamically parametrize tests with discovered files.

    This hook is called during test collection to parametrize tests
    with the actual list of files discovered by fixtures.
    """
    if "readme_file" in metafunc.fixturenames:
        # Get the readme_files fixture value
        readme_files = metafunc.config.cache.get("readme_files", None)
        if readme_files is None:
            # Fixture hasn't been evaluated yet, use a workaround
            # Import here to avoid circular dependency
            from tests.utils.file_scanner import find_readme_files

            project_root = Path(__file__).parent.parent
            readme_files = find_readme_files(str(project_root))

        metafunc.parametrize("readme_file", readme_files)


@pytest.mark.markdown
def test_readme_follows_template_order(readme_file: Path):
    """
    Validate that README.md sections follow the template order.

    Expected order:
    1. Non-Compliant Code Example
    2. Compliant Solution
    3. Automated Detection
    4. Related Guidelines
    5. Bibliography

    Args:
        readme_file: Path to README.md file to validate
    """
    parsed = parse_markdown(readme_file)
    section_order = parsed["section_order"]

    # Define expected order
    expected_order = [
        "Non-Compliant Code Example",
        "Compliant Solution",
        "Automated Detection",
        "Related Guidelines",
        "Bibliography",
    ]

    # Extract just the section names from section_order
    found_sections = [section_name for section_name, _ in section_order]

    # Check if sections appear in the correct order
    # We only validate the relative order of sections that are present
    order_issues = []

    # Build a mapping of expected positions
    expected_positions = {section: i for i, section in enumerate(expected_order)}

    # Check each pair of consecutive found sections
    for i in range(len(found_sections) - 1):
        current_section = found_sections[i]
        next_section = found_sections[i + 1]

        # Get expected positions
        current_expected_pos = expected_positions.get(current_section)
        next_expected_pos = expected_positions.get(next_section)

        # If both sections are in expected order, check their relative positions
        if (
            current_expected_pos is not None
            and next_expected_pos is not None
            and current_expected_pos > next_expected_pos
        ):
            order_issues.append(
                f"'{current_section}' appears before '{next_section}' "
                f"(expected order: {next_section} before {current_section})"
            )

    assert not order_issues, (
        f"{readme_file}:\n  Section order issues:\n"
        + "\n".join(f"    - {issue}" for issue in order_issues)
    )
