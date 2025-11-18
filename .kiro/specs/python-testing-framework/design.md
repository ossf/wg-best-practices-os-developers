# Design Document: Python Testing Framework

## Overview

This design describes a pytest-based testing framework for the Secure Coding Guide for Python subproject. The framework validates Python code examples for syntax errors and deprecation warnings, and verifies that Markdown documentation conforms to the project's README template structure. Tests will run locally via pytest and automatically in CI/CD via GitHub Actions.

## Architecture

### High-Level Structure

```
docs/Secure-Coding-Guide-for-Python/
├── tests/                          # New testing directory
│   ├── __init__.py
│   ├── conftest.py                 # Pytest configuration and fixtures
│   ├── test_python_validation.py   # Python code validation tests
│   ├── test_markdown_validation.py # Markdown structure validation tests
│   └── utils/
│       ├── __init__.py
│       ├── file_scanner.py         # File discovery utilities
│       └── markdown_parser.py      # Markdown parsing utilities
├── pyproject.toml                  # Project configuration with PEP 735 dependency groups
├── tox.ini                         # Tox configuration for multi-version testing
└── [existing CWE directories...]
```

### GitHub Actions Integration

```
.github/workflows/
├── linter.yml                      # Existing markdown linter
└── python-tests.yml                # New Python testing workflow
```

## Components and Interfaces

### 1. File Scanner Utility (`utils/file_scanner.py`)

**Purpose**: Discover Python files and README.md files in the directory structure

**Key Functions**:
- `find_python_files(root_dir: str) -> List[Path]`: Recursively finds all `.py` files under the root directory, excluding the tests directory itself
- `find_readme_files(root_dir: str) -> List[Path]`: Recursively finds all `README.md` files in CWE directories
- `get_cwe_directories(root_dir: str) -> List[Path]`: Identifies all CWE-specific directories

**Implementation Notes**:
- Use `pathlib.Path` for cross-platform compatibility
- Exclude template files and test files from validation
- Cache results in pytest fixtures for performance

### 2. Python Validation Tests (`test_python_validation.py`)

**Purpose**: Validate Python code examples for syntax and runtime issues

**Test Cases**:

1. **test_python_syntax_valid**: Parametrized test that validates each Python file can be parsed using `ast.parse()`
   - Input: Path to Python file
   - Validation: File parses without `SyntaxError`
   - Output: Pass/fail with error details

2. **test_python_no_deprecation_warnings**: Parametrized test that executes Python files and checks for deprecation warnings
   - Input: Path to Python file
   - Validation: No `DeprecationWarning` or `PendingDeprecationWarning` when executed
   - Output: Pass/fail with warning details
   - Note: Uses `warnings` module with `simplefilter('error')` to catch warnings

3. **test_python_imports_valid**: Parametrized test that validates all imports can be resolved
   - Input: Path to Python file
   - Validation: All import statements reference available modules
   - Output: Pass/fail with import error details

**Implementation Strategy**:
- Use `pytest.mark.parametrize` with file list from scanner
- Capture stdout/stderr during execution to prevent test output pollution
- Use subprocess for isolated execution to prevent side effects
- Set timeout for execution (5 seconds per file) to prevent hanging

### 3. Markdown Parser Utility (`utils/markdown_parser.py`)

**Purpose**: Parse README.md files and extract structural elements

**Key Functions**:
- `parse_markdown(file_path: Path) -> Dict`: Parses markdown and returns structure
- `extract_sections(content: str) -> List[str]`: Extracts all heading sections
- `extract_code_references(content: str) -> List[str]`: Finds references to Python files (e.g., `compliant01.py`)
- `validate_table_structure(content: str, table_name: str) -> bool`: Validates presence and structure of required tables

**Implementation Notes**:
- Use regex patterns to identify markdown elements
- Consider using `markdown` library or simple regex for lightweight parsing
- Return structured data for easy test assertions

### 4. Markdown Validation Tests (`test_markdown_validation.py`)

**Purpose**: Validate README.md files conform to template structure

**Test Cases**:

1. **test_readme_has_required_sections**: Parametrized test validating presence of required sections
   - Input: Path to README.md file
   - Required sections:
     - Title heading (H1 starting with "CWE-")
     - Introduction paragraph
     - "Non-Compliant Code Example" section
     - "Compliant Solution" section
     - "Automated Detection" section
     - "Related Guidelines" section
     - "Bibliography" section
   - Output: Pass/fail with missing sections listed

