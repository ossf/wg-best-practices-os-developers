## Default Branch Could Be Deleted
policy name: missing_default_branch_protection_deletion

severity: MEDIUM

### Description
The history of the default branch is not protected against deletion for this repository.

### Threat Example(s)
Rewriting project history can make it difficult to trace back when bugs or security issues were introduced, making them more difficult to remediate.



### Remediation
1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Branches" tab
4. Under "Branch protection rules"
5. Click "Edit" on the default branch rule
6. Uncheck "Allow deletions"
7. Click "Save changes"



