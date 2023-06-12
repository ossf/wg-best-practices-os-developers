## Default Branch Doesn't Require New Code Changes After Approval To Be Re-Approved

policy name: dismisses_stale_reviews

severity: LOW

### Description

This security control prevents merging code that was approved but later on changed. Turning it on ensures new changes are required to be reviewed again. This setting is part of the branch protection and code-review settings, and hardens the review process. If turned off - a developer can change the code after approval, and push code that is different from the one that was previously allowed. This option is found in the branch protection setting for the repository.

### Threat Example(s)

Buggy or insecure code may be committed after approval and will reach the main branch without review. Alternatively, an attacker can attempt a just-in-time attack to introduce dangerous code just before merge.

### Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Branches" tab
4. Under "Branch protection rules"
5. Click "Edit" on the default branch rule
6. Check "Require a pull request before merging"
7. Check "Dismiss stale pull request approvals when new commits are pushed"
8. Click "Save changes"
