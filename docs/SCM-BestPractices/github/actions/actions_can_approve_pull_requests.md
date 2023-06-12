# Workflows Should Not Be Allowed To Approve Pull Requests

policy name: actions_can_approve_pull_requests

severity: HIGH

## Description

The default GitHub Actions configuration allows for workflows to approve pull
requests. This could allow users to bypass code-review restrictions.

## Threat Example(s)

Attackers can exploit this misconfiguration to bypass code-review restrictions
by creating a workflow that approves their own pull request and then merging the
pull request without anyone noticing, introducing malicious code that would go
straight ahead to production.

## Remediation

1. Make sure you have admin permissions
2. Go to the org's settings page
3. Enter "Actions - General" tab
4. Under 'Workflow permissions'
5. Uncheck 'Allow GitHub actions to create and approve pull requests.
6. Click 'Save'
