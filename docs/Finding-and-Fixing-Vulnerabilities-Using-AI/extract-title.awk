#!/usr/bin/awk -f
# Transient transform for pandoc's benefit only: never written back to
# Finding.md. Reads the already-cleaned Finding.md (see
# clean-finding.awk, which runs first): title H1, any HTML comments
# (like the markdownlint/split ones clean-finding.awk inserts there),
# a byline paragraph, and an abstract paragraph, before the second H1.
# Pulls that leading block into pandoc YAML metadata
# (subtitle/author/abstract; see metadata.yaml for the rest, like
# "title") instead of a heading, so it lands on index.html's title
# block (alongside the table of contents) instead of becoming its own
# separate chunked page. Usage:
# awk -f extract-title.awk Finding.md | pandoc --metadata-file=metadata.yaml ...
#
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

function rstrip(s) { sub(/[ \t]+$/, "", s); return s }

# YAML single-quoted scalar: backslash escapes don't apply (so the
# markdown backslash-escapes already in this text, like "\-", pass
# through untouched for pandoc's own markdown-in-metadata parsing);
# only a literal "'" needs doubling.
function yaml_squote(s) { gsub(/'/, "''", s); return "'" s "'" }

BEGIN { state = "title" }

state == "title" {
    sub(/^#[ \t]+/, "")
    title = rstrip($0)
    state = "frontmatter"
    next
}

# Drop any HTML comment lines here (clean-finding.awk inserts two,
# right after the title), whatever they say.
state == "frontmatter" && /^<!--.*-->$/ { next }

# Second H1: everything before it has been captured, so flush the
# YAML front matter, then fall through to print this heading (and
# everything after it) unchanged.
#
# The real title becomes the subtitle, not the title: "title" comes
# from metadata.yaml instead (see there for why), and is what other
# pages' Up/Previous/Top links reuse as their link text.
state == "frontmatter" && /^#[^#]/ {
    print "---"
    print "subtitle: " yaml_squote(title)
    if (author != "") print "author: " yaml_squote(author)
    if (abstract != "") {
        print "abstract: |"
        print "  " abstract
    }
    print "---"
    state = "body"
}

state == "frontmatter" {
    if ($0 ~ /^[ \t]*$/) next
    line = rstrip($0)
    # First non-blank paragraph is the byline; anything after that
    # (there's normally just one more paragraph) is the abstract.
    if (author == "") author = line
    else abstract = (abstract == "" ? line : abstract "\n\n  " line)
    next
}

{ print }
