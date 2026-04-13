# Concise Guide for Collaborating with Open Source Projects

_by the [Open Source Security Foundation (OpenSSF)](https://openssf.org) [Best Practices Working Group](https://best.openssf.org/), work in progress_

## Why This Guide Exists: The Impact of the Cyber Resilience Act

As the [Cyber Resilience Act (CRA)](https://eur-lex.europa.eu/eli/reg/2024/2847/oj/eng) enters into full force, commercial users of open source software face a new landscape of cybersecurity obligations. Complying with these regulations will inevitably require commercial developers to interact directly with open source maintainers - often for the first time.

For example, these two obligations of commercial software vendors ("Manufacturers" in CRA terms) defined in the CRA will necessitate interaction:

* **Security Due Diligence** ([CRA, article 13 (5)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202402847#art_13)): Commercial users must now assess the security of the open source components they use. This process will uncover security issues — both real and perceived — triggering the need to report findings to the project maintainers. This due diligence is both a step that must be performed when an OSS component is being evaluated, and also when such dependencies are updated. [OSPS Baseline](https://baseline.openssf.org/) can be a useful as a set of criteria to incorporate into such a due diligence process. Also note: this is distinct from any licence due diligence that you may already be performing.

* **Sharing of Security Fixes** ([CRA, article 13 (6)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202402847#art_13)): The CRA mandates that manufacturers share security fixes with the upstream open source projects.
While increased corporate involvement is vital for the long-term sustainability of the open source ecosystem, it carries a risk of friction. Most commercial developers are accustomed to a "consumer" relationship with software, managed through procurement departments, contracts, and service-level agreements.

Open source operates on a fundamentally different set of social norms and implicit best practices. When commercial teams attempt to engage with maintainers using a corporate mindset, miscommunication and frustration often follow. Even ambitious, well-intentioned efforts to improve a project’s security posture can backfire if the contributor is unfamiliar with the project's culture.

This guide aims to bridge that gap, helping commercial developers navigate these interactions effectively.

## Scope and Purpose of this guide

Drawing from established industry research on open source collaboration, this guide compiles a concise checklist of essential behaviors for organizations and developers. It is designed to cover the fundamental requirements for new contributors, acting as both a practical manual for immediate compliance and a gateway to more extensive educational resources.

## Recommendations

The following recommendations are structured along the lifecycle of a typical engagement.

### Open Source Projects and the CRA

Open Source projects are collaborative communities that each have their own way of operating.
More importantly, projects do not bear responsibility for performing any specific tasks that an individual or organization may want, including providing cyber security compliance information.

When engaging with open source projects, don't expect having any CRA-related conversations _by default_.
Project maintainers don’t have to do anything at all because of the CRA, if they're maintaining an open source project without commercial monetization or placing products on the EU market. Which applies to _almost all_ open source projects. The CRA does not impose obligations on individual open source developers or volunteer maintainers merely for publishing or maintaining code. However, maintainers _may voluntarily choose_ to implement widely accepted security best practices that align with modern secure development expectations and may assist downstream users who integrate your software into regulated products.

### Prepare by understanding how the project works

* **Read the project's security policy:** Following a project's security policy for any disclosures is crucial. Unwarranted or accidental public vulnerability disclosures must be avoided.
* **Read the project’s contribution guide:** Locate and carefully study files named CONTRIBUTING.md or similar documentation, as these outline the specific technical and procedural standards required for patches. Ignoring these instructions is often viewed as disrespectful and is the most common reason for contributions being ignored or rejected.
* **Determine the project's copyright policy:** Projects may use a DCO (Developer Certifiacte of Origin) or a CLA (Contributor License Agreement) to manage the copyright of the contributed code. Contributors must ensure that they indeed have the copyright as well as the permission to contribute code. In particular CLAs often require signing by a company representative and cannot be signed by developers on behalf of the company.
* **Review the code of conduct**: Familiarize yourself with the project's Code of Conduct to understand the behavioral expectations and social norms of that specific community. Unlike a corporate environment governed by HR policies, open source projects relies on these documents to maintain a healthy collaboration space, and violating them can lead to immediate exclusion.
* **Read through the project’s issue tracker to learn about related (past) discussions:** Before raising a new issue, perform a thorough search of closed tickets and pull requests to see if the topic has already been addressed or debated. This demonstrates respect for the maintainers' time and prevents you from potentially re-igniting settled arguments or reporting known duplicates.
* **Find out how the project members communicate: GitHub issues, Slack, IRC, …:** Identify the preferred channels for different types of interaction, as many projects separate general support questions (often on Discord, Slack, or mailing lists) from technical bug tracking. Using the correct medium ensures your message reaches the right audience without cluttering the project's development workflow.

### Start participating

* **Initiate a discussion by opening an issue:** Depending on the contirbution policy of the project and the complexity of contribution, the best approach to initiate a contribution is open an issue rather than contributing via Pull Request / Merge Request / Change right away, in particular for non-trivial contributions.
* **Describe why your contribution is important to you and the project:** In issues and PRs, always clearly articulate the problem your contribution solves, linking your specific commercial use case (such as a security vulnerability) to the broader benefit for the project's user base. Maintainers are more likely to accept changes when they understand the context and see how the improvement strengthens the software for everyone, not just for your organization.
* **Make your motivations transparent and disclose your affiliation:** Openly state your employer and the reason for your involvement, such as compliance with the Cyber Resilience Act or internal security requirements. Transparency builds trust within the community, preventing suspicions of hidden agendas and helping maintainers understand the resources and constraints backing the contribution.
* **Describe the design of your contribution and be willing to modify it based on feedback:** Provide a high-level summary of your technical approach alongside the code to help maintainers assess how well it fits the project's existing architecture. Be prepared to iterate on your solution. Viewing code review as a collaborative design process rather than a gatekeeping hurdle is essential for getting your changes merged.
* **Always show respectful behavior:** Approach every interaction with patience and courtesy, recognizing that maintainers are often volunteers with limited time and competing priorities. Avoid demanding language or imposing corporate deadlines, as professional empathy is the most effective tool for fostering long-term cooperation and avoiding friction.

### End participation

* **Wrapping up after the contribution landed:** If the contribution is of limited scope and there is no intention for a longer-term engagement with the project, clearly wrap up once the contribution has landed: regonize the support of the maintainers and close remaining open issues, such as bug reports or feature requests.
* **End long-term participation gracefully by communicating early and wrapping up:**  In case of ending a longer-term engagement, for instance due to a change in internal priorities, inform the maintainers immediately rather than simply abandoning open pull requests or discussions ("ghosting"). Make an effort to either finalize outstanding work or clearly document the state of your contribution, ensuring you do not leave the community with the burden of deciphering or maintaining unfinished code.

## Navigating common pitfalls

It is valuable for new open source contributors to be aware of common pitfalls to avoid misunderstandings and resulting friction and frustration among contributors and project maintainers.
This section outlines situations that frequently arise and provides guidance on how to resolve them.

### Release Management and Cadence

After contributing a fix for a particular issue, such as a bug or a security vulnerability, product teams frequently request that a new release incorporating their fix be published shortly after the contribution has been merged. This urgency is driven by the desire to update the open source component in their product as soon as possible, and is further heightened by the CRA-mandated obligation for manufacturers to resolve vulnerabilities within specific deadlines.

However, open source projects follow very diverse release patterns. Some projects do not create releases at all, while others only publish releases from the main branch. Very few projects issue dedicated bugfix releases or maintain stable branches, as supporting maintenance branches for older releases represents a significant burden and is therefore only practiced by the largest and most well-resourced projects, such as the Linux kernel. Most commonly, projects follow a regular release cadence with intervals of weeks or months between releases.

Larger communities, such as the CNCF, are cognizant of the need to recommend [common release practices across their projects](https://github.com/cncf/toc/issues/1849).

#### Possible Solutions

The decision to create a release remains solely at the discretion of the project maintainers. Rather than requesting an expedited release, contributors should consider the following approaches:

* Support the project maintainers in preparing the next scheduled release, for instance by running test suites and verifying release candidates.
* Contribute improvements to the project's test coverage, thereby helping to increase the maintainers' confidence in releasing more frequently.
* Accept the responsibility of maintaining a temporary public fork, or a corresponding branch within the project's repository, until the fix is included in an official release.

### Disagreements about the direction of a project

Contributions from commercial organizations are sometimes rejected by project maintainers. A maintainer may disagree with the technical approach, consider the change out of scope for the project, or determine that it introduces unwanted complexity or maintenance burden. This situation creates particular tension when the contributor feels compelled by the CRA or internal pressure to get a fix merged, while the maintainer declines for legitimate technical or architectural reasons.

It is essential to recognize that maintainers have the final say over the direction of their project. Open source projects are not vendors, and maintainers are under no obligation to accept any contribution, regardless of the contributor's regulatory or business needs. Pressuring maintainers to accept changes that primarily serve commercial interests, or attempting to steer a project's roadmap to align with corporate goals, undermines the trust and collaborative spirit on which open source depends. Even when a contribution addresses a genuine security concern, the maintainer's judgment about how — or whether — to address it within their project must be respected.

#### Possible Solutions

When a contribution is rejected, contributors should consider the following approaches rather than escalating pressure on the maintainers:

* Engage constructively with the maintainer's feedback to understand the reasons for the rejection and explore whether an alternative approach could address both the project's concerns and your requirements.
* Accept the responsibility of maintaining a public fork that incorporates your changes. A fork is a legitimate and well-established mechanism in open source for pursuing a different direction without imposing on the original project.
* Re-evaluate whether the specific open source component is still the best fit for your product, considering the divergence in priorities between your organization's needs and the project's direction.

## References

More information is available

* [Participating in Open Source Communities](https://todogroup.org/resources/guides/participating-in-open-source-communities/), guide, TODO Group
* [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/), guide, GitHub
* [Start Contributing to Open Source](https://contribute.cncf.io/contributors/getting-started/), guide, CNCF
* [Security Hygiene Guide for Project Maintainers](https://contribute.cncf.io/projects/best-practices/security/security-hygiene/), guide, CNCF
* [Governance](https://contribute.cncf.io/projects/best-practices/governance/), guide, CNCF
* [HowTo: Make a Contributing Guide](https://contribute.cncf.io/projects/best-practices/templates/contributing/), guide, CNCF

## List of additional content to cover in this guide

These are ideas + a make-shift backlog

### Scenarios

* bumping versions of dependencies
  * manual effort
  * add automation (e.g., dependabot)
  * support reviewing and testing version bumps
  * unless CI is robust, it might be major load to test any change
* unresolved CVEs
* implementing test cases
  * security-focused test cases
* adding additional tools
  * causes additional overhead of dealing with the output
  * @balteravishay: yes, but: Avoid "Drive-by" Tooling by not adding any CI tools, linters, or bots without maintainer buy-in. Proposing automation should be a conversation, not a surprise PR.

## Contributors

This guide is a collaborative effort of the OpenSSF community. The following people have contributed to this guide (in alphabetical order):

* TBD
