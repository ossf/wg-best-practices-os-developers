#!/usr/bin/awk -f
# Transient transform for pandoc's benefit only: never written back to
# Finding.md. Called by gen-html. Replaces lines that are exactly
# "OVERVIEW" and "ENDOVERVIEW" (uppercase, nothing else on the line,
# so ordinary text is unlikely to trigger it) with
# <div class="overview"> and </div>, so TEMPLATE.htm's CSS can draw
# the list between them as a diagram (a box per top-level item, with
# arrows between them). The Google Doc and Finding.md keep a plain,
# easily edited nested list of links. Usage:
# ... | awk -f wrap-overview.awk | pandoc ...
#
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

# Pandoc needs blank lines around the <div> tags to parse the
# markdown between them (and not treat it as part of the HTML).
/^OVERVIEW$/    { print ""; print "<div class=\"overview\">"; print ""; next }
/^ENDOVERVIEW$/ { print ""; print "</div>"; print ""; next }
{ print }
