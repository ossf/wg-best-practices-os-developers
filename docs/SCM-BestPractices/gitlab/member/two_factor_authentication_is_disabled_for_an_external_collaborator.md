## Two Factor Authentication Is Disabled For an External Collaborator

policy name: two_factor_authentication_is_disabled_for_an_external_collaborator

severity: HIGH

### Description

An external collaborator's two factor authentication is disabled at the source code management system. Turn it on in the collaborator setting, or globally in the account, to prevent any access without MFA.

### Threat Example(s)

Collaborators without two-factor authentication are prime targets for phising and social engineering attacks, as compromise only requires acquiring the collaborator's password.
This is doubly important for external collaborators, as these are identities that aren't likely managed by you or your organization and may be easier to compromise.

### Remediation

1. Login with the user credentials
2. Go to the user settings page
3. Select "Account" on the left navigation bar
4. Press "Enable two-factor authentication"
