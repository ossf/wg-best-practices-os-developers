# Contributor Guide

This guide provides an overview of how you can help, the standards we adhere to, and the steps to get your contributions reviewed for the subpages in [wg-best-practices-os-developers/docs/Secure-Coding-Guide-for-Python/](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python/).

## Mission Statement

The goal is to provide a learning resource for secure coding in `Python` that is as comprehensive as those available for `Java`, `C`, `C++`, or `Go`.

Similar to Python itself, the learning shall be as fun as possible by providing:

* Working code examples
* Usable in a local coding programming IDE or online either CLI or web.
* Independence of any specific web framework or module.
* Documentation free of bias towards a single commercial vendor of security tooling
* Short concise and way below 40+ hours of other secure coding resources for a full study.
* Overview table of rule vs risk rating.
* Evidence based approach on risk rating.

Join us to explore how this resource can become an indispensable part of your secure coding toolkit

## Getting Started

1. __Fork the repository:__ Click the "Fork" button at the top of this page to create a copy of the repository under your GitHub account.

2. __Clone your fork:__ Use the following command to clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/repo-name.git
    ```

3. Set up the development environment with a Python environment >= `3.9` and a `Markdown` reader.

## Target Audience

Target audience are new designers, security researchers, machines and anyone teaching secure coding.

### New designers

This resource provides a baseline of knowledge for self-study while learning Python. It also helps free up experienced team members by standardizing training on common secure coding practices.

### Security Researchers

The overview table listing the most prominent CVEs allows to gain understanding of CVSS rating and blind spots in relation to EPSS frequency ratings.

### Machines

Ai's, LLMS, and secure code analysis tool can either be trained or tested with the code examples.

The `noncompliantXX.py` code examples are designed to allow throwing analysis tools at them. The code is split into a 'defend' and 'attack' section via:

```py
...
#####################
# Trying to exploiting above code example
#####################
...
```

The attack section is not suitable for automated analysis and would need to be stripped or ignored. Language based solutions must also rename the `noncompliantXX.py` and strip all comments to avoid language based bias.

The `compliantXX.py` code examples are not suitable for automated analysis as they address only one issue, they do NOT supply end to end secure code!

### Teaching secure coding

Provided content is designed for self learning, the open source license invites anyone using it as part of their own teaching.

## How to Contribute

We welcome contributions in many forms—whether it’s fixing a bug or typo, improving the readability of the guide, adding a new code example, or creating entirely new pages to cover missing material. Before you start, please check for existing issues.

Become part of the reviewers for upcoming pull requests (PRs) by joining slack and our bi-weekly meetings.

Steps to join #secure-coding-guide-for-python slack channel as per [Beginner to builder steps](https://openssf.org/blog/2025/08/08/from-beginner-to-builder-understanding-openssf-community-and-working-groups/):

1) Request access [https://slack.openssf.org/](https://slack.openssf.org/)
2) in the search bar at the top: `/join secure-coding-guide-for-python`

Become part of organizing bigger changes via our bi-weekly online meeting, see details in:

* [Meeting Notes](https://docs.google.com/document/d/1u1gJMtOz-P5Z71B-vKKigzTbIDIS-bUNgNIcfnW4r-k)

It is helpful to know:

* Why we do this, as explained in our mission statement.
* Our documentation style
* Code standards, Python and Markdown linters and such
* Folder, file layout and naming conventions

## Code of Conduct

Please read and adhere to our [Code of Conduct](https://github.com/ossf/wg-best-practices-os-developers/blob/main/code-of-conduct.md). We are committed to creating a welcoming and inclusive environment for all contributors.

## Documentation Style

* Bottom Line Up Front (BLUF), conclusion is in the first sentence of a rule
* Keep It Small and Simple (KISS)
* Working code examples
* Academic in wording whilst aiming for low word count.
* No fluff, "in software security it is important to be aware of ...."
* Use imperative "do x and y to ensure z" instead of vague wording "might want to, could be a good idea..."
* Rule titles are in Title Case (start uppercase unless its a conjunction; "to" or "for")
* Rule IDs are lowercase (pyscg-0040)
* Bibliography, follow the Harvard reference guide

A template for a rule is available here: [README_TEMPLATE.md](templates/README_TEMPLATE.md) with inline documentation on each section.

## Structure Guide, from a reader perspective

The psycg guide structure starts below `docs/Secure-Coding-Guide-for-Python` with the its main [readme.md](readme.md) showing the learning path in its main table.
Folder on this level represent a Section such as "Introduction" in `01_introduction`.

The pyscg main [readme.md](readme.md) is expected to contain:

* Section such as "01 Introduction"
* Rules in that section such as "pyscg-0040"
* Rule related base or class level CWE
* Rule relted single representitive CVE with CVSS and EPSS rating
* Automated detection
* Automated correction

## Structure Guide, from a author perspective

The sublevel from a section, such as `01_introduction`, has individual folders per rule such as `pyscg-0040`.
A section, such as `01_introduction`, may contain a `readme.md` outlining knowledge that spans across all rules in that section.
Each rule folder, such as `pyscg-0040`, is expected to have:

* Only one `README.md` file
* At least one `noncompliant01.py` demonstrating an antipattern.
* At least one `compliant01.py` providing a reasonable solution.
* Optional `example01.py` or `example01.sh` code or `image01.png`

A code example should be around 20 lines and only demonstrate countermeasures for the discussed issue. The writer can indicated requirements for a wider range of issues by leaving a comment `# TODO: verify xyz...`. Rules without working code examples might be required must be avoided.

