# Best Practices for Open Source Developers

[![GitHub Super-Linter](https://github.com/ossf/wg-best-practices-os-developers/workflows/Lint%20Code%20Base/badge.svg)](https://github.com/marketplace/actions/super-linter)

Anyone is welcome to join our open discussions related to the group's mission and charter.

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
-- Create a “Secure from the (open) source” expert podcast to showcase the work across the foundation.
-- As new guides/best practices are launched, we will create blogs and a conference presentation to raise awareness about it.
-- Amplify talks and artifacts created by other groups within the foundation
-- Create 3 EvilTux artifacts each quarter
- Create express learning classes for our body of work: working group explainer, SCM BP Guide, C/C++ Guide, Scorecard/Badges, Concise Guides
- Create a “Best Practices Member Badge” for member organizations
- Support and promote our sub-projects with contributions and feedback - Scorecard, BP Badges, OpenSSF - SkillFoundry, Classes, and Guides, Secure Software Guiding Principles (SSGP)
- Create a Memory Safety W3C-style workshop to assemble development leaders to talk about how to integrate memory safe languages and techniques more deeply into the oss ecosystem.
- Expand DEI AMA Office Hours to more broadly engage new-to-oss individuals and provide a forum for mentorship and guidance as they launch into and grow within their careers.
- Identify, curate, produce, and deliver new secure development education such as Developer Manager Training, Implementing/Integrating OSSF tools such as Scorecard, Badges, OSV, OpenVEX, etc), advanced secure development techniques, and more.
- Evangelize and embed all of our guides across OpenSSF Technical Initiatives and understand what makes sense to integrate into Scorecard

## Help build a community

- Program to attract open source contributors and incentivize them to use and contribute to the inventory

Supply a Learning platform
-Any free course can be integrated into the platform

- The learner can follow a track, track their progress and get badges
- A suite of exercises are available for each best practice of the inventory

## Current Work

We welcome contributions, suggestions and updates to our projects. To contribute please fill in an [issue](https://github.com/ossf/wg-best-practices-os-developers/issues) or create a [pull request](https://github.com/ossf/wg-best-practices-os-developers/pulls).

We typically use the [Simplest Possible Process (SPP)](https://best.openssf.org/spp/Simplest-Possible-Process) to publish and maintain the documents we publish; see the [SPP documentation](https://best.openssf.org/spp/Simplest-Possible-Process) if you have questions about it.

Our work is organized into several discrete-yet-related projects that help us achieve our goals:

| Effort                  |     Description           |       Git Repo        | Slack Channel | Mailing List |
| ------------------      | ------------------------  |  -------------------  |  -----------  |  ----------  |
| Best Practices Guides   | Longer reference documents on implementing specific secure techniques   | - [Compiler Annotations for C and C++ (incubating)](https://best.openssf.org/Compiler-Hardening-Guides/Compiler-Annotations-for-C-and-C++.html), </p> - [Compiler Options Hardening Guide for C and C++](https://best.openssf.org/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++), </p> - [Existing Guidelines for Developing and Distributing Secure Software](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Existing%20Guidelines%20for%20Developing%20and%20Distributing%20Secure%20Software.md), </p> - [Package Manager Best Practices (incubating)](https://github.com/ossf/package-manager-best-practices), </p> - [npm Best Practices Guide](https://github.com/ossf/package-manager-best-practices/blob/main/published/npm.md), </p> - [Source Code Management Platform Configuration Best Practices](docs/SCM-BestPractices/README.md) | [SCM Slack](https://openssf.slack.com/archives/C058EC1EZ5Y) |
|  Concise Guides SIGs   |  Quick Guidance around Open Source Software Develpment Good Practices | - [Concise Guide for Developing More Secure Software](https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software), </p> - [Concise Guide for Evaluating Open Source Software](https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software) |  | [Mailing List](https://lists.openssf.org/g/openssf-wg-best-practices) |
| Education SIG - (incubating) | To provide industry standard secure software development training materials that will educate learners of all levels and backgrounds on how to create, compose, deploy, and maintain software securely using best practices in cyber and application security. | [EDU.SIG](https://github.com/ossf/education/)  | [stream-01-security-education](https://openssf.slack.com/archives/C03FW3YGXH9)  |  [Mailing List](https://lists.openssf.org/g/openssf-sig-education)  |
|[OpenSSF Best Practices Badge - formerly CII Best Practices badge](https://www.bestpractices.dev/) | Identifies FLOSS best practices & implements a badging system for those practices, | | |
| OpenSSF Scorecard Project  | Automate analysis and trust decisions on the security posture of open source projects |[Scorecard Repo](https://github.com/ossf/scorecard) | [security_scorecards](https://openssf.slack.com/archives/C0235AR8N2C) | |
| [Secure Software Development Fundamentals - online course](https://openssf.org/training/courses/)  |Teach software developers fundamentals of developing secure software  | [GitHub](https://github.com/ossf/secure-sw-dev-fundamentals) | | |
| Memory Safety SIG | The Memory Safety SIG is a group working within the OpenSSF's Best Practices Working Group formed to advance and deliver upon The OpenSSF's Mobilization Plan - Stream 4.   |[Git Repo](https://github.com/ossf/Memory-Safety) | [Slack](https://openssf.slack.com/archives/C03G8NZH58R) | [Mailing List](https://lists.openssf.org/g/openssf-sig-memory-safety) |
|  The Security Toolbelt | Assemble a “sterling” collection of capabilities (**software frameworks, specifications, and human and automated processes**) that work together to **automatically list, scan, remediate, and secure the components flowing through the software supply chain** that come together as software is written, built, deployed, consumed, and maintained. Each piece of the collection will represent an **interoperable** link in that supply chain, enabling adaptation and integration into the major upstream language toolchains, developer environments, and CI/CD systems. | [Security Toolbelt](https://github.com/ossf/toolbelt) | [security-toolbelt](https://openssf.slack.com/archives/C057BN7K19B) | [Mailing List](Openssf-sig-sterling-toolchain@lists.openssf.org) |
| [SKF - Security Knowledge Framework](https://www.securityknowledgeframework.org/) |  Learn to integrate security by design in your web application  | | |

## Related resources

- [A Brief Introduction to Developing Secure Software (short presentation)](https://docs.google.com/presentation/d/1GzLX4CYr4HtXrNF6wyO11hzz9EgwriKhnbvVZ9-LG2E/edit)

## Past Work/Greatest Hits

- _Interactive artwork_ - (incubating) <https://github.com/blabla1337/wg-best-practices-os-developers/tree/main/infinity2>
  - Place where we want to guide developers in what stage they can use what type of tooling or approach. We have tons of great tools and materials but hard to find for devs, using this page and interactive loop we want to guide them to find the right stuff.
- _Great MFA Distribution Project_ - (archived) <https://github.com/ossf/great-mfa-project>
  - Distribute MFA tokens to OSS developers and best practices on how to easily use them
- [Recommended compiler option flags for C/C++ programs](https://docs.google.com/document/d/1SslnJuqbFUyTFnhzkhC_Q3PPGZ1zrG89COrS6LV6pz4/edit#heading=h.b3casmpemf1b).

## Related Activities

There are many great projects both within and outside the Foundation that compliment and intersect our work here. Some other great projects/resources to explore:

- _SLSA Supply-chain Levels for Software Artifacts_ - <https://github.com/slsa-framework/slsa>
  - Purpose - A security framework from source to service, giving anyone working with software a common language for increasing levels of software security and supply chain integrity

## Quick Start

### Areas that need contributions

- Any topics related to helping developers more easily make more secure software or consumers to better understand the security qualities of the software they wish to ingest

### Where to file issues

- Issues can be reviewed and filed [here](https://github.com/ossf/wg-best-practices-os-developers/issues)

## Get Involved

Anyone is welcome to join our open discussions related to the group's mission and charter.

- [2024 Meeting Notes](https://docs.google.com/document/d/1JY8FREBPCUUFpuv7-4B9EjeS2MLDpel0dbG5DFWrTns/)
- [2023 Meeting Notes](https://docs.google.com/document/d/1UClGUnOSkOH_wab6Lx43KUdkaK37L8sbWJ_GPZvc1YY/edit?usp=sharing)
- [2022 Meeting Minutes](https://docs.google.com/document/d/159RLmTvW-G6DqDOw3ya-7RI5KNNd1yHxQ5XP0D9OB4o/edit?usp=sharing)
- [Historic Group Notes 1](https://github.com/ossf/wg-best-practices-oss-developers/blob/main/meeting-minutes.md)
- [Historic Notes 2021](https://docs.google.com/document/d/1Fw6EIk47_rUFmi6m7jYObFofcD6gj1FK-QgGC8YuUr0/edit?usp=sharing)
- [Recent WG report to the TAC on activities and project statuses](https://docs.google.com/presentation/d/1BPSYzk9J33Xl08uekuDBlgJjhiJIMt5B_eBvZ9PetIo/edit?pli=1#slide=id.g24e2f2581b2_0_147)
- [Discussions](https://github.com/ossf/wg-best-practices-os-developers/discussions)
- Official communications occur on the Best Practices [mailing list](https://lists.openssf.org/g/openssf-wg-best-practices)
- [Manage your subscriptions to Open SSF mailing lists](https://lists.openssf.org/g/main/subgroups)
- Join the conversation on [Slack](https://openssf.slack.com/archives/C01AHCRP8BT)

## Meeting Times

Every 2 weeks, Tuesday 10am EST. The meeting invite is available on the [public OSSF calendar](https://calendar.google.com/calendar?cid=czYzdm9lZmhwNWk5cGZsdGI1cTY3bmdwZXNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ)

| Effort       |    Meeting Times                                         |    Meeting Notes/Agenda    |       Git Repo        | Slack Channel | Mailing List |
| :----------: | :------------------------------------------------------: | :------------------------: | :-------------------: | :-----------: | :----------: |
|   Full WG    | Every 2nd Tuesday 7:00a PT/10:00a ET/1400 UTC   | [Meeting Notes](https://docs.google.com/document/d/1UClGUnOSkOH_wab6Lx43KUdkaK37L8sbWJ_GPZvc1YY/edit?usp=sharing)           |  [Git Repo](https://github.com/ossf/wg-best-practices-os-developers) | [Slack](https://openssf.slack.com/archives/C01AHCRP8BT) | [Mailing List](https://lists.openssf.org/g/openssf-wg-best-practices) |
| Concise Guides - C/C++ Compiler Hardening Options | Occurs every 2nd Wednesday 6:00a PT/9:00a ET/1400 UTC | [Meeting Notes](https://docs.google.com/document/d/1UClGUnOSkOH_wab6Lx43KUdkaK37L8sbWJ_GPZvc1YY/edit?usp=sharing)           |  [Git Repo](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Compiler_Hardening_Guides/Compiler-Options-Hardening-Guide-for-C-and-C%2B%2B.md) | [Slack](https://openssf.slack.com/archives/C01AHCRP8BT) | [Mailing List](https://lists.openssf.org/g/openssf-wg-best-practices) | [Mailing List](https://lists.openssf.org/g/openssf-wg-best-practices) |
| Concise Guides - Source Code Management Best Practices | Occurs every 2nd Thursday 7:00a PT/10:00a ET/1400 UTC  | [Meeting Notes](https://docs.google.com/document/d/1UClGUnOSkOH_wab6Lx43KUdkaK37L8sbWJ_GPZvc1YY/edit?usp=sharing)           |  [Git Repo](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/SCM-BestPractices) | [Slack](https://openssf.slack.com/archives/C01AHCRP8BT) | [Mailing List](https://lists.openssf.org/g/openssf-wg-best-practices) | [Mailing List](https://lists.openssf.org/g/openssf-wg-best-practices) |
|   EDU.SIG   | Occurs every 2nd Wednesday 6:00a PT/9:00a ET/1400 UTC   | [Meeting Notes](https://docs.google.com/document/d/1NPk5HZLfSMLpUsqaqVcbUSmSR66gS8WoJmEqfsCwrrE/edit#heading=h.yi1fmphbeqoj)                       |  [Git Repo](https://github.com/ossf/education) | [Slack](https://openssf.slack.com/archives/C03FW3YGXH9) | [Mailing List](https://lists.openssf.org/g/openssf-sig-education) |
|   EDU.SIG - DEI Subcommittee  | Occurs every 2nd Tuesday 8:00a PT/11:00a ET/1600 UTC   | [Meeting Notes](https://docs.google.com/document/d/1LdQ07veOcJ596Vo3aQZCFy-HHeEO7cHnbE_6u_uq9Fk/edit#)                       |  [Git Repo](https://github.com/ossf/education) | [Slack](https://openssf.slack.com/archives/C04FMD5HSC9) | [Mailing List](https://lists.openssf.org/g/openssf-sig-education-dei) |
|  Memory Safety SIG   | Every 2nd Thursday 10:00a PT/1:00p ET/1500 UTC           | [Meeting Notes](https://docs.google.com/document/d/1KgWw0co9xvUfCqQYW6Qei2lii2Fl-t-L7gYkAZBYDWg/edit?usp=sharing)                       |  [Git Repo](https://github.com/ossf/Memory-Safety) | [Slack](https://openssf.slack.com/archives/C03G8NZH58R) | [Mailing List](https://lists.openssf.org/g/openssf-sig-memory-safety) |
|  Scorecard  | Occurs every 2nd Thursday 1:00p PT/4:00p ET/1800 UTC    | [Meeting Notes](https://docs.google.com/document/d/1b6d3CVJLsl7YnTE7ZaZQHdkdYIvuOQ8rzAmvVdypOWM/edit?usp=sharing)           |  [Git Repo](https://github.com/ossf/scorecard) | [Slack](https://openssf.slack.com/archives/C0235AR8N2C ) | Mailing List |
|  Security Knowledge Framework -  SKF  | TBD   | Meeting Notes           |  Git Repo | [Slack](https://openssf.slack.com/archives/C04B7EZLTM1) | Mailing List |
|  The Security Toolbelt  | Every Tuesday Noon/12pm ET  | [Meeting Notes](https://docs.google.com/document/d/1H3Nk0PwmylLg5F7pqrIvyKzTyXAll0-f50B7DdqOh4A/edit#heading=h.a615m7qzeitc)           |  [Git Repo](https://github.com/ossf/toolbelt) | [Slack](https://openssf.slack.com/archives/C057BN7K19B) | [Mailing List](Openssf-sig-sterling-toolchain@lists.openssf.org) |

## Meeting Notes

Meeting notes are maintained in a Google Doc found in the above table. If attending please add your name, and if a returning attendee, please change the color of your name from gray to black.

## Governance

The [CHARTER.md](CHARTER.md) outlines the scope and governance of our group activities.

- Lead - [Christopher "CRob" Robinson](https://github.com/SecurityCRob)
- Co-Lead - [Randall T. Vasquez*, The Linux Foundation](https://github.com/ran-dall)
- Backlog Warden -
- "*" denotes a project/SIG lead

### Project Maintainers

- [Christopher "CRob" Robinson*, Intel](https://github.com/SecurityCRob)
- [David A Wheeler, LF/OSSF](https://github.com/david-a-wheeler)
- [Dave Russo*, Red Hat](https://github.com/drusso-rh)
- [Randall T. Vasquez*, The Linux Foundation](https://github.com/ran-dall)

### Project Collaborators

- [Arnaud J Le Hors, IBM](https://github.com/lehors)
- Avishay Balter, Microsoft
- [Christine Abernathy*, F5](https://github.com/caabernathy)
- [Daniel Applequist*, Snyk](https://github.com/Torgo)
- [Georg Kunz, Ericsson](https://github.com/gkunz)
- [Glenn ten Cate*, OWASP/SKF](https://github.com/)
- [Jay White, Microsoft](https://github.com/camaleon2016)
- Jonathan Leitschuh*, Dan Kaminsky Fellowship @ Human Security
- [Judy Kelly, Red Hat](https://github.com/judyobrienie)
- [Marta Rybczynska, Syslinbit](https://github.com/mrybczyn)
- Noam Dotan, Legit Security
- [Roberth Strand, Amesto Fortytwo / Cloud Native Norway](https://github.com/roberthstrand)
- [Sal Kimmich, EscherCloud](https://github.com/salkimmich)
- [Thomas Nyman*, Ericsson](https://github.com/thomasnyman)
- Yotam Perkal, Rezilion

### Project Contributors

- [Chris de Almeida, IBM](https://github.com/ctcpip)
- [Jeffrey Borek, IBM](https://github.com/jtborek)
- Ixchel Ruiz, jfrog
- Laurent Simon*, Google/Scorecard
- [Matt Rutkowski, IBM](https://github.com/mrutkows)
- Riccardo ten Cate, SKF
- Spyros Gasteratos*, OWASP/CRE

### Toolbelt Collaborators

- [Andrea Frittoli, IBM](https://github.com/afrittoli)
- [Arnaud Le Hors, IBM](https://github.com/lehors)
- [Behan Webster, The Linux Foundation](https://github.com/)
- [Brandon Mitchell, IBM](https://github.com/sudo-bmitch)
- [Brian Behlendorf, The Linux Foundation](https://github.com/)
- [Brian Wagner, IBM](https://github.com/wags007)
- [Christopher "CRob" Robinson, Intel](https://github.com/SecurityCRob)
- [Daniel Appelquist, Samsung](https://github.com/Torgo)
- [David A Wheeler, LF/OSSF](https://github.com/david-a-wheeler)
- [Georg Kunz, Ericsson](https://github.com/)
- [Jacques Chester, independent](https://github.com/jchester)
- [Jay White, Microsoft](https://github.com/camaleon2016)
- [Jeff Borek, IBM](https://github.com/jtborek)
- [Jon Meadows, Citi](https://github.com/)
- [Josh Clements, Analog Devices](https://github.com/)
- [Joshua Lock, Verizon](https://github.com/)
- [Kris Borchers, independent](https://github.com/)
- [Marcela Melara, Intel](https://github.com/marcelamelara)
- [Matt Rutkowski, IBM](https://github.com/mrutkows)
- [Melba Lopez, IBM](https://github.com/)
- [Michael Leiberman, Kusari](https://github.com/mlieberman85)
- [Phil Estes, AWS](https://github.com/estesp)
- [Ryan Ware, Intel](https://github.com/ware)
- [Sal Kimmich, EscherCloud AI](https://github.com/salkimmich)
- [Sarah Evans, Dell](https://github.com/sevansdell)
- [Steve Taylor, Deployhub/Ortelius/Pyrsia](https://github.com/)
- [Tom Hennen, Google](https://github.com/TomHennen)
- [Tracy Ragan, Deployhub/Ortelius/CDEvents](https://github.com/)

A listing of our current and past group [members](https://github.com/ossf/wg-best-practices-os-developers/blob/main/members.md).

## Licenses

Unless otherwise specifically noted, software released by this working
group is released under the [Apache 2.0 license](LICENSES/Apache-2.0.txt),
and documentation is released under the
[CC-BY-4.0 license](LICENSES/CC-BY-4.0.txt).
Formal specifications would be licensed under the
[Community Specification License](https://github.com/CommunitySpecification/1.0)
(though at this time we don't have any examples of that).

## Charter

Like all OpenSSF working groups, this working group reports to the
[OpenSSF Technical Advisory Council (TAC)](https://github.com/ossf/tac).
For more organizational information, see the
[OpenSSF Charter](https://openssf.org/about/charter/).

## Antitrust Policy Notice

Linux Foundation meetings involve participation by industry competitors, and it is the intention of the Linux Foundation to conduct all of its activities in accordance with applicable antitrust and competition laws. It is therefore extremely important that attendees adhere to meeting agendas, and be aware of, and not participate in, any activities that are prohibited under applicable US state, federal or foreign antitrust and competition laws.

Examples of types of actions that are prohibited at Linux Foundation meetings and in connection with Linux Foundation activities are described in the Linux Foundation Antitrust Policy available at <http://www.linuxfoundation.org/antitrust-policy>. If you have questions about these matters, please contact your company counsel, or if you are a member of the Linux Foundation, feel free to contact Andrew Updegrove of the firm of Gesmer Updegrove LLP, which provides legal counsel to the Linux Foundation.
