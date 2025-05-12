// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      present: "/",
      text: "In JavaScript a constant regular expression is surrounded by forward slashes like /PATTERN/. However, for this exercise we only want the text inside the slashes (the pattern itself).",
      examples: [
        [ "/" ],
      ],
    },
    {
      present: "[\"'`]",
      text: "In this exercise we only want the regular expression pattern itself. There is no need to use any kind of quote mark.",
      examples: [
        [ "'" ],
      ],
    },
    {
      absent: String.raw`^\^`,
      text: "For input validation, start with '^' to indicate a full match.",
      examples: [
        [ "(Y|N)" ],
      ],
    },
    {
      present: String.raw`\\[Zz]`,
      text: "The ECMAScript (JavaScript) specification does not support \\Z or \\z.",
      examples: [
        [ "^Y|N\\z" ],
      ],
    },
    {
      absent: String.raw`\$$`,
      text: "For input validation, end with '$' to indicate a full match.",
      examples: [
        [ "^(Y|N)" ],
      ],
    },
    {
      absent: String.raw`[\|\[]`,
      text: "Consider using [YN], to match either a Y or an N.",
      examples: [
        [ "^$" ],
      ],
    },
    {
      present: String.raw`\|`,
      absent: String.raw`\(`,
      text: "If you use \"|\" you must parentheses or the precedence will be wrong. For example, \"^A|B$\" accepts anything beginning with A, and it also accepts anything ending with B. That is not what you want.",
      examples: [
        [ "^Y|N$" ],
      ],
    },
    {
      present: " ",
      text: "Spaces normally match spaces in a regex. Do not use them in this case, because a space is not one of the allowed characters.",
      examples: [
        [ "^[YN] $" ],
      ],
    },
    {
      absent: String.raw`^\^`,
      index: 1,
      text: "For input validation, start with '^' to indicate a full match.",
      examples: [
        [ null, "" ],
      ],
    },
    {
      absent: String.raw`\$$`,
      index: 1,
      text: "For input validation, end with '$' to indicate a full match.",
      examples: [
        [ null, "^" ],
      ],
    },
    {
      absent: String.raw`\[A-Z\]`,
      index: 1,
      text: "You can use [A-Z] to match one uppercase Latin letter (A through Z).",
      examples: [
        [ null, "^$" ],
      ],
    },
    {
      present: String.raw`\^\[A-Z\]\*`,
      index: 1,
      text: "A \"*\" matches one or more, not one or more.",
      examples: [
        [ null, "^[A-Z]*$" ],
      ],
    },
    {
      present: String.raw`\(`,
      index: 1,
      text: "You do not need parentheses to solve this problem.",
      examples: [
        [ null, "^([A-Z])+$" ],
      ],
    },
    {
      absent: String.raw`\[A-Z\](\+|\[A-Z\]\*)`,
      index: 1,
      text: "You can use [A-Z]+ to match one or more uppercase Latin letters.",
      examples: [
        [ null, "^[A-Z]$" ],
      ],
    },
    {
      present: "True",
      index: 2,
      text: "Regular expressions are case-sensitive by default; use \"true\"",
      examples: [
        [ null, null, "True" ],
      ],
    },
    {
      present: "False",
      index: 2,
      text: "Regular expressions are case-sensitive by default; use \"false\".",
      examples: [
        [ null, null, "False" ],
      ],
    },
    {
      absent: String.raw`\|`,
      index: 2,
      text: "Use \"|\" to express alternatives.",
    },
    {
      present: String.raw`^\^true\|false\$$`,
      index: 2,
      text: "No. This would match anything beginning with the term true, or anything ending with the term false. Use parenthesis.",
    },
    {
      present: String.raw`^\^false\|true\$$`,
      index: 2,
      text: "No. This would match anything beginning with the term false, or anything ending with the term true. Use parenthesis.",
    },
    {
      absent: String.raw`\(`,
      index: 2,
      text: "Use parentheses.",
    },
    {
      present: String.raw`\$`,
      index: 3,
      text: "This is Python, not ECMAScript (JavaScript). Use \\Z at the end, not $.",
      examples: [
        [ null, null, null, "^[A-Z]+$"],
      ],
    },
    {
      present: String.raw`\\z`,
      index: 3,
      text: "This is Python. Use \\Z at the end, not \\z.",
      examples: [
        [ null, null, null, "^[A-Z]+\\z"],
      ],
    },
    {
      absent: String.raw`^\\A`,
      index: 4,
      text: "This is Ruby. Use \\A at the beginning.",
      examples: [
        [ null, null, null, null, "^[A-Z]+$"],
      ],
    },
    {
      absent: String.raw`\\z$`,
      index: 4,
      text: "This is Ruby. Use \\z at the end.",
      examples: [
        [ null, null, null, null, "\\A[A-Z]+$"],
      ],
    },
    {
      absent: String.raw`\[A-Z\]`,
      index: 4,
      text: "Use [A-Z] to match one uppercase Latin letter.",
    },
    {
      present: String.raw`\[A-Z\](\*|\+)`,
      index: 4,
      text: "In this case we are only matching one letter, not many of them. Do not use \"*\" or \"+\" after [A-Z].",
    },
  ],
  expected: [
    '^[YN]$',
    '^[A-Z]+$',
    '^(true|false)$',
    String.raw`^[A-Z]+\Z`,
    String.raw`\A[A-Z]-[0-9]+\z`,
  ],
  correct: [
    String.raw`\^(
      \[YN\]|\[NY\]|
      \( (\?\:)? Y\|N \)|
      \( (\?\:)? N\|Y \) )\$`,
    String.raw`\^ \[A-Z\](\+|\[A-Z\]\*) \$`,
    String.raw`\^\( (\?\:)?
      (true\|false|false\|true)\)\$`,
    // Python uses \Z
    String.raw`\^ \[A-Z\] (\+|\[A-Z\]\*) \\Z`,
    // Ruby uses \A and \z
    String.raw`\\A \[A-Z\]-(\[0-9\]|\\d)
      (\+|(\[0-9\]|\\d)\*) \\z`,
  ],
  preprocessing: [
    [
      "\\s*",
      ""
    ],
  ],
};
