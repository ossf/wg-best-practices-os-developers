# Developer Landing Page

_by the [Open Source Security Foundation (OpenSSF)](https;//openssf.org)_

If you develop or build software, here are some ready-to-go resources to help you secure it.

## General software security education

* [Secure Software Development Fundamentals Courses](https://openssf.org/training/courses/) - a _free_ course for software developers focusing on the fundamentals of developing secure software, whether it's open source software (OSS) or closed source software.

## General guides for projects

* [Concise Guide for Developing More Secure Software](https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software) - a short "start here" page for how to develop secure software.
* [Concise Guide for Evaluating Open Source Software](https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software) - before you add a dependency, use this to help you evaluate it.
* [Guide to Implementing a Coordinated Vulnerability Disclosure Process for Open Source Projects](https://github.com/ossf/oss-vulnerability-guide/blob/main/maintainer-guide.md#readme) - we recommend OSS projects use this _before_ you get a vulnerability report!

You can also see the full list of [Guides released by the OpenSSF](https://openssf.org/resources/guides/).

## OSS Project Evaluation

Use these to evaluate OSS you intend to use _and_ how well your OSS project is doing.

* [Security Scorecard](https://github.com/ossf/scorecard) is a tool that automatically scores OSS projects. Currently only supports projects hosted by GitHub.
  * You can add [AllStar](https://github.com/ossf/allstar) to your OSS project, which will file an issue for Scorecard policy violations (you can configure what files an issue). See [Allstar's "Quickstart Installation" for more](https://github.com/ossf/allstar#quickstart-installation).
* [OpenSSF Best Practices badge](https://bestpractices.coreinfrastructure.org/) - This is a questionaire of security best practices, partly automation, that takes ~20 mintues. If you meet enough criteria your OSS project earns a badge!
* [Security Review](https://github.com/ossf/security-reviews) - collection of known security reviews of OSS projects.

## Build protection

* [Supply-chain Levels for Software Artifacts, or SLSA ("salsa")](https://slsa.dev/) is a checklist of standards and controls to prevent tampering, improve integrity, and secure packages. Its current focus is on protecting the build process.

## Specialized guides

* [npm Best Practices Guide](https://github.com/ossf/package-manager-best-practices/blob/main/published/npm.md)

## Sigstore (digital signing)

Sigstore is a new and simpler approach for artifact signing and signature verification.

* [cosign](https://github.com/sigstore/cosign) - tool for digitally signing artifacts.
* [Securing Your Software Supply Chain with Sigstore Course](https://openssf.org/training/securing-your-software-supply-chain-with-sigstore-course/)

## Funding of OSS projects

* [Secure Open Source Rewards (SOS)](https://sos.dev/) - provides financial grants to critical OSS projects to enhance their their security. Please read its [FAQ](https://sos.dev/#frequently-asked-questions) before submitting your application.

## For more information

Please also see the [main OpenSSF website](https://openssf.org) to learn more about the OpenSSF.
