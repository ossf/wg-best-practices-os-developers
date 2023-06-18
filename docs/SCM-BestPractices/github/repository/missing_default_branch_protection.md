# Default Branch Should Be Protected

policy name: missing_default_branch_protection

severity: MEDIUM

## Description

Branch protection is not enabled for this repository’s default branch.
Protecting branches ensures new code changes must go through a controlled merge
process and allows enforcement of code review as well as other security tests.
This issue is raised if the default branch protection is turned off.

## Threat Example(s)

Any contributor with write access may push potentially dangerous code to this
repository, making it easier to compromise and difficult to audit.

## Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Branches" tab
4. Under "Branch protection rules"
5. Click "Add rule"
6. Set "Branch name pattern" as the default branch name (usually "main" or
"master")
7. Set desired protections
8. Click "Create" and save the rule
