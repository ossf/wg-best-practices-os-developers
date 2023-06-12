## Collaborators Can Fork Repositories To External Namespaces

policy name: collaborators_can_fork_repositories_to_external_namespaces

severity: MEDIUM

### Description

The ability to fork project to external namespaces is turned on. Forking repositories poses security issues due to the loss of control over the code. It is recommended to disable this feature if it is not explicitly needed, in order to proactively prevent code leakage.

### Threat Example(s)

Forking to external namespaces could result in loss of control over proprietary information and potentially expose the organization to security risks, such as data leaks.

### Remediation

1. Go to the top-level groups Settings > General page
2. Expand the Permissions and group features section
3. Check Prevent project forking outside current group
4. Select Save changes
