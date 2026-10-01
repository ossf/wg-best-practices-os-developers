#!/usr/bin/awk -f
# Clean input Markdown file, writes to stdout. Usage:
# awk -f clean-finding.awk Finding.md > Finding.md.new &&
#   mv Finding.md.new Finding.md
# Normally run via cleanup-markdown, which also handles images: pass
# -v imgtags=FILE (the <img> tags from Finding.zip's HTML, one per
# line) to point images at images/ instead of embedded data URIs, and
# -v renames=FILE to get the "old<TAB>new" file names to give them
# (new names come from the alt text), -v embedded=DIR for images
# missing from the zip, and -v keeps=FILE for existing images/ files
# to keep (see fallback_image()).
# Exits nonzero (and cleanup-markdown keeps the old file) if an image
# can't be found anywhere or two images would get the same name.
#
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

# Wrap bare http(s) URLs in <...>, unless already preceded by "(", "<"
# or "[" (already part of markdown link/autolink syntax: a link
# target, an autolink, or link text that's the URL itself, as in
# "[https://x](https://x)"; this last form is the most common one in
# this doc). POSIX ERE has no lookbehind, so that one check has to be
# manual; the rest is just match()/substr() jumping straight from one
# URL to the next.
function wrap_urls(s,    out, i, prev, url) {
    out = ""; i = 1
    # Google's export sometimes escapes the colon ("https\://").
    while (match(substr(s, i), /https?\\?:\/\//)) {
        out = out substr(s, i, RSTART - 1)
        i += RSTART - 1
        prev = (i > 1) ? substr(s, i - 1, 1) : ""
        # The "]" right after "[^" is a literal "]", not the closing
        # bracket. This is the only portable way to negate-and-include "]"
        match(substr(s, i), /^[^] \t<>()[]+/)
        url = substr(s, i, RLENGTH)
        i += RLENGTH
        if (prev == "(" || prev == "<" || prev == "[") { out = out url; continue }
        # Autolinks don't process backslash escapes, so drop that one.
        sub(/\\:/, ":", url)
        out = out "<" url ">"
    }
    return out substr(s, i)
}

# Rewrite each in-document link target "](#target)" in s to the heading
# ID that GitHub's algorithm computes, which markdownlint (MD051) checks:
# lowercase, and drop everything but letters, digits, "-", and "_".
# Google's export keeps other punctuation, e.g., "#preparing-ci/cd" for
# the heading "Preparing CI/CD", whose ID is "preparing-cicd". This drops
# all non-ASCII bytes, which is right for punctuation like "’" but would
# be wrong for a heading with non-ASCII letters (there are none).
# gen-html has pandoc compute IDs the same way (its gfm_auto_identifiers
# extension), so these links work in the HTML too.
function fix_fragments(s,    out, t) {
    out = ""
    while (match(s, /\]\(#[^)]*\)/)) {
        t = tolower(substr(s, RSTART + 3, RLENGTH - 4))
        gsub(/[^a-z0-9_-]/, "", t)
        out = out substr(s, 1, RSTART - 1) "](#" t ")"
        s = substr(s, RSTART + RLENGTH)
    }
    return out s
}

# Value of attribute "name" in an HTML tag ("" if absent).
function attr(tag, name,    re, v) {
    re = "[ \t]" name "=\"[^\"]*\""
    if (!match(tag, re)) return ""
    v = substr(tag, RSTART + length(name) + 3, RLENGTH - length(name) - 4)
    gsub(/&quot;/, "\"", v); gsub(/&#39;/, "'", v)
    gsub(/&lt;/, "<", v); gsub(/&gt;/, ">", v); gsub(/&amp;/, "\\&", v)
    return v
}

# Canonical form of alt text, so the copy in the markdown (which may
# have backslash escapes) and the copy in the HTML compare equal.
function norm_alt(s) {
    gsub(/\\/, "", s); gsub(/[ \t]+/, " ", s)
    sub(/^ /, "", s); sub(/ $/, "", s)
    return s
}

# CSS pixel value of property "prop" (e.g. "width") in a style
# attribute, rounded to an integer ("" if absent).
function css_px(style, prop,    v) {
    if (!match(style, "(^|[ ;])" prop ":[ ]*[0-9.]+")) return ""
    v = substr(style, RSTART, RLENGTH)
    sub(/^[^:]*:[ ]*/, "", v)
    return int(v + 0.5)
}

# File name (without directory or extension) for an image, made from
# the first SLUG_WORDS words of its alt text: lowercase, letters and
# digits only, joined by "-", skipping a few filler words. The name
# depends only on the alt text, so it's the same on every run.
function slug(alt,    s, n, i, out, cnt, words) {
    s = tolower(alt)
    gsub(/[^a-z0-9]+/, " ", s)
    n = split(s, words, " ")
    out = ""; cnt = 0
    for (i = 1; i <= n && cnt < SLUG_WORDS; i++) {
        if (words[i] in filler) continue
        out = out (cnt ? "-" : "") words[i]
        cnt++
    }
    return out
}

# Report an error in the images and stop.
function image_error(msg) {
    print "clean-finding.awk: " msg > "/dev/stderr"
    failed = 1; exit 1
}

# Load the alt-text -> image map from the <img> tags, one per line, in
# the file named by the "imgtags" variable (see cleanup-markdown, which
# extracts them from the HTML in Finding.zip). Google's export numbers
# the images differently in the markdown ("[image2]") and in the zip
# ("images/image4.png"), so the alt text is the only reliable key. It
# also names the files (see slug()): each image is to be renamed from
# its name in the zip to images/SLUG.EXT, and "old<TAB>new" for each
# goes to the file named by the "renames" variable, for cleanup-markdown.
function load_imgtags(    tag, alt, src, name, ext) {
    while ((getline tag < imgtags) > 0) {
        alt = norm_alt(attr(tag, "alt"))
        src = attr(tag, "src")
        if (alt == "" || src == "") continue
        if (alt in zip_src) {
            # The same image used twice is fine; two images can't share alt text.
            if (zip_src[alt] == src) continue
            image_error("two images have the same alt text, so the map is ambiguous; make them distinct: " alt)
        }
        name = slug(alt)
        if (name == "")
            image_error("alt text has no letters or digits to name the image: " alt)
        ext = match(src, /\.[A-Za-z0-9]+$/) ? substr(src, RSTART) : ".png"
        if (("images/" name ext) in name_owner)
            image_error("alt texts \"" name_owner["images/" name ext] "\" and \"" alt "\" give the same file name (images/" name ext "); make their first words differ")
        name_owner["images/" name ext] = alt
        zip_src[alt] = src
        img_src[alt] = "images/" name ext
        img_w[alt] = css_px(attr(tag, "style"), "width")
        img_h[alt] = css_px(attr(tag, "style"), "height")
        if (renames != "") print src "\t" img_src[alt] > renames
        have_imgs = 1
    }
    close(imgtags)
    if (renames != "") close(renames)
    if (!have_imgs)
        image_error("no usable <img> tags in " imgtags)
}

# Load the base64 image data Google's markdown export embeds in its
# "[imageN]: <data:image/png;base64,...>" lines (at the end of the
# file, after the references, hence reading it here first), for
# fallback_image(). Sets md_data[id] and md_ext[id] ("id" as in
# "image7").
function load_embedded(    line, id, ext) {
    while ((getline line < ARGV[1]) > 0) {
        if (!match(line, /^\[image[0-9]+\]:[ \t]*<?data:image\/[a-z0-9.+-]+;base64,/)) continue
        id = substr(line, 2); sub(/\].*$/, "", id)
        ext = substr(line, 1, RLENGTH); sub(/^.*data:image\//, "", ext); sub(/;.*$/, "", ext)
        if (ext == "jpeg") ext = "jpg"
        else if (ext == "svg+xml") ext = "svg"
        else if (ext !~ /^[a-z0-9]+$/) ext = "png"
        md_ext[id] = "." ext
        md_data[id] = substr(line, RLENGTH + 1)
        sub(/>.*$/, "", md_data[id])  # also drops any "title" after it
    }
    close(ARGV[1])
}

# Replacement for image reference m (alt text "alt", normalized "key")
# when it isn't in Finding.zip. That happens when the image has no alt
# text (the only key we can match on), or when Google's HTML export
# simply leaves an image out (it does). Rather than fail, complain on
# stderr so you can fix it in the Google Doc, and use what we have:
# for Google's raw "![alt][imageN]" form, the lossy copy embedded in
# Finding.md, written base64-encoded into the "embedded" directory for
# cleanup-markdown to decode; for an earlier run's
# "![alt](images/FILE)" form, the existing file, listed in "keeps" for
# cleanup-markdown to keep. Names are only ever made here from slug()
# or digits, so they're safe as file names.
function fallback_image(m, alt, key,    why, id, name, path, n) {
    why = (key == "") ? "has no alt text" : "isn't in " zipname " (alt text: " key ")"
    if (match(m, /\[image[0-9]+\]$/)) {
        id = substr(m, RSTART + 1, RLENGTH - 2)
        if (embedded == "" || !(id in md_data)) {
            print "clean-finding.awk: line " NR ": image " why ", and there's no embedded copy of it" > "/dev/stderr"
            failed = 1
            return m
        }
        name = (key == "") ? "" : slug(key)
        if (name == "") name = "no-alt-text-" substr(id, 6)
        path = "images/" name md_ext[id]
        for (n = 2; (path in name_owner) && name_owner[path] != key; n++)
            path = "images/" name "-" n md_ext[id]
        name_owner[path] = key
        print md_data[id] > (embedded "/" substr(path, 8) ".b64")
        close(embedded "/" substr(path, 8) ".b64")
        print "clean-finding.awk: line " NR ": WARNING: image " why "; using its lossy copy embedded in Finding.md as " path ". Please fix this in the Google Doc." > "/dev/stderr"
        return "![" alt "](" path ")"
    }
    path = m; sub(/^!\[[^]]*\]\(/, "", path); sub(/\).*$/, "", path)
    if (keeps == "" || path !~ /^images\/[A-Za-z0-9][A-Za-z0-9._-]*$/) {
        print "clean-finding.awk: line " NR ": image " why ", and can't keep " path > "/dev/stderr"
        failed = 1
        return m
    }
    print path > keeps
    print "clean-finding.awk: line " NR ": WARNING: image " why "; keeping the existing " path ". Please fix this in the Google Doc." > "/dev/stderr"
    return m
}

# Rewrite each image reference in s to
# "![alt](images/FILE){width=W height=H}", using the map above, whether
# it's the raw Google form "![alt][imageN]" or an earlier run's result
# (idempotent, and follows a renumbering if the zip changes). The
# width/height are the size the author gave the image in the document
# (the pixel size is bigger and would render too large).
function fix_images(s,    out, m, alt, key, ref) {
    out = ""
    while (match(s, /!\[[^]]*\](\[image[0-9]+\]|\(images\/[^)]*\)(\{[^}]*\})?)/)) {
        m = substr(s, RSTART, RLENGTH)
        out = out substr(s, 1, RSTART - 1)
        s = substr(s, RSTART + RLENGTH)
        alt = substr(m, 3); sub(/\].*$/, "", alt)
        key = norm_alt(alt)
        if (!(key in img_src)) {
            out = out fallback_image(m, alt, key)
            continue
        }
        ref = "![" alt "](" img_src[key] ")"
        if (img_w[key] != "" && img_h[key] != "")
            ref = ref "{width=" img_w[key] " height=" img_h[key] "}"
        out = out ref
    }
    return out s
}

