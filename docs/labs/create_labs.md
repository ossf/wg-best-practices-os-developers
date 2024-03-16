# Create labs

We would *love* for people to create many labs!

Our system for creating labs runs entirely on the user's web browser
(client side). We do this so that users can *immediately* start
their exercises - they don't need to install anything, they don't need
to create an account somewhere, and we don't have to run arbitrary code
from users on some server.

The current system we implement is called `lab_checker`,
There may be other systems you can also use in the future.

## lab_checker

The current system we implement, `lab_checker`,
represents a lab exercise in an HTML file.
This HTML file describes the exercise.
It also embeds places for the user to attempt to fill in an answer
and patterns (that you set) that defines the
correct answer. See [input1.html](input1.html) and [input2.html](input2.html)
for examples.
An easy way create another lab is to copy
[input1.html](input1.html) and modify it for your situation.

Places where the user can fill in attempts have an id
of the form `attempt0` (where 0 is the first one, 1 is the second, and so on).
Correct answers are embedded in the web page in a div area with
an id of the form `correct0` (where 0 is the first one, 1 is the second,
and so on). There must be the same number of attempts and correct patterns.

Correct answers are expressed using regular expression (regex) patterns,
to make it easy to
indicate the many different forms that are all correct. E.g.:

* Pattern `(a|b)` matches `a` or `b`, while `foo\(a\)` matches `foo(a)`.
* Pattern `\{\\\}` matches the literal text `{\}`.
* Pattern `9_?999` matches `9`, an optional `_`, then `999`.

To make the correct answer regexes easier to enter and
read, the regex pattern for each correct answer is preprocessed as follows:

* The user's answer must match the *entire* correct value, though it's
  okay if the user's answer has extra whitespace at the end.
  E.g., the correct answer is prepended with `^` and postpended with `\s*$`.
* End-of-line (newline) is *completely* ignored. You can break up patterns
  into multiple lines for readability.
* Any sequence of 1+ spaces or tabs
  is interpreted as "0 or more whitespace is allowed here".
  This can also be expressed as `\s*`, but whitespace is much easier to read
  and this circumstance repeatedly occurs in correct answers.
  Stylistically there will often be a space at the beginning of
  a line to indicate that spaces are optional there, but you don't
  *have* to format text this way.
* If your answer is in JavaScript, you probably want to begin the answer
  with a space to indicate "0 or more spaces are allowed here".
  Most tokens should also be separated by a space, to indicate that they're
  allowed.
* Use \s to match a whitespace character, use \x20 for a space character.
  Append "+" to either if you want to require "1 or more".

You can optionally provide hints in a div with `id` of `hints`.
Hints are expressed in a JSON array, so it must begin with `[` and end with `]`.
Inside the array is a comma-separated list of hint objects, where
each object begins with `{`, has a set of fields, and ends with `}`.
Each hint object describes a hint, and they are checked in the order given
(so the earliest matching hint always takes precedence).

Every hint object must have a `text` field to be displayed as the hint.
A hint object can have a `present` field (a pattern that must be present
for the hint to be shown), and it can have an
`absent` field (a pattern that must be absent for the hint to be shown).
A hint can have both a `present` and `absent` field, or neither.
A hint with neither a `present` nor `absent` field always matches;
you can make this kind of hint to set a default hint.
The `present` and `absent` field are regular expression patterns, but
don't have to exactly match (start them with `^` and end them with
`$` if you want an exact match). Again, one or more spaces are interpreted
as allowing 0 or more spaces.

By default a hint checks `attempt0` against `correct0`; if you want
to check an entry index other than `0`, add an `entry` field and provide
the integer value of the entry to check instead.
