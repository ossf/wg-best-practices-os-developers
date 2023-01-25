## Webhook Configured Without SSL
policy name: organization_webhook_doesnt_require_ssl

severity: LOW

### Description
Webhooks that are not configured with SSL enabled could expose your software to man in the middle attacks (MITM).

### Threat Example(s)
If SSL verification is disabled, any party with access to the target DNS domain can masquerade as your designated payload URL, allowing it freely read and affect the response of any webhook request.
In the case of GitLab Self-Managed, it may be sufficient only to control the DNS configuration of the network where the instance is deployed.



### Remediation
1. Go to the group Settings -> Webhooks page
2. Find the misconfigured webhook and press "Edit"
3. Toggle "Enable SSL verification"
4. Press "Save Changes"



