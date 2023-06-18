# Default Branch Should Require Linear History

policy name: non_linear_history

severity: MEDIUM

## Description

Prevent merge commits from being pushed to protected branches.

## Threat Example(s)

Having a non-linear history makes it harder to reverse changes, making recovery
from bugs and security risks slower and more difficult.

## Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Branches" tab
4. Under "Branch protection rules"
5. Click "Edit" on the default branch rule
6. Check "Require linear history"
7. Click "Save changes"
