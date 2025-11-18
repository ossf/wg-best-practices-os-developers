---
inclusion: fileMatch
fileMatchPattern: 'docs/Secure-Coding-Guide-for-Python/**'
---

# Secure Coding Guide for Python - Project Rules

This steering file applies when working with files in `docs/Secure-Coding-Guide-for-Python/`.

## Project Overview

An educational resource providing secure coding guidance for CPython >= 3.9 with working code examples. Structured around Common Weakness Enumeration (CWE) Pillar Weaknesses. Target audiences: new Python developers, security researchers, and educators.

## Documentation Style (BLUF + KISS)

- **Bottom Line Up Front (BLUF)**: Conclusion in the first sentence
- **Keep It Small and Simple (KISS)**: Concise, accessible to beginners
- **Academic tone**: Plain English for international audience
- **Imperative voice**: "Do X to ensure Y" (not "might want to" or "could be")
- **No fluff**: Avoid phrases like "it is important to be aware of..."
- **Bibliography**: Follow Harvard reference guide format

## Code File Naming Conventions

- `noncompliantXX.py`: Anti-pattern demonstrating bad practice
- `compliantXX.py`: Mitigation addressing ONLY the described risk
- `exampleXX.py`: Demonstrates behavior not fitting compliant/noncompliant categories

## Code Standards

- **Python version**: CPython >= 3.9
- **Scope**: Only modules in Python Module Index (no third-party packages)
- **Length**: Keep examples under 20 lines per file
- **Simplicity**: Use simple Python accessible to beginners
- **Structure**: Defensive code first, then exploit code after `#####################` comment
- **Type hints**: Required
- **Linters**: Ruff with flake8-bandit plugin enabled
- **Warnings**: Keep to minimum

### Code Structure Pattern

```python
"""Compliant/Non-compliant Code Example"""

# Defensive code here

#####################
# Trying to exploit above code example
#####################

# Attack/exploit code here
```

### What NOT to Include in Examples

Code examples are educational only, NOT production-ready. They intentionally omit:
- Inline documentation
- Custom exceptions
- Full descriptive variable names
- Line length limits
- Proper logging (uses print to stdout)
- Comprehensive secure coding beyond the specific issue

Use `# TODO:` comments for aspects not covered.

## Directory Structure

### Hierarchy

1. **Top-level folders**: CWE Pillars (e.g., `CWE-707`, `CWE-664`)
2. **Second-level folders**: CWE Base/Variant/Class representing one rule (e.g., `CWE-89`)
3. **Third-level folders**: Multiple rules for same CWE use `01`, `02`, etc. subdirectories
4. **Placeholder folders**: Rules without matching CWE use `XXX-000`, `XXX-001`, etc.

### Example Structure

```
docs/Secure-Coding-Guide-for-Python/
├── CWE-707/                    # Pillar
│   └── CWE-89/                 # Rule (Base/Variant/Class)
│       ├── README.md
│       ├── compliant01.py
│       ├── noncompliant01.py
│       └── example01.py
├── CWE-664/
│   └── CWE-197/                # Multiple rules for same CWE
│       ├── README.md
│       ├── compliant01.py
│       ├── noncompliant01.py
│       └── 01/                 # Second rule
│           ├── README.md
│           ├── compliant01.py
│           └── noncompliant01.py
└── templates/
    └── README_TEMPLATE.md
```

## README Template Structure

Each rule's README.md must include:

1. **Title**: `CWE-XXX: Descriptive Title`
2. **Introduction**: Search-engine-friendly sentence + expanded paragraph with bullets
3. **Optional Example**: `example01.py` with output if needed
4. **Non-Compliant Code Example**: Anti-pattern with explanation
5. **Compliant Solution**: Fix with explanation
6. **Automated Detection**: Table listing tools (Bandit, Flake8, etc.)
7. **Related Guidelines**: Table with CWE links, CERT references
8. **Bibliography**: Harvard-style references

## Branch Naming

Use prefix `pySCG-` for Python Secure Coding Guide branches:
- `pySCG-issue-123`
- `pySCG-add-logging-feature`

## Review Requirements

Pull requests require approval from:
1. At least one core team member for this Python project
2. At least one additional reviewer (can be any GitHub user)

## Key References

- OWASP Developer Guide
- OWASP Top 10 Report
- CWE Top 25
- Python Module Index (3.9+)

## Licensing

- Documentation: CC-BY-4.0
- Code snippets: MIT

## Disclaimer

All code is WITHOUT WARRANTY. Examples are purely educational, NOT for production use. Using code is at your own risk. Code must NOT be used to cause harm.
