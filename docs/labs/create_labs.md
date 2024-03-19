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
We've taken several steps to make it easier to read regex patterns.

One traditional problem with regexes is that they
often have a lot of backslashes.
In many formats (e.g., JSON) those backslashes have to be backslashed,
leading to a problem known as
<a href="https://www.explainxkcd.com/wiki/index.php/1638:_Backslashes"
>the true name of Ba'all the soul-eater</a>.
We solve this by allowing patterns to be expressed either directly
in script tags or in YAML.

Another problem is that regexes can be hard to read if they are long
or must often match whitespace.
To make the correct answer regexes easier to enter and
read, the regex pattern for each correct answer is preprocessed as follows:

* The user's `answer` must match the *entire* corresponding
  `correct` value. In other words,
  the correct answer is prepended with `^` and appended with `$`.
* End-of-line (newline) in a pattern
  is *completely* ignored. Thus, you can break up patterns
  into multiple lines for readability.
* Any sequence of 1+ spaces or tabs
  is interpreted as "0 or more whitespace is allowed here".
  This can also be expressed as `\s*`, and you can combine them
  (e.g., a `\s*` can be preceded and/or appended by spaces and tabs).
* You *can* use a space at the end of a line
  to mean "0 or more spaces", but don't do that, since it's not
  usually visible. Use ` \s*` instead.
* If your answer is in JavaScript, you probably want to begin the answer
  with `\s*` followed by space to indicate "0 or more spaces are allowed here".
  Most tokens should also be separated by a space, to indicate that they're
  allowed. You should probably end it with a space and then `\s*`
  to indicate trailing whitespace is allowed.
* Use \s to match one (required) whitespace character, use \x20 require
  a space character.
  As usual, append "+" to either if you want to require "1 or more".

Patterns can be a YAML format (described below).

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

The info section supports
[YAML format version 1.2](https://yaml.org/spec/1.2.2/).
<!--
YAML 1.2 is an improvement over YAML 1.1, e.g., it doesn't have the
Norway problem.
-->

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

In YAML, field names with just alphanumerics, underscore, and dash
 don't require quoting.
Leading "-&nbsp;-" means an "array of arrays", which happens often
if you have a single input.

YAML has several ways to indicate strings and other scalar data:

* You can use "|" to indicate that the following indented text line(s)
  are to be taken literally (after removing the amount of indentation of the
  following list, and each line is its own line).
  This is probably the best mechanism for
  non-trivial patterns; you don't need to backslash anything.
  You probably want to use "\s*" to begin the first line of the pattern.

* A ">" means that the following indented text is to be taken literally,
  but newlines are converted into spaces. You can use a blank line
  to indicate a newline.

* A string can be surrounded by double-quotes; inside that, use
  \" for double-quotes and \\ for backslash.

* A string can be surrounded by single-quotes; inside that, use
  '' for a single-quote character (there are otherwise no escapes).

* Otherwise various rules are used to determine its type and interpretation.
  Sequences of digits (no ".") are considered integers.
  In many cases simple text (without quote marks) is considered a string.
  See the YAML specification for details.

Here is some YAML:

~~~~
test1: |
  \s* foo
    \( x \) \;? \s*
test2: >
  This is
  some text.

  Here is more.
test3: "Hello\n\n\\\" there."
test4: 'Hi\n ''there.'
test5: Simple text.
test6:
  - hello
test7:
  - - hello
test8:
  - mykey: 7
    examples:
      - - another test
~~~~

Here is its JSON equivalent:
~~~~
{
  "test1": "\\s* foo\n  \\( x \\) \\;? \\s*\n",
  "test2": "This is some text.\nHere is more.\n",
  "test3": "Hello\n\n\\\" there.",
  "test4": "Hi\\n 'there.",
  "test5": "Simple text.",
  "test6": [
    "hello"
  ],
  "test7": [
    [
      "hello"
    ]
  ],
  "test8": [
    {
      "mykey": 7,
      "examples": [
        [
          "another test"
        ]
      ]
    }
  ]
}
~~~

You can use
[convert yaml to json](https://onlineyamltools.com/convert-yaml-to-json)
to try out YAML.
