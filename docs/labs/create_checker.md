# Creating labs with checker

These are the instructions for how to create labs with `checker.js`,

## Introduction

The `checker.js` system
represents each lab exercise in an HTML file.
You define a pattern that the correct answer must match
using regular expressions (as well as a example of an expected answer).
This system does *not* run arbitrary code written by the user.
You can also provide patterns for various hints.

The HTML file of a given lab is expected to:

* Describe the exercise (in HTML text)
* Provide the exercise itself as a form
* Identify where the user will enter their attempted answer(s)
  (id `attempt0` etc.)
* Provide information about the lab, in particular:
  * Provide an example of an expected answer (id `expected0` etc.)
  * Provide the pattern of a correct answer (id `correct0` etc.)
  * Optionally provide other information such as tests and hints (id `info`)

The system is implemented by the client-side JavaScript file `checker.js`.

## TL;DR

We strongly urge you to first work out the basic lab and what
a *correct* answer would look like. Others can help you create the pattern
that describes a correct answer.

An easy way implement a lab is to copy
[input1.html](input1.html) and modify it for your situation.
Modify the `expected0` section to have a sample expected answer, and
`correct0` to have a full pattern for a correct answer.
You can comment out the `info` section (put `#` in front of each line)
to start.

See [input1.html](input1.html) and [input2.html](input2.html)
for examples.

Whenever a lab is loaded it automatically runs all embedded self-tests.
At the least, it checks that the initial attempted answer does
*not* satisfy the correct answer pattern, while the example expected answer
*does* satisfy the correct answer pattern.

We suggest including the buttons (Hint, Reset, and Give up)
as shown in the examples.
The code will automatically set up the buttons if they are present.

## Quick aside: script tag requirements

