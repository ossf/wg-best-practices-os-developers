# Create labs

We would *love* for people to create many labs!

Our system for creating labs runs entirely on the user's web browser
(client side). We do this so that users can *immediately* start
their exercises - they don't need to install anything, they don't need
to create an account somewhere, and we don't have to run arbitrary code
provided from users on some server.

The current system we implement is called `checker`,
There may be other systems you can also use in the future.

## checker

The current system we implement, `checker`,
represents a lab exercise in an HTML file.
You define a pattern that the correct answer must match
using regular expressions;
it does *not* run arbitrary code written by the user.
You can also provide patterns for various hints.

The HTML file of a given lab is expected to:

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
you can typically you can replace `&lt;` with `\x3C` to resolve it.

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

Correct answers are expressed using a preprocessed form of
[JavaScript regular expression (regex) patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).
This makes it easy to
indicate the many different forms that are all correct. E.g.:

* Pattern `(a|b)` matches `a` or `b`
* In the pattern append `*` to mean "zero or more",
  and `+` to mean "one or more"
* Use `\` to escape many characters, e.g.,
  pattern `foo\(a\)` matches `foo(a)` and
  pattern `\{\\\}` matches the literal text `{\}`.
* Pattern `9_?999` matches `9`, an optional `_`, then `999`.

Regexes are capable, but straightforward regex use might be hard to read.
To make the correct answer regexes easier to enter and
read, the regex pattern for each correct answer is preprocessed as follows:

* The user's answer must match the *entire* correct value, though it's
  okay if the user's answer has extra whitespace at the end.
  E.g., the correct answer is prepended with `^` and postpended with `$`.
* End-of-line (newline) is *completely* ignored. You can break up patterns
  into multiple lines for readability.
* Any sequence of 1+ spaces or tabs
  is interpreted as "0 or more whitespace is allowed here".
  This can also be expressed as `\s*`, but whitespace is much easier to read
  and this circumstance repeatedly occurs in correct answers.
* You *can* use a space at the beginning of a line or end of a line
  to mean "0 or more spaces".
  Using a space at the end of a line is a terrible idea, since it's not
  usually visible.
  Also, many YAML formats can't be used if there is a space at the
  beginning or end of a line. If you want to indicate "0 or more spaces"
  at the beginning of a line, we suggest using `\s*` followed by a space
  (this is optimized).
  Similarly, use space followed by `\s*` at the end of a line to mean
  0 or more spaces.
* If your answer is in JavaScript, you probably want to begin the answer
  with `\s*` followed by space to indicate "0 or more spaces are allowed here".
  Most tokens should also be separated by a space, to indicate that they're
  allowed. You should probably end it with a space and then `\s*`
  to indicate trailing whitespace is allowed.
* Use \s to match one whitespace character, use \x20 to match only
  and specifically a space character.
  As usual, append "+" to either if you want to require "1 or more".

Patterns can be a YAML format.
Most YAML mechanisms don't permit leading spaces. If you want to express
at the beginning of a line that you want to match 0 or more spaces, use
`\s*` followed by a space to express it.

### Expressing JavaScript code patterns

If you're defining a pattern to match an answer that is a
snippet of JavaScript code, here are some tips:

* Escape regex symbols by putting \ before them.
  These are <tt>. ( ) [ ] { } | + * ? \ </tt>
* Most language tokens should be separated by a space, e.g., foo \(
* If the language *requires* a space, use \s+, e.g.,
  <tt>const\s+helmet</tt>
* Put <tt>\s*</tt> at the beginning of each line in the correct pattern,
  in case we want to move that to YAML later.
* JavaScript constant strings can be surrounded by <tt>" ' `</tt>
* JavaScript allows trailing commas at the end of
  the list in a literal array, as well as in
  the key-value pairs in object literal syntax.
  Use <tt> ,? </tt> to permit them.
* End it with <tt>\s*</tt> to allow trailing whitespace.

It's impractical to match all possibilities, e.g., <tt>1</tt> can be
written as <tt>(5-4)</tt>, but that would be an absurd thing to do.

### Other info

The id `info` can provide other optional information.
If present, it must be a YAML object.
YAML is a superset of JSON,
so you can also use JSON format `{...}` to describe info.

One reason to do this is to provide more self-tests, which are
all verified on page load:

* Field `successes`: if present, this is an array of examples.
  Each example is an array of strings.
  Every example in `successes` should pass.
* Field `failures`: if present, this is an array of examples.
  Again, each example is an array of strings.
  Every example in `failures` should fail.

You can provide `correct` and `expected` values this way instead of creating
separate script regions:

* Field `correct`: If present, this is an array of strings.
  Each string is a preprocessed regular expression as described above.
* Field `expected`: If present, this is an array of strings.
  Each string is an example of a string that would meet the corresponding
  correct pattern.

The `info` object also has other fields:

* `debug`: If present and `true`, the program will present
   some data that may help you debug problems.
* `hints`: If present, this is an array of hints.

### Hints

Hints are expressed in the info `hints` field.
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

A hint has a default index of 0, that is, it
checks `attempt0` against the pattern `correct0`.
If you want to check an index other than `0`, add an `index` field and provide
an integer.

A hint can include an `examples` field, which must then contain
an array of examples (each example is an array of Strings).
On load the system will verify that each example will report the
matching hint (this helps ensure that the hint order is sensible).

### Notes on YAML

The info section supports YAML format.

YAML is a superset of JSON, so if you'd prefer to write in straight JSON,
you can do that instead.
JSON is a simple format, which is a bonus.
However, JSON is noisy for this situation, especially when there
are many backslashes and double-quotes (as there are in patterns).
If you use JSON, remember:

* All strings must be surrounded by double-quotes, even field names
* Commas *must* separate entries.
* JSON does *not* support trailing commas in arrays and dictionaries.
* Inside a string use \" for double-quote and \\ for backslash.

In YAML, field keys and simple strings don't require quoting.
Leading "-&nbsp;-" means an "array of arrays", which happens often
if you have a single input.

A string can be surrounded by double-quotes; inside that, use
\" for double-quotes and \\ for backslash.

A string can be surrounded by single-quotes; inside that, use
'' for a single-quote character (there are otherwise no escapes).
