## Default Branch Allows Force Pushes
policy name: missing_default_branch_protection_force_push

severity: MEDIUM

### Description
The history of the default branch is not protected against changes for this repository. Protecting branch history ensures every change that was made to code can be retained and later examined. This issue is raised if the default branch history can be modified using force push.

### Threat Example(s)
Rewriting project history can make it difficult to trace back when bugs or security issues were introduced, making them more difficult to remediate.



### Remediation
1. Make sure you have owner permissions
2. Go to the projects's settings -> Repository page
3. Enter "Protected branches" tab
4. select the default branch. Set the allowed to merge to "maintainers" and the allowed to push to "No one"



