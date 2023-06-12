
## Enterprise Should Not Allow Members To Fork Internal And Private Repositories
policy name: enterprise_allows_forking_repos

severity: LOW

### Description
The enterprise's repository forking policy should be set to DISABLED. Forking a repository can lead to loss of control and potential exposure of source code. If you do not need forking, it is recommended to turn it off in the project's configuration. The option to fork should be enabled only by owners deliberately when opting to create a fork.

### Threat Example(s)
Forking to external namespaces could result in loss of control over proprietary information and potentially expose the organization to security risks, such as data leaks.



### Remediation
1. Make sure you are an enterprise owner
2. Go to the policies page
3. Under the "Repository Forking" section
4. Choose the "Disabled" option


