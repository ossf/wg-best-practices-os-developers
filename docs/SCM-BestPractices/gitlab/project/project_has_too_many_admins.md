## Project Has Too Many Owners

policy name: project_has_too_many_admins

severity: LOW

### Description

Projects' owners are highly privileged and could create great damage if being compromised, it's recommeneded to limit them to the minimum required (recommended maximum 3 admins).

### Threat Example(s)

A compromised user with owner permissions can initiate a supply chain attack in a plethora of ways.
Having many admin users increases the overall risk of user compromise, and makes it more likely to lose track of unused admin permissions given to users in the past.

### Remediation

1. Make sure you have owner permissions
2. Go to the Project Information -> Members page
3. Select the unwanted owner users and remove the selected owners
