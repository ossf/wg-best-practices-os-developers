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

1. Make sure you have owner permissions
2. Go to the projects's settings -> Repository page
3. Enter "Protected branches" tab
4. select the default branch. Set the allowed to merge to "maintainers" and the
allowed to push to "No one"
