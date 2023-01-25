## Webhook Configured Without SSL Verification
policy name: project_webhook_doesnt_require_ssl

severity: LOW

### Description
Webhooks that are not configured with SSL verification enabled could expose your sofware to man in the middle attacks (MITM).

### Threat Example(s)
If SSL verification is disabled, any party with access to the target DNS domain can masquerade as your designated payload URL, allowing it freely read and affect the response of any webhook request.
In the case of GitLab Self-Managed, it may be sufficient only to control the DNS configuration of the network where the instance is deployed, as an attacker can redirect traffic to the target domain in your internal network directly to them, and this is often much easier than compromising an internet-facing domain.



### Remediation
1. Make sure you can manage webhooks for the project
2. Go to the project's settings page
3. Select "Webhooks"
4. Press on the "Enable SSL verfication"
5. Click "Save changes"



