# Creating labs with checker

These are the instructions for how to create labs with `checker.js`.
The main sections are:

* [Introduction](#introduction)
* [Creating the lab instructions and correct answer](#creating-the-lab-instructions-and-correct-answer)
* [Creating the lab HTML file](#creating-the-lab-html-file)
* [Creating the lab JavaScript file](#creating-the-lab-javascript-file)
  (including [JavaScript notation](#javascript-notation) and
  [Debugging](#debugging))
* [Localization](#localization) (aka translation)
* [Submitting a new or updated lab](#submitting-a-new-or-updated-lab)
* [Academic use](#academic-use)
* [Potential future directions](#potential-future-directions)

## Introduction

The `checker.js` system represents each lab exercise as:

1. An HTML file. There is an HTML file for each lab for each locale.
   If the locale isn't English, the filename is conventionally prefixed
   with the locale name (e.g. `ja`) and an underscore.
   The HTML file provides text explaining the lab exercise and
   a form allowing the learner to enter their answer.
2. A JavaScript file. The JavaScript file is shared between all locales
   for a given lab.
   This file includes an example of an expected answer,
   the pattern(s) defining the correct answer(s),
   and a list of hints to help users complete the lab.
   The file may have other information, including various self-tests
   that are run when an HTML file is loaded.

Everything runs in the user's browser - no installation is needed.
This system does *not* run arbitrary code written by the user.
Users can even download the labs and run them locally, using nothing
other than their web browser, if they want to do that.

There are three basic tasks, which can be done by different people:

1. Identifying the next lab to do.
   See the [README](./README.md) for the list of labs (pick an unassigned one).
   Tell [David A. Wheeler](mailto:dwheele&#114;&#64;linuxfoundation&#46;org).
   which one you want to do; he'll also be happy to answer
   any questions.
2. [Creating the lab instructions and correct answer](#creating-the-lab-instructions-and-correct-answer).
   This is done by a subject matter expert. See below.
3. [Creating the lab HTML file](#creating-the-lab-html-file).
   You'd typically copy an existing lab, like
   [template.html](template.html) or
   [input1.html](input1.html), and modify it for your situation.
   See David A. Wheeler who can help you get started.
4. [Creating the lab JavaScript file](#creating-the-lab-javascript-file).
   You might want to copy
   [template.js](template.js) or
   [input1.js](input1.js) and modify it for your situation.

The text below discusses these in more detail.
We suggest using the [template.html](template.html) and
[template.js](template.js) as a starting point.
You can also see our
[potential future directions](#potential-future-directions).

**NOTE**: At one time we used embedded values in the HTML,
including data in YAML format. We no longer do this; we use
per-lab JavaScript files instead.

## Creating the lab instructions and correct answer

We strongly urge you to first work out the basic lab and what
a *correct* answer would look like. Others can help you create the pattern
that describes a correct answer.

First consult the [section's text in the fundamentals course](more ~/projects/secure-sw-dev-fundamentals/secure_software_development_fundamentals.md).
It's probably best to then create some simple program that
demonstrates it, along with text that explains the task.

Remember that we're assuming that learners know how to program, but we
do *not* assume they know any particular programming language.
See [input1.html](input1.html),
[input2.html](input2.html), and
[csp1.html](csp1.html) for examples of how to do this.

We suggest using the [template](template.html) as a starting point.

## Creating the lab HTML file

Each lab is captured in its own HTML file.
The HTML file of a given lab is expected to:

* Describe the exercise (in HTML text)
* Provide the exercise itself as a form
* Identify where the user will enter their attempted answer(s)
  (id `attempt0` etc.). This also sets its starting value on load.

An easy way implement a lab is to copy
use our [template](template.html) and modify it for your situation.
Again, see [input1.html](input1.html) and [input2.html](input2.html)
for examples.

We suggest including the buttons (Hint, Reset, and Give up)
as shown in the examples.
The code will automatically set up the buttons if they are present.

If the lab is not in English, the `<html>` tag should say
`<html lang="LOCALE">` where LOCALE is the conventional locale ID
(e.g., `ja` for Japanese), and name the file `LOCAL_NAME.html`.

## Creating the lab JavaScript file

### TL;DR

Each lab, regardless of the number of translations, will typically have
a single shared JavaScript file.
This shared JavaScript file provides information on
an example of expected answer(s), a pattern defining the correct answer(s),
hints, and so on.

This shared JavaScript file sets `info` (at least), which provides
relevant information about the lab. This is an object, with
properties like `correct` and `expected`.

Whenever a lab is loaded it automatically runs all embedded self-tests.
At the least, it checks that the initial attempted answer does
*not* satisfy the correct answer pattern, while the example expected answer
*does* satisfy the correct answer pattern.

### Basic lab information

The basic inputs are:

* `expected`: An array of 1+ strings that provide an example
  of an expected *correct* answer. This is what's shown if the learner
  gives up.
* `correct`: An array of 1+ strings that define the *pattern* of
  an acceptable answer.
* `hints`: An array of 0+ hint objects. These provide hints to learners
  who are stuck.

The number of attempt fields (in the HTML), the number of `expected` values,
and the number of `correct` values much match.

### JavaScript notation

The lab data is expressed using JavaScript, primarily as
JavaScript strings.
There's more than one way to express a string in JavaScript, and each
has its advantages:

* "..." - double-quoted string. You don't need to do anything special to
  include a single-quote character in these.
  A backslash (&#92;) followed by something else is treated specially, e.g.,
  &#92;" is interpreted as a double-quote character, while &#92;&#92;
  expresses a backslash.
* '...' - single-quoted string.
* &#96;...&#96; - Template string. A ${...} is specially interpreted,
  as is backslash (&#92;).
* String.raw&#96;...&#96; - Raw template string.
  A ${...} is specially interpreted, but backslash (&#92;) is *not*.
  These can go over multiple lines.
  These are often useful for patterns.
  Use ${BACKQUOTE} for &#96; and ${DOLLAR} for $.

A common error is including the terminating character in the middle of
a string. For example, this is an error: `"A "foo" is metasyntactic variable"`
because the double-quote before `foo` is interpreted as the end of the string.
Some correct alternatives would be
`"A \"foo\" is metasyntactic variable"`
or
`'A "foo" is metasyntactic variable'` (either works).

Values (including strings)
are grouped into two kinds of structures, *arrays* and *objects*:

* array: An ordered sequence of values with this form: `[a, b, c]`
* object: A set of properties and their values with this form:
  `{property1: value1, property2: value2, property3: value3}`

A *really* *common* error is
forgetting to add a comma to separate items
when you add an item to an array or object.
For example, if you add `d` to the array earlier, you might have this
incorrect form: `[a, b, c d]` (ERRONEOUS).

JavaScript allows trailing commas, and we *encourage* using them.
In other words,
a list in JavaScript can have the form `[ 'a', 'b', 'c', ]`
(note the trailing extra comma after `'c'`).
Using trailing commas reduces the likelihood of
forgetting to add the comma between values.
If you using trailing commas, when you add a new item (`'d'`) at the end,
you *already* have the comma ready for use.

If things don't work out, see the [Debugging](#debugging) section.

### Expressing correct answer patterns

The patterns used for `correct` and `hints`
are expressed using a preprocessed form of
[JavaScript regular expression (regex) patterns](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions).

#### Quick introduction to regular expressions (regexes)

Regular expressions are a widely-used notation to indicate patterns.

Regular expressions let us specify
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

#### How we make regexes readable

Regexes are capable and widely used,
but straightforward regex use for this problem
would be hard to read.
We've taken several steps to make it easier to read regex patterns.

One traditional problem with regexes is that they
often have a lot of backslashes.
In many formats (e.g., JSON) those backslashes have to be backslashed,
leading to a profusion of unreadable backslashes sometimes known as
[the true name of Ba'al the soul-eater](https://www.explainxkcd.com/wiki/index.php/1638:_Backslashes).

JavaScript has a standard solution for this problem:
use String.raw&#96;...&#96; (a raw template string).

Another problem is that regexes can be hard to read if they are long
or must often match whitespace.
A "whitespace" is a character that is a space character, tab character,
newline, or return character.

Our solution is that we *preprocess* the regular expressions
in a lab to make them easier to enter and read.

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

### Expressing JavaScript code patterns

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

### Example pattern

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
   WARNING: If you use JavaScript raw strings or templates, you
   need to escape the backquote (&#96;) character.

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

### Other info

You can provide these fields for testing:

* Field `successes`: if present, this is an array of examples.
  Each example is an array of strings.
  Every example in `successes` should pass.
* Field `failures`: if present, this is an array of examples.
  Again, each example is an array of strings.
  Every example in `failures` should fail.
* `debug`: If present and `true`, the program will present
   some data that may help you debug problems.
* `hints`: If present, this is an array of hints.
  We discuss that now.

We encourage creating many self-tests (`successes`, `failures`, and
tests for hints).

### Hints

Hints are expressed in the info `hints` field.
This field must be an array
(its value must begin with `[` and end with `]`).
Inside the array is a list of hint objects.
Each hint object describes a hint, and they are checked in the order given
(so the earliest matching hint always takes precedence).
Each hint object begins with `{`, has a set of fields, and ends with `}`.

#### Format for a hint

Every hint object must have a `text` field to be displayed as the hint.
Translations can be provided as `text_LOCALE`, e.g., `text_ja` is the
Japanese version of the hint.

A hint object can have a `present` field (a pattern that must be present
for the hint to be shown), and it can have an
`absent` field (a pattern that must be absent for the hint to be shown).
A hint can have both a `present` and `absent` field, or neither.
A hint with neither a `present` nor `absent` field always matches;
you can make the last hint do this to set a default hint.

The `present` and `absent` fields are regular expression patterns that
are preprocessed similarly to a correct answer.
*However*, they
don't have to exactly match (start the pattern with `^` and end it with
`$` if you want an exact match). Again, one or more spaces are interpreted
as allowing 0 or more spaces.

A hint has a default index of 0, that is, it
checks the first `attempt0` against first `correct` pattern.
If you want to check an index other than `0`, add an `index` field and provide
an integer.

A hint can include an `examples` field, which must then contain
an array of examples which are used as tests.
Each example is an array of Strings; each element
corresponds to the indexes.
On load the system will verify that each example will report the
matching hint (this helps ensure that the hint order is sensible).

At the time of this writing, all examples are loaded and used as tests
to ensure that the hint requested is actually the one reported.
If your example is for a later index, provide test values that
don't trigger earlier index values. Currently those values are ignored,
but future versions will probably use them when checking the examples.

#### Examples of hints

Here are examples of hints:

~~~~javascript
hints: [
  {
    absent: ", $",
    text: "This is a parameter, it must end with a comma.",
    examples: [
      [ "  " ],
    ],
  },
  {
    present: "(isint|Isint|IsInt|ISINT)",
    text: "JavaScript is case-sensitive. Use isInt instead.",
    examples: [
      [ "  query('id').isint()," ],
      [ "  query('id').IsInt()," ],
    ],
  },
],
~~~~

The first hint triggers when the user attempt does *not* contain the
pattern <tt>,&nbsp;$</tt> (note the term `absent`).
This pattern matches on a comma, followed by 0 or more whitespace characters,
followed by the end of the input.
The index isn't specified, so this will check attempt #0 (the first one).
So if there's no comma at the end (ignoring trailing whitespace),
this hint will trigger with the given text.
The examples are test cases that *should* trigger this hint.

The second hint triggers when the user attempt *contains* the given
pattern (note the term `present`).

### Preventing problems

As always, it's best to try to
make smaller changes, test them, and once they work
check them in. That way you won't need to debug a long complicated
set of changes.
See the next section on [testing](#testing).

### Testing

Every time you reload the lab HTML, the program will reload and
all self-tests will be run. If you see no errors, and the text entry
areas are showing in yellow, a *lot* of things are working well.

Please create tests! You should create test cases for full attempts
(`successes` should pass, `failures` should fail) and test cases
for hints (`examples`).

Hints are checked in order - it's possible to create a hint
that won't trigger because something earlier would always match.
All tests are automatically re-run every time the page is (re)loaded.

In a hint, `examples` is an array of examples that should trigger the hint.
Each example is an array of answers. If you use an index, the other index
values aren't considered. We suggest using `null` for array entries
that aren't relevant for the test.

The script `mass-test` for Linux or MacOS will automatically open
every lab in your default browser's current window.
This will rerun all our lab automated tests.
If every lab has a yellow text entry area, and doesn't show test failure
alerts, then all the labs pass the test.

### Debugging

Sadly, sometimes things don't work; here are some debugging tips for labs.

If you load a page and the text entries don't have color, there
was a serious problem loading things.
Use your browser's *Developer Tools* to show details.
In Chrome, this is More Tools -> Developer Tools -> (Console Tab).
In Firefox, this is More Tools -> Web Developer Tools -> (Console Tab).
You may need to further open specifics to see them.
Often the problem is that (1) a line just before added material needs a
trailing comma, or (2) a string was not properly closed (e.g.,
it is double-quoted but includes double-quote that was not properly escaped).

If the JavaScript loads successfully, but then a self-test fails,
you'll see alert box(es) telling you which tests failed.
See [testing](#testing).

Note:

* If you're running locally, you can ignore the error
  "Failed to load resource: net::ERR_FILE_NOT_FOUND /assets/css/style.css:1",
  this reports an attempt to load a file that's hosted on GitHub pages,
  and that page is unlikely to exist on your local machine.

We encourage you to add many self-tests (e.g., `successes`, `failures`, and
tests for hints) when creating labs.

You can set the optional info "debug" field to true.
This will display information, particularly on its inputs.
This can help you track down a problems if you think your
inputs are being interpreted in a way different than you expect.

See the [JavaScript notation](#javascript-notation) section on how to write
data in JavaScript.

### Advanced use: Definitions

Regular expressions make it easy to describe many patterns.
However, it's sometimes useful to give certain sequences names, or
use the same sequence in different circumstances.

You can use JavaScript to define values, and even use values to compute
other values. By convention constants are usually in uppercase letters, e.g.,
`FOO = "bar";`. In a template you can use them using `${...}`, for example,
`${FOO}`.

If you doh't want to use JavaScript's mechanisms, there is an alternative.
Checker allows you to define named terms, and then use them in a regular
expression.
This is done in the `definitions` section, which is a sequence
of a `term` name and its corresponding `value`.
Any use of the same term in a later definition or a regular expression
will replaced by its current definition.
Leading and trailing whitespace in the value is removed.

Here's an example:

~~~~javascript
definitions: [
  {
    term: 'RETURN0'
    value: 'return \s+ 0 ;'
  },
  {
    term: 'RETURN0'
    value: String.raw`(RETURN0|\{ RETURN0 \})`
  },
]
~~~~

The first entry defines `RETURN0` as the value `\s+ 0 ;`
so any future use of RETURN0 will be replaced by that.
The next entry uses the *same* term name, and declares it to be
`(RETURN0|\{ RETURN0 \})`.
The result is that the new value for `RETURN0` will be
`(\s+ 0 ;|\{ \s+ 0 ; \})` - enabling us to have
an expression <i>optionally</i> surrounded by curly braces.

### Advanced use: Select preprocessing commands (e.g., for other languages)

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
2. The string that will replace each match.
   This be used *exactly* as it's provided.
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

~~~~javascript
  preprocessing: [
    [
      // Ignore newlines
      String.raw`[\n\r]+`,
      ""
    ],
    [
      // Convert \s+ surrounded by tabs/spaces as \s+ (optimization)
      String.raw`[ \t]+\\s\+[ \t]+`,
      String.raw`\s+`
    ],
    [
      // Convert 1+ spaces/tabs, optionally surrounded by \s*, as \s*
      String.raw`(\\s\*)?[ \t]+(\\s\*)?`,
      String.raw`\s*`
    ]
  ],
  preprocessingTests: [
    [
      String.raw`\s* console \. log \( (["'${BACKQUOTE}])Hello,\x20world!\1 \) ; \s*`,
      String.raw`\s*console\s*\.\s*log\s*\(\s*(["'${BACKQUOTE}])Hello,\x20world!\1\s*\)\s*;\s*`
    ],
    [
      String.raw`\s* foo \s+ bar \\string\\ \s*`,
      String.raw`\s*foo\s+bar\s*\\string\\\s*`
    ]
  ]
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

## Localization

We'd love to see translations of labs into various natural languages!

First, identify the standard identifier for your locale, e.g.,
for Japanese it is `ja`. We'll call that LOCALE from here on.

If we haven't done your language already, look at `checker.js` for the
`resources =` object. Add or modify ones for your language.
There aren't many strings to translate.

Each lab is a separate HTML file. To create a translation,
copy the HTML file into another file with a similar name indicating its locale.
We currently recommend it be named `LOCALE_oldname.html`, e.g.,
the Japanese (`ja`) translation of `input1.html` would be `ja_input1.html`.
Use the most common locale name and make it clear, e.g.,
for simplified Chinese use the locale `zh-CN`, for Brazilian Portuguese use
`pt-BR`, for French use `fr`.

Now edit the HTML file to translate its text into your locale:

* Modify the &lt;html&gt; statement to say &lt;html lang="LOCALE"&gt;
* Modify the HTML text.
* Modify the JavaScript text. Basically, every `text` value should have a
  corresponding `text_LOCALE` value.

You can try out [hello](hello.html) to start simple.
See [ja_hello](ja_hello.html) to see its Japanese translation.

The [list of labs](https://best.openssf.org/labs/) provides more information.
WARNING: We aren't currently using all labs we have.
Make sure you focus on the labs in use first :-).

See the [JavaScript notation](#javascript-notation) section on how to write
data, and
the [Debugging](#debugging) section to see how to understand and fix problems.

### No longer using embedded data or YAML

At one time we used data files embedded in the HTML (e.g., YAML,
expected answers, and correct answers).
YAML is a widely-used data format, and we made a lot of
progress using it.

Unfortunately, for our specific circumstance
having data files embedded in the HTML caused problems for localization.
When data files were embedded they couldn't
be shared between locales.
When we tried to make them
separate files (so they could be shared),
we found we could no longer easily run the labs locally
without additional conversion steps.
The problem is that when run locally,
JavaScript can't load other files due to security restrictions.
YAML is not the problem; switching to JSON or other formats
would have exactly the same problem.
If we made a single file for a lab for all locales, there would be
no easy way to specify which locale to load ahead-of-time.

We have transitioned to having a shared JavaScript file, one per lab.
Web browsers *are* allowed to load JavaScript through HTML.
This means we can have a data file shared between locales.
E.g., `input1.html` and `ja_input1.html` will both load
a corresponding `input1.js`
with configuration information that is shared between translations.

If you set an info2, on load any differences between info and info2
will be reported.

You can start a conversion from YAML to JavaScript using the `yq` tool:

~~~~sh
yq eval hello.yaml -o=json -P > hello.js
~~~~

Prepend the result with `info =`.
Now load the JavaScript as a script (after the main library).

## Submitting a new or updated lab

To submit new or updated labs, create a pull request on the
[OpenSSF Best Practices Working Group (WG) repository](https://github.com/ossf/wg-best-practices-os-developers/)
under the `docs/labs` directory.
Simply fork the repository, add your proposed lab in the `docs/labs` directory,
and create a pull request.

## Academic use

These labs were created for LFD121. However, they can (and are) also used
for other situations, such as for academic use.
We welcome those other uses! This does raise the issue of countering cheating.

We can't prevent all cheating. The answers can be shared among students,
and answers are visible to those who look at its source.
In addition, some learners may be unable to figure out the answer, so we
provide a "give up" button.

However, cheating is fundamentally a lazy approach, and we take some steps to
address this.
The "give up" button has a timer, so people can't load the page and
*immediately* give up to see the answer.
When a lab is completed, that is clearly indicated at the bottom.
In English this stamp has the word "Completed" at the bottom.
After that, it has a precise datetime of the completion time, followed
by a random unique value (a UUID), and a hash value computed from the
datetime stamp and random value.
All of this is followed by `(GA)` if the learner gave up in this session.
If two learners submit labs with the same datetime and random value,
then a single lab
session is being claimed by more than one learner (in other words,
there was cheating).
Changing the datetime or UUID, without fixing the hash, can also be used
to detect an invalid lab submission.
This doesn't detect all cheating, but these mechanisms
do provide a way to detect some kinds of cheating.

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
