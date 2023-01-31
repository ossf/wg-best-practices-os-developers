## Code Review Is Not Limited to Code-Owners Only in Default Branch
policy name: repository_require_code_owner_reviews_policy

severity: LOW

### Description
It is recommended to require code review only from designated individuals specified in CODEOWNERS file. Turning this option on enforces that only the allowed owners can approve a code change. This option is found in the branch protection setting of the project.

### Threat Example(s)
A pull request may be approved by any contributor with write access. Specifying specific code owners can ensure review is only done by individuals with the correct expertise required for the review of the changed files, potentially preventing bugs and security risks.



### Remediation
1. Make sure you have owner permissions
2. Go to the projects's settings -> Repository page
3. Enter "Protected branches" tab
4. select the default branch. Check the "Code owner approval"



