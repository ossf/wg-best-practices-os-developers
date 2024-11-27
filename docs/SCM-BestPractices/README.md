# Source Code Management Platform Configuration Best Practices

_by the [Open Source Security Foundation (OpenSSF)](https://openssf.org) [Best Practices Working Group](https://best.openssf.org/), 2023-08-29_

## Intro

Collaborative source code management platforms (such as GitHub and GitLab) play a critical role in modern software development, providing a central repository for storing, managing, and versioning source code as well as collaborating with a community of developers. However, they also represent a potential security risk if not properly configured. In this guide, we will explore the best practices for securing these platforms, covering topics that include user authentication, access control, permissions, monitoring, and logging. For additional guidance on selecting configurations that enable cross-organization collaboration, consider the InnerSource Commmon's [guidance section on InnerSource strategy for source code management platform configuration](https://innersourcecommons.gitbook.io/managing-innersource-projects/innersource-tooling).

## Audience

This guide has been written for the:

* **Maintainer** who wants to improve the security posture for one or more GitHub repositories or GitLab projects they support.
* **Owner** who wants to improve the security posture for their GitHub organization or GitLab group they manage.
* **Open Source Program Office (OSPO)** (or a team that plays a similar role) who is typically responsible for multiple GitHub organizations or GitLab groups.
* **Operations** team tasked with applying policies as part of their work managing assets on these platforms.
* **GitHub/GitLab enterprise administrator** who wants to improve the security posture for their SCM enterprise.

## Tooling

Below is a non-exhaustive list of possible tools that can be used to assist in review source code repositories.

### Allstar - <https://github.com/ossf/allstar>

An open-source project from the [OpenSSF](https://openssf.org/) that scans GitHub organizations for “repository level” misconfigurations.
Allstar detects a subset of the “repository level” policies suggested by this document. It can be configured to scan all repositories in an organization or a subset of them and is supported by the following SCMs:

* GitHub Cloud

### Legitify - <https://github.com/Legit-Labs/legitify>

An open-source project from [Legit Security](https://www.legitsecurity.com/) that scans SCM assets to find misconfigurations, security issues, and unfollowed best practices.
Legitify detects all policies suggested by this document and supports the following SCMs:

* GitHub Cloud
* GitHub Enterprise Server
* GitLab Cloud
* GitLab Server

### Scorecard - <https://github.com/ossf/scorecard>

An open-source project from the [OpenSSF](https://openssf.org/) that scans repositories for security issues and provides security health metrics.
Scorecard detects many of the “repository level” policies suggested by this document and supports the following SCMs:

* GitHub Cloud
* GitHub Enterprise Server
* GitLab Cloud
* GitLab Server

## Recommendations

Each specific recommendation below is noted to be applicable to either GitHub or GitLab by use of an appropriate icon and text, and is linked to the detailed best practice definition if available:

* (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
  * or
* [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/code_review_not_limited_to_code_owners.md) [GitHub](github/repository/code_review_not_limited_to_code_owners.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/repository_require_code_owner_reviews_policy.md) [GitLab](gitlab/project/repository_require_code_owner_reviews_policy.md)

For recommendations only applicable to GitHub or GitLab visit one of the following pages:

* [GitHub Recommendations](github/README.md)
* [GitLab Recommendations](gitlab/README.md)

### Continuous Integration / Continuous Deployment

* Workflows Should Not Be Allowed To Approve Pull Requests [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/actions/actions_can_approve_pull_requests.md) [GitHub](github/actions/actions_can_approve_pull_requests.md)
* GitHub Actions Should Be Restricted To Selected Repositories [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/actions/all_repositories_can_run_github_actions.md) [GitHub](github/actions/all_repositories_can_run_github_actions.md)
* GitHub Actions Should Be Limited To Verified or Explicitly Trusted Actions [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/actions/all_github_actions_are_allowed.md) [GitHub](github/actions/all_github_actions_are_allowed.md)
* Default Workflow Token Permission Should Be Read Only [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/actions/token_default_permissions_is_read_write.md) [GitHub](github/actions/token_default_permissions_is_read_write.md)
* Runner Group Should Be Limited to Private Repositories [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/runner_group/runner_group_can_be_used_by_public_repositories.md) [GitHub](github/runner_group/runner_group_can_be_used_by_public_repositories.md)
* Runner Group Should Be Limited to Selected Repositories [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/runner_group/runner_group_not_limited_to_selected_repositories.md) [GitHub](github/runner_group/runner_group_not_limited_to_selected_repositories.md)

### Enterprise

* Two-Factor Authentication Should Be Enforced For The Enterprise [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/enterprise/enterprise_enforce_two_factor_authentication.md) [GitHub](github/enterprise/enterprise_enforce_two_factor_authentication.md)
* Enterprise Should Not Allow Members To Create public Repositories [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/enterprise/enterprise_allows_creating_public_repos.md) [GitHub](github/enterprise/enterprise_allows_creating_public_repos.md)
* Enterprise Should Not Allow Members To Invite Outside Collaborators [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/enterprise/enterprise_allows_inviting_externals_collaborators.md) [GitHub](github/enterprise/enterprise_allows_inviting_externals_collaborators.md)
* Enterprise Should Not Allow Members To Change Repository Visibility [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/enterprise/enterprise_not_using_visibility_change_disable_policy.md) [GitHub](github/enterprise/enterprise_not_using_visibility_change_disable_policy.md)
* Enterprise Should Use Single-Sign-On [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/enterprise/enterprise_not_using_single_sign_on.md) [GitHub](github/enterprise/enterprise_not_using_single_sign_on.md)
* Enterprise Should Not Allow Members To Fork Internal And Private Repositories [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/enterprise/enterprise_allows_forking_repos.md) [GitHub](github/enterprise/enterprise_allows_forking_repos.md)
* Two-Factor Authentication Should Be Enforced For The Group [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/group/two_factor_authentication_not_required_for_group.md) [GitLab](gitlab/group/two_factor_authentication_not_required_for_group.md)
* Forking of Repositories to External Namespaces Should Be Disabled. [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/group/collaborators_can_fork_repositories_to_external_namespaces.md) [GitLab](gitlab/group/collaborators_can_fork_repositories_to_external_namespaces.md)
* Group Should Enforce Branch Protection [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/group/group_does_not_enforce_branch_protection_by_default.md) [GitLab](gitlab/group/group_does_not_enforce_branch_protection_by_default.md)
* Webhooks Should Be Configured To Use SSL [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/group/organization_webhook_doesnt_require_ssl.md) [GitLab](gitlab/group/organization_webhook_doesnt_require_ssl.md)

### Members, Access Control and Permissions

* Organization Should Have Fewer Than Three Owners [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/member/organization_has_too_many_admins.md) [GitHub](github/member/organization_has_too_many_admins.md)
* Organization Admins Should Have Activity In The Last 6 Months [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/member/stale_admin_found.md) [GitHub](github/member/stale_admin_found.md)
* Organization Members Should Have Activity In The Last 6 Months [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/member/stale_member_found.md) [GitHub](github/member/stale_member_found.md)
* Two Factor Authentication Should Be Enabled for Collaborators [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/member/two_factor_authentication_is_disabled_for_a_collaborator.md) [GitLab](gitlab/member/two_factor_authentication_is_disabled_for_a_collaborator.md)
* Two Factor Authentication Should Be Enabled for External Collaborators [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/member/two_factor_authentication_is_disabled_for_an_external_collaborator.md) [GitLab](gitlab/member/two_factor_authentication_is_disabled_for_an_external_collaborator.md)
* Administrators Should Have Activity in the Last 6 Months [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/member/stale_admin_found.md) [GitLab](gitlab/member/stale_admin_found.md)

### Repository

* Repository Should Be Updated At Least Quarterly [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/repository_not_maintained.md) [GitHub](github/repository/repository_not_maintained.md)
* Workflows Should Not Be Allowed To Approve Pull Requests [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/actions_can_approve_pull_requests.md) [GitHub](github/repository/actions_can_approve_pull_requests.md)
* Default Branch Should Require Code Review [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/code_review_not_required.md) [GitHub](github/repository/code_review_not_required.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/code_review_not_required.md) [GitLab](gitlab/project/code_review_not_required.md)
* Default Workflow Token Permission Should Be Set To Read Only [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/token_default_permissions_is_read_write.md) [GitHub](github/repository/token_default_permissions_is_read_write.md)
* Default Branch Should Be Protected [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/missing_default_branch_protection.md) [GitHub](github/repository/missing_default_branch_protection.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/missing_default_branch_protection.md) [GitLab](gitlab/project/missing_default_branch_protection.md)
* Default Branch Should Not Allow Force Pushes [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/missing_default_branch_protection_force_push.md) [GitHub](github/repository/missing_default_branch_protection_force_push.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/missing_default_branch_protection_force_push.md) [GitLab](gitlab/project/missing_default_branch_protection_force_push.md)
* Default Branch Should Require Code Review By At Least Two Reviewers [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/code_review_by_two_members_not_required.md) [GitHub](github/repository/code_review_by_two_members_not_required.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/code_review_by_two_members_not_required.md) [GitLab](gitlab/project/code_review_by_two_members_not_required.md)
* Vulnerability Alerts Should Be Enabled [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/vulnerability_alerts_not_enabled.md) [GitHub](github/repository/vulnerability_alerts_not_enabled.md)
* OpenSSF Scorecard Score Should Be Above 7 [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/scorecard_score_too_low.md) [GitHub](github/repository/scorecard_score_too_low.md)
* GitHub Advanced Security – Dependency Review Should Be Enabled For A Repository [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/ghas_dependency_review_not_enabled.md) [GitHub](github/repository/ghas_dependency_review_not_enabled.md)
* Default Branch Deletion Protection Should Be Enabled [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/missing_default_branch_protection_deletion.md) [GitHub](github/repository/missing_default_branch_protection_deletion.md)
* Default Branch Should Require Linear History [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/non_linear_history.md) [GitHub](github/repository/non_linear_history.md)
* Default Branch Should Require All Checks To Pass Before Merge [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/requires_status_checks.md) [GitHub](github/repository/requires_status_checks.md)
* Default Branch Should Require Branches To Be Up To Date Before Merge [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/requires_branches_up_to_date_before_merge.md) [GitHub](github/repository/requires_branches_up_to_date_before_merge.md)
* Repository Should Have Fewer Than Three Admins [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/repository_has_too_many_admins.md) [GitHub](github/repository/repository_has_too_many_admins.md)
* Default Branch Should Restrict Who Can Push To It [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/pushes_are_not_restricted.md) [GitHub](github/repository/pushes_are_not_restricted.md)
* Default Branch Should Require All Commits To Be Signed [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/no_signed_commits.md) [GitHub](github/repository/no_signed_commits.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/no_signed_commits.md) [GitLab](gitlab/project/no_signed_commits.md)
* Webhooks Should Be Configured With A Secret [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/repository_webhook_no_secret.md) [GitHub](github/repository/repository_webhook_no_secret.md)
* Webhooks Should Be Configured To Use SSL [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/repository_webhook_doesnt_require_ssl.md) [GitHub](github/repository/repository_webhook_doesnt_require_ssl.md)
* Default Branch Should Require All Conversations To Be Resolved Before Merge [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/no_conversation_resolution.md) [GitHub](github/repository/no_conversation_resolution.md)
* Default Branch Should Restrict Who Can Dismiss Reviews [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/review_dismissal_allowed.md) [GitHub](github/repository/review_dismissal_allowed.md)
* Default Branch Should Require New Code Changes After Approval To Be Re-Approved [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/dismisses_stale_reviews.md) [GitHub](github/repository/dismisses_stale_reviews.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/repository_dismiss_stale_reviews.md) [GitLab](gitlab/project/repository_dismiss_stale_reviews.md)
* Default Branch Should Limit Code Review to Code-Owners [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/code_review_not_limited_to_code_owners.md) [GitHub](github/repository/code_review_not_limited_to_code_owners.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/repository_require_code_owner_reviews_policy.md) [GitLab](gitlab/project/repository_require_code_owner_reviews_policy.md)
* Forking Should Not Be Allowed for This Repository [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/forking_allowed_for_repository.md) [GitHub](github/repository/forking_allowed_for_repository.md)
* Project Should Be Updated At Least Quarterly [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/project_not_maintained.md) [GitLab](gitlab/project/project_not_maintained.md)
* Repository Should Not Allow Review Requester To Approve Their Own Request [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/repository_allows_review_requester_to_approve_their_own_request.md) [GitLab](gitlab/project/repository_allows_review_requester_to_approve_their_own_request.md)
* Merge Request Authors Should Not Be Able To Override the Approvers List [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/repository_allows_overriding_approvers.md) [GitLab](gitlab/project/repository_allows_overriding_approvers.md)
* Project Should Require All Pipelines to Succeed [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/requires_status_checks.md) [GitLab](gitlab/project/requires_status_checks.md)
* Forking Should Not Be Allowed [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/forking_allowed_for_repository.md) [GitLab](gitlab/project/forking_allowed_for_repository.md)
* Project Should Require All Conversations To Be Resolved Before Merge [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/no_conversation_resolution.md) [GitLab](gitlab/project/no_conversation_resolution.md)
* Repository Should Not Allow Committer Approvals [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/repository_allows_committer_approvals_policy.md) [GitLab](gitlab/project/repository_allows_committer_approvals_policy.md)
* Webhook Configured Without SSL Verification [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/project_webhook_doesnt_require_ssl.md) [GitLab](gitlab/project/project_webhook_doesnt_require_ssl.md)
* Project Should Have Fewer Than Three Owners [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/project/project_has_too_many_admins.md) [GitLab](gitlab/project/project_has_too_many_admins.md)
* Secret Scanning Should be Enabled [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/repository/secret_scanning.md) [GitHub](github/repository/secret_scanning.md)

### Operations

General Recommendations

* Organization Management Should Be Consolidated Under a Central Account. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub)
* Organization Membership Should Be Limited to Its Staff When Relevant. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub)
* Review Security Policies and Procedures At Least Annually. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
* Establish a Clear Communication and Incident Response Plan. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
* Conduct Regular Security Audits and Vulnerability Assessments. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
* Use Insights to Track Activity and in Repositories and Organizations. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub)
* Use Tools Built On APIs to Automate Tasks and Avoid Needing Elevated Privileges. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
* Review the Configuration Settings Before Making a Repository Public. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
* Review the Configuration Settings After Transferring a Repository into the Organization. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
* Provide Automated Alerts and Tooling to Ensure Ongoing Compliance. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
* Review Audit Logs to Track Activity and Changes in Repositories and Organizations. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub)
* Group Membership Should Be Limited to Organization Staff When Relevant. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitHub)
* Review Audit Events to Track Activity and Changes in Projects and Groups. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitHub)

