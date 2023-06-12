# Forking of Repositories to External Namespaces Should Be Disabled

policy name: collaborators_can_fork_repositories_to_external_namespaces

severity: MEDIUM

## Description

The ability to fork project to external namespaces is turned on. Forking a
repository can lead to loss of control and potential exposure of source code. If
you do not need forking, it is recommended to turn it off in the project's
configuration. The option to fork should be enabled only by owners deliberately
when opting to create a fork.

## Threat Example(s)

Forking to external namespaces could result in loss of control over proprietary
information and potentially expose the organization to security risks, such as
data leaks.

## Remediation

1. Go to the top-level groups Settings > General page
2. Expand the Permissions and group features section
3. Check Prevent project forking outside current group
4. Select Save changes
