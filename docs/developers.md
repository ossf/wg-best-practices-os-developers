# For Maintainers & Contributors

_by the [Open Source Security Foundation (OpenSSF)](https://openssf.org)_

If you develop or build software, especially for the Open Source Softwrae (OSS) Community, these are some ready-to-go OpenSSF resources to help you secure that software.

## Security Education

* [Secure Software Development Fundamentals Courses](https://openssf.org/training/courses/) - a _free_ course for software developers focusing on the fundamentals of developing secure software, whether it's OSS or closed source software. Both the course and its certificate of completion are free from Linux Foundation Training.

## Security Guides

* [Concise Guide for Developing More Secure Software](https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software) - a short "start here" page for how to develop secure software.
* [Guide to Implementing a Coordinated Vulnerability Disclosure Process for Open Source Projects](https://github.com/ossf/oss-vulnerability-guide/blob/main/maintainer-guide.md#readme) - we recommend OSS projects use this _before_ you get a vulnerability report!

You can also see the full list of [Guides released by the OpenSSF](https://openssf.org/resources/guides/).

## Security Project Evaluations for OSS

Use these to evaluate the OSS you intend to use _and_ to evaluate how well your OSS project(s are doing.

* [Concise Guide for Evaluating Open Source Software](https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software) - before you add a dependency, use this to help you evaluate it.
* [Security Scorecard](https://github.com/ossf/scorecard) is a tool that automatically scores OSS projects. Currently only supports projects hosted by GitHub.
  * You can add [AllStar](https://github.com/ossf/allstar) to your OSS project, which will file an issue for Scorecard policy violations (you can configure what files an issue). See [Allstar's "Quickstart Installation" for more](https://github.com/ossf/allstar#quickstart-installation).
* [OpenSSF Best Practices badge](https://www.bestpractices.dev/) - This is a questionaire of security best practices, partly automation, that takes ~20 mintues. If you meet enough criteria your OSS project earns a Security Best Practices badge for display on your project in Github!
* [Security Reviews](https://github.com/ossf/security-reviews) - collection of known security reviews of OSS projects.

## Build Protection

* [Supply-chain Levels for Software Artifacts, or SLSA ("salsa")](https://slsa.dev/) is a checklist of standards and controls to prevent tampering, improve integrity, and secure packages. Its current focus is on protecting the build process.

## Specialized Guides

* [npm Best Practices Guide](https://github.com/ossf/package-manager-best-practices/blob/main/published/npm.md)

## Sigstore (Digital Signing)

Sigstore is a new and simpler approach for artifact signing and signature verification.

* [cosign](https://github.com/sigstore/cosign) - tool for digitally signing artifacts.
* [Securing Your Software Supply Chain with Sigstore Course](https://openssf.org/training/securing-your-software-supply-chain-with-sigstore-course/)

## Security Funding for OSS Projects

* [Alpha-Omega (AO) Alpha Grants](https://alpha-omega.dev/about/how-to-apply/) - provides financial grants to enhance their security of OSS projects.

## For more information about the OpenSSF

To learn more about the OpenSSF,
please see the [main OpenSSF website](https://openssf.org).
From this website you can get information such as:

* [list of OpenSSF working groups (WGs)](https://openssf.org/community/openssf-working-groups/)
* [OpenSSF blog](https://openssf.org/blog/)
* [Upcoming Events](https://openssf.org/events/)
* [OpenSSF press releases](https://openssf.org/news/)
* [Public event calendar](https://calendar.google.com/calendar/u/0?cid=czYzdm9lZmhwNWk5cGZsdGI1cTY3bmdwZXNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ).

## Getting involved in the OpenSSF

If you're interested in helping us improve the security (including the
supply chain security) of open source software,
[please get involved in the OpenSSF](https://openssf.org/getinvolved/).

A good starting point would be to look at our
[list of OpenSSF working groups (WGs)](https://openssf.org/community/openssf-working-groups/)
to see what would interest you.
You can click on its GitHub page to learn more about what they do and when they
meet by video; you can also join their Slack channel and mailing list
to participate in what they're doing.
