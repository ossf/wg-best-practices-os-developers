#!/usr/bin/awk -f
# Transient transform for pandoc's benefit only: never written back to
# Finding.md. gen-html runs it separately for each output (HTML, PDF,
# and EPUB), so any one of them can show quizzes later by replacing
# it with something that formats them. Drops each quiz block, from a
# line that's just QUIZ through the next line that's just ENDQUIZ
# (either may end in a "\" hard line break), and puts a blank line in
# its place, so the text on either side can't run together into one
# paragraph.
#
# It also checks that QUIZ and ENDQUIZ pair up in the Google Doc. A
# quiz with no ENDQUIZ would silently drop everything after it, so
# this fails instead if a quiz reaches a heading (quizzes must stay
# within one subsection anyway), another quiz (an extra QUIZ), or the
# end of the input. An ENDQUIZ with no QUIZ would leave that quiz's
# text in the output, so that fails too. Usage:
# ... | awk -f drop-quizzes.awk | pandoc ...
#
# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT

function unterminated(where) {
    printf "drop-quizzes.awk: %s has no ENDQUIZ before %s; fix the Google Doc\n", \
        (question == "" ? "a quiz with no question" : "quiz \"" question "\""), \
        where > "/dev/stderr"
    failed = 1
    exit 1
}

function no_start() {
    printf "drop-quizzes.awk: an ENDQUIZ has no QUIZ before it (%s, in section \"%s\"); fix the Google Doc\n", \
        (qline == "" ? "no question found" : "after \"" qline "\""), heading > "/dev/stderr"
    failed = 1
    exit 1
}

skip && /^ *QUIZ\\?$/ { unterminated("the next quiz (or it has an extra QUIZ)") }
/^ *QUIZ\\?$/ { skip = 1; question = ""; next }
skip && /^#/ { unterminated("heading \"" $0 "\"") }
skip && question == "" && /[^ \t]/ { question = substr($0, 1, 60); sub(/\\$/, "", question) }
!skip && /^#/ { heading = $0; qline = "" }
!skip && /^Q[0-9]+\. / { qline = substr($0, 1, 60); sub(/\\$/, "", qline) }
!skip && /^ *ENDQUIZ\\?$/ { no_start() }
!skip { print }
skip && /^ *ENDQUIZ\\?$/ { skip = 0; print "" }

END { if (skip && !failed) unterminated("the end of the document") }
