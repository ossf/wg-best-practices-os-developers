# Best Practices for Open Source Developers

[![GitHub Super-Linter](https://github.com/ossf/wg-best-practices-os-developers/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

Anyone is welcome to join our open discussions related to the group's mission and charter. The BEST Working group is officially a [Graduated-level](https://github.com/ossf/tac/blob/main/process/working-group-lifecycle.md) working group within the OpenSSF <img align="right" src="https://github.com/ossf/tac/blob/main/files/images/OpenSSF_StagesBadges_graduated.png" width="100" height="100">

<img align="right" src="https://github.com/ossf/wg-best-practices-os-developers/blob/main/img/ossf-best-goose.png" width="300" height="300">

## Mission

Our Mission is to provide open source developers with security best practices recommendations and easy ways to learn and apply them.  

We seek to fortify the open-source ecosystem by championing and embedding best security practices, thereby creating a digital environment where both developers and users can trust and rely on open-source solutions without hesitation.

## Vision

- We envision a world where software developers can easily IDENTIFY good practices, requirements and tools that help them create and maintain secure world-class software, helping foster a community where security knowledge is shared and amplified.  
- We seek to provide means to LEARN techniques of writing and identifying secure software using methods best suited to learners of all types.
- We desire to provide tools to help developers ADOPT these good practices seamlessly into their daily work.

<img align="top" src="https://github.com/ossf/wg-best-practices-os-developers/blob/main/img/OpenSSF%20Dev%20Best%20Practices%20Projects%20Relations.png">

## Scope

The Developer Best Practices group wants to help identify and curate an accessible [inventory](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/inventory.md) of best practices

- Prioritized according to ROI for open source developers
- Categorized per technology, language, framework
- Community-curated

## Strategy

To achieve our Mission and Vision, the BEST Working group will execute on the following strategy:

- Collaborate with security experts to draft a comprehensive set of best practices tailored for open-source projects.
- Identify gaps in tools and resources that provide opportunities to promote and implement secure development practices.
- Evangelize and drive adoption of our artifacts (ex: guides, trainings, tools) through community outreach and targeted maintainer engagement.
- Collaborate with other OpenSSF and open source efforts to provide comprehensive guidance, advice, and tooling for software developers and open source software consumers to use, implement, and evaluate the security qualities of software.

## Roadmap

To deliver on our Strategy, the BEST Working Group will do the following:

- Evangelize OpenSSF “best practices” and tooling through blogs, podcasts, conference presentations, and the like.
- Create express learning classes for our body of work: working group explainer, SCM BP Guide, C/C++ Guide, Scorecard/Badges, Concise Guides
- Create a “Best Practices Member Badge” for member organizations
- Support and promote our sub-projects with contributions and feedback - Scorecard, BP Badges, OpenSSF - SkillFoundry, Classes, and Guides, Secure Software Guiding Principles (SSGP)
- Create a Memory Safety W3C-style workshop to assemble development leaders to talk about how to integrate memory safe languages and techniques more deeply into the oss ecosystem.
- Expand BEAR (Belonging, Empowerment, Allyship, and Representation) WG Office Hours to more broadly engage new-to-oss individuals and provide a forum for mentorship and guidance as they launch into and grow within their careers.
- Identify, curate, produce, and deliver new secure development education such as Developer Manager Training, Implementing/Integrating OSSF tools (such as Scorecard, Badges, OSV, OpenVEX, etc), advanced secure development techniques, and more.
- Evangelize and embed all of our guides across OpenSSF Technical Initiatives and understand what makes sense to integrate into Scorecard

## Current Work

### Active SIGs and Initiatives

The table below lists the active initiatives and efforts of the Best Practices Working Group. The meeting times may change, so please check the [public OpenSSF calendar](https://openssf.org/getinvolved/) for up-to-date information about all community meetings.

| Effort                            | Description                                                           |    Meeting Times                                         |    Meeting Notes/Agenda    |       Git Repo        | Slack Channel | Mailing List |
| :-------------------------------- |:----------------------------------------------------------------------| :------------------------------------------------------- | :------------------------- | :-------------------- | :------------ | :----------- |
| Full WG                           | Secure Software Development Best Practices                            | Every two weeks, Tuesday 7:00a PT/10:00a ET/1600 CET     | [Meeting Notes](https://docs.google.com/document/d/1b2yGx6sVONsxMW8bdHhfBFCX2WbmaqvIDuWmKfiLgRo/)       | [Git Repo](https://github.com/ossf/wg-best-practices-os-developers)                                                  | [Slack](https://openssf.slack.com/archives/C01AHCRP8BT)      | [Mailing List](https://lists.openssf.org/g/openssf-wg-best-practices) |
| Academic Connections SIG          | Collaborate with the academic community to support education. (in concert with the EDU.SIG)| Every 2 weeks, Wednesday 6:00a PT/9:00a ET/1500 CET      | [Meeting Notes](https://docs.google.com/document/d/1th8joOtmQa3y9KNlH-QBcYADMEHtCynSYwRR1r_WB6Q/)       | [Git Repo](https://github.com/ossf/education)                                                                        | [Slack](https://openssf.slack.com/archives/C0A2A44TSDD)      | [Mailing List](https://lists.openssf.org/g/openssf-sig-education)     |
| Allstar                           | Monitors GitHub repositories for adherence to security best practices | Every 2 weeks, Thursday 1:00p PT/4:00p ET/2200 CET       | See Scorecard Notes                                                                                     | [Git Repo](https://github.com/ossf/allstar)                                                                          | [Slack](https://openssf.slack.com/archives/C02UQ2RL0HM)      |                                                                       |
| C/C++ Compiler Guides             | C/C++ compiler hardening best practices guide                         | Every month, Thursday 6:00a PT/9:00a ET/1500 CET         | See Full SIG Notes                                                                                      | [Git Repo](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Compiler-Hardening-Guides)         | [Slack](https://openssf.slack.com/archives/C058E884WN7)      | [Mailing List](https://lists.openssf.org/g/openssf-wg-best-practices) |
| EDU.SIG                           | Provide industry standard secure software development training.       | Every 2 weeks, Wednesday 6:00a PT/9:00a ET/1500 CET      | [Meeting Notes](https://docs.google.com/document/d/1th8joOtmQa3y9KNlH-QBcYADMEHtCynSYwRR1r_WB6Q/)       | [Git Repo](https://github.com/ossf/education)                                                                        | [Slack](https://openssf.slack.com/archives/C03FW3YGXH9)      | [Mailing List](https://lists.openssf.org/g/openssf-sig-education)     |
| Memory Safety SIG                 | Eliminating memory safety vulnerabilities                             | Every 2 weeks, Thursday 10:00a PT/1:00p ET/1900 CET      | [Meeting Notes](https://docs.google.com/document/d/1HyfvC3FuEn6xrueQJrCIUokuRT0c8Pk-IkpW_MfqJaM/)       | [Git Repo](https://github.com/ossf/Memory-Safety)                                                                    | [Slack](https://openssf.slack.com/archives/C03G8NZH58R)      | [Mailing List](https://lists.openssf.org/g/openssf-sig-memory-safety) |
| OpenSSF Best Practices Badge      | Identifies FLOSS best practices & implements a badging system         | Full SIG call                                            | See Full SIG Notes                                                                                      | [OpenSSF Best Practices Badge](https://www.bestpractices.dev/)                                                       |                                                              |                                                                       |
| Python Hardening Guide SIG        | A secure coding guide for Python and with code examples               | Every two weeks, Monday 8:00a PT/12a ET/1700 CET         | See Full SIG Notes                                                                                      | [Git Repo](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)    | [Slack](https://openssf.slack.com/archives/C07LH7RH8MT)      |                                                                       |
| Scorecard                         | Automate analysis on the security posture of open source projects.    | Every 2 weeks, Thursday 1:00p PT/4:00p ET/2200 CET       | [Meeting Notes](https://docs.google.com/document/d/1b6d3CVJLsl7YnTE7ZaZQHdkdYIvuOQ8rzAmvVdypOWM/)       | [Git Repo](https://github.com/ossf/scorecard)                                                                        | [Slack](https://openssf.slack.com/archives/C0235AR8N2C)      |                                                                       |
| Web Developer Security Guidelines | Security guidelines specific to web developers                        | See Full SIG Notes                                       | See Full SIG Notes                                                                                      | [Git Repo](https://github.com/w3c-cg/swag)                                                              | [Slack](https://w3ccommunity.slack.com/archives/C079JKV32RX) |                                                       |

## Work Items, Outputs, Deliverables

We develop our material on GitHub and publish a rendered version of our guides on <https://best.openssf.org>.

We currently use the [Simplest Possible Process (SPP)](https://best.openssf.org/spp/Simplest-Possible-Process) for publishing.
Please see the [SPP documentation](https://best.openssf.org/spp/Simplest-Possible-Process) if you have questions about it.

### Best Practices Guides

Longer reference documents on implementing specific secure techniques

- [Compiler Annotations for C and C++ (incubating)](https://best.openssf.org/Compiler-Hardening-Guides/Compiler-Annotations-for-C-and-C++.html)
- [Compiler Options Hardening Guide for C and C++](https://best.openssf.org/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++)
- [Correctly Using Regular Expressions for Secure Input Validation](https://best.openssf.org/Correctly-Using-Regular-Expressions)
- [Cyber Resilience Act (CRA) Brief Guide for Open Source Software (OSS) Developers](https://best.openssf.org/CRA-Brief-Guide-for-OSS-Developers)
- [Existing Guidelines for Developing and Distributing Secure Software](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Existing%20Guidelines%20for%20Developing%20and%20Distributing%20Secure%20Software.md)
- [npm Best Practices Guide](https://github.com/ossf/package-manager-best-practices/blob/main/published/npm.md)
- [Package Manager Best Practices (archived)](https://github.com/ossf/package-manager-best-practices)
- [Secure Coding Guide for Python](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python)
- [Security Focused Guide for AI Code Assistant Instructions](https://best.openssf.org/Security-Focused-Guide-for-AI-Code-Assistant-Instructions)
- [Simplifying Software Component Updates](https://best.openssf.org/Simplifying-Software-Component-Updates)
- [Source Code Management Platform Configuration Best Practices](docs/SCM-BestPractices/README.md)
- [The Memory Safety Continuum](https://memorysafety.openssf.org/memory-safety-continuum)

### Concise Guides

Quick Guidance around Open Source Software Development Good Practices

- [Concise Guide for Developing More Secure Software](https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software)
- [Concise Guide for Evaluating Open Source Software](https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software)

### Education Material and Training Courses

The Education SIG provides industry standard secure software development training materials that will educate learners of all levels and backgrounds on how to create, compose, deploy, and maintain software securely using best practices in cyber and application security.

- [Developing Secure Software (LFD121)](https://openssf.org/training/courses/)
  - The [presentation "A Brief Introduction to Developing Secure Software"](https://docs.google.com/presentation/d/12b7Wm6KRp9kd1oV3QVrJpiCWVDexxF8doYZOFOfLy2Y/edit) summarizes its content
- [Security for Software Development Managers (LFD125)](https://training.linuxfoundation.org/training/security-for-software-development-managers-lfd125). We thank Intel for contributing the starting material for this course.
  - The [presentation from LFD125](https://docs.google.com/presentation/d/19lolYrumwUa7qHV65OW0IJ-oTpLV0l2KqEVGzjf0FSI/edit) is available if you want to propose changes or reuse it for special purposes (CC-BY-4.0)
- [Understanding the EU Cyber Resilience Act (CRA) (LFEL1001)](https://training.linuxfoundation.org/express-learning/understanding-the-eu-cyber-resilience-act-cra-lfel1001). Developed with the OpenSSF Global Cyber Policy WG.
  - The [presentation from LFEL1001](https://docs.google.com/presentation/d/1j3OlNz2k5rk9KRD8ZZz8xvsM_hyxqOioK4UUkJTWee8/edit) is available if you want to propose changes or reuse it for special purposes (CC-BY-4.0)
- [Secure AI/ML-Driven Software Development (LFEL1012)](https://training.linuxfoundation.org/express-learning/secure-ai-ml-driven-software-development-lfel1012), to be released 2025-10-16. Developed with the OpenSSF AI/ML WG.
  - The [presentation from LFEL1012](https://docs.google.com/presentation/d/1SONjRe6mdtqNuUqVE9s5kLC6tUwtuw-XTAG23MjXIFI/edit) is available if you want to propose changes or reuse it for special purposes (CC-BY-4.0)

### Related resources

- [A Brief Introduction to Developing Secure Software (short presentation)](https://docs.google.com/presentation/d/12b7Wm6KRp9kd1oV3QVrJpiCWVDexxF8doYZOFOfLy2Y/edit)

## Past Work

- [OpenSSF Security Baseline](https://github.com/ossf/security-baseline) - spun out
  - Baseline is now a part of the ORBIT Working Group
- [Interactive artwork](https://github.com/blabla1337/wg-best-practices-os-developers/tree/main/infinity2) - archived
  - A place where we want to guide developers in what stage they can use what type of tooling or approach. We have tons of great tools and materials but hard to find for devs, using this page and interactive loop we want to guide them to find the right stuff.
- [Great MFA Distribution Project](https://github.com/ossf/great-mfa-project) - completed
  - Distribute MFA tokens to OSS developers and best practices on how to easily use them
- [Recommended compiler option flags for C/C++ programs](https://docs.google.com/document/d/1SslnJuqbFUyTFnhzkhC_Q3PPGZ1zrG89COrS6LV6pz4/edit#heading=h.b3casmpemf1b) - spun out
  - This early draft inspired the group's work on the C/C++ Compiler Hardening Guide.
- [The Security Toolbelt](https://github.com/ossf/toolbelt) - currently on hold
  - Assemble a “sterling” collection of capabilities (**software frameworks, specifications, and human and automated processes**) that work together to **automatically list, scan, remediate, and secure the components flowing through the software supply chain** that come together as software is written, built, deployed, consumed, and maintained. Each piece of the collection will represent an **interoperable** link in that supply chain, enabling adaptation and integration into the major upstream language toolchains, developer environments, and CI/CD systems.

## Contributing

Contributions to all initiatives of the Working Group are highly welcome. Please see our [Contribution Guide](CONTRIBUTING.md) for more details.

## Translations

We are _delighted_ that some are willing to help us translate materials to other languages. Please ensure all pull requests that add or modify translations are labeled with its language.
Such pull requests (PRs) must be first reviewed and approved by a trusted translator.

See [translations](docs/translations) for specific details.

## Meeting Notes

We take notes for each meeting. Please see [Meeting Notes](meeting-minutes.md) for links to the documents.

## Governance

### Charter

The [CHARTER.md](CHARTER.md) outlines the scope and governance of our group activities. Like all OpenSSF working groups, this working group reports to the [OpenSSF Technical Advisory Council (TAC)](https://github.com/ossf/tac). For more organizational information, see the [OpenSSF Charter](https://openssf.org/about/charter/).

### Project Leads

- Co-chair - [Avishay Balter, Microsoft](https://github.com/balteravishay)
- Co-chair - [Georg Kunz, Ericsson](https://github.com/gkunz)
- "*" denotes a project/SIG lead

### Project Maintainers

- [Christopher "CRob" Robinson*, OpenSSF](https://github.com/SecurityCRob)
- [David A Wheeler, LF/OSSF](https://github.com/david-a-wheeler)
- [Dave Russo*, Red Hat](https://github.com/drusso-rh)
- [Georg Kunz, Ericsson](https://github.com/gkunz)
- [Avishay Balter, Microsoft](https://github.com/balteravishay)

### Project Collaborators

- [Christine Abernathy*, F5](https://github.com/caabernathy)
- [Daniel Applequist*, Snyk](https://github.com/Torgo)
- [Marta Rybczynska, Syslinbit](https://github.com/mrybczyn)
- [Thomas Nyman*, Ericsson](https://github.com/thomasnyman)
- Yotam Perkal, Rezilion
- [Chris de Almeida, IBM](https://github.com/ctcpip)
  
### Project Contributors

- [Arnaud J Le Hors, IBM](https://github.com/lehors)
- [Jeffrey Borek, IBM](https://github.com/jtborek)
- Ixchel Ruiz, jfrog
- Laurent Simon*, Google/Scorecard
- [Matt Rutkowski, IBM](https://github.com/mrutkows)
- Riccardo ten Cate, SKF
- Spyros Gasteratos*, OWASP/CRE
- [Glenn ten Cate*, OWASP/SKF](https://github.com/)
- [Jay White, Microsoft](https://github.com/camaleon2016)
- Jonathan Leitschuh*, Dan Kaminsky Fellowship @ Human Security
- [Judy Kelly, Red Hat](https://github.com/judyobrienie)
- [Roberth Strand, Amesto Fortytwo / Cloud Native Norway](https://github.com/roberthstrand)
- [Sal Kimmich, EscherCloud](https://github.com/salkimmich)
- [Helge Wehder, Ericsson](https://github.com/myteron)
- Noam Dotan, Legit Security
- [Eddie Knight, Sonatype](https://github.com/eddie-knight)
- [Randall T. Vasquez*, The Linux Foundation](https://github.com/ran-dall)

A listing of our current and past group [members](https://github.com/ossf/wg-best-practices-os-developers/blob/main/members.md).

## Licenses

Unless otherwise specifically noted, software released by this working group is released under the [Apache 2.0 license](LICENSES/Apache-2.0.txt), and documentation is released under the [CC-BY-4.0 license](LICENSES/CC-BY-4.0.txt). Formal specifications would be licensed under the [Community Specification License](https://github.com/CommunitySpecification/1.0)
(though at this time we don't have any examples of that).

## Antitrust Policy Notice

Linux Foundation meetings involve participation by industry competitors, and it is the intention of the Linux Foundation to conduct all of its activities in accordance with applicable antitrust and competition laws. It is therefore extremely important that attendees adhere to meeting agendas, and be aware of, and not participate in, any activities that are prohibited under applicable US state, federal or foreign antitrust and competition laws.

Examples of types of actions that are prohibited at Linux Foundation meetings and in connection with Linux Foundation activities are described in the Linux Foundation Antitrust Policy available at <http://www.linuxfoundation.org/antitrust-policy>. If you have questions about these matters, please contact your company counsel, or if you are a member of the Linux Foundation, feel free to contact Andrew Updegrove of the firm of Gesmer Updegrove LLP, which provides legal counsel to the Linux Foundation.
