# Default Member Permissions Should Be Restricted

policy name: default_repository_permission_is_not_none

severity: HIGH

## Description

Default repository permissions configuration is not set in the organization,
thus every new repository will be accessible by default to all users. It is
strongly recommended to remove the default permissions and assign them on
demand.

## Threat Example(s)

Organization members can see the content of freshly created repositories, even
if they should be restricted.

## Remediation

1. Make sure you have admin permissions
2. Go to the organization settings page
3. Enter "Member privileges" tab
4. Under "Base permissions"
5. Set permissions to "No permissions"
6. Click "Save"
