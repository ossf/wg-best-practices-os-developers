# Possible future directions: Changed location and format

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
