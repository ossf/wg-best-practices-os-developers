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

### Images

Google's markdown export embeds each image as a lossy, base64-encoded
`[imageN]: data:image/png;base64,...` line at the end of `Finding.md`.
Those copies have degraded quality, are huge, and look like secrets to
scanners. So also download the document as "Web Page (.html, zipped)",
and save it in this directory as `Finding.zip`.
When `Finding.zip` exists, `cleanup-markdown`:

* Replaces `images/` with the zip's `images/` (the full-quality files).
* Deletes the `[imageN]: data:...` lines.
* Rewrites each image reference to
  `![alt text](images/FILE.png){width=W height=H}`, using the size the
  document gives the image (the pixel size would display too large).

Google numbers the images differently in the markdown (`[image2]`)
and in the zip (`images/image4.png`), so `cleanup-markdown` matches
them by alt text, taken from the `<img>` tags in the zip's HTML.
Every image needs alt text that's unique and the same in both places.
If an image has none, or no image in the zip has the same alt text,
`cleanup-markdown` reports the error and leaves `Finding.md` unchanged.
Running it again with a newer `Finding.zip` follows any renumbering.
Without `Finding.zip`, images are left alone.
Commit `images/` along with `Finding.md`.

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

## Vendored CSS

The site's styling (`simple.min.css`) is vendored into this
directory instead of loaded from a CDN at page-load time. Loading it
from a CDN means if it goes down, pages lose styling, if it's compromised,
visitor browsers get that. Vendoring removes that runtime
dependency entirely: the exact bytes are committed here and never
change unless someone here changes them. I use a relative reference
so we can move directories and so users can use a local copy easily.

* **Source**: <https://cdn.jsdelivr.net/npm/simpledotcss@2.2.1/simple.min.css>
  (the [Simple.css](https://github.com/kevquirk/simple.css) project),
  version 2.2.1.
* **License**: MIT. The exact license text for this version is in
  `simple.min.css.LICENSE`, vendored alongside it (fetched from the
  `v2.2.1` tag) so both stay independently verifiable against
  upstream.
* **Do not hand-edit `simple.min.css`**: it's kept byte-identical to
  the upstream file so it can be verified with a plain `diff`/hash
  comparison against a fresh download, with no ambiguity about what's
  vendor code versus a local change.

### Checking for and applying updates

1. Check for a newer release: <https://github.com/kevquirk/simple.css/releases>
   or `npm view simpledotcss versions`.
2. Skim the changelog/diff between the vendored version and the
   candidate before updating (this is unaudited third-party CSS
   running in every visitor's browser).
3. Download the new version's minified CSS and LICENSE, e.g. for
   version `X.Y.Z`:

   ```shell
   curl -fsSL "https://cdn.jsdelivr.net/npm/simpledotcss@X.Y.Z/simple.min.css" \
     -o simple.min.css
   curl -fsSL "https://raw.githubusercontent.com/kevquirk/simple.css/vX.Y.Z/LICENSE" \
     -o simple.min.css.LICENSE
   ```

4. Update the version and any changed terms in this section.
5. Run `gen-html` and check a few pages in a browser (the `.quiz`
   CSS rule and other class names this site depends on could
   theoretically change or disappear upstream).
6. Commit `simple.min.css`, `simple.min.css.LICENSE`, this README,
   and the regenerated `*.html` files together.

## LICENSE

Our content is CC-BY-4.0, code is MIT.

Third-party vendored assets (currently just `simple.min.css`) keep their
own license; see "Vendored CSS" above.
