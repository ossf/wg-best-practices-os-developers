# Source Code Management Platform Configuration Best Practices

## Intro

Collaborative source code management platforms (such as GitHub and GitLab) play a critical role in modern software development, providing a central repository for storing, managing, and versioning source code as well as collaborating with a community of developers. However, they also represent a potential security risk if not properly configured. In this guide, we will explore the best practices for securing these latforms, covering topics ranging from user authentication and access control to monitoring and logging activities, and integrating security tools.

## Table Of Contents

1. Members, Access Control and Permissions
   - Admins Should Have Activity In The Last 6 Months [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">](github/member/stale_admin_found.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">](gitlab/member/stale_admin_found.md)
   - Members Should Have Activity In The Last 6 Months *GH GL*
   - Two-Factor Authentication For Collaborators *GH GL*
   - Two-Factor Authentication For External Contributors *GH GL*
2. Organizational Management
   - Default Member Permissions Should Be Restricted *GH*
   - **[Move to Section 1?]** Two-Factor Authentication Should Be Enforced For The Organization *GH GL*
   - Only Admins Should Be Able To Create Public Repositories *GH*
   - Organization Should Use Single-Sign-On *GH&
   - Webhooks Should Be Configured To Use SSL *GH GL*
   - Webhooks Should Be Configured With A Secret *GH*
   - **[move to repo config?]** Forking of Repositories to External Namespaces Should Be Disabled. *GL*
   - Group Should Enforce Branch Protection *GL*
   - Member Default Repository Permission Should be None *GH*
   - Member Should Be Able To Create Only Private Repositories *GH*
   - **[move to repo config?]** Should Not Enable Forking Of Private And Internal Repositoreis *GH*
   - Should Not Enable Repository Admin To Invite Outside Collaborators *GH*
   - Member Should Be Able To Create Only Private Github Pages *GH*
   - Member Should Be Able Only Private and Internal Packages *GH*
   - Package Should Inherit Access From Source Repository *GH*
   - Secret Scanning Should Be Enabled For All Repositories *GH*
   - **Dependencey Monitoring** Should Be Enabled For All Repositories *GH* (& GL?)
   - Default Branch Should Be Fully Protected *GL*
   - Reject Pushing Secret File Should Be Enabled *GL*
   - Group Shouldn't Forward Package Requsts To Public Registries If Not Found Locally *GL*

3. Repository configuration
   - Forking Should Not Be Allowed for This Repository *GH GL*
   - Default Branch Should Require All Checks To Pass Before Merge *GH GL*
   - Webhooks Should Be Configured To Use SSL *GH GL*
   - Repository Should Be Updated At Least Quarterly *GH GL*
   - Default Branch Should Require Code Review *GH GL*
   - Default Branch Should Not Allow Force Pushes *GH GL*
   - Default Branch Should Be Protected *GH GL*
   - Default Branch Should Require Code Review By At Least Two Reviewers *GH GL*
   - Default Branch Should Require All Conversations To Be Resolved Before Merge *GH GL*
   - Repository Should Have Fewer Than Three Admins *GH GL*
   - Default Branch Should Require All Commits To Be Signed *GH GL*
   - Default Branch Should Limit Code Review to Code-Owners *GH GL*
   - Default Branch Should Require New Code Changes After Approval To Be Re-Approved *GH GL*
   - Workflows Should Not Be Allowed To Approve Pull Requests *GH*
   - Default Branch Should Require Linear History *GH*
   - Vulnerability Alerts Should Be Enabled *GH*
   - Default Workflow Token Permission Should Be Set To Read Only *GH*
   - GitHub Advanced Security – Dependency Review Should Be Enabled For A Repository *GH*
   - Default Branch Deletion Protection Should Be Enabled *GH*
   - Default Branch Should Require Branches To Be Up To Date Before Merge *GH*
   - Webhooks Should Be Configured With A Secret *GH*
   - Default Branch Should Restrict Who Can Push To It *GH*
   - Default Branch Should Restrict Who Can Dismiss Reviews *GH*
   - Merge Request Authors Should Not Be Able To Override the Approvers List *GL*
   - Prevent Pushing Secret File Should Be Enabled *GL*
   - Should Prevent Approval By Author *GL*

4. Continuous Integration / Continuous Deployment 

   - Workflows Should Not Be Allowed To Approve Pull Requests *GH*
   - GitHub Actions Should Be Restricted To Selected Repositories *GH*
   - Default Workflow Token Permission Should Be Read Only *GH* 
   - GitHub Actions Should Be Limited To Verified or Explicitly Trusted Actions *GH*
   - Fork pull requests should require approval for all outside collaborators *GH*
   - Variable Should Be Masked *GH*
   - Variable Should Be Protected *GL*
   - CI Token Should Be Limited To The Current Project *GL*
   - Pipline Visibility Should Be Set To Private *GL*
   - Pipeline Should Use Separate Cache For Protected Branches *GL*
   - AutoDevOps Should Be Enabled *GL*
   - Pipeline Should Not Be Able To Approve Deployment *GL*
   - Environment Should Be Protected *GH GL*
   - Runner Group Should Be Limited to Private Repositories *GH*
   - Runner Group Should Be Limited to Selected Repositories *GH*
   - Runner Should Be Limitied To Protected Branches and Tags *GL*
   - Runner Should Be Locked To The Current Project *GL*

5. Server

   - All collaborators in the server are allowed to create public repositories *GL*
   - Default Group visibility is Public *GL*
   - Default repository group visibility is Public *GL*
   - Server allows access to unauthenticated users with sign-up *GL*
   - **[Move to Section 1?]** Two factor authentication is not globally enforced by default *GL*
   - Branch protection is not globally enabled by default *GL*
   - Collaborator has too many personal access tokens *GL*
   - Collaborator is not using any external authentication provider *GL*
   - External authentication provider is not mandatory to all users *GL*
   - Personal access token has no expiration *GL*
   - Personal access token is stale *GL*
   - Sign-up confirmation email is not mandatory *GL*
   - Unauthenticated request rate limit disabled *GL*
   - API request-rate is not limited *GL*
   - Password authentication for Git over HTTP(S) is enabled *GL*
   - Protected paths rate limit is disabled *GL*
   - Webhooks are allowed to be sent to the local network *GL*
   - Web request-rate is not limited *GL*

6. Hygiene Factors

   - Port Visibility Should Be Set To Private *GH*
   - OSSF Scorecard Score Should Be Above 7 *GH*
