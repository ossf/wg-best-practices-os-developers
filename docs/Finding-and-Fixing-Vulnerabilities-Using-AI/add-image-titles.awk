#!/usr/bin/awk -f
# Transient transform for pandoc's benefit only: never written back to
# Finding.md. Called by gen-html. Copies each image's alt text into its
# title, so browsers show it as a tooltip when you hover over the
# image (browsers don't show alt text on hover). That is, it rewrites
# "![alt](images/FILE)" to "![alt](images/FILE "alt")". Screen readers
# such as NVDA don't announce a description (here, the title) that
# matches the name (here, the alt text), so it isn't read twice.
# Usage: ... | awk -f add-image-titles.awk | pandoc ...
#
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

# Curl straight quotes in s like pandoc's "smart" extension: a quote
# at the start or after a space or opening bracket opens; any other
# closes (for "'", that's also an apostrophe, as in "who's").
function curl_quotes(s,    out, i, c, prev) {
    out = ""; prev = ""
    for (i = 1; i <= length(s); i++) {
        c = substr(s, i, 1)
        if (c == "\"") c = (prev == "" || prev ~ /[ \t([{]/) ? "“" : "”"
        else if (c == "'") c = (prev == "" || prev ~ /[ \t([{]/) ? "‘" : "’"
        out = out c; prev = substr(s, i, 1)
    }
    return out
}

{
    out = ""; s = $0
    # An image without a title: "![" alt "](images/" file ")", where
    # the alt text may contain backslash escapes like "\]".
    while (match(s, /!\[([^]\\]|\\.)*\]\(images\/[^ )]*\)/)) {
        m = substr(s, RSTART, RLENGTH)
        out = out substr(s, 1, RSTART - 1)
        s = substr(s, RSTART + RLENGTH)
        alt = m; sub(/^!\[/, "", alt); sub(/\]\(images\/[^ )]*\)$/, "", alt)
        # Pandoc's "smart" extension curls quotes in the alt text but
        # not in titles. Curl them here the same way, so the title
        # exactly matches the alt text (screen readers only skip it
        # then). This also leaves no '"' that would end the title
        # early. Other backslash escapes work the same in both.
        alt = curl_quotes(alt)
        out = out substr(m, 1, length(m) - 1) " \"" alt "\")"
    }
    print out s
}
