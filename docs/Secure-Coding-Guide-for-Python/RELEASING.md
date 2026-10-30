# Releasing

PySCG releases are annotated git tags on `main`, published as GitHub Releases.
This process is manual today and designed to be automated later without changes
to the conventions below.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the versioning scheme and the rule ID
stability contract.

## Tag format

| Stage | Tag example | GitHub Release flag |
||-------||-------------||---------------------||
| alpha | `v1.1.0a1` | `--prerelease` |
| beta | `v1.1.0b1` | `--prerelease` |
| release candidate | `v1.1.0rc1` | `--prerelease` |
| final | `v1.1.0` | (none) → marked "Latest", IDs frozen |
| patch | `v1.1.1` | (none) |

Rules:

* Always use signed annotated tags (`git tag -s`).
* Never move or delete a final tag. Fix mistakes with a new PATCH release.
* Pre-release tags (`a` / `b` / `rc`) may be deleted if a stage is abandoned.

## Prepare notes

* During development, every content PR updates [whatsnew/unreleased.md](whatsnew/unreleased.md).
* When cutting a final release, rename `unreleased.md` to `whatsnew/<version>.md`,
  set the release date, then create a fresh empty `unreleased.md`.
* Add the new version to [whatsnew/index.md](whatsnew/index.md).

## Cut a pre-release (alpha / beta / rc)

```bash
git checkout main && git pull
VERSION="1.1.0a1"
TITLE="PySCG 1.1.0 alpha 1"
git tag -s "$TAG" -m "$TITLE"
git push origin "v$VERSION"
gh release create "v$VERSION" \
  --title  "$TITLE" \
  --notes-file whatsnew/unreleased.md \
  --prerelease
```

## Cut a final release

```bash
git checkout main && git pull
# rename unreleased.md -> whatsnew/1.1.0.md, set date, update index.md, commit via PR first
VERSION="1.1.0"
TITLE="PySCG $VERSION"
git tag -s "v$VERSION" -m "$TITLE"
git push origin "v$VERSION"
gh release create "v$VERSION" \
  --title "$TITLE" \
  --notes-file whatsnew/$VERSION.md
# no --prerelease: becomes "Latest", rule IDs now permanently frozen
```

## Future automation

A GitHub Action may later create the Release on tag push, deriving `--prerelease`
from the tag name (`a` / `b` / `rc` → pre-release; otherwise final). Keeping the
tag format and `whatsnew/` layout above makes that a drop-in addition.
