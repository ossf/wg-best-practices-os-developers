# Default Branch Should Limit Code Review to Code-Owners

policy name: code_review_not_limited_to_code_owners

severity: LOW

## Description

It is recommended to require code review only from designated individuals
specified in CODEOWNERS file. Turning this option on enforces that only the
allowed owners can approve a code change. This option is found in the branch
protection setting of the repository.

## Threat Example(s)

A pull request may be approved by any contributor with write access. Specifying
specific code owners can ensure review is only done by individuals with the
correct expertise required for the review of the changed files, potentially
preventing bugs and security risks.

## Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Branches" tab
4. Under "Branch protection rules"
5. Click "Edit" on the default branch rule
6. Check "Require a pull request before merging"
7. Check "Require review from Code Owners"
8. Click "Save changes"