Example structure with mocked up data below `docs/Secure-Coding-Guide-for-Python/`:

```bash
# pyscg main readme:
./readme.md

# license file copies:
./licenses/MIT.txt
./licenses/CC-BY-4.0.txt

# template folder:
./templates/compliant01.py
./templates/example01.py
./templates/noncompliant01.py
./templates/README_TEMPLATE.md

# section with its own readme.md, example01.py code and rule pyscg-0040 and pyscg-0041 below that:
./01_introduction/readme.md
./01_introduction/example01.py
./01_introduction/pyscg-0040/README.md
./01_introduction/pyscg-0040/example01.py
./01_introduction/pyscg-0040/noncompliant01.py
./01_introduction/pyscg-0040/compliant01.py
./01_introduction/pyscg-0041/README.md
./01_introduction/pyscg-0041/example01.py
./01_introduction/pyscg-0041/noncompliant01.py
./01_introduction/pyscg-0041/compliant01.py

```

### Rule Titles

Titles should be:

* Positive
* Action-oriented guideline statements
* APA Title Case style [[APA 2022](https://apastyle.apa.org/style-grammar-guidelines/capitalization/title-case)]

Using a negative form only when it reads more naturally.

### Coding Examples

Idealistically we have a `noncompliantXX.py` code matching in number the `XX` number of a `compliantXX.py` example with minimal changes between the two. The noncompliant and compliant code example's are also expected to contain the defensive code at the top while having the attacker code after the "#attempting to exploit" comment. Any code examples that do not qualify as compliant or noncompliant are named `exampleXX.py`.

To avoid running into linters or lighting up the programming IDE of others ensure to have the following installed:

* `Ruff` with enabled `flake8-bandit` plugin
* `GitHub` `Markdown` linter such as `markdownlint` (this is enforced via GitHub action) * `Python` type hints.

Linter warnings should be kept to a minimum.

Keep code examples as short while using simple Python, it's not about showing off python programming skills and must be kept accessible to beginners.

There is the option to add `# TODO:` instead of overloading compliant code examples with all aspects of an end to end secure solution.

### Submitting Your Contribution

1. __Create a new branch:__ Use descriptive names for branches, e.g., `pyscg-issue-123` or  `pyscg-add-logging-feature` using `git checkout -b branch-name`

2. __Make your changes:__ Commit your changes with clear and concise commit messages.

3. __Push your changes:__ Push your branch to your forked repository.
`git push origin branch-name`

4. __Submit a pull request:__ Go to the original repository and click on "New Pull Request". Fill out the template provided, detailing your changes and their purpose.

### Review Process

A Pull Request is expected to have approval of at least 2 reviewers. One reviewer must be part of the core team for this Python project. The second can be anyone feeling brave enough who has a GitHub account.

Once you submit a pull request:

* A project maintainer will review your submission.
* You may be asked to make revisions based on feedback.
* Once approved, your changes will be merged into the main branch.
