## Two-Factor Authentication Is Not Enforced For The Group

policy name: two_factor_authentication_not_required_for_group

severity: HIGH

### Description

The two-factor authentication requirement is not enabled at the group level. Regardless of whether users are managed externally by SSO, it is highly recommended to enable this option, to reduce the risk of a deliberate or accidental user creation without MFA.

### Threat Example(s)

If an attacker gets the valid credentials for one of the organization’s users they can authenticate to your GitHub organization.

### Remediation

1. Go to the group page
2. Press Settings -> General
3. Expand "Permissions and group features"
4. Toggle "Require all users in this group to set up two-factor authentication"
5. Press "Save Changes"
