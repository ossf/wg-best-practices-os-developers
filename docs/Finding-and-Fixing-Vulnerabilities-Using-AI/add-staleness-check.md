# Adding a CI staleness check for `sections/`

`sections/` is generated from `Finding.md` by running `split`. Nothing
enforces that someone actually reran `split` before committing, so
`sections/` can drift out of sync with `Finding.md`. Here's how to add
a CI check that catches that, without changing how the site is built
or published.

This is the simple approach: it checks that committed output matches
`split`'s output, but `split` still only runs on a contributor's
machine, not as part of building the site. See "Alternative" below
for the bigger change that actually runs `split` as part of the
website build.

## Steps

1. Add a new job (or a new workflow file, e.g.
   `.github/workflows/check-finding-sections.yml`) that:
   - Triggers on `pull_request` (and optionally `push`) for changes
     under `docs/Finding-and-Fixing-Vulnerabilities-Using-AI/**`.
   - Checks out the repo.
   - Installs `pandoc` and `perl` (`perl` is preinstalled on
     `ubuntu-latest`; pandoc isn't, e.g.
     `sudo apt-get install -y pandoc` or `r-lib/actions/setup-pandoc`).
   - Runs `./split` from
     `docs/Finding-and-Fixing-Vulnerabilities-Using-AI/`.
   - Runs `git diff --exit-code -- sections/` in that directory. A
     nonzero exit means `sections/` doesn't match what `split`
     produces from the committed `Finding.md`, so fail the job.

2. Scope the trigger path so this job doesn't run (and doesn't
   need pandoc) on unrelated PRs.

3. In the failure message or step name, tell the contributor to run
   `split` locally and commit the result. Point at this directory's
   `README.md`.

## Why this doesn't touch site generation

GitHub Pages here builds `docs/` as a classic Jekyll site (no
Actions-based deploy workflow); it never runs `split` itself. This
check only verifies, in CI, that the `sections/*.html` files already
committed to git are what `split` would currently produce. It adds a
gate on PRs; it doesn't change what gets built or deployed.

## Alternative: run `split` as part of the actual site build

The bigger change: stop relying on GitHub's classic (Settings →
Pages → "Deploy from a branch") Jekyll build, and switch the repo to
build and deploy Pages via a GitHub Actions workflow that runs
`split` and then Jekyll, in order, every time. Roughly:

1. In repo Settings → Pages, change the source from "Deploy from a
   branch" to "GitHub Actions".
2. Add a workflow (e.g. `.github/workflows/pages.yml`) that:
   - Installs `pandoc` and Ruby/Bundler.
   - Runs `split` in
     `docs/Finding-and-Fixing-Vulnerabilities-Using-AI/` to
     (re)generate `sections/`.
   - Runs `actions/jekyll-build-pages` (or `bundle exec jekyll
     build`) on `docs/` to build the full site, now including the
     freshly generated `sections/`.
   - Uses `actions/upload-pages-artifact` and
     `actions/deploy-pages` to publish the result.
3. Remove `sections/` from git (add it to `.gitignore`) since it's
   now generated at deploy time instead of committed.

This is worth doing if `Finding.md` changes often enough that the
staleness check above becomes annoying, or if you want other
generated content in the site later. It's more work and more risk
than the staleness check: it takes over deploying the *entire* site
(not just this directory), so any bug in the new workflow (bad
pandoc/Jekyll version, wrong working directory, a failed step) can
break the whole site, not just this guide. Test it on a fork or a
non-`main` branch's Pages deployment before switching the real one
over.

## Not doing either

Skipping both means relying on contributors remembering to run
`split` before committing, per this directory's `README.md`. That's
fine for now given how rarely `Finding.md` changes; revisit if
staleness becomes a real problem.
