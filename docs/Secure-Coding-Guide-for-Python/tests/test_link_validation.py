# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Link validation tests for README.md files.

This module validates that all links in README.md files are valid,
including internal links to other files and links in the index table.
"""

from pathlib import Path

import pytest

from tests.utils.markdown_parser import extract_links


@pytest.mark.markdown
def test_internal_links_valid(readme_file: Path):
    """
    Validate that all internal links in README.md files point to existing files.

    Internal links are relative paths to other files in the project.
    This test checks that each internal link target exists.

    Args:
        readme_file: Path to README.md file to validate
    """
    links = extract_links(readme_file.read_text(encoding="utf-8"))
    readme_dir = readme_file.parent

    broken_links = []
    for link_text, url in links:
        # Skip external links (http://, https://, mailto:, etc.)
        if "://" in url or url.startswith("mailto:") or url.startswith("#"):
            continue

        # Resolve the link relative to the README's directory
        target_path = (readme_dir / url).resolve()

        # Check if the target exists
        if not target_path.exists():
            broken_links.append((link_text, url, str(target_path)))

    assert not broken_links, f"{readme_file}:\n" + "\n".join(
        f"  - Broken link: [{text}]({url}) -> {target}"
        for text, url, target in broken_links
    )


@pytest.mark.markdown
def test_index_links_valid(project_root: Path):
    """
    Validate that all links in the top-level readme.md index table are valid.

    The index table contains links to all CWE article README.md files.
    This test ensures each link points to an existing file.

    Args:
        project_root: Path to the Secure-Coding-Guide-for-Python directory
    """
    index_file = project_root / "readme.md"

    # Skip if index file doesn't exist
    if not index_file.exists():
        pytest.skip(f"Index file not found: {index_file}")

    content = index_file.read_text(encoding="utf-8")
    links = extract_links(content)

    broken_links = []
    for link_text, url in links:
        # Skip external links
        if "://" in url or url.startswith("mailto:") or url.startswith("#"):
            continue

        # Skip non-README links (like CONTRIBUTING.md, LICENSE files)
        if not url.endswith("README.md") and not url.endswith("."):
            continue

        # Handle links ending with "." (like CWE-502/.)
        if url.endswith("/."):
            url = url[:-1] + "README.md"

        # Resolve the link relative to the index file's directory
        target_path = (project_root / url).resolve()

        # Check if the target exists
        if not target_path.exists():
            broken_links.append((link_text, url, str(target_path)))

    assert not broken_links, f"{index_file}:\n" + "\n".join(
        f"  - Broken index link: [{text}]({url}) -> {target}"
        for text, url, target in broken_links
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
