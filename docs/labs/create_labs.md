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
This HTML file is expected to:

* Describe the exercise
* Provide the exercise itself as a form
* Identify where the user will fill in answer(s) (id `attempt0` etc.)
* Provide information about the lab, in particular:
  * Provide an example of an expected answer (id `expected0` etc.)
  * Provide the pattern of a correct answer (id `correct0` etc.)
  * Optionally provide other information such as tests and hints (id `info`)

An easy way create another lab is to copy
[input1.html](input1.html) and modify it for your situation.
See [input1.html](input1.html) and [input2.html](input2.html)
for examples.

Whenever a lab is loaded it automatically runs all embedded self-tests.
At the least, it checks that the initial attempted answer does
*not* satisfy the correct answer pattern, while the example expected answer
*does* satisfy the correct answer pattern.

We suggest including the buttons as shown in the examples;
the code will automatically set up the buttons if they are present.

### Quick aside: script tag requirements

The data about the test is embedded in the HTML in a
`script` tag. Embedding this data simplifies lab maintenance,
and using `script` is the
[recommended approach for embedding script-supporting elements](https://html.spec.whatwg.org/multipage/scripting.html).

This does create a
[few quickly restrictions](https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements).
Basically, the text embedded in the `script` sections must
*not* include the following text sequences (ignoring case):

* `&lt;!--`
* `&lt;script`
* `&lt;/script`

If you *need* to include these text sequences inside the `script` region,
you can typically you can replace `&lt; `with `\x3C` to resolve it.

### Basic lab inputs

The basic inputs are:

* Identify where the user will fill in answer(s) (id `attempt0` etc.).
  This also sets the starting value.
* Provide an example of an expected answer (id `expected0` etc.)
* Provide the pattern of a correct answer (id `correct0` etc.)

It's possible to have multiple attempt fields, in which case they are
in order (0, 1, 2, ...).
The number of attempt fields, expected fields, and correct fields
much match.

### Expressing correct answers

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

Most YAML forms don't permit leading spaces. If you want to express
at the beginning of a line that you want to match 0 or more spaces, use
`\s*` to express it.

### Other info such as more tests and hints

You can optionally provide other information in the `id` of `info`.
This must contain a YAML object (YAML is a superset of JSON,
so you can also use JSON format `{...}`).

One reason to do this is to provide more self-tests, which are
all verified on page load:

* The field `successes`, if present, is an array of examples.
  Each example is an array of strings.
  Every example in `successes` should pass.
* The field `failures`, if present, is an array of examples.
  Again, each example is an array of strings.
  Every example in `failures` should fail.

Another reason to provide info is to provide hints.
Hints are expressed in a `hints` field.
This field must be an array
(in JSON its value must begin with `[` and end with `]`).
Inside the array is a list of hint objects.
Each hint object describes a hint, and they are checked in the order given
(so the earliest matching hint always takes precedence).
If you use JSON format,
each hint object begins with `{`, has a set of fields, and ends with `}`.

Every hint object must have a `text` field to be displayed as the hint.
A hint object can have a `present` field (a pattern that must be present
for the hint to be shown), and it can have an
`absent` field (a pattern that must be absent for the hint to be shown).
A hint can have both a `present` and `absent` field, or neither.
A hint with neither a `present` nor `absent` field always matches;
you can make this kind of hint to set a default hint.

The `present` and `absent` fields are regular expression patterns that
are preprocessed similarly to a correct answer.
*However*,
don't have to exactly match (start a pattern with `^` and end it with
`$` if you want an exact match). Again, one or more spaces are interpreted
as allowing 0 or more spaces.

By default a hint checks `attempt0` against `correct0`; if you want
to check an entry index other than `0`, add an `entry` field and provide
the integer value of the entry to check instead.

You can also include an `examples` field, which must then contain
an array of examples (each example is an array of Strings).
On load the system will verify that each example will report the
matching hint (this helps ensure that the hint order is sensible).
