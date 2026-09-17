# README for Finding and Fixing Vulnerabilities Using AI

Edit [Finding.md](./Finding.md). When you're ready, generate the
subsections by running `split` in this directory.

The resulting files will be in `sections/`. `split` deletes and
regenerates that whole directory, so new chunk files show up as
untracked, not modified. Commit with `git add -A sections/` (not `-u`
or `git commit -a`), or a new file can end up linked from the TOC but
never actually committed, producing a broken link on the live site.

## Quiz content

Quiz questions for the eventual course go in the same document, using
this exact template:

```text
QUIZ

**Q1.** <question text>

A) <option>
B) <option>
C) <option>
D) <option>

**Answer:** B

ENDQUIZ
```

`split` turns this into a native, click-to-expand HTML widget (no
JavaScript) via `clean-finding.awk`, currently hidden entirely by the
`.quiz { display: none; }` rule in `template.html`. To reveal quizzes,
delete (or no-op) that one CSS rule; nothing else needs to change,
since the widget is already closed by default on its own.

Keep each quiz block entirely within one subsection; don't let it span
a heading, since `split` chunks pages at both H1 and H2 headings, and a
quiz straddling that boundary would end up broken across two pages.
