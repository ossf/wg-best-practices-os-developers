# Merge Request Authors Should Not Be Able To Override the Approvers List

policy name: repository_allows_overriding_approvers

severity: MEDIUM

## Description

A repository should not allow merge request authors to freely edit the list of
required approvers. To enforce code review only by authorized personnel, the
option to override the list of valid approvers for the merge request must be
toggled off.

## Threat Example(s)

Users can merge code without being reviewed which can lead to insecure code
reaching the main branch and production.

## Remediation

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Merge Requests" tab
4. Under "Approval settings"
5. Check "Prevent editing approval rules in merge requests"
6. Click "Save Changes"
