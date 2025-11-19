# SPDX-License-Identifier: Apache-2.0
# SPDX-FileCopyrightText: OpenSSF Best Practices WG

"""
Pytest configuration and shared fixtures for the testing framework.

This module provides session-scoped fixtures that discover files once
and reuse them across all tests for better performance.
"""

from pathlib import Path

import pytest

from tests.utils.file_scanner import (
    find_python_files,
    find_readme_files,
    get_cwe_directories,
)


def pytest_configure(config):
    """Register custom markers for test categorization."""
    config.addinivalue_line(
        "markers", "python: marks tests that validate Python code examples"
    )
    config.addinivalue_line(
        "markers", "markdown: marks tests that validate Markdown documentation"
    )


@pytest.fixture(scope="session")
def project_root() -> Path:
    """
    Provide the path to the Secure-Coding-Guide-for-Python directory.

    Returns:
        Path object pointing to the project root directory
    """
    # conftest.py is in tests/, so parent is the project root
    return Path(__file__).parent.parent


@pytest.fixture(scope="session")
def python_files(project_root: Path) -> list[Path]:
    """
    Discover all Python files to validate (session-scoped for performance).

    Uses the file scanner utility to find all .py files, excluding
    templates and test files.

    Args:
        project_root: Path to the Secure-Coding-Guide-for-Python directory

    Returns:
        List of Path objects for all Python files to validate
    """
    files = find_python_files(str(project_root))
    return files


@pytest.fixture(scope="session")
def readme_files(project_root: Path) -> list[Path]:
    """
    Discover all README.md files to validate (session-scoped for performance).

    Uses the file scanner utility to find all README.md files in CWE
    directories, excluding templates and the top-level index.

    Args:
        project_root: Path to the Secure-Coding-Guide-for-Python directory

    Returns:
        List of Path objects for all README.md files to validate
    """
    files = find_readme_files(str(project_root))
    return files


@pytest.fixture(scope="session")
def cwe_directories(project_root: Path) -> list[Path]:
    """
    Discover all CWE directories (session-scoped for performance).

    Uses the file scanner utility to find all directories with names
    matching the CWE-### pattern.

    Args:
        project_root: Path to the Secure-Coding-Guide-for-Python directory

    Returns:
        List of Path objects for all CWE directories
    """
    directories = get_cwe_directories(str(project_root))
    return directories


@pytest.fixture(scope="session", autouse=True)
def cleanup_test_artifacts(project_root: Path):
    """
    Clean up test artifacts created by code examples.
    
    This fixture runs automatically after all tests complete and removes
    files/directories created by running Python code examples during testing.
    
    Args:
        project_root: Path to the Secure-Coding-Guide-for-Python directory
    """
    import shutil
    
    yield  # Run all tests first
    
    # List of artifacts to clean up
    artifacts = [
        # Database files
        project_root / "CWE-707/CWE-89/school.db",
        
        # Temporary files
        project_root / "CWE-664/CWE-459/tempfile.txt",
        
        # Zip test files and extracted content
        project_root / "CWE-664/CWE-409/zip_attack_test.zip",
        project_root / "CWE-664/CWE-409/zipbombfile0.txt",
        project_root / "CWE-664/CWE-409/zipbombfile1.txt",
        project_root / "CWE-664/CWE-409/zipbombfile2.txt",
        project_root / "CWE-664/CWE-409/zipbombfile3.txt",
        project_root / "CWE-664/CWE-409/safe_dir",
        project_root / "CWE-664/CWE-409/tmp",
        project_root / "CWE-664/CWE-409/Temp",
        project_root / "CWE-664/CWE-409/....................Temp",
        project_root / "CWE-664/CWE-409/ziptemp",
    ]
    
    # Clean up files and directories
    for artifact in artifacts:
        try:
            if artifact.is_file():
                artifact.unlink()
            elif artifact.is_dir():
                shutil.rmtree(artifact)
        except Exception:
            # Ignore errors during cleanup (file may not exist)
            pass
