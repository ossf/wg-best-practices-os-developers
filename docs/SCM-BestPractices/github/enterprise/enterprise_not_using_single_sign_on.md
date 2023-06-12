
## Enterprise Should Use Single-Sign-On
policy name: enterprise_not_using_single_sign_on

severity: MEDIUM

### Description
It is recommended to enable access to an enterprise via SAML single sign-on (SSO) by authenticating through an identity provider (IdP). This allows for central account control and for timely access revocations.

### Threat Example(s)
Not using an SSO solution makes it more difficult to track a potentially compromised user's actions across different systems, prevents common password policy throughout the enterprise, and makes it challenging to audit different aspects of the user's behavior.



### Remediation
1. Make sure you are an enterprise owner
2. Go to the Settings page
3. Go to the Authentication security tab
4. Toggle on "Enable SAML authentication"
5. Fill in the remaining SSO configuration as instructed on the screen
6. Click "Save"


