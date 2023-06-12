# Runner Group Should Be Limited to Selected Repositories

policy name: runner_group_not_limited_to_selected_repositories

severity: MEDIUM

## Description

Not limiting the runner group to selected repositories allows any user in the
organization to execute workflows on the group's runners. In case of inadequate
security measures implemented on the hosted runner, malicious insider could
create a repository with a workflow that exploits the runner's vulnerabilities
to move laterally inside your network.

## Threat Example(s)

Hosted runners are usually part of the organization's private network and can
be easily misconfigured.
If the hosted runner is insecurely configured, any user in the organization
could:

1. Create a workflow that runs on the hosted runner
2. Exploit the runner misconfigurations/known CVE's to execute code inside the
private network

## Remediation

1. Go to the organization settings page
2. Go to Actions ➝ Runner groups
3. Under the 'Repository Access' section, select 'Selected repositories'
4. Select the required repositories
