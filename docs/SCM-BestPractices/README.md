# Source Code Management Platform Configuration Best Practices

## Intro

Collaborative source code management platforms (such as GitHub and GitLab) play a critical role in modern software development, providing a central repository for storing, managing, and versioning source code as well as collaborating with a community of developers. However, they also represent a potential security risk if not properly configured. In this guide, we will explore the best practices for securing these latforms, covering topics ranging from user authentication and access control to monitoring and logging activities, and integrating security tools.

## Recommendations

### Members, Access Control and Permissions
   - Admins Should Have Activity In The Last 6 Months [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">](github/member/stale_admin_found.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">](gitlab/member/stale_admin_found.md)
   - Members Should Have Activity In The Last 6 Months <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Two-Factor Authentication For Collaborators <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Two-Factor Authentication For External Contributors <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">

### Organizational Management

For centralizing security and billing, all organizations should be managed under one company or organizational account.

The following section covers how to set up new organizations and how to configure existing organizations.

General Recommendations
- All organizations should be managed under a central account.
- Only employees of the company can be members of organizations.
- Two-factor authentication **must** be enabled for all organization members.
- Access and roles for members must be managed in accordance with the organization's access control policy.

Specific Recommendations
   - Default Member Permissions Should Be Restricted <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - **[Move to Section 1?]** Two-Factor Authentication Should Be Enforced For The Organization <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Only Admins Should Be Able To Create Public Repositories <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Organization Should Use Single-Sign-On <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">&
   - Webhooks Should Be Configured To Use SSL <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Webhooks Should Be Configured With A Secret <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Forking of Repositories to External Namespaces Should Be Disabled. <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Group Should Enforce Branch Protection <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Member Default Repository Permission Should be None <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Member Should Be Able To Create Only Private Repositories <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Should Not Enable Forking Of Private And Internal Repositoreis <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Should Not Enable Repository Admin To Invite Outside Collaborators <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Member Should Be Able To Create Only Private Github Pages <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Member Should Be Able Only Private and Internal Packages <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Package Should Inherit Access From Source Repository <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Secret Scanning Should Be Enabled For All Repositories <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - **Dependencey Monitoring** Should Be Enabled For All Repositories <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> (& <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">?)
   - Default Branch Should Be Fully Protected <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Reject Pushing Secret File Should Be Enabled <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Group Shouldn't Forward Package Requsts To Public Registries If Not Found Locally <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">

### Repository configuration

   - Forking Should Not Be Allowed for This Repository <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Require All Checks To Pass Before Merge <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Webhooks Should Be Configured To Use SSL <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Repository Should Be Updated At Least Quarterly <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Require Code Review <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Not Allow Force Pushes <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Be Protected <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Require Code Review By At Least Two Reviewers <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Require All Conversations To Be Resolved Before Merge <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Repository Should Have Fewer Than Three Admins <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Require All Commits To Be Signed <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Limit Code Review to Code-Owners <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Branch Should Require New Code Changes After Approval To Be Re-Approved <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Workflows Should Not Be Allowed To Approve Pull Requests <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Default Branch Should Require Linear History <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Vulnerability Alerts Should Be Enabled <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Default Workflow Token Permission Should Be Set To Read Only <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - GitHub Advanced Security – Dependency Review Should Be Enabled For A Repository <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Default Branch Deletion Protection Should Be Enabled <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Default Branch Should Require Branches To Be Up To Date Before Merge <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Webhooks Should Be Configured With A Secret <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Default Branch Should Restrict Who Can Push To It <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Default Branch Should Restrict Who Can Dismiss Reviews <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Merge Request Authors Should Not Be Able To Override the Approvers List <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Prevent Pushing Secret File Should Be Enabled <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Should Prevent Approval By Author <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">

###. Continuous Integration / Continuous Deployment 

   - Workflows Should Not Be Allowed To Approve Pull Requests <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - GitHub Actions Should Be Restricted To Selected Repositories <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Default Workflow Token Permission Should Be Read Only <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> 
   - GitHub Actions Should Be Limited To Verified or Explicitly Trusted Actions <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Fork pull requests should require approval for all outside collaborators <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Variable Should Be Masked <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Variable Should Be Protected <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - CI Token Should Be Limited To The Current Project <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Pipline Visibility Should Be Set To Private <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Pipeline Should Use Separate Cache For Protected Branches <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - AutoDevOps Should Be Enabled <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Pipeline Should Not Be Able To Approve Deployment <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Environment Should Be Protected <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25"> <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Runner Group Should Be Limited to Private Repositories <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Runner Group Should Be Limited to Selected Repositories <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - Runner Should Be Limitied To Protected Branches and Tags <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Runner Should Be Locked To The Current Project <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">

###. Server

   - All collaborators in the server are allowed to create public repositories <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default Group visibility is Public <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Default repository group visibility is Public <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Server allows access to unauthenticated users with sign-up <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Two factor authentication is not globally enforced by default <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Branch protection is not globally enabled by default <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Collaborator has too many personal access tokens <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Collaborator is not using any external authentication provider <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - External authentication provider is not mandatory to all users <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Personal access token has no expiration <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Personal access token is stale <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Sign-up confirmation email is not mandatory <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Unauthenticated request rate limit disabled <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - API request-rate is not limited <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Password authentication for Git over HTTP(S) is enabled <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Protected paths rate limit is disabled <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Webhooks are allowed to be sent to the local network <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">
   - Web request-rate is not limited <img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">

###. Hygiene Factors

   - Port Visibility Should Be Set To Private <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
   - OSSF Scorecard Score Should Be Above 7 <img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">
