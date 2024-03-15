# Create labs

We would *love* for people to create many labs!

Our system for creating labs runs entirely on the user's web browser
(client side).

Typically we have an exercise where there is a known pattern for the
correct answer. See `input1.html` for an example.
You should copy `input1.html` and modify it for your case.

Correct answers are embedded in the web page in a div area with
the id "correct".
Answers are expressed using regular expression patterns, to make it easy to
indicate the many different forms that are all correct. E.g.:

* Pattern `(a|b)` matches `a` or `b`, while `foo\(a\)` matches `foo(a)`.
* Pattern `\{\\\}` matches the literal text `{\}`.
* Pattern `9_?999` matches `9`, an optional `_`, then `999`.

To make the correct answer regular expressions easier to read, the
pattern for correct answers is preprocessed as follows:

* The user's answer must match the *entire* correct value, though it's
  okay if the user's answer has extra whitespace at the end.
  E.g., the correct answer is prepended with `^` and postpended with `\s*$`.
* If your answer is in JavaScript, you probably want to begin the answer
  with a space to indicate "0 or more spaces are allowed here".
  Most tokens should also be separated by a space, to indicate that they're
  allowed.
* End-of-line (newline) is *completely* ignored. You can break up patterns
  into multiple lines for readability.
* Any sequence of 1+ spaces or tabs
  is interpreted as "0 or more whitespace is allowed here".
  This can also be expressed as `\s*`, but whitespace is much easier to read
  and this circumstance repeatedly occurs in correct answers.
  Stylistically there will often be a space at the beginning of
  a line to indicate that spaces are optional there, but you don't
  *have* to format text this way.
* Use \s to match a whitespace character, use \x20 for a space character.
  Append "+" if to either if you want to require "1 or more".
* The given pattern much be exactly matched, and it's case-sensitive.
