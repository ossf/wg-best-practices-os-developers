#!/usr/bin/env python3
"""
Generate a clean summary of test failures with actual file paths and errors.

This script runs the test suite and provides a human-readable summary
of issues without verbose test output.

Usage:
    python tests/generate_issue_report.py [--save]
    # or
    uv run python tests/generate_issue_report.py [--save]
    
Options:
    --save    Save the report to KNOWN_ISSUES.md in addition to printing
"""

import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path


def parse_test_output(output):
    """Parse pytest output and extract meaningful failure information."""
    failures = defaultdict(list)
    lines = output.split("\n")
    
    i = 0
    while i < len(lines):
        line = lines[i]
        
        # Look for "E   Failed:" lines (Python test failures)
        if line.strip().startswith("E   Failed:"):
            # Check next few lines for file path
            full_error = line
            j = i + 1
            while j < len(lines) and j < i + 3:
                if lines[j].strip():
                    full_error += " " + lines[j].strip()
                j += 1
            
            # Extract file path - look for CWE-xxx/xxx/file.py pattern
            match = re.search(r'((?:CWE-|Intro_)[^\\/:]+[/\\][^\\/:]+[/\\]\w+\.py)', full_error)
            if match:
                file_path = match.group(1).replace("\\", "/")
                
                # Determine error type
                if "Execution timeout" in full_error:
                    failures[file_path].append("Execution timeout (intentional infinite loop/blocking)")
                elif "Deprecation warning" in full_error or "DeprecationWarning" in full_error:
                    failures[file_path].append("DeprecationWarning detected")
                elif "Output mismatch" in full_error:
                    failures[file_path].append("Output doesn't match expected")
                else:
                    failures[file_path].append("Python validation failed")
        
        # Look for assertion error lines with README paths
        elif "AssertionError:" in line and ("CWE-" in line or "Intro_" in line):
            # Extract file path
            match = re.search(r'(CWE-[^:]+|Intro_[^:]+)', line)
            if match:
                file_path = match.group(1).replace("\\", "/")
                
                # Look ahead for the error message
                error_msg = ""
                j = i + 1
                while j < len(lines) and j < i + 5:
                    if "Missing required sections:" in lines[j]:
                        error_msg = lines[j].strip().replace("- ", "")
                        break
                    elif "Missing referenced code files:" in lines[j]:
                        error_msg = lines[j].strip().replace("Missing referenced code files: ", "Missing file: ")
                        break
                    elif "Section order issues:" in lines[j]:
                        error_msg = "Section order issue"
                        break
                    j += 1
                
                if not error_msg:
                    error_msg = "Validation failed"
                
                failures[file_path].append(error_msg)
        
        i += 1
    
    return failures


def format_report(doc_issues, code_issues):
    """Format the report as a string."""
    lines = []
    lines.append("ISSUES FOUND")
    lines.append("=" * 70)
    lines.append("")

    if doc_issues:
        lines.append("Documentation Issues:")
        lines.append("")
        for file_path in sorted(doc_issues.keys()):
            lines.append(f"  {file_path}")
            # Remove duplicates and generic messages
            unique_errors = []
            for error in doc_issues[file_path]:
                if error not in unique_errors and error != "Validation failed":
                    unique_errors.append(error)
            for error in unique_errors:
                lines.append(f"    -> {error}")
            lines.append("")

    if code_issues:
        lines.append("Python Code Issues:")
        lines.append("")
        for file_path in sorted(code_issues.keys()):
            lines.append(f"  {file_path}")
            # Remove duplicates
            unique_errors = list(set(code_issues[file_path]))
            for error in unique_errors:
                lines.append(f"    -> {error}")
            lines.append("")

    total = len(doc_issues) + len(code_issues)
    lines.append("=" * 70)
    lines.append(f"Total Files with Issues: {total}")
    lines.append("")
    lines.append("For detailed output: uv run pytest tests/ -v")
    lines.append("For fix instructions: see tests/README.md")
    
    return "\n".join(lines)


def main():
    """Run tests and display clean summary."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Generate test failure report")
    parser.add_argument("--save", action="store_true", 
                       help="Save report to KNOWN_ISSUES.md")
    args = parser.parse_args()
    
    print("Running tests and generating summary...\n")

    # Run Python tests separately to capture detailed errors
    print("  Checking Python code...")
    python_result = subprocess.run(
        ["pytest", "tests/test_python_validation.py", "--tb=short", "-q", "--no-header"],
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent.parent,
    )
    
    # Run Markdown tests separately
    print("  Checking documentation...")
    markdown_result = subprocess.run(
        ["pytest", "tests/test_markdown_validation.py", "tests/test_link_validation.py", 
         "--tb=short", "-q", "--no-header"],
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent.parent,
    )

    # Combine outputs
    output = python_result.stdout + python_result.stderr + markdown_result.stdout + markdown_result.stderr
    
    # Parse failures
    failures = parse_test_output(output)

    if not failures:
        print("All tests passed!")
        return 0

    # Group by issue type
    doc_issues = {}
    code_issues = {}
    
    for file_path, errors in failures.items():
        # Python files go to code issues
        if file_path.endswith(".py"):
            code_issues[file_path] = errors
        # README files go to doc issues
        else:
            doc_issues[file_path] = errors

    # Format report
    report = format_report(doc_issues, code_issues)
    
    # Display to console
    print(report)

    # Optionally save to file
    if args.save:
        output_file = Path(__file__).parent.parent / "KNOWN_ISSUES.md"
        output_file.write_text(report, encoding="utf-8")
        print(f"\nReport saved to: {output_file}")

    return 1


if __name__ == "__main__":
    sys.exit(main())
