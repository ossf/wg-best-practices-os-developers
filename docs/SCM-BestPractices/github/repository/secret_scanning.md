# Secret Scanning

policy name: secret_scanning

severity: HIGH

## Description

This security control checks for secrets being checked into a repository
and prevents it.
Turning on secret scanning detects many kinds of secrets being checked
into a repository and reports it.
Push protection builds on secret scanning and prevents attempts to add such
secrets (and creates an alert if that is overridden).

## Threat Example(s)

Inserting a secret into a source code repository is unfortunately an easy
mistake to make. Instructions for various services often
encourage putting secrets into a repository (as it's the "simple" way
to do it, though not the secure way).
Once secrets are in a repository, they become available for anyone who
can view the repository (directly or via a copy).
Inserting secrets into a source code repository is a mistake, since
it interferes with the whole point of a secret: keeping it secret.
This is such a common type of vulnerability that it is identified as
the Common Weakness Enumeration (CWE)
[CWE-540: Inclusion of Sensitive Information in Source Code](https://cwe.mitre.org/data/definitions/540.html).

## Remediation

Like practically all tools, secret scanning is subject to false positives
and false negatives. That said, secret scanning can prevent significant
vulnerabilities and should be enabled.

There are two different steps, scanning and enforcement:

* On a new project you should enable both scanning and enforcement.
* On an existing project you should enable scanning, ensure it works
  well first, and *then* enable enforcement.

### Enabling Secret Scanning

[The GitHub documentation describes how to enable secret scanning](https://docs.github.com/en/code-security/secret-scanning/configuring-secret-scanning-for-your-repositories).

In short, to enable GitHub secret scanning on a repository:

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Security" section of the sidebar, click "Code security and analysis".
4. Click "Enable for secret scanning"
5. Click "Save changes"

You may also choose to enable other secret scanning tools.
For example, those with access to the Linux Foundation's LFX tools should
consider enabling its secret scanning tools as well.

### Enforcing Secret Scanning

In GitHub you can enable push protection on secret scanning
for repositories and organizations.
When this is enabled, secret scanning "blocks contributors
from pushing secrets to a repository and generates an alert
whenever a contributor bypasses the block."

[The GitHub documentation describes how to enable push protection with secret scanning](https://docs.github.com/en/code-security/secret-scanning/push-protection-for-repositories-and-organizations).

In short, to enforce GitHub secret scanning on a repository:

1. Make sure you have admin permissions
2. Go to the repo's settings page
3. Enter "Security" section of the sidebar, click "Code security and analysis".
4. Under "Code security and analysis", find "GitHub Advanced Security."
5. Under "Secret scanning", under "Push protection", click "Enable".
