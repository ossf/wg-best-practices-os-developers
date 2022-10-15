# Concise Guide for Evaluating Open Source Software 2022-09-01

As a software developer, before using open source software (OSS) dependencies or tools, identify candidates and evaluate the leading ones against your needs. To evaluate a potential OSS dependency for security and sustainability, consider these questions (all tools or services listed are merely examples):

1. **Can you avoid adding it?** Can you use an existing (possibly indirect) dependency instead? Every new dependency increases the attack surface (a subversion of the new dependency, or its transitive dependencies, may subvert the system).
2. **Are you evaluating the intended version?** Ensure you are evaluating the intended version of the software, not a personal fork nor an attacker-controlled fork. These techniques help to counter the common “typosquatting” attack (where an attacker creates an “almost-correct” name).
    1. Check its name and the project website for the link.
    2. Verify the fork relation on GitHub/GitLab.
    3. Check if the project is affiliated with a foundation (in this case, you should be able to access the official source from the foundation’s website).
    4. Check its creation time, and check its popularity.
3. **Is it maintained?** Unmaintained software is a risk; most software needs continuous maintenance. If it’s unmaintained, it’s also likely to be insecure.
    1. Has significant recent activity (e.g., commits) occurred within the last year?
    2. When was its last release (was it less than a year ago)?
    3. Is there more than one maintainer, ideally from different organizations?
    4. Are there recent releases or announcements from its maintainer(s)?
    5. Does its version string indicate instability (e.g., begin with “0”, include “alpha” or “beta”, etc.)
4. **Is there evidence that its developers work to make it secure?**
    1. Determine whether the project has earned (or is well on the way to) an [Open Source Security Foundation (OpenSSF) Best Practices badge](https://bestpractices.coreinfrastructure.org/).
    2. Examine information on [https://deps.dev](https://deps.dev/), including its [OpenSSF Scorecards](https://github.com/ossf/scorecard) score and any known vulnerabilities.
    3. Determine whether the package dependencies are (relatively) up to date.
    4. Determine whether there is documentation explaining why it’s secure (aka an “assurance case”).
    5. Are there automated tests included in its CI pipeline? What is its test coverage?
    6. Does the project fix bugs (especially security bugs) in a timely manner? Do they release security fixes for older releases? Do they have an LTS (Long Time Support) version?
    7. Do the developers use code hosting security features where applicable (e.g., if they’re on GitHub or GitLab, do they use branch protection)?
    8. Identify security audits and whether any problems found were fixed. Security audits are relatively uncommon, but see OpenSSF’s “[Security Reviews](https://github.com/ossf/security-reviews)”.
    9. Use [SAFECode’s guide _Principles for Software Assurance Assessment_](https://safecode.org/resource-managing-software-security/principles-of-software-assurance-assessment/) (2019), a multi-tiered approach for examining the software’s security.
    10. Is the current version free of known important vulnerabilities (especially long-known ones)? Organizations may want to implement the [OpenChain](https://www.openchainproject.org/) [Security Assurance Specification Guide](https://github.com/OpenChain-Project/Security-Assurance-Specification/tree/main/Security-Assurance-Specification/1.1/en) to systemically check for known vulnerabilities on ingest and as new vulnerabilities are publicly revealed.
    11. Do they apply many practices in the [Concise Guide for Developing More Secure Software](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Concise-Guide-for-Evaluating-Open-Source-Software.md#readme)?
5. **Is it easy to use securely?**

    1. Are the default configuration and “simple examples” secure (e.g., encryption turned on by default in network protocols)? If not, avoid it.
    2. Is its interface/API designed to be easy to use securely (e.g., if the interface implements a language, does it support parameterized queries)?
    3. Is there guidance on how to use it securely?

6. **Are there instructions on how to report vulnerabilities?​​** See the [Guide to implementing a coordinated vulnerability disclosure process for open source projects](https://github.com/ossf/oss-vulnerability-guide/blob/main/guide.md#readme) for guidance to OSS projects.,
7. **Does it have significant use?** Software with many users or large users may be inappropriate for your use. However, widely used software is more likely to offer useful information on how to use it securely, and more people will care about its security. Check if a similar name is more popular - that could indicate a typosquatting attack.
8. **What is the software’s license?** Licenses are technically not security, but licenses can have a significant impact on security and sustainability. Ensure every component has a license, that it’s a widely-used [OSI license](https://opensource.org/licenses) if it’s OSS, and that it’s consistent with your intended use. Projects that won’t provide clear license information are less likely to follow other good practices that lead to secure software.
9. **What is your evaluation of its code?** Even a brief review of software source code, and its changes over time, can give you some insight. Here are things to consider:
    1. When you review its source code, is there evidence in the code that the developers were trying to develop secure software (such as rigorous input validation of untrusted input and the use of parameterized statements)?
    2. Is there evidence of insecure/ incomplete software (e.g., many TODO statements)?
    3. What are the “top” problems reported by static analysis tools?
    4. Is there evidence that the software is malicious? Per [_Backstabber’s Knife Collection_](https://arxiv.org/abs/2005.09535), check the installation scripts/routines for maliciousness, check for data exfiltration from **~/.ssh** and environment variables, and look for encoded/ obfuscated values that are executed. Examine the most recent commits for suspicious code (an attacker may have added them recently).
    5. Consider running the software in a sandbox to attempt to trigger and detect malicious code.
    6. Consider running all defined test cases to ensure the software passes them.

Other resources you may wish to consider include:

1. [The Tidelift guide to choosing packages well (February 2021)](https://tidelift.com/subscription/choosing-open-source-packages-well), Tidelift
2. [How to Evaluate Open Source Software / Free Software (OSS/FS) Programs](https://dwheeler.com/oss_fs_eval.html)
