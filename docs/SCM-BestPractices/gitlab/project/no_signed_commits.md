# Default Branch Should Require All Commits To Be Signed

policy name: no_signed_commits

severity: LOW

## Description

Require all commits to be signed and verified

## Threat Example(s)

A commit containing malicious code may be crafted by a malicious actor that has
acquired write access to the repository to initiate a supply chain attack.
Commit signing provides another layer of defense that can prevent this type of
compromise.

## Remediation

1. Make sure you have owner permissions
2. Go to the projects's settings -> Repository page
3. Enter "Push Rules" tab. Set the "Reject unsigned commits" checkbox
