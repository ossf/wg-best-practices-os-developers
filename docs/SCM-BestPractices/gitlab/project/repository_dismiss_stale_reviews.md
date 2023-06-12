## Default Branch Doesn't Require New Code Changes After Approval To Be Re-Approved

policy name: repository_dismiss_stale_reviews

severity: LOW

### Description

This security control prevents merging code that was approved but later on changed. Turning it on ensures new changes are required to be reviewed again. This setting is part of the Merge request approval settings, and hardens the code-review process. If turned off - a developer can change the code after approval, and push code that is different from the one that was previously allowed.

### Threat Example(s)

Buggy or insecure code may be committed after approval and will reach the main branch without review. Alternatively, an attacker can attempt a just-in-time attack to introduce dangerous code just before merge.

### Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Merge Requests" tab
4. Under "Approval settings"
5. Check "Remove all approvals"
6. Click "Save Changes"
