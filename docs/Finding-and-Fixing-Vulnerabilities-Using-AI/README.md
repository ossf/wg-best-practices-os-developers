# README for Finding and Fixing Vulnerabilities Using AI

## How to update the content

Update [Finding.md](./Finding.md).

Currently, this is done by first updating the corresponding Google document
and running save as markdown. Eventually we expect the markdown will be
the final version (below we discuss how we'll implement that).

Then run `cleanup-markdown` in this directory after downloading/exporting
`Finding.md` from Google Docs and before committing it.
It fixes Google Docs export artifacts that would otherwise trip up
markdownlint (see `clean-finding.awk`) and rewrites `Finding.md` in
place. It's idempotent, so running it again later (or on an
already-clean `Finding.md`) is a no-op.

A few conventions in the Google document matter because of this:

* To make a block quote, start the paragraph with ">".
* Don't use Shift+Enter for a line break inside a paragraph; `cleanup-markdown`
  removes trailing whitespace, which is how the export represents those
  breaks. Use Enter for a new paragraph instead.
* In-document links are rewritten to use GitHub's heading IDs, which
  markdownlint checks. `gen-html` has pandoc compute IDs the same way
  (its `gfm_auto_identifiers` extension), so they work in the HTML too.

### Images

Google's markdown export embeds each image as a lossy, base64-encoded
`[imageN]: data:image/png;base64,...` line at the end of `Finding.md`.
Those copies have degraded quality, are huge, and look like secrets to
scanners. So also download the document as "Web Page (.html, zipped)",
and save it in this directory as `Finding.zip`.
When `Finding.zip` exists, `cleanup-markdown`:

* Replaces `images-originals/` with the zip's `images/` (the
  full-quality files), renaming each image from its alt text (see
  below).
* Replaces `images/` with the copies the guide serves (on the web, and
  in the PDF and EPUB), made by `compress-images.py`: JPEGs at quality
  90. The originals are lossless PNGs, mostly photo-like
  illustrations, so the JPEGs are about 6x smaller (2MB instead of
  12MB) with no difference you can see. Images that are already JPEGs,
  or have transparency, or aren't raster images (e.g., SVG) are served
  as-is.
* Deletes the `[imageN]: data:...` lines.
* Rewrites each image reference to
  `![alt text](images/NAME.jpg){width=W height=H}`, using the size the
  document gives the image (the pixel size would display too large).

`compress-images.py` needs Pillow. On Debian or Ubuntu, install it with
`sudo apt install python3-pil`; elsewhere, use your system's package
manager, or `pip install pillow` in a Python virtual environment.

Google numbers the images differently in the markdown (`[image2]`)
and in the zip (`images/image4.png`), so `cleanup-markdown` matches
them by alt text, taken from the `<img>` tags in the zip's HTML.
It also names each file from its alt text: the first 6 words, ignoring
a few filler words such as "a" and "the", lowercased and joined by
"-". For example, "A robot tries to warn a human about a fire, ..."
becomes `images-originals/robot-tries-warn-human-about-fire.png`
(served as `images/robot-tries-warn-human-about-fire.jpg`).
The name depends only on the alt text, so it's the same on every run,
and it's the same whatever numbers Google gives the images.
Editing the start of an image's alt text renames its file (`git`
shows it as a rename).

Every image needs alt text that's the same in both places, and the
first words must be distinct: if an image has none, no image in the
zip has the same alt text, or two images would get the same name,
`cleanup-markdown` reports the error and leaves `Finding.md`,
`images/`, and `images-originals/` unchanged.
Running it again with a newer `Finding.zip` follows any renumbering.
Without `Finding.zip`, images are left alone.
Commit `images/` and `images-originals/` along with `Finding.md`, but
not `Finding.zip`.

### Switching to the markdown as the canonical version

We plan to make `Finding.md` the canonical version, instead of the
Google document. When we do, people should propose improvements on
GitHub instead of in the Google document. To do that, change the
"You may propose improvements" link in the footer of `TEMPLATE.htm`
(see the comment there), then rerun `gen-html`. Change this:

```html
<a href="https://docs.google.com/document/d/1fji3SlBDDpdGfh46Hs3r7kCv30RYzgSXrLu8eVDoLrM/edit">You may propose improvements</a>
```

to this, which opens `Finding.md` in GitHub's web editor:

```html
<a href="https://github.com/ossf/wg-best-practices-os-developers/edit/main/docs/Finding-and-Fixing-Vulnerabilities-Using-AI/Finding.md">You may propose improvements</a>
```

People without write access to the repository (most readers) need a
GitHub account but don't need to know git: when they save, GitHub
forks the repository for them and walks them through opening a pull
request.

After the switch, `Finding.md` is no longer exported from Google Docs,
so `cleanup-markdown` and `Finding.zip` are no longer needed. Edit
`Finding.md` directly instead, and update this README to match. To add
an image, put the original in `images-originals/`, run
`python3 compress-images.py images-originals images` to make its
served copy in `images/`, and refer to that served copy from
`Finding.md`.

