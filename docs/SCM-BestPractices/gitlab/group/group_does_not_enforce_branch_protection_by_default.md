## Group Does Not Enforce Branch Protection by Default
policy name: group_does_not_enforce_branch_protection_by_default

severity: MEDIUM

### Description
You do not have a default full branch protection for a specific group, which means any new repository will be created without it. In fully protected level, developers cannot push new commits, and no one can force push or delete the branch. Protecting branches ensures new code changes must go through a controlled merge process and it allows enforcement of code review and other security tests.

### Threat Example(s)
A developer creates a repository without any branch protection rules
Attacker that get access to the repository can modify its main branch without any restrictions



### Remediation
1. Go to the group page
2. Press Settings -> Repository
3. Expand "Default Branch" section
4. Toggle the required protection rule
5. Press "Save Changes"



