# README for Finding and Fixing Vulnerabilities Using AI

## How to update the content

Update [Finding.md](./Finding.md).
Currently, this is done by updating the corresponding Google document
and running save as markdown. Eventually we expect the markdown will be
the final version.

Then run `cleanup-markdown` in this directory after downloading/exporting
`Finding.md` from Google Docs and before committing it.
It fixes Google Docs export artifacts that would otherwise trip up
markdownlint (see `clean-finding.awk`) and rewrites `Finding.md` in
place. It's idempotent, so running it again later (or on an
already-clean `Finding.md`) is a no-op.

## How to regenerate pages

When you're ready (`Finding.md` updated and cleaned), generate the
site's HTML by running `gen-html` in this directory.

The `gen-html` script assumes
`Finding.md` is already clean (a committed one always is; run
`cleanup-markdown` first otherwise), and generates new `*.html` chunk
files directly in this directory (no `sections/` subdirectory), so
their URLs stay flat. Long-term, `gen-html` is meant to run only when
the website itself is built/deployed, so that the generated HTML doesn't
need to be committed to the repo at all. For now, it still is, so run
it and commit the result whenever `Finding.md` changes.

Note that `gen-html` deletes and regenerates all `*.html` files in
this directory (that's safe: nothing else here uses that extension;
the template is named `TEMPLATE.htm`), so new chunk files show up as
untracked, not modified. Commit with `git add -A -- '*.html'`
(not `-u` or `git commit -a`), or a new file can end
up linked from the TOC but never actually committed, producing a
broken link on the live site. Scoping the pathspec this way also
keeps that commit from sweeping up unrelated untracked files that
happen to be sitting in this same directory.

## How to view the results

To see the results, view
<https://best.openssf.org/Finding-and-Fixing-Vulnerabilities-Using-AI/>

## Quiz content

Quiz questions for the eventual course go in the same document, using
this exact template:

```text
QUIZ
Q1. <question text>

A) <option>
B) <option>
C) <option>
D) <option>

Answer: B
ENDQUIZ
```

`cleanup-markdown` turns this into a native, click-to-expand HTML
widget (no JavaScript) via `clean-finding.awk`, currently hidden
entirely by the `.quiz { display: none; }` rule in `TEMPLATE.htm`. To
reveal quizzes, delete (or no-op) that one CSS rule; nothing else
needs to change, since the widget is already closed by default on its
own.

Keep each quiz block entirely within one subsection; don't let it span
a heading, since `gen-html` chunks pages at both H1 and H2 headings,
and a quiz straddling that boundary would end up broken across two
pages.

## LICENSE

The content is CC-BY-4.0.
