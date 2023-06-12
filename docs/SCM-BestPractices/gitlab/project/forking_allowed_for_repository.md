# Forking Should Not Be Allowed

policy name: forking_allowed_for_repository

severity: LOW

## Description

Forking a repository can lead to loss of control and potential exposure of
source code. If you do not need forking, it is recommended to turn it off in the
project's configuration. The option to fork should be enabled only by owners
deliberately when opting to create a fork.

## Threat Example(s)

Forked repositories may leak important code assets or sensitive secrets
embedded in the code to anyone outside your organization, as the code becomes
publicy-accessible

## Remediation

1. Make sure you have owner permissions
2. Go to the project's settings page
3. Enter "General" tab
4. Under "Visibility
5. project features
6. permissions"
7. Toggle off "Forks"
