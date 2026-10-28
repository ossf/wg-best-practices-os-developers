# Unreleased

Draft staging area for the next release. Rule IDs listed here are __provisional__
and may change until a final release freezes them.

Add an entry under the relevant heading in every content PR. Link the source
issue or PR where applicable (source repo: `ossf/wg-best-practices-os-developers`).

## Added rules

_None yet._

## Renamed / revised

* pyscg-0009 — revised code examples; added compliant02.py (04_neutralization) ([#1053](https://github.com/ossf/wg-best-practices-os-developers/issues/1053))
* pyscg-0020 — added compliant02.py / noncompliant02.py, RFC-compliant audit log example (06_logging) ([#1064](https://github.com/ossf/wg-best-practices-os-developers/issues/1064), [#1079](https://github.com/ossf/wg-best-practices-os-developers/pull/1079))
* pyscg-0021 — added missing code examples compliant01.py / noncompliant01.py (06_logging) ([#1062](https://github.com/ossf/wg-best-practices-os-developers/issues/1062))
* pyscg-0027 — revised to recommend `with` when using locks (07_concurrency)
* pyscg-0042 — revised code examples to demonstrate operator-precedence side effects (01_introduction) ([#992](https://github.com/ossf/wg-best-practices-os-developers/issues/992))
* pyscg-0052 — added compliant02.py, state-related code examples (05_exception_handling) ([#1042](https://github.com/ossf/wg-best-practices-os-developers/issues/1042))
* pyscg-0015 — added length parameter to `os.read` example (05_exception_handling)
* pyscg-0002 — revised (03_numbers)
* pyscg-0010 — fixed xkcd CC 2.5 reference (04_neutralization)
* pyscg-0029 — revised (07_concurrency)

## Withdrawn / deprecated

_None yet._

## Other changes

* Reworded introduction and code example explanations.
* Added versioning scheme, branch model, and rule ID stability contract to CONTRIBUTING.md.
* Added RELEASING.md and whatsnew/ changelog.
* Typo, reference, and markdown linter fixes ([#1150](https://github.com/ossf/wg-best-practices-os-developers/pull/1150)).
