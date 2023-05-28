
## Two-Factor Authentication Should Be Enforced For The Enterprise
policy name: enterprise_enforce_two_factor_authentication

severity: HIGH

### Description
The two-factor authentication requirement should be enforced at the enterprise level. Regardless of whether users are managed externally by SSO, it is highly recommended to enable this option to reduce the risk of a deliberate or accidental user creation without MFA.

### Threat Example(s)
If an attacker gets the valid credentials for one of the enterprise’s users they can authenticate to your GitHub enterprise.



### Remediation
1. Make sure you are an enterprise owner
2. Go to the Settings page
3. Go to the Authentication security tab
4. Check the "Require two-factor authentication for all organizations in the enterprise" checkbox


