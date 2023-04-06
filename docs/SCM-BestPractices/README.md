# Source Code Management Platform Configuration Best Practices

## Intro

Collaborative source code management platforms (such as GitHub and GitLab) play a critical role in modern software development, providing a central repository for storing, managing, and versioning source code as well as collaborating with a community of developers. However, they also represent a potential security risk if not properly configured. In this guide, we will explore the best practices for securing these latforms, covering topics ranging from user authentication and access control to monitoring and logging activities, and integrating security tools.

## Table Of Contents

1. Members, Access Control and Permissions

  1. Admins Should Have Activity In The Last 6 Months [<img src="https://user-images.githubusercontent.com/287526/230375178-2f1f8844-5609-4ef3-b9ac-141c20c43406.svg" alt="GitHub" height="25" width="25">](github/member/stale_admin_found.md) [<img src="https://user-images.githubusercontent.com/287526/230376963-ae9b8a47-4a74-4746-bc83-5b34cc520d40.svg" alt="GitLab" height="25" width="25">](gitlab/member/stale_admin_found.md)
  2. Members Should Have Activity In The Last 6 Months *GH GL*
  3. Two-Factor Authentication For Collaborators *GH GL*
  4. Two-Factor Authentication For External Contributors *GH GL*

2. Organizational Management

  1. Default Member Permissions Should Be Restricted *GH*
  2. **[Move to Section 1?]** Two-Factor Authentication Should Be Enforced For The Organization *GH GL*
  3. Only Admins Should Be Able To Create Public Repositories *GH*
  4. Organization Should Use Single-Sign-On *GH&
  5. Webhooks Should Be Configured To Use SSL *GH GL*
  6. Webhooks Should Be Configured With A Secret *GH*
  7. **[move to repo config?]** Forking of Repositories to External Namespaces Should Be Disabled. *GL*
  8. Group Should Enforce Branch Protection *GL*
  9. Member Default Repository Permission Should be None *GH*
  10. Member Should Be Able To Create Only Private Repositories *GH*
  11. **[move to repo config?]** Should Not Enable Forking Of Private And Internal Repositoreis *GH*
  12. Should Not Enable Repository Admin To Invite Outside Collaborators *GH*
  13. Member Should Be Able To Create Only Private Github Pages *GH*
  14. Member Should Be Able Only Private and Internal Packages *GH*
  15. Package Should Inherit Access From Source Repository *GH*
  16. Secret Scanning Should Be Enabled For All Repositories *GH*
  17. **Dependencey Monitoring** Should Be Enabled For All Repositories *GH* (& GL?)
  18. Default Branch Should Be Fully Protected *GL*
  19. Reject Pushing Secret File Should Be Enabled *GL*
  20. Group Shouldn't Forward Package Requsts To Public Registries If Not Found Locally *GL*

3. Repository configuration

  1. Forking Should Not Be Allowed for This Repository *GH GL*
  2. Default Branch Should Require All Checks To Pass Before Merge *GH GL*
  3. Webhooks Should Be Configured To Use SSL *GH GL*
  4. Repository Should Be Updated At Least Quarterly *GH GL*
  5. Default Branch Should Require Code Review *GH GL*
  6. Default Branch Should Not Allow Force Pushes *GH GL*
  7. Default Branch Should Be Protected *GH GL*
  8. Default Branch Should Require Code Review By At Least Two Reviewers *GH GL*
  9. Default Branch Should Require All Conversations To Be Resolved Before Merge *GH GL*
  10. Repository Should Have Fewer Than Three Admins *GH GL*
  11. Default Branch Should Require All Commits To Be Signed *GH GL*
  12. Default Branch Should Limit Code Review to Code-Owners *GH GL*
  13. Default Branch Should Require New Code Changes After Approval To Be Re-Approved *GH GL*
  14. Workflows Should Not Be Allowed To Approve Pull Requests *GH*
  15. Default Branch Should Require Linear History *GH*
  16. Vulnerability Alerts Should Be Enabled *GH*
  17. Default Workflow Token Permission Should Be Set To Read Only *GH*
  18. GitHub Advanced Security – Dependency Review Should Be Enabled For A Repository *GH*
  19. Default Branch Deletion Protection Should Be Enabled *GH*
  20. Default Branch Should Require Branches To Be Up To Date Before Merge *GH*
  21. Webhooks Should Be Configured With A Secret *GH*
  22. Default Branch Should Restrict Who Can Push To It *GH*
  23. Default Branch Should Restrict Who Can Dismiss Reviews *GH*
  24. Merge Request Authors Should Not Be Able To Override the Approvers List *GL*
  25. Prevent Pushing Secret File Should Be Enabled *GL*
  26. Should Prevent Approval By Author *GL*

4. Continuous Integration / Continuous Deployment 

  1. Workflows Should Not Be Allowed To Approve Pull Requests *GH*
  2. GitHub Actions Should Be Restricted To Selected Repositories *GH*
  3. Default Workflow Token Permission Should Be Read Only *GH* 
  4. GitHub Actions Should Be Limited To Verified or Explicitly Trusted Actions *GH*
  5. Fork pull requests should require approval for all outside collaborators *GH*
  6. Variable Should Be Masked *GH*
  7. Variable Should Be Protected *GL*
  8. CI Token Should Be Limited To The Current Project *GL*
  9. Pipline Visibility Should Be Set To Private *GL*
  10. Pipeline Should Use Separate Cache For Protected Branches *GL*
  11. AutoDevOps Should Be Enabled *GL*
  12. Pipeline Should Not Be Able To Approve Deployment *GL*
  13. Environment Should Be Protected *GH GL*
  14. Runner Group Should Be Limited to Private Repositories *GH*
  15. Runner Group Should Be Limited to Selected Repositories *GH*
  16. Runner Should Be Limitied To Protected Branches and Tags *GL*
  17. Runner Should Be Locked To The Current Project *GL*

5. Server

  1. All collaborators in the server are allowed to create public repositories *GL*
  2. Default Group visibility is Public *GL*
  3. Default repository group visibility is Public *GL*
  4. Server allows access to unauthenticated users with sign-up *GL*
  5. **[Move to Section 1?]** Two factor authentication is not globally enforced by default *GL*
  6. Branch protection is not globally enabled by default *GL*
  7. Collaborator has too many personal access tokens *GL*
  8. Collaborator is not using any external authentication provider *GL*
  9. External authentication provider is not mandatory to all users *GL*
  10. Personal access token has no expiration *GL*
  11. Personal access token is stale *GL*
  12. Sign-up confirmation email is not mandatory *GL*
  13. Unauthenticated request rate limit disabled *GL*
  14. API request-rate is not limited *GL*
  15. Password authentication for Git over HTTP(S) is enabled *GL*
  16. Protected paths rate limit is disabled *GL*
  17. Webhooks are allowed to be sent to the local network *GL*
  18. Web request-rate is not limited *GL*

6. Hygiene Factors

  1. Port Visibility Should Be Set To Private *GH*
  2. OSSF Scorecard Score Should Be Above 7 *GH*
