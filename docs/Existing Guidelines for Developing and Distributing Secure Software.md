# Existing Guidelines for Developing and Distributing Secure Software #

A product of the OpenSSF Best Practices Working Group

This document is a summary of various guidelines for developing and distributing secure software. Many summaries are quoted abstracts from the materials themselves. They are listed as “[marker] organization/author, name of document: description” so that this can be easily reused as a bibliography. We only list the current version of each document. Items are sorted to make them easier to find.

Note that many materials are focused on specific situations that may not apply to others. For example, some guidance materials are focused on developing software within large organizations, and in many cases on developing proprietary software; such materials can be challenging to apply to smaller projects and/or open source software projects. Similarly, materials for web applications may not always apply to other kinds of software.

## Guidance material not specific to a particular language or ecosystem ##
If you’re just starting out trying to make first steps in security of an open source software project, have it try to get an [OpenSSF CII Best Practices Badge](https://bestpractices.coreinfrastructure.org/), take the OpenSSF Secure Software Development Fundamentals course [OpenSSF SSDF 2021](https://openssf.org/edx-courses/), and work to improve their scorecard ranking. (Note: At the time of this writing, scorecard can only measure projects on GitHub, though we hope to fix that in the future.)

Note that [NIST 2020](https://csrc.nist.gov/publications/detail/white-paper/2020/04/23/mitigating-risk-of-software-vulnerabilities-with-ssdf/final) does a cross-examination of several materials and creates a set of best practices.

- [BSA] Business Software Alliance (BSA), The [BSA Framework for Secure Software: A New Approach to Securing the Software Lifecycle: A consolidated framework for assessing and encouraging security across the software lifecycle](https://www.bsa.org/files/reports/bsa_software_security_framework_web_final.pdf), “intended to focus on software products (including Software-as-a-Service) by considering both the process by which a software development organization develops and manages software products and the security capabilities of those products. It is intended to complement, rather than replace, guidance for organizational risk management processes.”
- [BSIMM] BSIMM, [Building Security In Maturity Model (BSIMM)](https://www.bsimm.com/): “A study of existing software security initiatives. By quantifying the practices of many different organizations, we can describe the common ground shared by many as well as the variations that make each unique.” This is less guidance and more a survey result, but it can be helpful to know what is common among the surveyed organizations.
- [Chess 2007] Chess, Brian, and Jacob West, Secure Programming with Static Analysis, 2007, Addison-Wesley. This book provides guidance on how to write secure software with topics such as handling input, buffer overflow, and errors and exceptions. It particularly focuses on applying static analysis tools.
- [CNCF] Cloud Native Computing Foundation (CNCF), [Software Supply Chain Best Practices](https://github.com/cncf/tag-security/blob/main/supply-chain-security/supply-chain-security-paper/CNCF_SSCP_v1.pdf): “This paper puts forth four key principles crucial to supply chain security: First, every step in a supply chain should be "trustworthy" as a result of a combination of cryptographic attestation and verification. … Second, automation is critical to supply chain security. … Third, the build environments used in a supply chain should be clearly defined, with limited scope. … Fourth, all entities operating in the supply chain environment must be required to mutually authenticate using hardened authentication mechanisms with regular key rotation.”
- [Graff 2003] Graff, Mark G., and Kenneth R. van Wyk, Secure Coding: Principles and Practices, 2003, O’Reilly. This brief book contains chapters on architecture; design; implementation; operations; and automation and testing.
- [Google SLSA 2021] Google et al, [Supply-chain Levels for Software Artifacts (SLSA)](https://github.com/slsa-framework/slsa), 2021: SLSA “(pronunced "salsa") is an open source security framework to describe and verify what integrity looks like, giving anyone working with software a common language and a way to work at scale.” Project website: https://slsa.dev/
- [Howard 2003] Howard, Michael, and David LeBlanc, Writing Secure Code, 2003, Second Edition, Microsoft Press. The book includes chapters on the introduction to security, secure coding techniques (the main part of the book; covers buffer overruns, access control, least privilege, cryptography, protecting secret data, validating input, internationalization), special topics (security testing, code review, software installation, privacy, general good practices, documentation and error messages).
- [ISC2] (ISC)2, edited by Mano Paul, Official (ISC)2 Guide to the CSSLP CBK, Second Edition, 2014, CRC Press. This book is intended for those preparing to receive the Certified Secure Software Lifecycle Professional (CSSLP) certification. The book is divided into the following domains: secure software concepts; secure software requirements; secure software design;secure software implementation/coding; secure software testing; software acceptance; software deployment, operations, maintenance, and disposal; and supply chain and software acquisition.
- [ISO/IEC 27034-1] [ISO/IEC, ISO/IEC 27034-1:2011](https://www.iso.org/standard/44378.html): International Organization for Standardization/International Electrotechnical Commission (ISO/IEC), Information technology – Security techniques – Application security – Part 1: Overview and concepts, ISO/IEC 27034-1:2011. “ISO/IEC 27034 provides guidance to assist organizations in integrating security into the processes used for managing their applications.” BEWARE: This document is not a publicly available standard; do not quote significant portions of it publicly, and do not make it available to the public, as that might violate copyright laws.
- [Microsoft SDL] Microsoft Security Development Lifecycle (SDL) practices (viewed July 2021). Other resources available.
- [NIST 800-160 vol1], NIST SP 800-160 Vol. 1, Systems Security Engineering: Considerations for a Multidisciplinary Approach in the Engineering of Trustworthy Secure Systems, 2018-03-21: Developing Cyber Resilient Systems: A Systems Security Engineering Approach “This publication addresses the engineering-driven perspective and actions necessary to develop more defensible and survivable systems, inclusive of the machine, physical, and human components that compose the systems and the capabilities and services delivered by those systems.”
- [NIST 800-160 vol2] NIST, [NIST SP 800-160 Vol. 2 Developing Cyber Resilient Systems: A Systems Security Engineering Approach](https://csrc.nist.gov/publications/detail/sp/800-160/vol-1/final): “[This] can be viewed as a handbook for achieving the identified cyber resiliency outcomes based on a systems engineering perspective on system life cycle processes in conjunction with risk management processes, allowing the experience and expertise of the organization to help determine what is correct for its purpose.”
- [NIST 800-181 rev1] NIST, [Workforce Frameworkfor Cybersecurity (NICE Framework)](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-181r1.pdf) 2020: introduces a model of doing security work including Tasks and the Knowledge and Skills needed to perform the work.
- [NIST 800-53 rev5] NIST, [Security and Privacy Controls for Information Systems and Organizations, revision 5](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf), 2020: This document “provides a catalog of security and privacy controls for information systems and organizations to protect organizational operations and assets, individuals, other organizations, and the Nation from a diverse set of threats and risks, including hostile attacks, human errors, natural disasters, structural failures, foreign intelligence entities, and privacy risks.” It is divided into the following parts: introduction, the fundamentals, the controls. The controls described are: access control; awareness and training; audit and accountability; assessment, authorisation and monitoring; configuration management; contingency planning; identification and authentication; incident response; maintenance; media protection; physical and environmental protection; planning; program management; personnel security; personally identifiable information processing and transparency; risk assessment; system and services acquisition; system and communications protection; system and information integrity; supply chain risk management.
- [NIST FRA v1.1] NIST, [Framework for Improving Critical Infrastructure Cybersecurity version 1.1](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.04162018.pdf), 2018: “The Framework focuses on using business drivers to guide cybersecurity activities and considering cybersecurity risks as part of the organization’s risk management processes. The Framework consists of three parts: the Framework Core, the Implementation Tiers, and the Framework Profiles. The Framework Core is a set of cybersecurity activities, outcomes, and informative references that are common across sectors and critical infrastructure. Elements of the Core provide detailed guidance for developing individual organizational Profiles. Through use of Profiles, the Framework will help an organization to align and prioritize its cybersecurity activities with its business/mission requirements, risk tolerances, and resources. The Tiers provide a mechanism for organizations to view and understand the characteristics of their approach to managing cybersecurity risk, which will help in prioritizing and achieving cybersecurity objectives.”
- [NIST 2020] NIST, [Mitigating the Risk of Software Vulnerabilities by Adopting a Secure Software Development Framework (SSDF)](https://csrc.nist.gov/publications/detail/white-paper/2020/04/23/mitigating-risk-of-software-vulnerabilities-with-ssdf/final), 2020: “This white paper recommends a core set of high-level secure software development practices called a secure software development framework (SSDF) to be integrated within each SDLC implementation.” It does this in part by doing a crosswalk of many guidance documents.
- [OpenSSF CII Best Practices Badge] [OpenSSF/CII, Core Infrastructure Initiative (CII) Best Practices Badge](https://bestpractices.coreinfrastructure.org): This is “a way for Free/Libre and Open Source Software (FLOSS) projects to show that they follow best practices. Projects can voluntarily self-certify, at no cost, by using this web application to explain how they follow each best practice… Consumers of the badge can quickly assess which FLOSS projects are following best practices and as a result are more likely to produce higher-quality secure software.” There are 3 badge levels: passing, silver, and gold. You can view the passing criteria or [all the criteria](https://bestpractices.coreinfrastructure.org/criteria). Many criteria have “[details](https://bestpractices.coreinfrastructure.org/criteria?details=true&rationale=true)” that provide suggestions on how to implement the criteria.
- [OpenSSF SSDF 2021] OpenSSF, [Secure Software Development Fundamentals](https://openssf.org/edx-courses/): “The Open Source Security Foundation (OpenSSF) has developed a trio of free courses on how to develop secure software. These courses are part of the Secure Software Development Fundamentals Professional Certificate program.  There’s a fee if you want to try to earn a certificate (to prove that you learned the material), but not for the courses themselves. All are available on the edX platform. The courses included in the program are: Secure Software Development: Requirements, Design, and Reuse (LFD104x); Secure Software Development: Implementation (LFD105x); [and] Secure Software Development: Verification and More Specialized Topics (LFD106x).” The [course materials are available in Markdown format on GitHub](https://github.com/ossf/secure-sw-dev-fundamentals) under the CC-BY license.
- [OWASP ASVS] OWASP, [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/): “The primary aim of the OWASP Application Security Verification Standard (ASVS) Project is to normalize the range in the coverage and level of rigor available in the market when it comes to performing Web application security verification using a commercially-workable open standard. The standard provides a basis for testing application technical security controls, as well as any technical security controls in the environment, that are relied on to protect against vulnerabilities such as Cross-Site Scripting (XSS) and SQL injection. This standard can be used to establish a level of confidence in the security of Web applications.” Note that it focuses on web applications, not on other kinds of software.
- [OWASP MASVS] OWASP, [OWASP Mobile Application Security Verification Standard (MASVS)](https://github.com/OWASP/owasp-masvs/), 2022: The OWASP Mobile Application Security Verification Standard (MASVS) is a standard that establishes the security requirements for mobile app security.
- [OWASP MSTG] OWASP, [OWASP Mobile Security Testing Guide (MSTG)](https://github.com/OWASP/owasp-mstg/), 2022: The OWASP Mobile Security Testing Guide (MSTG) is a comprehensive manual for mobile app security testing and reverse engineering. It describes technical processes for verifying the controls listed in the OWASP MASVS.
- [OWASP SAMM] OWASP, [Open SAMM  Software Assurance Maturity Model, v2.0](https://owasp.org/www-project-samm/), 2020: the model’s goal is to provide “an effective and measurable way for all types of organizations to analyze and improve their software security posture. OWASP SAMM supports the complete software lifecycle, including development and acquisition, and is technology and process agnostic. It is intentionally built to be evolutive and risk-driven in nature.” The model includes the following categories:
   - Governance
   - Design
   - Implementation
   - Verification
   - Operations

- [PCI 2021] Payment Card Industry(PCI) Standards Council, [Software Security Framework, Secure Software Requirements and Assessment Procedures, Version 1.1](https://www.pcisecuritystandards.org/document_library?category=sware_sec#results), 2021: BEWARE: This document is not a publicly available standard; it has a specific licence.
- [SAFECode 2018] SAFECode, [Fundamental Practices for Secure Software Development: Essential Elements of a Secure Development Lifecycle Program](https://safecode.org/wp-content/uploads/2018/03/SAFECode_Fundamental_Practices_for_Secure_Software_Development_March_2018.pdf), 2018: the guide includes elements of a Secure Development Lifecycle (SDL) including secure design, coding practices, managing third party components, testing and validation, security findings and their management, vulnerability response and disclosure. It also has a chapter on implementing the practices in an organization.
- [SAFECode 2012] SAFECode, [Practical Security Stories and Security Tasks for Agile Development Environments](http://safecode.org/publication/SAFECode_Agile_Dev_Security0712.pdf), 2012: gives examples of defining tasks related to secure coding in Agile environments.
- [Saltzer 1975] Saltzer, Jerome, and Michael Schroeder, [The Protection of Information in Computer Systems](https://www.cs.virginia.edu/~evans/cs551/saltzer/), 1975: The eight design principles listed in this paper are still widely cited and applied today. These are:
   - Economy of mechanism: Keep the design as simple and small as possible.
   - Fail-safe defaults: Base access decisions on permission rather than exclusion.
   - Complete mediation: Every access to every object must be checked for authority.
   - Open design: The design should not be secret.
   - Separation of privilege: Where feasible, a protection mechanism that requires two keys to unlock it is more robust and flexible than one that allows access to the presenter of only a single key.
   - Least privilege: Every program and every user of the system should operate using the least set of privileges necessary to complete the job.
   - Least common mechanism: Minimize the amount of mechanism common to more than one user and depended on by all users.
   - Psychological acceptability: It is essential that the human interface be designed for ease of use, so that users routinely and automatically apply the protection mechanisms correctly.

- [Wheeler 2015] Wheeler, David A., [Secure Programming HOWTO](https://dwheeler.com/secure-programs), 1999-2015, book available online.
- [Wheeler 2016] Wheeler, David A. and Henninger, Amy E. State-of-the-Art Resources (SOAR) for Software Vulnerability Detection, Test, and Evaluation 2016, Institute for Defense Analyses (Note: Ken Hongfong is not an author)
- [Viega 2002] Viega, John, and Gary McGraw, Building Secure Software, 2002, Addison-Wesley. This book includes a number of recommendations on securing software, including chapter 5, “guiding principles for software security” along with specific sections on topics such as buffer overflows and race conditions.
- [Zalewski 2012] Zalewski, Michal, The Tangled Web: A Guide to Securing Modern Web Applications, 2012, No Starch Press


## Guidance for specific languages or ecosystems ##

This list only includes guidance that includes or is focused on developing secure software not general coding style guidelines.

Some organizations provide several guidance documents, e.g., [SEI CERT Coding Standards and Google Style Guides](https://wiki.sei.cmu.edu/confluence/display/seccode).

### Apex and Visualforce ###

- [Salesforce] [Secure Coding Guidelines for Salesforce Lightning Platform](https://developer.salesforce.com/docs/atlas.en-us.secure_coding_guide.meta/secure_coding_guide/secure_coding_guidelines.htm)
- [Salesforce] [Apex Security and Sharing Guide](https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_security_sharing_chapter.htm)

### C and/or C++ ###

- [Seacord 2006] Seacord, Robert C., Secure Coding in C and C++, 2006, Addison-Wesley. See the more recent SEI material.
- [SEI C 2016] Software Engineering Institute (SEI), [SEI CERT C Coding Standard: Rules for Developing Safe, Reliable, and Secure Systems (2016 Edition)](https://resources.sei.cmu.edu/library/asset-view.cfm?assetID=454220), June 2016.
- [SEI C++] SEI, [SEI CERT C++ Coding Standard](https://resources.sei.cmu.edu/library/asset-view.cfm?assetID=494932). See also the online [in-progress update](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682).
- [Viega 2003] Viega, John, and Matt Messier, Secure Programming Cookbook for C and C++, 2003, O’Reilly.
- [Recommended GCC and clang option flags for compiling C/C++ programs](https://docs.google.com/document/d/1SslnJuqbFUyTFnhzkhC_Q3PPGZ1zrG89COrS6LV6pz4/edit#heading=h.b3casmpemf1b)
- [Fedora Project Defensive Coding Guide - The C Programming Language](https://docs.fedoraproject.org/en-US/defensive-coding/programming-languages/C/)
- [Fedora Project Defensive Coding Guide - The C++ Programming Language](https://docs.fedoraproject.org/en-US/defensive-coding/programming-languages/CXX/)

### Go ###

- [OWASP Go] OWASP, [OWASP Go Secure Coding Practices Guide](https://owasp.org/www-project-go-secure-coding-practices-guide/)
- [Fedora Project Defensive Coding Guide - The Go Programming Language](https://docs.fedoraproject.org/en-US/defensive-coding/programming-languages/Go/)

### Java ###

- [Seacord 2006] Seacord, Robert C., Secure Coding in C and C++, 2006, Addison-Wesley. See the more recent SEI material.
- [SEI C 2016] Software Engineering Institute (SEI), [SEI CERT C Coding Standard: Rules for Developing Safe, Reliable, and Secure Systems (2016 Edition)](https://resources.sei.cmu.edu/library/asset-view.cfm?assetID=454220), June 2016.
- [SEI C++] SEI, [SEI CERT C++ Coding Standard](https://resources.sei.cmu.edu/library/asset-view.cfm?assetID=494932). See also the online [in-progress update](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682).
- [Viega 2003] Viega, John, and Matt Messier, Secure Programming Cookbook for C and C++, 2003, O’Reilly.
- [Recommended GCC and clang option flags for compiling C/C++ programs](https://docs.google.com/document/d/1SslnJuqbFUyTFnhzkhC_Q3PPGZ1zrG89COrS6LV6pz4/edit#heading=h.b3casmpemf1b)
- [SEI Java] SEI, [SEI CERT Oracle Coding Standard for Java.](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)
- [Fedora Project Defensive Coding Guide - The Java Programming Language](https://docs.fedoraproject.org/en-US/defensive-coding/programming-languages/Java/)

### JavaScript ###

- [OWASP][OWASP NodeJS security cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security)>[eslint-plugin-security](https://www.npmjs.com/package/eslint-plugin-security)
- [eslint-plugin-security-node](https://www.npmjs.com/package/eslint-plugin-security-node)>[eslint-plugin-security-node](https://www.npmjs.com/package/eslint-plugin-security-node)

### Kubernetes ###
- Kubernetes team - [tutorials](https://kubernetes.io/docs/tutorials/)
- [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
- Learning Kubernetes basics ([Red Hat](https://www.redhat.com/en/topics/containers/learning-kubernetes-tutorial)) 
- Kubernetes team - [Securing a Cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/)
- IBM - Basics of Kubernetes Security [blog](https://developer.ibm.com/blogs/basics-of-kubernetes-security/)
- OWASP - Kubernetes Security [Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html)
- Red Hat - [What is DevSecOps?](https://www.redhat.com/en/topics/devops/what-is-devsecops)
- Synk - [Kubernetes Security: Common Issues and Best Practices](https://snyk.io/learn/kubernetes-security/)
- CISA & NSA - [Kubernetes Hardening Guidance](https://media.defense.gov/2021/Aug/03/2002820425/-1/-1/1/CTR_KUBERNETES%20HARDENING%20GUIDANCE.PDF)
- Kubernetes team - [tutorials](https://kubernetes.io/docs/tutorials/)
- [Introduction to Kubernetes (edX)](https://www.edx.org/course/introduction-kubernetes-linuxfoundationx-lfs158x#)
- Learning Kubernetes basics ([Red Hat](https://www.redhat.com/en/topics/containers/learning-kubernetes-tutorial))
- Kubernetes team - [Securing a Cluster](https://kubernetes.io/docs/tasks/administer-cluster/securing-a-cluster/)
- IBM - Basics of Kubernetes Security [blog](https://developer.ibm.com/blogs/basics-of-kubernetes-security/)
- OWASP - Kubernetes Security [Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Kubernetes_Security_Cheat_Sheet.html)
- Red Hat - [What is DevSecOps?](https://www.redhat.com/en/topics/devops/what-is-devsecops)
- Synk - [Kubernetes Security: Common Issues and Best Practices](https://snyk.io/learn/kubernetes-security/) 
- CISA & NSA - [Kubernetes Hardening Guidance](https://media.defense.gov/2021/Aug/03/2002820425/-1/-1/1/CTR_KUBERNETES%20HARDENING%20GUIDANCE.PDF) 


### Linux ###

- [KSP] [Kernel Self-Protection](https://www.kernel.org/doc/html/latest/security/self-protection.html) guidelines show techniques recommended to Linux kernel developers
- [Fedora Project Defensive Coding Guide - Shell Programming and bash](https://docs.fedoraproject.org/en-US/defensive-coding/programming-languages/Shell/)

### PHP ###

- [PHP Security manual](https://www.php.net/manual/en/security.php)
- [Survive The Deep End: PHP Security ](https://phpsecurity.readthedocs.io/en/latest/)
- [Symfony Framework](https://symfony.com/doc/current/security.html)
- [Laravel Framework](https://laravel.com/docs/5.6/validation)

### Python ###

- [Bandit](https://github.com/PyCQA/bandit), a tool to find common issues in Python programs
- [Python security best practices cheat sheet](https://snyk.io/blog/python-security-best-practices-cheat-sheet/)
- [Common Python security pitfalls](https://deepsource.io/blog/python-security-pitfalls/)
- [Pipenv](https://pipenv.pypa.io/en/latest/), a tool to manage dependencies securely
- [Pyre](https://pyre-check.org/) is a type checker for Python programs. On top of Pyre, [Pysa](https://pyre-check.org/docs/pysa-basics/) provides static analysis to help finding potential security vulnerabilities.
- [Pyup.io Safety] [Pyup.io Safety](https://github.com/pyupio/safety) checks Python dependencies for known security vulnerabilities.
- Bandit] [Bandit](https://github.com/PyCQA/bandit), a tool to find common issues in Python programs
- [Python BestPractices] [Python security best practices cheat sheet](https://snyk.io/blog/python-security-best-practices-cheat-sheet/)
- [Python pitfalls] [Common Python security pitfalls](https://deepsource.io/blog/python-security-pitfalls/)
- [Pipenv] [Pipenv](https://pipenv.pypa.io/en/latest/), a tool to manage dependencies securely
- [Pyre]  [Pyre](https://pyre-check.org/) is a type checker for Python programs. On top of Pyre, [Pysa](https://pyre-check.org/docs/pysa-basics/) provides static analysis to help finding potential security vulnerabilities.
- [Pyup.io Safety] [Pyup.io Safety](https://github.com/pyupio/safety) checks Python dependencies for known security vulnerabilities.
- [Fedora Project Defensive Coding Guide - The Phyton Programming Language](https://docs.fedoraproject.org/en-US/defensive-coding/programming-languages/Python/)

### Ruby / Rails ###

- [Rails][Rails] Rails project, [Securing Rails Applications](https://guides.rubyonrails.org/security.html): “This manual describes common security problems in web applications and how to avoid them with Rails [a widely-used web application framework].”

### Rust ###

- [Rust Secure Code Working Group ](https://github.com/rust-secure-code)
- [RustSec - advisories etc. for Rust](https://github.com/RustSec) ([Homepage](https://rustsec.org/)) ([Github action](https://github.com/marketplace/actions/rust-audit-check))

### Vala ###

- [Fedora Project Defensive Coding Guide - The Vala Programming Language](https://docs.fedoraproject.org/en-US/defensive-coding/programming-languages/Vala/)
[Fedora Project Defensive Coding Guide - The Vala Programming Language](https://docs.fedoraproject.org/en-US/defensive-coding/programming-languages/Vala/)
    

### Mobile applications

- [OWASP MASVS] OWASP, [OWASP Mobile Application Security Verification Standard (MASVS)](https://github.com/OWASP/owasp-masvs/)
- [OWASP MSTG] OWASP, [OWASP Mobile Security Testing Guide (MSTG)](https://github.com/OWASP/owasp-mstg/)

### Web applications ###

- [OWASP TG] OWASP, [OWASP Testing Guide v4.0](https://owasp.org/www-pdf-archive/OTGv4.pdf)

## Other materials ##

This section includes materials that cover cybersecurity, or security more broadly, but while they may briefly discuss it, they do not focus on developing or distributing secure software. That doesn’t mean they’re bad materials (far from it!), they’re just somewhat less focused on the issues this document is focusing on. That said, many are highly useful for providing broader and related context. Here are some of them.

- [Anderson 2020] Anderson, Ross, Security Engineering, 2020, Wiley. This book covers many broader security-related areas
- [Bishop 2019] Bishop, Matt. Computer Security: Art and Science, 2019, Addison-Wesley
- [Hoglund] Hoglund, Greg, and Gary McGraw, Exploiting Software: How to Break Code, Addison-Wesley
- http://www.devopsbookmarks.com/](http://www.devopsbookmarks.com/)
- [Schneier 2000] Schneier, Bruce, Secrets & Lies, 2000, Wiley
