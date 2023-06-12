## Default Branch Doesn't Require All Commits To Be Signed

policy name: no_signed_commits

severity: LOW

### Description

Require all commits to be signed and verified

### Threat Example(s)

A commit containing malicious code may be crafted by a malicious actor that has acquired write access to the repository to initiate a supply chain attack. Commit signing provides another layer of defense that can prevent this type of compromise.

### Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Branches" tab
4. Under "Branch protection rules"
5. Click "Edit" on the default branch rule
6. Check "Require signed commits"
7. Click "Save changes"
