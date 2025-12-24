#!/bin/bash
# Generate a clean summary of test failures
# Usage: ./generate_test_summary.sh

echo "🧪 Running tests and generating summary..."
echo ""

# Run tests and capture summary
uv run pytest tests/ --tb=line -q --no-header 2>&1 | tee test_output.txt

# Extract just the failure lines
echo ""
echo "📋 SUMMARY OF ISSUES"
echo "===================="
echo ""

grep "FAILED" test_output.txt | sed 's/FAILED //' | sed 's/tests\///' | sort | uniq

# Count issues
TOTAL=$(grep -c "FAILED" test_output.txt || echo "0")
echo ""
echo "📊 Total Issues: $TOTAL"
echo ""
echo "💡 For detailed output, see: test_output.txt"
echo "💡 To fix issues, refer to: tests/README.md"

# Clean up
rm -f test_output.txt
