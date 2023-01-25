## Stale Admin Found
policy name: stale_admin_found

severity: MEDIUM

### Description
A member with global admin permissions without any activity in the past 6 months. Admin users are extremely powerful and common compliance standards demand keeping the number of admins to a minimum. Consider revoking this member’s admin credentials by downgrading to regular user or removing the user completely.

### Threat Example(s)
Stale admins are most likely not managed and monitored, increasing the possibility of being compromised.



### Remediation
1. Make sure you have admin permissions
2. Go to the org's People page
3. Select all stale admins
4. Using the "X members selected" - remove members from organization



