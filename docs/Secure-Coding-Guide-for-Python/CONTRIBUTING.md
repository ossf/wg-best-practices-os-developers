# Contributor Guide

This guide provides an overview of how you can help, the standards we adhere to, and the steps to get your contributions reviewed for the subpages in [wg-best-practices-os-developers/docs/Secure-Coding-Guide-for-Python/](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python/).

## Code of Conduct

Please read and adhere to our [Code of Conduct](https://github.com/ossf/wg-best-practices-os-developers/blob/main/code-of-conduct.md). We are committed to creating a welcoming and inclusive environment for all contributors.

## Getting Started

1. __Fork the repository:__ Click the "Fork" button at the top of this page to create a copy of the repository under your GitHub account.

2. __Clone your fork:__ Use the following command to clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-username/repo-name.git
    ```

3. Set up the development environment with a Python environment >= `3.9` and a `Markdown` reader.

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

## Target Audience

Target audience is new designers, security researchers and anyone teaching secure coding.

### New designers

This resource provides a baseline of knowledge for self-study while learning Python. It also helps free up experienced team members by standardizing training on common secure coding practices.

### Security Researchers

The noncompliantXX.py code examples are designed to allow throwing analysis tools at them. The code is split into a 'defend' and 'attack' section via:

```py
...
#####################
# Trying to exploiting above code example
#####################
...
```

The attack section is not suitable for automated analysis and would need to be stripped or ignored.

The `compliantXX.py` code examples are not suitable for automated analysis as they address only one issue or CWE, they do NOT supply end to end secure code.

The overview table listing the most prominent CVEs allows to gain understanding of CVSS rating and blind spots in relation to EPSS frequency ratings. There is plenty that can be improved on this subject.

### Teaching secure coding

Although not specifically designed as a teaching resource, the material provided can be effectively used in educational settings.

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

## Documentation Style

* Bottom Line Up Front (BLUF), conclusion is in the first sentence of a rule
* Keep It Small and Simple (KISS)
* Working code examples
* Academic in wording whilst aiming for low word count.
* No fluff, "in software security it is important to be aware of ...."
* Use imperative "do x and y to ensure z" instead of vague wording "might want to, could be a good idea..."
* bibliography, follow the Harvard reference guide

A template for a rule is available here: [README_TEMPLATE.md](templates/README_TEMPLATE.md) with inline documentation on each section.

Each rule should have:

* At least one `noncompliant01.py` demonstrating an antipattern.
* At least one `compliant01.py` providing a fix for the issue demonstrated in `noncompliant01.py`.
* Be within 20 lines of code per file.

## Structure Guide

### From a reader perspective

The guide is structured in two levels. The top level readme is to list all rules whilst also providing an idea of:

* Chapter
* Related risks
* Available automated detection
* Available automated correction

The sublevel has an a individual rule with a single CWE where possible.

> [!NOTE]
> We are aware that CWEs are not designed as 'read throughs'. Their numbering is not designed to become a step by step guide. The [Introduction to Multithreading and Multiprocessing](Intro_to_multiprocessing_and_multithreading/readme.md) in Python is an example where we had to provide an alternative layout with three levels. Eventually we will have to shuffle the individual rules into a more suitable sequence.
> Same CWE number with different titles will also have to be fixed at some stage.

### From a author perspective

* Top-level folders are Pillars `CWE-1000` such as `CWE-707`
* Second-level folders are either a CWE of Base, Variant, or Class type representing one rule such as `CWE-89`
* If multiple rules match a single CWE such as `CWE-197` we create another subfolder with a two-digit number starting at `01`
since `00` is in the main folder.
* Rules without a matching CWE are stored in an incrementing placeholder `XXX-000`, `XXX-001`.
* Rules matching multiple CWEs to use the best matching one as a folder and list it at the top of its reference list

Example structure with mocked up data:

```bash
./README.md
./licenses/MIT.txt
./licenses/CC-BY-4.0.txt

./Concepts/Multithreading_Multiprocessing.md

# Top level using Pillar CWE-707:
./CWE-707/README.md

# Second level representing a Rule is either a CWE of type Base, Variant or Class:
./CWE-664/CWE-197/README.md
./CWE-664/CWE-197/compliant01.py
./CWE-664/CWE-197/example01.py
./CWE-664/CWE-197/noncompliant01.py

# Multiple rules matching one CWE of type Base, Variant or Class:
./CWE-664/CWE-197/01/README.md
./CWE-664/CWE-197/01/compliant01.py
./CWE-664/CWE-197/01/noncompliant01.py

# Rule matching no CWE of type Base, Variant, or Class:
./CWE-707/XXX-000/README.md
./CWE-707/XXX-000/noncompliant01.py
./CWE-707/XXX-000/compliant01.py

./CWE-707/XXX-001/README.md
./CWE-707/XXX-001/noncompliant01.py
./CWE-707/XXX-001/compliant01.py

# Rule matching multiple CWEs of type Base, Variant or Class:
./CWE-707/CWE-117/README.md
./CWE-707/CWE-117/compliant01.py
./CWE-707/CWE-117/noncompliant01.py
```

## Coding Examples

Idealistically we have a `noncompliantXX.py` code matching in number the `XX` number of a `compliantXX.py` example with minimal changes between the two. The noncompliant and compliant code example's are also expected to contain the defensive code at the top while having the attacker code after the "#attempting to exploit" comment. Any code examples that do not qualify as compliant or noncompliant are named `exampleXX.py`.

To avoid running into linters or lighting up the programming IDE of others ensure to have the following installed:

* `Ruff` with enabled `flake8-bandit` plugin
* `GitHub` `Markdown` linter such as `markdownlint` (this is enforced via GitHub action) * `Python` type hints.

Linter warnings should be kept to a minimum.

Keep code examples as short while using simple Python, it's not about showing off python programming skills and must be kept accessible to beginners.

There is the option to add `# TODO:` instead of overloading compliant code examples with all aspects of an end to end secure solution.

## Submitting Your Contribution

1. __Create a new branch:__ Use descriptive names for branches, e.g., `pySCG-issue-123` or  `pySCG-add-logging-feature` using `git checkout -b branch-name`

2. __Make your changes:__ Commit your changes with clear and concise commit messages.

3. __Push your changes:__ Push your branch to your forked repository.
`git push origin branch-name`

4. __Submit a pull request:__ Go to the original repository and click on "New Pull Request". Fill out the template provided, detailing your changes and their purpose.

## Review Process

A Pull Request is expected to have approval of at least 2 reviewers. One reviewer must be part of the core team for this Python project. The second can be anyone feeling brave enough who has a GitHub account.

Once you submit a pull request:

* A project maintainer will review your submission.
* You may be asked to make revisions based on feedback.
* Once approved, your changes will be merged into the main branch.
