# Project Structure

## Repository Organization

This repository follows a documentation-centric structure with multiple sub-projects and working groups.

## Top-Level Directories

- **`docs/`**: Primary documentation directory, published to `best.openssf.org` via GitHub Pages
  - Contains all guides, best practices documents, and educational materials
  - Subdirectories for specific topics (Compiler-Hardening-Guides, SCM-BestPractices, Secure-Coding-Guide-for-Python, etc.)
  - `docs/index.md` serves as the main landing page
  - `docs/_config.yml` configures Jekyll for GitHub Pages
  - `docs/_includes/` contains reusable Jekyll templates

- **`minutes/`**: Meeting minutes organized by year (2021, 2022, 2023, etc.)

- **`presentations/`**: Conference presentations and slide decks

- **`img/`**: Images and graphics used across documentation

- **`infinity2/`**: Interactive artwork project (HTML/CSS/JS) for guiding developers to tools

- **`LICENSES/`**: License text files (Apache-2.0, CC-BY-4.0, MIT)

- **`.github/`**: GitHub-specific configurations (workflows, actions)

- **`.devcontainer/`**: Development container configuration

- **`.kiro/`**: Kiro AI assistant configuration and steering rules

## Key Files

- **`README.md`**: Main repository documentation, mission, scope, and working group information
- **`CHARTER.md`**: Technical charter defining governance, roles, and processes
- **`SECURITY.md`**: Security policy and vulnerability reporting
- **`code-of-conduct.md`**: Community code of conduct
- **`members.md`**: Working group member listing
- **`meeting-minutes.md`**: Historic meeting notes
- **`package.json`**: npm configuration with formatting scripts

## Documentation Conventions

- All documentation is written in Markdown
- Guides are stored in `docs/` and organized by topic in subdirectories
- Use relative links between documents
- Follow the Simplest Possible Process (SPP) for publishing
- Include front matter for Jekyll when needed
- Inline HTML is acceptable for complex layouts

## Contribution Workflow

- Issues tracked in GitHub Issues
- Pull requests for all changes
- Use the SPP process for document publication
- Follow the Contributor Covenant Code of Conduct 2.0
- Sign-off required (Developer Certificate of Origin)
