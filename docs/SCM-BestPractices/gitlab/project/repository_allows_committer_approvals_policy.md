## Repository Allows Committer Approvals Policy

policy name: repository_allows_committer_approvals_policy

severity: LOW

### Description

The repository allows merge request contributors (that aren't the merge request author), to approve the merge request. To ensure merge request review is done objectively, it is recommended to toggle this option off.

### Threat Example(s)

Users can merge code without being reviewed which can lead to insecure code reaching the main branch and production.

### Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Merge Requests" tab
4. Under "Approval settings"
5. Check "Prevent approvals by users who add commits"
6. Click "Save Changes"
