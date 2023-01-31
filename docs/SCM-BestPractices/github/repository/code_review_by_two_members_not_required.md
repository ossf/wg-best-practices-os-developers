## Default Branch Doesn't Require Code Review By At Least Two Reviewers
policy name: code_review_by_two_members_not_required

severity: MEDIUM

### Description
In order to comply with separation of duties principle and enforce secure code practices, a code review should be mandatory using the source-code-management built-in enforcement. This option is found in the branch protection setting of the repository.

### Threat Example(s)
Users can merge code without being reviewed, which can lead to insecure code reaching the main branch and production.
Requiring code review by at least two reviewers further decreases the risk of an insider threat (as merging code requires compromising at least 2 identities with write permissions), and decreases the likelihood of human error in the review process.



### Remediation
1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Branches" tab
4. Under "Branch protection rules"
5. Click "Edit" on the default branch rule
6. Check "Require a pull request before merging"
7. Check "Require approvals"
8. Set "Required number of approvals before merging" to 1 or more
9. Click "Save changes"