We'll probably have a script for importing markdown changes back into
Google docs, in case that's needed, once the Markdown file is the
canonical version.

## How to regenerate pages

When you're ready (`Finding.md` updated and cleaned), generate the
site's HTML, `Finding.pdf`, and `Finding.epub` by running `gen-html` in
this directory. Note that `gen-html` is misnomer, it generates more than HTML.

The EPUB is for e-book readers (such as Apple Books, Google Play Books,
Kobo, Send to Kindle, Thorium, Calibre, and Foliate), which reflow it
for any screen size. Its images keep their alt text. pandoc makes it directly;
its cover image
(made from `COVER-TEMPLATE.htm`) also needs WeasyPrint and `pdftoppm`
(on Debian or Ubuntu, `sudo apt install poppler-utils`). Without them,
`gen-html` warns and makes the EPUB without a cover image.
`epub-metadata.yaml` adds EPUB-only accessibility metadata.

The PDF is made with [WeasyPrint](https://weasyprint.org/), which turns
pandoc's HTML into a PDF using the print rules in `guide.css` (page
size, page numbers, chapter page breaks, and so on). If WeasyPrint
isn't installed, `gen-html` warns and skips the PDF; to install it, use
`pipx install weasyprint`. The PDF's template (`PDF-TEMPLATE.htm`)
puts Honk the Goose on its first page. Its page size is a "Least Common
Denominator" of 210mm x 279mm: A4's width and Letter's height, so it
prints on either paper without scaling. Keep `gen-html` free of
WeasyPrint warnings, so new ones (like a missing image) stand out;
that's why the PDF doesn't use `simple.min.css`, and why web-only
rules (site navigation, and media queries for screens) live in
`site.css` rather than `guide.css`. The web pages link all three
stylesheets, in that order, and embed no styles of their own.

The `gen-html` script assumes
`Finding.md` is already clean (a committed one always is; run
`cleanup-markdown` first otherwise), and generates new `*.html` chunk
files directly in this directory (no `sections/` subdirectory), so
their URLs stay flat. Long-term, `gen-html` is meant to run only when
the website itself is built/deployed, so that the generated HTML doesn't
need to be committed to the repo at all. For now, it still is, so run
it and commit the result whenever `Finding.md` changes.

Note that `gen-html` deletes and regenerates all the `[a-z0-9]*.html`
files in this directory (generated pages are named from heading IDs,
which start that way; the template is named `TEMPLATE.htm`, and
`,`-prefixed scratch files are left alone), so new chunk files show up
as untracked, not modified. Commit with
`git add -A -- '[a-z0-9]*.html' images/ images-originals/ Finding.pdf Finding.epub`
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
widget (no JavaScript) via `clean-finding.awk`. For now, `gen-html`
leaves quizzes out of the HTML, PDF, and EPUB, by running
`drop-quizzes.awk` separately for each. To show quizzes in one of
them, stop running `drop-quizzes.awk` for that one; nothing else
needs to change, since the widget is already closed by default.

`drop-quizzes.awk` makes `gen-html` fail, naming the quiz, if a quiz
runs into a heading, another quiz, or the end of the document. That
means a missing `ENDQUIZ` (or an extra `QUIZ`) in the Google Doc,
which would otherwise silently drop the text after it.

Keep each quiz block entirely within one subsection; don't let it span
a heading, since `gen-html` chunks pages at both H1 and H2 headings,
and a quiz straddling that boundary would end up broken across two
pages.

## Overview diagram

To draw a list as a diagram in the HTML (a box for each top-level
item, with arrows between them), put a paragraph that's exactly
`OVERVIEW` (uppercase, nothing else) right before it, and one that's
exactly `ENDOVERVIEW` right after it. The overview list uses this. In
the Google Doc it's just a nested bulleted list, so edit it normally;
make each item a link to its heading (Insert › Link › Headings).
`gen-html` runs `wrap-overview.awk`, which turns the markers into
`<div class="overview">` and `</div>` only in what it passes to pandoc
(`Finding.md` itself isn't changed), and CSS in `guide.css` does
the drawing (`site.css` stacks the boxes on narrow screens). The CSS assumes three top-level items; change
`grid-template-columns` there if that changes.

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
5. Run `gen-html` and check a few pages in a browser (class names and
   CSS variables this site depends on could theoretically change or
   disappear upstream). `guide.css` copies simple.css's light-mode
   CSS variables, for the PDF and EPUB; update them if they changed.
6. Commit `simple.min.css`, `simple.min.css.LICENSE`, this README,
   and the regenerated `*.html` files together.

## LICENSE

Our content is CC-BY-4.0, code is MIT.

Third-party vendored assets (currently just `simple.min.css`) keep their
own license; see "Vendored CSS" above.
