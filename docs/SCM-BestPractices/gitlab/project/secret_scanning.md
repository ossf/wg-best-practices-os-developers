# Secret Scanning

policy name: secret_scanning

severity: HIGH

## Description

This security control checks for secrets being checked into a repository.
Turning on secret detection (also called secret scanning)
detects many kinds of secrets being checked
into a repository and reports it.
At this time GitLab's mechanism for *preventing* this event is experimental.

## Threat Example(s)

Inserting a secret into a source code repository is unfortunately an easy
mistake to make. Instructions for various services often
encourage putting secrets into a repository (as it's the "simple" way
to do it, though not the secure way).
Once secrets are in a repository, they become available for anyone who
can view the repository (directly or via a copy).
Inserting secrets into a source code repository is a mistake, since
it interferes with the whole point of a secret: keeping it secret.
This is such a common kind of vulnerability that it is identified as
the Common Weakness Enumeration (CWE)
[CWE-540: Inclusion of Sensitive Information in Source Code](https://cwe.mitre.org/data/definitions/540.html).

## Remediation

Like practically all tools, secret scanning is subject to false positives
and false negatives. That said, secret scanning can prevent significant
vulnerabilities and should be enabled.

GitLab includes
[two different secret detection methods](https://docs.gitlab.com/ee/user/application_security/secret_detection/)
which can be used simultaneously:

* The pipeline method "detects secrets during the project’s CI/CD pipeline.
  This method cannot reject pushes".
* The pre-receive method "detects secrets when users push changes to
  the remote Git branch. This method can reject pushes if a secret is detected."

However, as of 2024-05-14, the pre-receive method is an
experiment with limited availability. Thus, we focus on the pipeline method.
The pipeline method is unfortunately unable to *prevent* this, but at least
it quickly warns you of the event.

Note that secret scanning is automatically enabled if you enable
[Auto DevOps](https://docs.gitlab.com/ee/topics/autodevops/index.html#enable-or-disable-auto-devops).

Those with more complex needs must
edit the `.gitlab-ci.yml` file manually.
To do this:

1. Make sure you can manage project merge requests permissions
2. Go to the project's settings page
3. Select "Build > Pipeline editor"
4. Add the following to the end of the `.gitlab-ci.yml` file:
~~~~yml
include:
  - template: Jobs/Secret-Detection.gitlab-ci.yml
~~~~
5. Select the Validate tab, then select Validate pipeline. The message Simulation completed successfully indicates the file is valid.
6. Select the Edit tab.
7. In the Branch text box, enter the name of the default branch.
8. Select Commit changes.