Data about the lab is embedded in the HTML in a
`script` tag. Embedding this data simplifies lab maintenance,
and this approach is the
[recommended approach for embedding script-supporting elements](https://html.spec.whatwg.org/multipage/scripting.html).

This technique does create a
[few quirky restrictions](https://html.spec.whatwg.org/multipage/scripting.html#restrictions-for-contents-of-script-elements),
though it shouldn't matter in practice.
Basically, the text embedded in the `script` sections must
*not* include the following text sequences (ignoring case):

* `<!--`
* `<script`
* `</script`

If you *need* to include these text sequences inside the `script` region,
you can typically you can replace `<` with `\x3C` to resolve it.

## Basic lab inputs

The basic inputs are:

* Identify where the user will fill in answer(s) (id `attempt0` etc.).
  This also sets the starting value.
* Provide an example of an expected answer (id `expected0` etc.)
* Provide the pattern of a correct answer (id `correct0` etc.)

It's possible to have multiple attempt fields, in which case they are
in order (0, 1, 2, ...).
The number of attempt fields, expected fields, and correct fields
much match.

## Expressing correct answer patterns

Correct answer patterns are expressed using a preprocessed form of
[JavaScript regular expression (regex) patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).

### Quick introduction to regular expressions (regexes)

Regular expressions are a widely-used notation to
indicate patterns.
In this case, they let us specify
the many different forms that are all correct. E.g.:

* Pattern `(abc|def)` matches `abc` or `def`
* Append `*` to mean "zero or more",
  `+` to mean "one or more", and `?` to mean "optional".
  By default this describes repetition of the previous character;
  use `(` ... `)` to group a larger sequence of characters.
* Use backslash (<tt>&#92;</tt>) to escape many characters, e.g.,
  pattern `foo\(a\)` matches `foo(a)` and
  pattern `\{\\\}` matches the literal text `{\}`.
* Pattern `9_?999` matches `9`, an optional underscore
  (<tt>&#95;</tt>) because the `?` makes it optional, then `999`.

### How we make regexes readable

Regexes are capable and widely used,
but straightforward regex use for this problem
would be hard to read.
We've taken several steps to make it easier to read regex patterns.

One traditional problem with regexes is that they
often have a lot of backslashes.
In many formats (e.g., JSON) those backslashes have to be backslashed,
leading to a profusion of unreadable backslashes sometimes known as
[the true name of Ba'al the soul-eater](https://www.explainxkcd.com/wiki/index.php/1638:_Backslashes).

We solve this by allowing patterns to be expressed either directly
in script tags or in YAML (which has input formats that don't require
backslashing the backslashes).

Another problem is that regexes can be hard to read if they are long
or must often match whitespace.
A "whitespace" is a character that is a space character, tab character,
newline, or return character.

Our solution is that we *preprocess* the regular expressions
to make them easier to enter and read.

By default, the regex pattern for each correct answer
and each hint is preprocessed as follows:

* The user's `attempt` must match the *entire* corresponding
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
  usually visible. Use a space followed by `\s*` instead.
* If your answer is in JavaScript, you probably want to begin the answer
  with `\s*` followed by space to indicate "0 or more spaces are allowed here".
  Most tokens should also be separated by a space, to indicate that they're
  allowed. You should probably end it with a space and then `\s*`
  to indicate trailing whitespace is allowed.
* Use \s to match one (required) whitespace character, use \x20 require
  a space character.
  As usual, append "+" to either if you want to require "1 or more".

Typical regex languages do not have a built-in way to indicate
"all of the following patterns are required, and use this pattern as the
separator".
It would be *awesome* if it did
(e.g., for listing multiple fields in JavaScript object).
If they're short and there are only two options you can list both.
You can also require a specific order, explaining the text the order you want
and possibly providing hints if they use a "wrong" order.
The *simplest* approach is to require a specific order.

If you *really* want to allow arbitrary orders, you can use
lookahead matching as described in
[Matching several things (in no particular order) using a single regex](https://perlancar.wordpress.com/2018/10/05/matching-several-things-in-no-particular-order-using-a-single-regex/).
This approach has a flaw: it will match some kinds of *wrong* text
as well as accepting correct text.
You can greatly reduce this by requiring a strict *general* pattern after
defining the lookahead patterns for all required specific answers.
If you need that kind of order flexibility for longer lists, that is the
best approach I've found.

## Expressing JavaScript code patterns

If you're defining a pattern to match an answer that is a
snippet of JavaScript code, here are some tips:

* Escape regex symbols by putting \ before them.
  These are <tt>. ( ) [ ] { } | + * ? \ </tt>
* Most language tokens should be separated by a space, e.g.,
  <tt>foo&nbsp;&#92;(</tt> which means 0 or more whitespace is allowed
  after `foo`
* If the language *requires* a space, use `\s+`, e.g.,
  <tt>const&#92;s+helmet</tt>
* Put <tt>\s*</tt> at the beginning of each line in the correct pattern,
  in case we want to move that to YAML later.
* JavaScript constant strings can be surrounded by
  <tt>"</tt> or <tt>'</tt> or <tt>&#96;</tt> (backquote)
* JavaScript allows trailing commas at the end of
  the list in a literal array, as well as in
  the key-value pairs in object literal syntax.
  Use <tt> ,? </tt> to permit them.
* End it with <tt>\s*</tt> to allow trailing whitespace.

It's impractical to match all possibilities, e.g., <tt>1</tt> can be
written as <tt>(5-4)</tt>, but that would be an absurd thing for a
student to do.

## Example pattern

Here's an example pattern for matching a correct answer:

~~~~regex
\s* query \( ('id'|"id"|`id`) \) \.
    isInt \( \{ min: 1 , max: 9_?999 ,? \} \) , \s*
~~~~

Here's an explanation of this pattern:

1. We start with `\s*` followed by a space
   to indicate that 0 or more whitespace at the beginning is fine.
   We could just use a leading space, but that indent might not be noticed,
   and it doesn't work well with YAML.

2. The word `query` matches the word "query" and nothing else
   (not even `Query`). Notice the space after it - that means
   0 or more whitespace is allowed after the word "query".

3. The sequence `\(` matches one open parenthesis.
   A parentheses have a special meaning it regexes
   (they group patterns), so to match a literal open parenthesis
   you must precede it with a backslash.
   Note the space afterwards, which again will match 0 or more whitespace.

4. The sequence <tt>('id'|"id"|&#96;id&#96;)</tt>
   uses parentheses to group things together.
   The `|` means "or".
   This that one of the following patterns is allowed:
   `'id'` or `"id"` or <tt>&#96;id&#96</tt> (and nothing else).
   Again, the space after it means 0+ spaces are allowed.

5. The `\)` matches a literal close parenthesis,
   while `\.` matches a literal period.

6. The sequence of indented spaces means that 0 or more spaces are allowed
   here. The patterns `isInt` and `\(` are the same kinds of patterns
   we've seen.
   Similarly, a `\{` matches a literal open brace.

7. The pattern `9_?999` means a nine, an optional `_`
   (`?` means the preceding pattern is optional), and three more `9`
   characters. JavaScript numbers allow `_` in them as a separator, and
   some might use that in a thousands column.
   Similarly, `,?` means that the (trailing) comma in this position
   is optional.

8. The final `\s*` with a space before it matches 0 or more spaces.
   We could end the line with a space, but it wouldn't be visible.
   By ending the last pattern with `\s*` we make it clear that
   trailing whitespace is allowed at the end.

## Other info

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

## Hints

Hints are expressed in the info `hints` field.
This field must be an array
(in JSON its value must begin with `[` and end with `]`).
Inside the array is a list of hint objects.
Each hint object describes a hint, and they are checked in the order given
(so the earliest matching hint always takes precedence).
If you use JSON format,
each hint object begins with `{`, has a set of fields, and ends with `}`.

### Format for a hint

Every hint object must have a `text` field to be displayed as the hint.
A hint object can have a `present` field (a pattern that must be present
for the hint to be shown), and it can have an
`absent` field (a pattern that must be absent for the hint to be shown).
A hint can have both a `present` and `absent` field, or neither.
A hint with neither a `present` nor `absent` field always matches;
you can make this kind of hint to set a default hint.

The `present` and `absent` fields are regular expression patterns that
are preprocessed similarly to a correct answer.
*However*, they
don't have to exactly match (start the pattern with `^` and end it with
`$` if you want an exact match). Again, one or more spaces are interpreted
as allowing 0 or more spaces.

A hint has a default index of 0, that is, it
checks `attempt0` against the pattern `correct0`.
If you want to check an index other than `0`, add an `index` field and provide
an integer.

A hint can include an `examples` field, which must then contain
an array of examples (each example is an array of Strings).
On load the system will verify that each example will report the
maatching hint (this helps ensure that the hint order is sensible).

### Examples of hints

Here are examples of hints:

~~~~yaml
hints:
- absent: ", $"
  text: This is a parameter, it must end with a comma.
  examples:
  - - "  "
- present: "(isint|Isint|IsInt|ISINT)"
  text: JavaScript is case-sensitive. Use isInt instead of the case you have.
  examples:
  - - "  query('id').isint(),"
  - - "  query('id').IsInt(),"
~~~~

The first hint triggers when the user attempt does *not* contain the
pattern <tt>,&nbsp;$</tt> (note the term `absent`).
This pattern matches on a comma, followed by 0 or more whitespace characters,
followed by the end of the input.
The index isn't specified, so this will check attempt #0 (the first one).
So if there's no comma at the end (ignoring trailing whitespace),
this hint will trigger with the given text.
The <tt>-&nbsp;-</tt> line is a test case that *should* trigger
the hint.

The second hint triggers when the user attempt *contains* the given
pattern (note the term `present`).

## Notes on YAML

The info section supports
[YAML format version 1.2](https://yaml.org/spec/1.2.2/).
YAML 1.2 was released in 2009 and
is an improvement over YAML 1.1, e.g., YAML 1.2 doesn't have the
so-called "Norway problem".
YAML is a widely-used, widely-understood, and widely-implemented format,
which is why we use it.

YAML is a superset of JSON, so if you'd prefer to write in straight JSON,
you can do that.
JSON is a simple format, which is a bonus.
However, JSON is noisy for this situation, especially when there
are many backslashes and double-quotes (as there are in patterns).
For this use case, JSON is probably unnecessarily hard to read and use.
Still, if you prefer, you can use it.
If you use JSON, remember:

* All strings must be surrounded by double-quotes, even field names.
* Commas *must* separate entries.
* JSON does *not* support trailing commas in arrays and dictionaries.
* JSON fails to support comments.
* Inside a string use `\"` for double-quote and `\\` for backslash.

You can also use full YAML.
YAML comments start with "#" and continue to the end of the line.
Field names with just alphanumerics, underscore, and dash
don't require quoting (unlike JSON).
Leading "-&nbsp;-" means an "array of arrays", which happens often
if you have a single input.

YAML has several ways to indicate strings and other scalar data:

* You can use `|` to indicate that the following indented text line(s)
  are to be taken literally (after removing the amount of indentation of the
  following list, and each line is its own line).
  This is probably the best mechanism for
  non-trivial patterns; you don't need to backslash anything.
  You probably want to use "\s*" to begin the first line of the pattern.
  For clarity you might use `|-` instead of `|` (this removes trailing
  newlines), though it most cases it doesn't matter for this use.

* A ">" means that the following indented text is to be taken literally,
  but newlines are converted into spaces. You can use a blank line
  to indicate a newline. Again, ">-" removes trailing newlines.

* A string can be surrounded by double-quotes; inside that, use
  \" for double-quotes and \\ for backslash.

* A string can be surrounded by single-quotes; inside that, use
  '' for a single-quote character (there are otherwise no escapes).

* Otherwise various rules are used to determine its type and interpretation.
  Sequences of digits (no ".") are considered integers.
  In many cases simple text (without quote marks) is considered a string,
  but consider quoting the text (using any of the other formats)
  to ensure it's considered a string.
  See the YAML specification for details.

Here is some YAML followed by its equivalent JSON, to clarify
how YAML works:

~~~~yaml
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

~~~~json
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
~~~~

You can use
[convert yaml to json](https://onlineyamltools.com/convert-yaml-to-json)
to interactively experiment with YAML.

## Preventing problems

As always, it's best to try to
make smaller changes, test them, and once they work
check them in. That way you won't need to debug a long complicated
set of changes.

Please create tests! You can create test cases for attempts
(`successes` should pass, `failures` should fail), and test cases
to ensure the hints work correctly.
Remember, hints are checked in order - it's possible to create a hint
that won't trigger because something earlier would always match.
These tests are automatically checked every time the page is (re)loaded.

## Debugging

Sadly, sometimes things don't work; here are some debugging tips for labs.

If you open a page and the text entries don't have color, there
was a serious problem loading things (e.g., the JavaScript code or
YAML info has a syntax error).
Use your browser's Developer Tools to show details.
In Chrome, this is More Tools -> Developer Tools -> (Console Tab).
In Firefox, this is More Tools -> Web Developer Tools -> (Console Tab).
You may need to further open specifics to see them.
Note:

* If you see an error in the YAML processing, remember that the reported
  line numbers are relative to the beginning of the *YAML* data,
  not of the entire file.
* If you're running locally, you can ignore the error
  "Failed to load resource: net::ERR_FILE_NOT_FOUND /assets/css/style.css:1",
  this reports an attempt to load a file that's hosted on GitHub pages,
  and that page is unlikely to exist on your local machine.

You can set the optional info "debug" field to true.
This will display information, particularly on its inputs.
This can help you track down a problems if you think your
inputs are being interpreted in a way different than you expect.

## Additional settings for natural languages other than English

This tool should work fine with languages other than English.
We expect that there will be a different HTML page for each
lab and each different natural language.

*However*, it sets some default tooltips for the buttons in English.
For each button you should set the `title` attribute for the
given language.

## Advanced use: Select preprocessing commands (e.g., for other languages)

For most programming languages the default regex preprocessing
should be fine. However, the *defaults* are *not* a
good fit for some programming languages such as Python.
It's also possible that some patterns for correct answers include
repeating patterns.

This `checker.js` system lets you define your own
regex preprocessing commands.
This functionality is *advanced* - hopefully you won't need to do it.

To do this, set the `preprocessing` field to an array.
Each array element should itself be an array of:

1. A regular expression (expressed as a string).
   I suggest using `|-` in YAML (stripping the trailing newlines)
   for the patterns, though the system *will* strip leading and trailing
   newlines from patterns regardless to eliminate likely errors with this.
2. The string that will replace each match.
   This be used *exactly* as it's provided, so in YAML, I recommend using
   "..." to make it clear, or at worst `|-` as a prefix.
   Many YAML forms leave a trailing newline, which can create surprises.
3. (Optional) Regex flags. If not provided "g" (global) will be used.
   Do *not* use multiline (`m`) mode! We do matches of entire phrases
   by surrounding an attempt with `^(?:` on the left and `)$` on the right.
   JavaScript's default is that `^` matches the beginning of the string and
   `$` matches the end. However, setting multiline would break this.
   We can't replace `^` with `\A` and replace `$` with `\z` because
   these buffer boundary constructs are not in ECMAScript/JavaScript,
   though there [is a proposal to add them](https://github.com/tc39/proposal-regexp-buffer-boundaries).

You can also test preprocessing by setting the info field
`preprocessingTests` - if you don't set `preprocessing` itself, you're
testing the default preprocessor.
The `preprocessingTests` field contains an array of examples that
test the preprocessor.
Each example array is two elements long;
the first is a pattern that could be
requested, and the second is post-processed pattern that should result.
There's no need for a "failure" test suite here, because we
demand exact results for every test case.

Here is an example:

~~~~yaml
preprocessing:
  - 
    - |-
        [\n\r]+
    - ""
  -
    - |-
        [ \t]+\\s\+[ \t]+
    - "\\s+"
  -
    - |-
        (\\s\*)?[ \t]+(\\s\*)?
    - "\\s*"
preprocessingTests:
  -
    - |-
        \s* console \. log \( (["'`])Hello,\x20world!\1 \) ; \s*
    - |-
        \s*console\s*\.\s*log\s*\(\s*(["'`])Hello,\x20world!\1\s*\)\s*;\s*
  -
    - |-
        \s* foo \s+ bar \\string\\ \s*
    - |-
        \s*foo\s+bar\s*\\string\\\s*
~~~~

Here is an explanation of each of these preprocessing elements
in this example:

1. Remove end-of-line characters (`\n` and `\r`)
2. An optimization. This removes useless spaces and tabs if they surround `\s+`
   (speeding up matching).
   This optimization ONLY occurs when spaces/tabs are on both sides,
   to prevent false matches.
3. 1+ spaces/tabs are instead interpreted as `\s*` (0+ whitespace).
   The optional expressions before and after it are an optimization,
   to coalesce this for speed.

In the preprocessing replacement text, you can use `$` followed by a digit
to refer to the corresponding capturing group.

If you load `hello.html` you'll automatically run some self-tests on
the default preprocessor.

## Potential future directions

Below are notes about potential future directions.

Currently this system uses simple input and textarea tags
to retrieve data.
It might be useful to (optionally?) replace that with a code editor.
[Wikipedia's Comparison of JavaScript-based source code editors](https://en.wikipedia.org/wiki/Comparison_of_JavaScript-based_source_code_editors) lists many options.
[CodeJar](https://medv.io/codejar/)
([CodeJar repo](https://github.com/antonmedv/codejar))
looks promising. It has an MIT license, only about 2.5kB,
and you can use a highlighting library such as PrismJS or your own;
it doesn't do any bracket matching though.
There are many larger ones such as Ace and CodeMirror.