2. **test_readme_code_references_exist**: Parametrized test validating code file references
   - Input: Path to README.md file
   - Validation: All referenced Python files (compliant01.py, noncompliant01.py, example01.py) exist in the same directory
   - Output: Pass/fail with missing file references

3. **test_readme_has_required_tables**: Parametrized test validating table presence
   - Input: Path to README.md file
   - Validation: "Automated Detection" and "Related Guidelines" tables are present
   - Output: Pass/fail with missing tables listed

4. **test_readme_follows_template_order**: Parametrized test validating section ordering
   - Input: Path to README.md file
   - Validation: Sections appear in the order specified by the template
   - Output: Pass/fail with ordering issues

**Implementation Strategy**:
- Use markdown parser utility to extract structure
- Compare against template requirements
- Provide clear error messages indicating what's missing or incorrect

### 5. Link Validation Tests (`test_link_validation.py`)

**Purpose**: Validate all links in README.md files are valid and not broken

**Test Cases**:

1. **test_internal_links_valid**: Parametrized test validating internal project links
   - Input: Path to README.md file
   - Validation: All internal links (relative paths to other files) point to existing files
   - Output: Pass/fail with broken link details (source file, link text, target path)

2. **test_code_file_links_exist**: Parametrized test validating code file links
   - Input: Path to README.md file
   - Validation: All links to Python files (compliant01.py, noncompliant01.py, example01.py) exist
   - Output: Pass/fail with missing file links

3. **test_index_links_valid**: Test validating top-level README.md index table
   - Input: `docs/Secure-Coding-Guide-for-Python/readme.md`
   - Validation: All links in the index table point to existing article README.md files
   - Output: Pass/fail with broken index links

**Implementation Strategy**:
- Use `lychee` CLI tool for comprehensive link checking (supports internal and external links)
- Alternative: Use `markdownlint-cli2` with link validation plugins
- Wrap CLI tool execution in pytest tests for integration with test suite
- Parse CLI tool output to provide structured test results
- Focus on internal links first (external link checking can be optional/slower)

### 5. Pytest Configuration (`conftest.py`)

**Purpose**: Centralize test configuration and shared fixtures

**Fixtures**:
- `python_files`: Session-scoped fixture returning list of all Python files to validate
- `readme_files`: Session-scoped fixture returning list of all README.md files to validate
- `project_root`: Fixture providing path to Secure-Coding-Guide-for-Python directory
- `template_structure`: Fixture providing parsed template structure for comparison

**Configuration**:
- Set pytest markers for test categorization (`@pytest.mark.python`, `@pytest.mark.markdown`)
- Configure test output formatting
- Set up logging for detailed error reporting

### 6. PyProject Configuration (`pyproject.toml`)

**Purpose**: Modern Python project configuration following PEP 735 standards

**Configuration Structure**:
```toml
[project]
name = "secure-coding-guide-python-tests"
version = "0.1.0"
description = "Testing framework for Python Secure Coding Guide"
readme = "README.md"
requires-python = ">=3.9"

[build-system]
requires = ["uv_build>=0.9.0,<0.10.0"]
build-backend = "uv_build"

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = "test_*.py"
markers = [
    "python: marks Python code validation tests",
    "markdown: marks Markdown structure validation tests",
    "slow: marks tests as slow (deselected by default)",
]
addopts = """
    -v
    --tb=short
    --strict-markers
    --cov=tests
    --cov-branch
    --cov-report=term-missing:skip-covered
    --cov-report=html:reports/coverage/html
"""

[tool.ruff]
line-length = 88
target-version = "py39"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "UP", "B", "C4"]
ignore = [
    "S101",  # Allow assert statements (used in tests)
]

[dependency-groups]
# PEP 735: Development dependencies (local-only, never published)
# Install with: uv sync --group test
test = [
    "pytest>=8.0.0",
    "pytest-cov>=4.1.0",
    "pytest-xdist>=3.5.0",
]

dev = [
    "pytest>=8.0.0",
    "pytest-cov>=4.1.0",
    "pytest-xdist>=3.5.0",
    "ruff>=0.4.0",
    "tox>=4.0.0",
    "tox-uv>=1.0.0",
    "lychee>=0.15.0",  # Fast link checker
]

[tool.coverage.run]
source = ["tests"]
branch = true
relative_files = true

[tool.coverage.report]
show_missing = true
precision = 2
skip_covered = false
exclude_lines = [
    "pragma: no cover",
    "if TYPE_CHECKING:",
    "if __name__ == .__main__.:",
]
```