Specific Recommendations

* Two-Factor Authentication Should Be Enforced For The Organization [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/organization/two_factor_authentication_not_required_for_org.md) [GitHub](github/organization/two_factor_authentication_not_required_for_org.md)
* Organization Should Use Single-Sign-On [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/organization/organization_not_using_single_sign_on.md) [GitHub](github/organization/organization_not_using_single_sign_on.md)
* Default Member Permissions Should Be Restricted [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/organization/default_repository_permission_is_not_none.md) [GitHub](github/organization/default_repository_permission_is_not_none.md)
* Only Admins Should Be Able To Create Public Repositories [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/organization/non_admins_can_create_public_repositories.md) [GitHub](github/organization/non_admins_can_create_public_repositories.md)
* Webhooks Should Be Configured To Use SSL [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/organization/organization_webhook_doesnt_require_ssl.md) [GitHub](github/organization/organization_webhook_doesnt_require_ssl.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/group/organization_webhook_doesnt_require_ssl.md) [GitLab](gitlab/group/organization_webhook_doesnt_require_ssl.md)
* Webhooks Should Be Configured With A Secret [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20">](github/organization/organization_webhook_no_secret.md) [GitHub](github/organization/organization_webhook_no_secret.md)
* Configure Security Alerts and Vulnerability Scanning at the Organization or Repository Level. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub)
* Enable GitHub Advanced Security features for Private and Internal Repositories. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="20" width="20"> GitHub)
* Two-Factor Authentication Should Be Enforced For The Group [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20">](gitlab/group/two_factor_authentication_not_required_for_group.md) [GitLab](gitlab/group/two_factor_authentication_not_required_for_group.md)
* Group Should Use Single-Sign-On (Applies to: <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)
* Only Admins Should Be Able To Create Public Projects and Groups. (Applies to: <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="20" width="20"> GitLab)

## Acknowledgements

The following community members helped contribute to this guidance:

* [Avishay Balter, Microsoft](https://github.com/balteravishay)
* [Chris de Almeida, IBM](https://github.com/ctcpip)
* [Christine Abernathy, F5 - project lead](https://github.com/caabernathy)
* [Daniel Appelquist, Snyk - project lead](https://github.com/Torgo)
* [Noam Dotan, Legit Security - project lead](https://github.com/noamd-legit)
* [David A. Wheeler, The Linux Foundation](https://github.com/david-a-wheeler)
