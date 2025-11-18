# Technical Stack

## Build System & Tools

- **Package Manager**: npm
- **Linting & Formatting**:
  - Prettier for code formatting
  - markdownlint-cli for Markdown linting
  - GitHub Super-Linter for CI/CD validation

## Documentation Publishing

The project uses the **Simplest Possible Process (SPP)** for publishing documentation:

- **Static Site Generator**: Jekyll (GitHub Pages default)
- **Markdown Processor**: kramdown (default)
- **Template**: Minima (default Jekyll theme)
- **Hosting**: GitHub Pages at `best.openssf.org`
- **Format**: Markdown files in `docs/` directory are automatically published as static HTML

## Common Commands

```bash
# Format all files (Prettier + markdownlint)
npm run format

# Format with Prettier only
npx prettier --write .

# Lint and fix Markdown files
npx markdownlint --fix '**/*.md' --ignore node_modules
```

## Markdown Configuration

- Uses `.markdownlint.yml` for linting rules
- Disabled rules: MD013 (line-length), MD024 (duplicate headings), MD033 (inline HTML), MD036 (emphasis as heading)
- Inline HTML is allowed for complex layouts and images

## Licensing

- **Code**: Apache 2.0 License
- **Documentation**: CC-BY-4.0 License
- Files should include SPDX license identifiers

## Development Environment

- `.devcontainer/` configuration available for containerized development
- Git-based workflow with issues and pull requests
- CI/CD via GitHub Actions
