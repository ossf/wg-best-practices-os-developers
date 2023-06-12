## Repository Has Too Many Admins

policy name: repository_has_too_many_admins

severity: LOW

### Description

Repository are admins highly privileged and could create great damage if being compromised, it's recommeneded to limit them to the minimum required (recommended maximum 3 admins).

### Threat Example(s)

A compromised user with admin permissions can initiate a supply chain attack in a plethora of ways.
Having many admin users increases the overall risk of user compromise, and makes it more likely to lose track of unused admin permissions given to users in the past.

### Remediation

1. Make sure you have admin permissions
2. Go to the repository settings page
3. Press "Collaborators and teams"
4. Select the unwanted admin users
5. Select "Change Role"
