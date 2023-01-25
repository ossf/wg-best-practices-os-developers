## Two-Factor Authentication Is Not Enforced For The Organization
policy name: two_factor_authentication_not_required_for_org

severity: HIGH

### Description
The two-factor authentication requirement is not enabled at the organization level. Regardless of whether users are managed externally by SSO, it is highly recommended to enable this option, to reduce the risk of a deliberate or accidental user creation without MFA.

### Threat Example(s)
If an attacker gets the valid credentials for one of the organization’s users they can authenticate to your GitHub organization.



### Remediation
1. Make sure you have admin permissions
2. Go to the organization settings page
3. Enter "Authentication security" tab
4. Under "Two-factor authentication"
5. Toggle on "Require two-factor authentication for everyone in the <ORG> organization"
6. Click "Save"



