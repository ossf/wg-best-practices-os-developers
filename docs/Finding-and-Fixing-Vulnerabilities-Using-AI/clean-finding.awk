#!/usr/bin/awk -f
# POSIX awk to clean input Markdown file, writes to stdout. Usage:
# awk -f clean-finding.awk Finding.md > Finding.md.new &&
#   mv Finding.md.new Finding.md

# Wrap bare http(s) URLs in <...>, unless already preceded by "(", "<"
# or "[" (already part of markdown link/autolink syntax: a link
# target, an autolink, or link text that's the URL itself, as in
# "[https://x](https://x)"; this last form is the most common one in
# this doc). POSIX ERE has no lookbehind, so that one check has to be
# manual; the rest is just match()/substr() jumping straight from one
# URL to the next.
function wrap_urls(s,    out, i, prev, url) {
    out = ""; i = 1
    while (match(substr(s, i), /https?:\/\//)) {
        out = out substr(s, i, RSTART - 1)
        i += RSTART - 1
        prev = (i > 1) ? substr(s, i - 1, 1) : ""
        # The "]" right after "[^" is a literal "]", not the closing
        # bracket. This is the only portable way to negate-and-include "]"
        match(substr(s, i), /^[^] \t<>()[]+/)
        url = substr(s, i, RLENGTH)
        i += RLENGTH
        out = out (prev == "(" || prev == "<" || prev == "[" ? url : "<" url ">")
    }
    return out substr(s, i)
}

BEGIN { looking_for_toc = 1 }

# Drop any MD025-disable comment already in the file (idempotency: a
# fresh copy goes back right after the title below). The directive
# comment must be exactly "markdownlint-disable-file MD025" with
# nothing else on the line, or markdownlint silently ignores it, so
# the explanation is a separate plain comment line.
/^<!-- markdownlint-disable-file MD025 -->$/ { next }
/^<!-- Each chapter below is intentionally its own H1; see split\. -->$/ { next }

# Count H1 headings; stop looking for the TOC after the 2nd one (the
# title, then the first real chapter).
/^#[^#]/ { if (++h1_seen >= 2) looking_for_toc = 0 }

# Drop Google Docs' flat "[Text](#anchor)" table of contents; `split`
# generates a real one via pandoc's --toc instead.
looking_for_toc && /^\[[^]]+\]\(#(\\.|[^)])+\)[ \t]*$/ { in_toc = 1; next }

# Drop blank lines in TOC
in_toc {
    if (looking_for_toc && /^[ \t]*$/) next
    in_toc = 0
}

# Drop pandoc/kramdown heading-id attributes like "{#some-id}".
{ gsub(/[ \t]*\{#[^}]*\}/, "") }

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

# MD009: normalize trailing whitespace to this doc's "  " (two spaces)
# hard-break convention; blank lines just lose theirs.
/[^ \t]/ { sub(/[ \t]+$/, "  ") }
!/[^ \t]/ { sub(/[ \t]+$/, "") }

# MD047: buffer blank lines and only emit them once we know more
# content follows, so trailing blank lines at EOF are dropped.
/^[ \t]*$/ { blanks++; next }
{
    while (blanks > 0) { print ""; blanks-- }
    print
    # Each chapter here is intentionally its own H1 (`split` chunks
    # pages on both H1 and H2), so tell markdownlint not to flag that
    # right after the title, the first H1 seen.
    if ($0 ~ /^#[^#]/ && h1_seen == 1) {
        print "<!-- markdownlint-disable-file MD025 -->"
        print "<!-- Each chapter below is intentionally its own H1; see split. -->"
    }
}