**Design Decisions**:
- Use PEP 735 `[dependency-groups]` instead of `[project.optional-dependencies]`
- Separate `test` group (minimal) from `dev` group (includes linting/tox)
- Configure pytest, ruff, and coverage in single file
- Use `uv_build` as build backend for consistency with uv tooling
- Set `requires-python = ">=3.9"` to match testing matrix

### 7. Tox Configuration (`tox.ini`)

**Purpose**: Enable local multi-version testing with the same matrix as CI/CD

**Configuration Structure**:
```ini
[tox]
requires = tox-uv
envlist = py39,py310,py311,py312,py313,py314

[testenv]
description = Run pytest tests for Python {envname}
groups = test
commands = 
    pytest tests/ -v --tb=short

[testenv:lint]
description = Run linting checks with ruff
groups = dev
commands =
    ruff check tests/
    ruff format --check tests/

[testenv:coverage]
description = Run tests with full coverage reporting
groups = test
commands =
    pytest tests/ -v --tb=short --cov=tests --cov-report=html --cov-report=term

[testenv:links]
description = Check all markdown links
groups = dev
allowlist_externals = lychee
commands =
    lychee --offline --base . **/*.md
```

**Design Decisions**:
- Use `requires = tox-uv` to enable uv integration
- Use `groups = test` to install from PEP 735 dependency groups
- Match CI/CD Python version matrix (3.9-3.14) for consistency
- Include separate environments for linting and coverage
- No `skipsdist` needed - tox-uv handles this automatically

**Local Usage**:
```bash
# Install uv and tox
uv pip install tox tox-uv

# Run tests for all Python versions
tox

# Run tests for specific Python version
tox -e py311

# Run linting
tox -e lint

# Run with coverage report
tox -e coverage

# Check markdown links
tox -e links
```

### 8. GitHub Actions Workflow (`python-tests.yml`)

**Purpose**: Automate test execution on pull requests and pushes using `uv`

**Workflow Structure**:
```yaml
name: Python Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
    paths:
      - 'docs/Secure-Coding-Guide-for-Python/**'
      - '.github/workflows/python-tests.yml'

jobs:
  test:
    name: Run Python Tests
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ['3.9', '3.10', '3.11', '3.12', '3.13', '3.14']
    
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4
      
      - name: Install uv
        uses: astral-sh/setup-uv@v3
        with:
          enable-cache: true
          cache-dependency-glob: "docs/Secure-Coding-Guide-for-Python/pyproject.toml"
      
      - name: Set up Python
        run: uv python install ${{ matrix.python-version }}
      
      - name: Install Dependencies
        working-directory: docs/Secure-Coding-Guide-for-Python
        run: |
          uv sync --group test
      
      - name: Run Tests
        working-directory: docs/Secure-Coding-Guide-for-Python
        run: |
          uv run pytest tests/ -v --tb=short
      
      - name: Upload Coverage
        if: matrix.python-version == '3.12'
        uses: codecov/codecov-action@v4
        with:
          files: ./docs/Secure-Coding-Guide-for-Python/reports/coverage/coverage.xml
          flags: python-tests
```

**Design Decisions**:
- Test against multiple Python versions (3.9-3.14) to ensure broad compatibility and catch version-specific deprecation warnings
- Use `astral-sh/setup-uv@v3` action with caching enabled for fast, reliable uv installation
- Use `uv python install` to install specific Python version (uv manages Python versions)
- Use `uv sync --group test` to install dependencies from PEP 735 dependency groups
- Use `uv run pytest` to run tests in the uv-managed environment
- Use `working-directory` instead of `cd` for cleaner workflow
- Only trigger on changes to Python Secure Coding Guide files for efficiency
- Upload coverage report from Python 3.12 run (representative version)
- Use verbose output (`-v`) and short traceback (`--tb=short`) for readable CI logs

**Performance Benefits**:
- `uv` is 10-100x faster than pip for dependency resolution and installation
- Parallel dependency downloads
- Better caching in CI/CD environments
- uv manages Python versions, eliminating need for separate setup-python action complexity

## Data Models

### Python File Validation Result
```python
@dataclass
class PythonValidationResult:
    file_path: Path
    syntax_valid: bool
    syntax_error: Optional[str]
    has_deprecation_warnings: bool
    deprecation_details: List[str]
    imports_valid: bool
    import_errors: List[str]
```

