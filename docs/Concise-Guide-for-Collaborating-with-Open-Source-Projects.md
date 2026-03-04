# Concise Guide for Collaborating with Open Source Projects

_by the [Open Source Security Foundation (OpenSSF)](https://openssf.org) [Best Practices Working Group](https://best.openssf.org/), work in progress_

## Why This Guide Exists: The Impact of the Cyber Resilience Act

As the Cyber Resilience Act (CRA) comes into full force, commercial users of open source software face a new landscape of cybersecurity obligations. Complying with these regulations will inevitably require commercial developers to interact directly with open source maintainers - often for the first time.

For example, these two obligations of commercial software vendors ("Manufacturers" in CRA terms) defined in the CRA will necessitate interaction:

* **Security Due Diligence** ([CRA, article 13 (5)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202402847#art_13)): Commercial users must now assess the security of the open source components they use. This process will uncover security issues — both real and perceived — triggering the need to report findings to the project maintainers. This due diligence is both a step that must be performed when an OSS component is being evaluated, and also when such dependencies are updated. [OSPS Baseline](https://baseline.openssf.org/) can be a useful as a set of criteria to incorporate into such a due diligence process. Also note: this is distinct from any licence due diligence that you may already be performing.

* **Sharing of Security Fixes** ([CRA, article 13 (6)](https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=OJ:L_202402847#art_13)): The CRA mandates that manufacturers share security fixes with the upstream open source projects.
While increased corporate involvement is vital for the long-term sustainability of the open source ecosystem, it carries a risk of friction. Most commercial developers are accustomed to a "consumer" relationship with software, managed through procurement departments, contracts, and service-level agreements.

Open source operates on a fundamentally different set of social norms and implicit best practices. When commercial teams attempt to engage with maintainers using a corporate mindset, miscommunication and frustration often follow. Even ambitious, well-intentioned efforts to improve a project’s security posture can backfire if the contributor is unfamiliar with the project's culture.

This guide aims to bridge that gap, helping commercial developers navigate these interactions effectively.

## Scope and Purpose of this guide

Drawing from established industry research on open source collaboration, this guide compiles a concise checklist of essential behaviors for organizations and developers. It is designed to cover the fundamental requirements for new contributors, acting as both a practical manual for immediate compliance and a gateway to more extensive educational resources.
When engaging with open source projects, don't expect having any CRA-related conversations *by default*. 
Project maintainers don’t have to do anything at all because of the CRA, if they're maintaining an open source project without commercial monetization or placing products on the EU market. Which applies to *almost all* open source projects. The CRA does not impose obligations on individual open source developers or volunteer maintainers merely for publishing or maintaining code. However, maintainers *may voluntarily choose* to implement widely accepted security best practices that align with modern secure development expectations and may assist downstream users who integrate your software into regulated products.
## Recommendations

The following recommendations are structured along the lifecycle of a typical engagement.

### Prepare by understanding how the project works

* **Read the project's security policy:** Following a project's security policy for any disclosures is crucial. Unwarranted or accidental public vulnerability disclosures must be avoided.
* **Read the project’s contribution guide:** Locate and carefully study files named CONTRIBUTING.md or similar documentation, as these outline the specific technical and procedural standards required for patches. Ignoring these instructions is often viewed as disrespectful and is the most common reason for contributions being ignored or rejected.
* **Determine the project's copyright policy:** Projects may use a DCO (Developer Certifiacte of Origin) or a CLA (Contributor License Agreement) to manage the copyright of the contributed code. Contributors must ensure that they indeed have the copyright as well as the permission to contirbute code. In particular CLAs often require signing by a company representative and cannot be signed by developers on behalf of the company.
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

* **TBD:** once done, ie contirbution merged or problem fixed, regonize the support and wrap up your work.
* **End participation gracefully by communicating early and wrapping up:**  If your internal priorities change or you are reassigned, inform the maintainers immediately rather than simply abandoning open pull requests or discussions ("ghosting"). Make an effort to either finalize outstanding work or clearly document the state of your contribution, ensuring you do not leave the community with the burden of deciphering or maintaining unfinished code.

## References

More information is available

* [Participating in Open Source Communities](https://todogroup.org/resources/guides/participating-in-open-source-communities/), guide, TODO Group
* [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/), guide, GitHub

## List of additional content to cover in this guide

These are ideas + a make-shift backlog

### Challenges

#### Release Mnagement and Cadence

* how to deal with new releases: often teams desire a new release which includes a bug fix, but the project does not necessarily cut a release after a bug fix / vuln fix

@tuminoid: Release cadence is surely one area leading to friction with CRA. Not everyone does releases at all, some do releases from main only, release branches have
serious maintenance burden etc. CNCF has open initiative on releases guidance too.

#### Disagreements on the direction of a project

* @tuminoid: Should we also describe scenarios where the project maintainer disagrees and says no? This is common for corporate contributions, and creates tension, especially if contributor feels compelled by the CRA or internal pressure to get the fix in, and the maintainer disagrees for whatever reason?

* @balteravishay: not sure if this should be it's own section, or part of showing respectful behaviour, but would add a note about respecting maintainer autonomy &
project direction by avoiding pressuring maintainers to accept changes that serve only commercial interests or attempting to steer a project's roadmap to align with corporate goals.

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
