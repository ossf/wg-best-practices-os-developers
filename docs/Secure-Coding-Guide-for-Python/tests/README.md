# Testing Framework for Python Secure Coding Guide

This directory contains a pytest-based testing framework that validates Python code examples and Markdown documentation structure for the Secure Coding Guide for Python.

## Purpose

The testing framework ensures:

- **Python Code Quality**: All Python examples are syntactically valid, execute without deprecation warnings, and produce expected output
- **Documentation Consistency**: All README.md files conform to the standard template structure
- **Link Integrity**: All internal links and code references are valid and not broken
- **CI/CD Integration**: Automated testing on every pull request across multiple Python versions (3.9-3.14)

## Quick Start

### Prerequisites

Install [uv](https://docs.astral.sh/uv/), a fast Python package manager:

```bash
# Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or via pip
pip install uv

# Or via homebrew (macOS)
brew install uv
```

### Installation

Navigate to the Secure Coding Guide directory and install dependencies:

```bash
cd docs/Secure-Coding-Guide-for-Python

# Install test dependencies only
uv sync --group test

# Install all development dependencies (includes linting and tox)
uv sync --group dev
```

### Running Tests

Run all tests:

```bash
uv run pytest tests/
```

Run with verbose output:

```bash
uv run pytest tests/ -v
```

Generate a clean summary of issues (recommended):

```bash
# Cross-platform (Python) - prints to console
uv run python tests/generate_issue_report.py

# Save report to KNOWN_ISSUES.md for reference
uv run python tests/generate_issue_report.py --save

# Or using bash script (Linux/macOS)
./generate_test_summary.sh
```

This provides a concise list of all issues without verbose test output. The `--save` option creates a `KNOWN_ISSUES.md` file that can be committed as a reference for tracking issues.

## Test Categories

The framework includes three main test categories:

### Python Validation Tests (`test_python_validation.py`)

Validates Python code examples for syntax errors, deprecation warnings, and expected output:

```bash
# Run only Python validation tests
uv run pytest tests/test_python_validation.py -v

# Run specific test
uv run pytest tests/test_python_validation.py::test_python_syntax_valid -v
```

**What it checks:**
- Syntax validation using `ast.parse()`
- Deprecation warnings when executing code
- Expected output matches documentation (for files with documented output)
- Expected failure handling (files marked with `# EXPECTED_TIMEOUT` or `# EXPECTED_FAILURE`)

### Markdown Validation Tests (`test_markdown_validation.py`)

Validates README.md files conform to the template structure:

```bash
# Run only Markdown validation tests
uv run pytest tests/test_markdown_validation.py -v

# Run specific test
uv run pytest tests/test_markdown_validation.py::test_readme_has_required_sections -v
```

**What it checks:**
- Required sections presence (title, introduction, Non-Compliant Code Example, Compliant Solution, etc.)
- Code file references (compliant01.py, noncompliant01.py) exist

### Link Validation Tests (`test_link_validation.py`)

Validates all links in README.md files are valid:

```bash
# Run only link validation tests
uv run pytest tests/test_link_validation.py -v
```

**What it checks:**
- Internal links point to existing files
- Index table links are valid
- Code file references exist

## Running Tests with Markers

Use pytest markers to run specific test categories:

```bash
# Run only Python validation tests
uv run pytest tests/ -m python -v

# Run only Markdown validation tests
uv run pytest tests/ -m markdown -v

# Run all except slow tests
uv run pytest tests/ -m "not slow" -v
```

## Multi-Version Testing with Tox

Test across multiple Python versions (3.9-3.14) using tox:

```bash
# Run tests for all Python versions
uv run tox

# Run tests for specific Python version
uv run tox -e py311

# Run tests in parallel (faster)
uv run tox -p
```

### Tox Environments

The `tox.ini` configuration provides several environments:

**Test Environments:**
```bash
# Python 3.9
uv run tox -e py39

# Python 3.10
uv run tox -e py310

# Python 3.11
uv run tox -e py311

# Python 3.12
uv run tox -e py312

# Python 3.13
uv run tox -e py313

# Python 3.14
uv run tox -e py314
```

**Linting:**
```bash
# Run ruff linting checks
uv run tox -e lint
```

**Coverage:**
```bash
# Run tests with full coverage reporting
uv run tox -e coverage
```

**Link Checking:**
```bash
# Check internal markdown links only (fast, reliable)
uv run tox -e links

# Check ALL links including external URLs (slow, may have false positives)
uv run tox -e links-external
```

> **Note:** Both `links` environments require [lychee](https://github.com/lycheeverse/lychee), a Rust-based link checker, to be installed separately. The `links-external` environment checks external URLs which can be slow and may fail due to network issues or rate limiting - use it locally before major releases:
> 
> **Windows:**
> - Scoop: `scoop install lychee`
> - Chocolatey: `choco install lychee`
> - Cargo: `cargo install lychee`
> - [Download binary](https://github.com/lycheeverse/lychee/releases)
> 
> **Linux/macOS:**
> - Cargo: `cargo install lychee`
> - Homebrew: `brew install lychee`
> - [Download binary](https://github.com/lycheeverse/lychee/releases)
> 
> Internal link validation is already covered by `test_link_validation.py` and doesn't require lychee.

## Coverage Reports

Generate coverage reports:

```bash
# Run tests with coverage
uv run pytest tests/ --cov=tests --cov-report=html --cov-report=term

# View HTML coverage report
open reports/coverage/html/index.html  # macOS
xdg-open reports/coverage/html/index.html  # Linux
start reports/coverage/html/index.html  # Windows
```

## Running Specific Test Subsets

### By File Pattern

```bash
# Run all tests in a specific file
uv run pytest tests/test_python_validation.py

# Run tests matching a pattern
uv run pytest tests/ -k "syntax" -v

# Run tests for specific CWE
uv run pytest tests/ -k "CWE-079" -v
```

### By Test Function

```bash
# Run a specific test function
uv run pytest tests/test_python_validation.py::test_python_syntax_valid

# Run parametrized test for specific file
uv run pytest tests/test_python_validation.py::test_python_syntax_valid[path/to/file.py]
```

### Parallel Execution

Speed up test execution with parallel processing using pytest-xdist:

```bash
# Run tests in parallel (auto-detect CPU count)
uv run pytest tests/ -n auto

# Run tests with specific number of workers
uv run pytest tests/ -n 4
```

**Performance tip:** Parallel execution can significantly speed up the test suite (2-4x faster on multi-core systems), especially useful when running the full suite locally.

## Link Validation with Lychee

The framework integrates [lychee](https://github.com/lycheeverse/lychee), a fast link checker for markdown files.

### Installation

Lychee is included in the `dev` dependency group:

```bash
uv sync --group dev
```

### Running Link Validation

```bash
# Via tox (recommended)
uv run tox -e links

# Direct execution (if lychee is in PATH)
lychee --offline --base . **/*.md
```

**What it checks:**
- Internal links (relative paths to other files)
- Anchor links within documents
- Code file references

**Note:** The `--offline` flag checks only internal links, not external URLs.

## Adding New Validation Rules

### Adding Python Validation Rules

1. Open `tests/test_python_validation.py`
2. Add a new test function with the `@pytest.mark.python` marker
3. Use the `python_files` fixture to get all Python files
4. Implement your validation logic

Example:

```python
@pytest.mark.python
def test_python_new_rule(python_files):
    """Test description."""
    for py_file in python_files:
        # Your validation logic here
        with open(py_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Assert your condition
        assert condition, f"Validation failed for {py_file}"
```

### Adding Markdown Validation Rules

1. Open `tests/test_markdown_validation.py`
2. Add a new test function with the `@pytest.mark.markdown` marker
3. Use the `readme_files` fixture to get all README.md files
4. Use utilities from `tests/utils/markdown_parser.py` for parsing

Example:

```python
@pytest.mark.markdown
def test_readme_new_rule(readme_files):
    """Test description."""
    for readme in readme_files:
        content = readme.read_text(encoding='utf-8')
        
        # Use markdown parser utilities
        sections = extract_sections(content)
        
        # Assert your condition
        assert condition, f"Validation failed for {readme}"
```

### Adding Utility Functions

Create reusable utilities in `tests/utils/`:

1. Create a new Python file (e.g., `tests/utils/my_utility.py`)
2. Implement your utility functions
3. Import and use in test files

Example:

```python
# tests/utils/my_utility.py
from pathlib import Path

def my_validation_function(file_path: Path) -> bool:
    """Utility function description."""
    # Implementation
    return True
```

### Adding Pytest Fixtures

Add shared fixtures in `tests/conftest.py`:

```python
@pytest.fixture
def my_fixture():
    """Fixture description."""
    # Setup
    yield value
    # Teardown (optional)
```

## Test Framework Architecture

### Directory Structure

```
tests/
├── __init__.py                     # Package marker
├── conftest.py                     # Pytest configuration and fixtures
├── test_python_validation.py       # Python code validation tests
├── test_markdown_validation.py     # Markdown structure validation tests
├── test_link_validation.py         # Link validation tests
└── utils/                          # Utility modules
    ├── __init__.py
    ├── file_scanner.py             # File discovery utilities
    ├── markdown_parser.py          # Markdown parsing utilities
    └── output_validator.py         # Output validation utilities
```

### Key Components

**Fixtures (`conftest.py`):**
- `project_root`: Path to Secure-Coding-Guide-for-Python directory
- `python_files`: Session-scoped list of all Python files to validate
- `readme_files`: Session-scoped list of all README.md files to validate

**Utilities:**
- `file_scanner.py`: Discovers Python and README files recursively
- `markdown_parser.py`: Parses markdown structure and extracts elements
- `output_validator.py`: Validates Python output against expected results

## CI/CD Integration

Tests run automatically on GitHub Actions with smart optimizations for speed:

### Test Execution Strategy

**Pull Requests (Fast - Targeted Testing):**
- Only tests files in changed CWE directories
- Significantly faster for focused changes (typically 30-60 seconds)
- Example: Changing `CWE-089/compliant01.py` only tests CWE-089 files
- Reduces CI time from ~3 minutes to under 1 minute for typical PRs

**Pushes to main (Comprehensive):**
- Runs full test suite across all 661+ tests
- Ensures overall repository health
- Takes ~3 minutes across Python 3.9-3.14

**Manual Trigger (On-Demand):**
- Can manually trigger full test suite via GitHub Actions UI
- Go to Actions → Python Tests → Run workflow
- Useful for validating entire codebase after major changes

### Workflow Configuration

The workflow (`.github/workflows/python-tests.yml`) runs tests across Python versions 3.9-3.14 using a matrix strategy.

**Viewing CI Results:**
1. Navigate to the "Actions" tab in GitHub
2. Select the "Python Tests" workflow
3. View test results for each Python version

**Coverage Reports:**
Coverage reports are uploaded to Codecov from the Python 3.12 run.

## Troubleshooting

### Common Issues

**Issue: `uv: command not found`**
```bash
# Install uv first
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Issue: Tests fail with import errors**
```bash
# Ensure dependencies are installed
uv sync --group test
```

**Issue: Tox fails to find Python version**
```bash
# Install the required Python version with uv
uv python install 3.11
```

**Issue: Coverage report not generated**
```bash
# Ensure pytest-cov is installed
uv sync --group test

# Run with coverage explicitly
uv run pytest tests/ --cov=tests --cov-report=html
```

### Getting Help

- Check test output for specific error messages
- Review the test file to understand what's being validated
- Consult the design document at `.kiro/specs/python-testing-framework/design.md`
- Open an issue in the repository for persistent problems

## Contributing

When adding new tests or validation rules:

1. Follow existing test patterns and naming conventions
2. Add appropriate pytest markers (`@pytest.mark.python` or `@pytest.mark.markdown`)
3. Include clear docstrings explaining what the test validates
4. Ensure tests are deterministic and don't depend on external state
5. Run the full test suite locally before submitting a pull request
6. Update this README if adding new test categories or utilities

## License

This testing framework is part of the OpenSSF Best Practices Working Group project and is licensed under Apache 2.0.
