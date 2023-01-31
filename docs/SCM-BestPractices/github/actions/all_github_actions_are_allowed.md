## GitHub Actions Runs Are Not Limited To Verified Actions
policy name: all_github_actions_are_allowed

severity: MEDIUM

### Description
When using GitHub Actions, it is recommended to only use actions by Marketplace verified creators or explicitly trusted actions. By not restricting which actions are permitted allows your developers to use actions that were not audited and potentially malicious, thus exposing your pipeline to supply chain attacks.

### Threat Example(s)
This misconfiguration could lead to the following attack:
1. Attacker creates a repository with a tempting but malicious custom GitHub Action
2. An innocent developer / DevOps engineer uses this malicious action
3. The malicious action has access to the developer repository and could steal its secrets or modify its content



### Remediation
1. Make sure you have admin permissions
2. Go to the org's settings page
3. Enter "Actions - General" tab
4. Under "Policies"
5. Select "Allow enterprise, and select non-enterprise, actions and reusable workflows"
6. Check "Allow actions created by GitHub" and "Allow actions by Marketplace verified creators"
7. Set any other used trusted actions under "Allow specified actions and reusable workflows"
8. Click "Save"



