# GitLab Configuration Best Practices

## Intro

GitLab is a collaborative source code management platform that plays a critical
role in modern software development, providing a central repository for
storing, managing, and versioning source code as well as collaborating with
a community of developers. However, it also represent a potential security
risk if not properly configured. In this guide, we will explore the best
practices for securing GitLab, covering topics that include user
authentication, access control, permissions, monitoring, logging,
and integrating security tools.

## Audience

This guide has been written for the:

* **Maintainer** who wants to improve the security posture for one or more
GitLab projects they support.
* **Open Source Program Office (OSPO)** who is typically responsible for
multiple groups and projects.
* **Operations** team tasked with applying policies as part of their work
managing assets on GitLab.

## Recommendations

## Server

1. [Two-Factor Authentication Should Be Enforced For The Group](group/two_factor_authentication_not_required_for_group.md)
2. [Forking of Repositories to External Namespaces Should Be Disabled](group/collaborators_can_fork_repositories_to_external_namespaces.md)
3. [Group Should Enforce Branch Protection](group/group_does_not_enforce_branch_protection_by_default.md)
4. [Webhooks Should Be Configured To Use SSL](group/organization_webhook_doesnt_require_ssl.md)

## Members, Access Control and Permissions

1. [Two Factor Authentication Should Be Enabled for Collaborators](member/two_factor_authentication_is_disabled_for_a_collaborator.md)
2. [Two Factor Authentication Should Be Enabled for External Collaborators](member/two_factor_authentication_is_disabled_for_an_external_collaborator.md)
3. [Admininistrators Should Have Activity in the Last 6 Months](member/stale_admin_found.md)

## Repository

1. [Project Should Be Updated At Least Quarterly](project/project_not_maintained.md)
2. [Default Branch Should Require Code Review](project/code_review_not_required.md)
3. [Project Should Require All Pipelines to Succeed](project/requires_status_checks.md)
4. [Repository Should Not Allow Review Requester To Approve Their Own Request](project/repository_allows_review_requester_to_approve_their_own_request.md)
5. [Default Branch Should Be Protected](project/missing_default_branch_protection.md)
6. [Default Branch Should Not Allow Force Pushes](project/missing_default_branch_protection_force_push.md)
7. [Default Branch Should Require Code Review By At Least Two Reviewers](project/code_review_by_two_members_not_required.md)
8. [Merge Request Authors Should Not Be Able To Override the Approvers List](project/repository_allows_overriding_approvers.md)
9. [Project Should Have Fewer Than Three Owners](project/project_has_too_many_admins.md)
10. [Webhook Configured Without SSL Verification](project/project_webhook_doesnt_require_ssl.md)
11. [Project Should Require All Conversations To Be Resolved Before Merge](project/no_conversation_resolution.md)
12. [Default Branch Should Require All Commits To Be Signed](project/no_signed_commits.md)
13. [Repository Should Not Allow Committer Approvals](project/repository_allows_committer_approvals_policy.md)
14. [Default Branch Should Limit Code Review to Code-Owners](project/repository_require_code_owner_reviews_policy.md)
15. [Forking Should Not Be Allowed](project/forking_allowed_for_repository.md)
16. [Default Branch Should Require New Code Changes After Approval To Be Re-Approved](project/repository_dismiss_stale_reviews.md)

### Operations

General Recommendations:

* Group Membership Should Be Limited to Organization Staff When Relevant.
* Review Security Policies and Procedures At Least Annually.
* Establish a Clear Communication and Incident Response Plan.
* Conduct Regular Security Audits and Vulnerability Assessments.
* Use Tools Built On APIs to Automate Tasks and Avoid Needing Elevated Privileges.
* Review the Configuration Settings Before Making a Repository Public.
* Review the Configuration Settings After Transferring a Repository into the Organization.
* Provide Automated Alerts and Tooling to Ensure Ongoing Compliance.
* Review Audit Events to Track Activity and Changes in Projects and Groups.

Specific Recommendations:

* [Two-Factor Authentication Should Be Enforced For The Group](group/two_factor_authentication_not_required_for_group.md)
* Group Should Use Single-Sign-On
* Only Admins Should Be Able To Create Public Projects and Groups.
* [Webhooks Should Be Configured To Use SSL](group/organization_webhook_doesnt_require_ssl.md)
  