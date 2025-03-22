# Concise Guide for Evaluating Open Source Software

**Document Version:** 1.1.0  
**Date of Issue:** 2025-03-22

_by the [Open Source Security Foundation (OpenSSF)](https://openssf.org) [Best Practices Working Group](https://best.openssf.org/), 2023-11-21_

As a software developer, before using open source software (OSS) dependencies or tools, identify candidates and evaluate the leading ones against your needs. To evaluate a potential OSS dependency for security and sustainability, consider these questions (all tools or services listed are merely examples):

## Initial Assessment

| Rule | Description | Checkbox |
|------|-------------|:--------:|
| **Consider Necessity** | Evaluate whether the dependency can be avoided by utilizing existing components. Every new dependency increases the attack surface (a subversion of the new dependency, or its transitive dependencies, may subvert the system). | □ |
| **Verify Authenticity** | Verify that the software being evaluated is the authentic version from the authorized source, not a personal fork nor an attacker-controlled fork. These techniques help counter the common "typosquatting" attack (where an attacker creates an "almost-correct" name). Check its name and the project website for the link. Verify the fork relation on GitHub/GitLab. Check if the project is affiliated with a foundation. Check its creation time and popularity. | □ |

## Maintenance & Sustainability

Unmaintained software is a risk; most software needs continuous maintenance. If it's unmaintained, it's also likely to be insecure.

| Rule | Description | Checkbox |
|------|-------------|:--------:|
| **Activity Level** | Confirm significant recent activity (e.g., commits) has occurred within the previous 12 months. | □ |
| **Communication** | Verify the existence of recent releases or announcements from the project maintainer(s). | □ |
| **Maintainer Diversity** | Verify the presence of more than one maintainer, ideally from different organizations, to reduce single-point-of-failure risk. | □ |
| **Release Recency** | Confirm that the last release was issued within the previous 12 months. | □ |
| **Version Stability** | Assess whether the version string indicates instability (e.g., begin with "0", include "alpha" or "beta", etc.). | □ |

## Security Practices

| Rule | Description | Checkbox |
|------|-------------|:--------:|
| **Assessment Framework** | Utilize established assessment methodologies such as [SAFECode's guide _Principles for Software Assurance Assessment_](https://safecode.org/resource-managing-software-security/principles-of-software-assurance-assessment/) (2019), a multi-tiered approach for examining the software's security. | □ |
| **Best Practices Certification** | Determine whether the project has earned (or is well on the way to) an [Open Source Security Foundation (OpenSSF) Best Practices badge](https://www.bestpractices.dev/). | □ |
| **Dependency Management** | Verify that the package dependencies are (relatively) up to date. | □ |
| **Repository Security** | Confirm that developers use code hosting security features where applicable (e.g., if they're on GitHub or GitLab, do they use branch protection). | □ |
| **Security Audits** | Identify existing security audits and verify that identified vulnerabilities have been fixed. Security audits are relatively uncommon, but see OpenSSF's "[Security Reviews](https://github.com/ossf/security-reviews)". | □ |
| **Security Development** | Confirm they apply many practices in the [Concise Guide for Developing More Secure Software](https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software). | □ |
| **Security Documentation** | Verify the existence of documentation explaining why it's secure (aka an "assurance case"). | □ |
| **Security Response** | Assess whether the project fixes bugs (especially security bugs) in a timely manner, if they release security fixes for older releases, and if they have an LTS (Long Term Support) version. | □ |
| **Security Scores** | Examine information on [https://deps.dev](https://deps.dev/), including its [OpenSSF Scorecards](https://github.com/ossf/scorecard) score and any known vulnerabilities. | □ |
| **Testing Practices** | Evaluate if there are automated tests included in its CI pipeline and what is its test coverage. | □ |
| **Vulnerability Status** | Confirm if the current version is free of known important vulnerabilities (especially long-known ones). Organizations may want to implement the [OpenChain](https://www.openchainproject.org/) [Security Assurance Specification 1.1](https://github.com/OpenChain-Project/Security-Assurance-Specification/tree/main/Security-Assurance-Specification/1.1/en) to systemically check for known vulnerabilities on ingest and as new vulnerabilities are publicly revealed. | □ |

## Usability & Security

| Rule | Description | Checkbox |
|------|-------------|:--------:|
| **Interface Design** | Verify that the interface/API is designed to be easy to use securely (e.g., if the interface implements a language, does it support parameterized queries). | □ |
| **Secure Defaults** | Confirm that the default configuration and "simple examples" are secure (e.g., encryption turned on by default in network protocols). If not, avoid it. | □ |
| **Security Guidance** | Verify if there is guidance on how to use it securely. | □ |
| **Vulnerability Reporting** | Confirm if there are instructions on how to report vulnerabilities. See the [Guide to implementing a coordinated vulnerability disclosure process for open source projects](https://github.com/ossf/oss-vulnerability-guide/blob/main/maintainer-guide.md#guide-to-implementing-a-coordinated-vulnerability-disclosure-process-for-open-source-projects) for guidance to OSS projects. | □ |

## Adoption & Licensing

Licensing frameworks, while not directly security-related, significantly impact security and sustainability postures. Projects lacking clear licensing information frequently demonstrate deficiencies in other security best practices.

| Rule | Description | Checkbox |
|------|-------------|:--------:|
| **License Clarity** | Verify that every component has a license, that it's a widely-used [OSI license](https://opensource.org/licenses) if it's OSS, and that it's consistent with your intended use. Projects that won't provide clear license information are less likely to follow other good practices that lead to secure software. | □ |
| **Name Verification** | Check if a similar name is more popular - that could indicate a typosquatting attack. | □ |
| **Usage Metrics** | Assess if it has significant use. Software with many users or large users may be inappropriate for your use. However, widely-used software is more likely to offer useful information on how to use it securely, and more people will care about its security. | □ |

## Practical Testing

| Rule | Description | Checkbox |
|------|-------------|:--------:|
| **Behavior Testing** | Try adding the dependency as a test, preferably in an isolated environment. Does it exhibit malicious behaviour, e.g., does it attempt to exfiltrate sensitive data? | □ |
| **Dependency Impact** | Does it add unexpected or unnecessary indirect dependencies in production? For example, does it include production dependencies that are only required at development time or test time instead? If so, would their maintainers be willing to fix that? Every new dependency is a potential support problem or supply chain attack, so it's wise to eliminate unnecessary ones. | □ |

## Code Evaluation

Even a brief review of software (by you, someone you hire, or someone else), along with recent changes to it, can give you some insight. Here are things to consider:

| Rule | Description | Checkbox |
|------|-------------|:--------:|
| **Code Completeness** | Evaluate whether there is evidence of insecure/incomplete software (e.g., many TODO statements). | □ |
| **Malicious Code Check** | Analyze if there is evidence that the software is malicious. Per [_Backstabber's Knife Collection_](https://arxiv.org/abs/2005.09535), check the installation scripts/routines for maliciousness, check for data exfiltration from **~/.ssh** and environment variables, and look for encoded/obfuscated values that are executed. Examine the most recent commits for suspicious code (an attacker may have added them recently). | □ |
| **Sandbox Testing** | Consider running the software in a sandbox to attempt to trigger and detect malicious code. | □ |
| **Security Implementations** | When reviewing its source code, is there evidence in the code that the developers were trying to develop secure software (such as rigorous input validation of untrusted input and the use of parameterized statements)? | □ |
| **Security Reviews** | See the [OpenSSF's list of security reviews](https://github.com/ossf/security-reviews/blob/main/Overview.md#readme). | □ |
| **Static Analysis** | What are the "top" problems reported by static analysis tools? | □ |
| **Test Validation** | Consider running all defined test cases to ensure the software passes them. | □ |

## Additional Resources

- [The Tidelift guide to choosing packages well (February 2021)](https://tidelift.com/subscription/choosing-open-source-packages-well), Tidelift
- [How to Evaluate Open Source Software / Free Software (OSS/FS) Programs](https://dwheeler.com/oss_fs_eval.html)


## Terminology Reference

| Term | Definition |
|------|------------|
| **Attack Surface** | The total sum of points in a software system where an unauthorized user might try to enter or extract data. Larger codebases and more dependencies typically mean a larger attack surface. |
| **Branch Protection** | A feature in code hosting platforms that prevents direct changes to important branches without review, helping maintain code quality and security. |
| **CI Pipeline** | Continuous Integration pipeline - automated workflows that build, test, and validate code changes before they're merged into the main codebase. |
| **Dependency** | External code packages or libraries that a software project relies on to function properly. |
| **LTS (Long Term Support)** | A version of software that will receive maintenance and security updates for an extended period, often used for stability in production environments. |
| **OpenChain Security Assurance Specification** | A specification from the [OpenChain Project](https://www.openchainproject.org/) (part of the Linux Foundation) that provides guidelines for managing security assurance in the open source supply chain. It helps organizations systematically identify and remediate known vulnerabilities in open source components. While OpenChain's license compliance framework became ISO/IEC 5230:2020, the [Security Assurance Specification](https://github.com/OpenChain-Project/Security-Assurance-Specification/) is a related initiative focusing specifically on security aspects. |
| **OpenSSF Badge** | A certification from the [Open Source Security Foundation](https://openssf.org/) that indicates a project follows security best practices. Projects earn badges by meeting specific criteria for security, quality, and community engagement through the [Best Practices Badge Program](https://www.bestpractices.dev/). |
| **OSI License** | A license approved by the [Open Source Initiative](https://opensource.org/) (OSI) that guarantees specific freedoms to users while meeting the [Open Source Definition](https://opensource.org/osd/). |
| **Parameterized Queries** | A technique for database access that separates SQL code from data, preventing SQL injection attacks. |
| **Sandbox** | A controlled environment where untrusted code can be safely run without affecting the rest of the system. |
| **Static Analysis** | Automated tools that examine code without executing it to identify potential bugs, vulnerabilities, or style issues. |
| **Test Coverage** | A measure of how much of a codebase is executed during testing, indicating the thoroughness of your test suite. |
| **Transitive Dependency** | Dependencies of your direct dependencies - packages your code relies on indirectly. |
| **Typosquatting** | A malicious practice where attackers create packages with names very similar to popular packages, hoping developers will accidentally install them due to typos. |
| **Vulnerability** | A weakness in software that could be exploited to cause harm or allow unauthorized access to systems or data. |
**Document Version History**

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2023-11-21 | Initial document version |
| 1.1.0 | 2025-03-22 | Refactor structure. Add terminology table |

_We welcome suggestions and updates! Please open an [issue](https://github.com/ossf/wg-best-practices-os-developers/issues/) or post a [pull request](https://github.com/ossf/wg-best-practices-os-developers/pulls)._