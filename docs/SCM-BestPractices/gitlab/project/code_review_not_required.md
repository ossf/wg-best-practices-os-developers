## Project Doesn't Require Code Review For Default Branch
policy name: code_review_not_required

severity: HIGH

### Description
In order to comply with separation of duties principle and enforce secure code practices, a code review should be mandatory using the source-code-management built-in enforcement. An even safer option is to require 2 separate reviewers, which is enforced in the Legitify policy "Project Doesn't Require Code Review By At Least Two Reviewers".

### Threat Example(s)
Users can merge code without being reviewed which can lead to insecure code reaching the main branch and production.



### Remediation
1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Merge Requests" tab
4. Under "Merge request approvals"
5. Click "Add approval rule" on the default branch rule
6. Select "Approvals required" and enter at least 1 approvers"
7. Select "Add approvers" and select the desired members
8. Click "Add approval rule"



