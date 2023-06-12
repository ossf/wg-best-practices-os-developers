## Default Branch Doesn't Restrict Who Can Push

policy name: pushes_are_not_restricted

severity: LOW

### Description

By default, commits can be pushed directly to protected branches, without going through a Pull Request. Restrict who can push commits to protected branches so that commits can be added only via merges, which require Pull Request.

### Threat Example(s)

An attacker with write credentials may introduce vulnerabilities to your code without your knowledge. Alternatively, contributors may commit unsafe code that is buggy or easy to exploit that could have been caught using a review process.

### Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Branches" tab
4. Under "Branch protection rules"
5. Click "Edit" on the default branch rule
6. Check "Restrict who can push to matching branches"
7. Choose who should be allowed to push
8. Click "Save changes"
