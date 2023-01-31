## GitHub Actions Is Not Restricted To Selected Repositories
policy name: all_repositories_can_run_github_actions

severity: MEDIUM

### Description
By not limiting GitHub Actions to specific repositories, every user in the organization is able to run arbitrary workflows. This could enable malicious activity such as accessing organization secrets, crypto-mining, etc.

### Threat Example(s)
This misconfiguration could lead to the following attack:
1. Prerequisite: the attacker is part of your GitHub organization
2. Attacker creates new repository in the organization
3. Attacker creates a workflow file that reads all organization secrets and exfiltrate them
4. Attacker trigger the workflow
5. Attacker receives all organization secrets and uses them maliciously



### Remediation
1. Make sure you have admin permissions
2. Go to the org's settings page
3. Enter the "Actions - General" tab
4. Under "Policies"
5. Change "All repositories" to "Selected repositories" and select repositories that should be able to run actions
6. Click "Save"



