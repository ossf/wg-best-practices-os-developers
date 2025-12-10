# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Markdown parsing utilities for the testing framework.

This module provides functions to parse README.md files and extract
structural elements like sections, code references, links, and tables.
"""

import re
from pathlib import Path


def parse_markdown(file_path: Path) -> dict:
    """
    Parse a markdown file and return its structure.

    Args:
        file_path: Path to the markdown file

    Returns:
        Dictionary containing:
        - 'content': Raw file content
        - 'sections': List of section headings
        - 'code_references': List of Python file references
        - 'links': List of (text, url) tuples
        - 'has_automated_detection_table': Boolean
        - 'has_related_guidelines_table': Boolean
        - 'has_bibliography_table': Boolean
        - 'section_order': List of (section_name, index) tuples for key sections
    """
    with open(file_path, encoding="utf-8") as f:
        content = f.read()

    return {
        "content": content,
        "sections": extract_sections(content),
        "code_references": extract_code_references(content),
        "links": extract_links(content),
        "has_automated_detection_table": validate_table_structure(
            content, "Automated Detection"
        ),
        "has_related_guidelines_table": validate_table_structure(
            content, "Related Guidelines"
        ),
        "has_bibliography_table": validate_table_structure(content, "Bibliography"),
        "section_order": extract_section_order(content),
    }


def extract_sections(content: str) -> list[str]:
    """
    Extract all heading sections from markdown content.

    Args:
        content: Markdown file content

    Returns:
        List of section heading texts (without the # markers)
    """
    # Match markdown headings (# Heading, ## Heading, etc.)
    heading_pattern = r"^#{1,6}\s+(.+)$"
    sections = []

    for line in content.split("\n"):
        match = re.match(heading_pattern, line.strip())
        if match:
            sections.append(match.group(1).strip())

    return sections


def extract_code_references(content: str) -> list[str]:
    """
    Find references to Python files in markdown content.

    Looks for patterns like:
    - [compliant01.py](compliant01.py)
    - [noncompliant01.py](noncompliant01.py)
    - [example01.py](example01.py)
    - _[example01.py:](example01.py)_

    Args:
        content: Markdown file content

    Returns:
        List of Python filenames referenced in the markdown
    """
    # Pattern to match markdown links to .py files
    # Matches: [text](file.py) or _[text](file.py)_
    link_pattern = r"\[([^\]]+)\]\(([^)]+\.py)\)"

    code_files = set()
    for match in re.finditer(link_pattern, content):
        filename = match.group(2)
        # Extract just the filename if it's a relative path
        filename = Path(filename).name
        code_files.add(filename)

    return sorted(code_files)


def extract_links(content: str) -> list[tuple[str, str]]:
    """
    Extract all markdown links from content.

    Args:
        content: Markdown file content

    Returns:
        List of (link_text, url) tuples
    """
    # Pattern to match markdown links: [text](url) or [text](url "title")
    link_pattern = r"\[([^\]]+)\]\(([^)]+)\)"

    links = []
    for match in re.finditer(link_pattern, content):
        link_text = match.group(1)
        url = match.group(2)

        # Remove title attribute if present (e.g., "url "title"" -> "url")
        # Split on space and take first part if there's a quoted title
        if ' "' in url:
            url = url.split(' "')[0]

        links.append((link_text, url))

    return links


def validate_table_structure(content: str, table_name: str) -> bool:
    """
    Validate that a table with the given name exists in the content.

    Looks for a heading with the table name followed by a table structure.

    Args:
        content: Markdown file content
        table_name: Name of the table section to look for

    Returns:
        True if the table section exists and contains a table, False otherwise
    """
    # Look for heading with table name (case-insensitive)
    # Pattern matches: ## Automated Detection, ### Related Guidelines, etc.
    # Note: Double curly braces {{1,6}} in f-string to get literal {1,6} in regex
    heading_pattern = rf"^#{{1,6}}\s+{re.escape(table_name)}\s*$"

    lines = content.split("\n")
    found_heading = False
    heading_index = -1

    for i, line in enumerate(lines):
        if re.match(heading_pattern, line.strip(), re.IGNORECASE):
            found_heading = True
            heading_index = i
            break

    if not found_heading:
        return False

    # Look for table structure after the heading
    # Tables can be markdown tables (with |) or HTML tables (<table>)
    # Check the next 20 lines for table indicators
    for i in range(heading_index + 1, min(heading_index + 21, len(lines))):
        line = lines[i].strip()

        # Check for markdown table (contains |)
        if "|" in line:
            return True

        # Check for HTML table
        if "<table>" in line.lower():
            return True

    return False


def extract_section_order(content: str) -> list[tuple[str, int]]:
    """
    Extract the order of key sections in the markdown content.

    Args:
        content: Markdown file content

    Returns:
        List of (section_name, line_index) tuples for key sections:
        - Non-Compliant Code Example
        - Compliant Solution
        - Automated Detection
        - Related Guidelines
        - Bibliography
    """
    key_sections = [
        "Non-Compliant Code Example",
        "Compliant Solution",
        "Automated Detection",
        "Related Guidelines",
        "Bibliography",
    ]

    section_positions = []
    lines = content.split("\n")

    for i, line in enumerate(lines):
        # Match markdown headings (## or ###, etc.)
        heading_match = re.match(r"^#{1,6}\s+(.+)$", line.strip())
        if heading_match:
            heading_text = heading_match.group(1).strip()
            # Check if this heading matches any key section (case-insensitive)
            for key_section in key_sections:
                if key_section.lower() in heading_text.lower():
                    section_positions.append((key_section, i))
                    break

    return section_positions