### Markdown Validation Result
```python
@dataclass
class MarkdownValidationResult:
    file_path: Path
    has_required_sections: bool
    missing_sections: List[str]
    code_references_valid: bool
    missing_code_files: List[str]
    has_required_tables: bool
    missing_tables: List[str]
    section_order_correct: bool
    order_issues: List[str]
```

## Error Handling

### Python Validation Errors

1. **Syntax Errors**: Caught via `ast.parse()`, reported with line number and error message
2. **Import Errors**: Caught during execution, reported with module name
3. **Deprecation Warnings**: Caught via warnings filter, reported with warning message and source
4. **Execution Timeouts**: Handled via subprocess timeout, reported as test failure
5. **File Read Errors**: Caught and reported with file path and error details

### Markdown Validation Errors

1. **Missing Sections**: Reported with list of section names not found
2. **Missing Code References**: Reported with list of referenced files that don't exist
3. **Malformed Tables**: Reported with table name and structural issue
4. **Section Order Issues**: Reported with expected vs actual order
5. **File Read Errors**: Caught and reported with file path and error details

### CI/CD Error Handling

1. **Dependency Installation Failures**: Workflow fails with clear error message
2. **Test Execution Failures**: Individual test failures reported in GitHub Actions log
3. **Python Version Incompatibilities**: Matrix strategy allows some versions to fail without blocking others (optional)

## Testing Strategy

### Unit Tests for Test Utilities

Create tests for the testing framework itself:
- `test_file_scanner.py`: Validate file discovery logic
- `test_markdown_parser.py`: Validate markdown parsing logic

### Integration Testing

- Run full test suite locally before committing
- Verify tests pass in CI environment
- Test with known-good and known-bad examples

### Performance Considerations

- Use session-scoped fixtures to avoid repeated file scanning
- Implement caching for parsed markdown structures
- Set reasonable timeouts for Python execution
- Consider parallel test execution with `pytest-xdist` if test suite grows large

### Test Maintenance

- Document how to add new validation rules
- Provide examples of extending test cases
- Keep test code simple and readable
- Use descriptive test names and error messages

## Dependencies

All dependencies are managed via PEP 735 dependency groups in `pyproject.toml`:

### Test Dependencies (dependency-groups.test)
- `pytest>=8.0.0` - Testing framework
- `pytest-cov>=4.1.0` - Coverage reporting
- `pytest-xdist>=3.5.0` - Parallel test execution

### Development Dependencies (dependency-groups.dev)
- All test dependencies plus:
- `ruff>=0.4.0` - Fast Python linter and formatter
- `tox>=4.0.0` - Multi-version testing orchestration
- `tox-uv>=1.0.0` - Tox plugin for uv integration
- `lychee>=0.15.0` - Fast link checker for markdown files

### Installation

**Install uv** (one-time setup):
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

**Install project dependencies**:
```bash
cd docs/Secure-Coding-Guide-for-Python

# Install test dependencies only
uv sync --group test

# Install all development dependencies
uv sync --group dev

# Run tests
uv run pytest tests/

# Run tox
uv run tox
```

## Migration and Rollout

### Phase 1: Initial Implementation
1. Create `pyproject.toml` with PEP 735 dependency groups
2. Create `tox.ini` with multi-version testing configuration
3. Create test directory structure
4. Implement file scanner utility
5. Implement basic Python syntax validation
6. Create GitHub Actions workflow with uv
7. Test with subset of files

### Phase 2: Enhanced Validation
1. Add deprecation warning detection
2. Add import validation
3. Implement markdown parser utility
4. Add markdown structure validation

### Phase 3: Refinement
1. Add code reference validation
2. Add table structure validation
3. Optimize performance with pytest-xdist
4. Add ruff linting configuration
5. Add documentation

### Phase 4: Documentation and Adoption
1. Add README in tests/ directory with local testing instructions
2. Document uv and tox usage
3. Update CONTRIBUTING.md with testing framework information
4. Announce to contributors
5. Monitor CI results and iterate

## Future Enhancements

1. **Code Quality Checks**: Integrate with tools like `ruff` with flake8-bandit plugin for security validation
2. **Code Execution Validation**: Verify that compliant examples actually prevent the vulnerability
3. **Cross-Reference Validation**: Ensure CWE numbers in README match directory names
4. **External Link Validation**: Check that external links in bibliography are accessible (currently focusing on internal links)
5. **Template Evolution**: Support multiple template versions as the project evolves
6. **Performance Metrics**: Track test execution time and optimize slow tests
7. **Custom Pytest Plugins**: Create project-specific pytest plugins for specialized validation
