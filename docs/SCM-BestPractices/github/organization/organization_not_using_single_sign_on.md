## Organization Not Using Single-Sign-On

policy name: organization_not_using_single_sign_on

severity: MEDIUM

### Description

It is recommended to enable access to an organization via SAML single sign-on (SSO) by authenticating through an identity provider (IdP).

### Threat Example(s)

Not using an SSO solution makes it more difficult to track a potentially compromised user's actions accross different systems, prevents the organization from defining a common password policy, and makes it challenging to audit different aspects of the user's behavior.

### Remediation

1. Make sure you have admin permissions
2. Go to the organization settings page
3. Enter "Authentication security" tab
4. Toggle on "Enable SAML authentication"
5. Fill in the remaining SSO configuration as instructed on the screen
6. Click "Save"
