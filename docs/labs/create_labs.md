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

### Lab inputs

Places where the user can fill in attempts have an id
of the form `attempt0` (where 0 is the first one, 1 is the second, and so on).
Correct answers are embedded in the web page in a div area with
an id of the form `correct0` (where 0 is the first one, 1 is the second,
and so on). There must be the same number of attempts and correct patterns.
We suggest including the buttons as shown in the examples
(the code will automatically set up the buttons if they are present).

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

### Other info such as hints

You can optionally provide other information in a div with an `id` of `info`.
This must contain a JSON object {...}.

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
This field must be a JSON array, so its value
must begin with `[` and end with `]`.
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

The `present` and `absent` field are regular expression patterns that
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

### Possible future directions: Changed location and format

Currently information such as the pattern of correct answers,
a sample correct answer, and hints, are all embedded in the HTML.
The hints are further encoded with JSON.

An advantage is that a lab is entirely self-contained.
However, this approach creates a challenge: you have to add many
escapes in various places because of JSON, and there's also a risk
that the enclosing HTML could become a problem
(e.g., an &lt; in the material could misinterpreted as a tag).
This is especially a problem with JSON, where \ and " must be escaped
all over. JSON is also rather wordy (e.g., you have to quote field names).
JSON is well-known and easily supported, which is why we started there.

An alternative would be to store such metadata in a separate file.
That would prevent the HTML confusion at least, and it would mean
that tools for editing the overall format (e.g., JSON) would work well.

We might also want to change the format from JSON.
JSON is very wordy and forces many escapes, making it a problem for
our use case. It's easy to *use* (because a JSON reader is built-in),
but we might want to look for alternatives.
The most obvious ones are YAML and NestedText.

YAML would be clearer than JSON and is a common format.
YAML has a number of "sharp edges", so we'd need to be careful about
how it's used. In particular, its "..." construct requires additional
escaping similar to JSON's requirements.
In many cases YAML's "|" (literal scalar) format would probably be best,
because it does *not* have an internal escape mechanism that users
have to fight against.
(Writing regular expressions that use backslash and double-quotes, while
having the escape them a second time, is confusing!)
Per the [YAML version 1.2 specification on literal styles](https://yaml.org/spec/1.2.2/#literal-style),
"Inside literal scalars, all (indented) characters are considered
to be content, including white space characters. Note that all line
break characters are normalized. In addition, empty lines are not
folded, though final line breaks and trailing empty lines are
chomped.
There is no way to escape characters inside literal scalars. This
restricts them to printable characters. In addition, there is no
way to break a long literal line."
This appears to be what we usually want, though in some cases
some of the other formats might be useful.
A negative is that this means bringing in a larger library
and not using most of its functionality.
A positive is that YAML is a well-known format.
Folded style may also make sense.

There are at least [two JavaScript libraries](https://socket.dev/npm/category/server/file-formats/yaml-parser) for YAML that look especially promising:

* [eemeli/yaml](https://github.com/eemeli/yaml) is a JavaScript library
  that can read YAML format. It says it works client-side
  (ISC license, no dependencies), but I didn't immediately see
  instructions on how to to that.
  See [its documentation](https://eemeli.org/yaml/#yaml).
* js-yaml.
  Here is the [node.js info](https://www.npmjs.com/package/js-yaml?activeTab=code), which points to
  [GitHub nodeca/js-yaml](https://github.com/nodeca/js-yaml).
  This has TideLift support.
  [Here is a demo of how to use it client-side](https://stackoverflow.com/questions/13785364/reading-from-yaml-file-in-javascript),
  and here is [further discussion](https://stackoverflow.com/questions/9043765/how-to-parse-yaml-in-the-browser).

An alternative might be to use the less-common
[NestedText format](https://nestedtext.org/en/stable/).
This doesn't require
any escaping of the data (structural information is basically a prefix).
However, it's an uncommon format and
it's not clear how well it's supported on *client-side* JavaScript;
it might require re-implementation if we went that route.
This is a simpler format, but while there's a server-side JavaScript
implementation, I have not found a client-side one.
Thus, its advantages are that it's simpler.
Its disadvantage is needing to implement it and
being less common.