BEGIN {
    looking_for_toc = 1
    # Image file names: this many words of the alt text, minus filler.
    SLUG_WORDS = 6
    split("a an the to of is are and but with has in", filler_list, " ")
    for (i in filler_list) filler[filler_list[i]] = 1
    if (zipname == "") zipname = "Finding.zip"
    if (imgtags != "") { load_imgtags(); load_embedded() }
}

# Drop any MD025-disable comment already in the file (idempotency: a
# fresh copy goes back right after the title below). The directive
# comment must be exactly "markdownlint-disable-file MD025" with
# nothing else on the line, or markdownlint silently ignores it, so
# the explanation is a separate plain comment line.
/^<!-- markdownlint-disable-file MD025 -->$/ { next }
/^<!-- Each chapter below is intentionally its own H1; see gen-html\. -->$/ { next }

# Count H1 headings; stop looking for the TOC after the 2nd one (the
# title, then the first real chapter).
/^#[^#]/ { if (++h1_seen >= 2) looking_for_toc = 0 }

# Drop Google Docs' flat "[Text](#anchor)" table of contents;
# `gen-html` generates a real one via pandoc's --toc instead.
looking_for_toc && /^\[[^]]+\]\(#(\\.|[^)])+\)[ \t]*$/ { in_toc = 1; next }

# Drop blank lines in TOC
in_toc {
    if (looking_for_toc && /^[ \t]*$/) next
    in_toc = 0
}

# Drop pandoc/kramdown heading-id attributes like "{#some-id}".
{ gsub(/[ \t]*\{#[^}]*\}/, "") }

# MD009: drop trailing whitespace. Google Docs' export leaves it on
# many lines, nearly always where a hard line break is pointless: ends
# of list items (including the quiz's "A)" choices, where pandoc
# turned it into stray <br />s), before blank lines, and on QUIZ/ENDQUIZ
# markers. If you need a line break inside a paragraph (a Shift+Enter
# in the Google Doc), use a new paragraph (Enter) instead.
{ sub(/[ \t]+$/, "") }

# Block quotes: Google's export escapes a paragraph's leading ">" as
# "\>", so it shows as a literal ">". A paragraph you start with ">" in
# the Google Doc is meant as a block quote, so unescape it.
{ sub(/^\\>/, ">") }

# Turn the fixed "QUIZ" ... "Answer: ..." ... "ENDQUIZ" quiz
# template into native, click-to-expand disclosure widgets: no JS, and
# closed by default on their own. Hidden entirely for now via the
# "quiz" CSS class in TEMPLATE.htm; delete that one rule later to
# reveal them.
/^[ \t]*QUIZ[ \t]*$/ { $0 = "<details class=\"quiz\"><summary>Quiz</summary>" }
/^\**Answer:\** / { $0 = "<details><summary>Show answer</summary>" $0 "</details>" }
/^[ \t]*ENDQUIZ[ \t]*$/ { $0 = "</details>" }

# Put a blank line before each quiz. Without one, pandoc treats the
# paragraph before the quiz as part of the HTML block, so it loses its
# <p> (and paragraph styling). "blanks" counts the blank lines seen
# since the last line printed (see MD047 below).
/^<details class="quiz">/ && !blanks { blanks = 1 }

# Images: when cleanup-markdown found Finding.zip (imgtags is set),
# point each image at its file under images/ and drop Google's
# "[imageN]: data:image/png;base64,..." definitions at the end. Those
# embedded copies are lossy, huge, and look like secrets to scanners.
# Without the zip, leave everything alone (the data URIs still work).
have_imgs && /^\[image[0-9]+\]:/ { next }
have_imgs { $0 = fix_images($0) }

# Unwrap angle-bracket-wrapped data:image URIs: keep everything the
# match covers except its first and last character (the brackets).
match($0, /<data:image\/[^>]*>/) {
    $0 = substr($0, 1, RSTART - 1) \
        substr($0, RSTART + 1, RLENGTH - 2) substr($0, RSTART + RLENGTH)
}

# MD010: hard tabs -> single space.
{ gsub(/\t/, " ") }

# MD030: exactly one space after a list marker.
match($0, /^[ \t]*(-|\*|\+|[0-9]+[.)])[ \t][ \t]+/) {
    marker = substr($0, RSTART, RLENGTH)
    sub(/[ \t]+$/, "", marker)
    $0 = marker " " substr($0, RSTART + RLENGTH)
}

# MD034: wrap bare URLs.
{ $0 = wrap_urls($0) }

# MD051: in-document links must use GitHub's heading IDs.
{ $0 = fix_fragments($0) }

# MD047: buffer blank lines and only emit them once we know more
# content follows, so trailing blank lines at EOF are dropped.
/^$/ { blanks++; next }
{
    while (blanks > 0) { print ""; blanks-- }
    print
    # Each chapter here is intentionally its own H1 (`gen-html` chunks
    # pages on both H1 and H2), so tell markdownlint not to flag that
    # right after the title, the first H1 seen.
    if ($0 ~ /^#[^#]/ && h1_seen == 1) {
        print "<!-- markdownlint-disable-file MD025 -->"
        print "<!-- Each chapter below is intentionally its own H1; see gen-html. -->"
    }
}

END { if (failed) exit 1 }
