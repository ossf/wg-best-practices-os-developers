## GitHub Advanced Security – Dependency Review Is Disabled For A Repository
policy name: ghas_dependency_review_not_enabled

severity: MEDIUM

### Description
Enable GitHub Advanced Security dependency review to avoid introducing new vulnerabilities

### Threat Example(s)
A contributor may add vulnerable third-party dependencies to the repository, introducing vulnerabilities to your application that will only be detected after merge.



### Remediation
1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Code security and analysis" tab
4. Set "Dependency graph" as Enabled



