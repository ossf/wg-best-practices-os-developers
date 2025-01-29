info =
{
  hints: [
    {
      present: "/",
      text: "In JavaScript a constant regular expression is surrounded by forward slashes like /PATTERN/. However, for this exercise we only want the text inside the slashes (the pattern itself).",
      "examples": [
        [ "/" ]
      ]
    },
    {
      present: "[\"'`]",
      text: "In this exercise we only want the regular expression pattern itself. There is no need to use any kind of quote mark.",
      "examples": [
        [ "'" ]
      ]
    },
    {
      absent: String.raw`^\^`,
      text: "For input validation, start with '^' to indicate a full match.",
      "examples": [
        [ "(Y|N)" ]
      ]
    },
    {
      present: String.raw`\\[Zz]`,
      text: "The ECMAScript (JavaScript) specification does not support \\Z or \\z.",
      "examples": [
        [ "^Y|N\\z" ]
      ]
    },
    {
      absent: String.raw`\$$`,
      text: "For input validation, end with '$' to indicate a full match.",
      "examples": [
        [ "^(Y|N)" ]
      ]
    },
    {
      absent: String.raw`[\|\[]`,
      text: "Consider using [YN], to match either a Y or an N.",
      "examples": [
        [ "^$" ]
      ]
    },
    {
      present: String.raw`\|`,
      absent: String.raw`\(`,
      text: "If you use \"|\" you must parentheses or the precedence will be wrong. For example, \"^A|B$\" accepts anything beginning with A, and it also accepts anything ending with B. That is not what you want.",
      "examples": [
        [ "^Y|N$" ]
      ]
    },
    {
      present: " ",
      text: "Spaces normally match spaces in a regex. Do not use them in this case, because a space is not one of the allowed characters.",
      "examples": [
        [ "^[YN] $" ]
      ]
    },
    {
      absent: String.raw`^\^`,
      "index": 1,
      text: "For input validation, start with '^' to indicate a full match.",
      "examples": [
        [ "^[YN]$", "" ]
      ]
    },
    {
      absent: String.raw`\$$`,
      "index": 1,
      text: "For input validation, end with '$' to indicate a full match.",
      "examples": [
        [ "^[YN]$", "^" ]
      ]
    },
    {
      absent: String.raw`\[A-Z\]`,
      "index": 1,
      text: "You can use [A-Z] to match one uppercase Latin letter (A through Z).",
      "examples": [
        [ "^[YN]$", "^$" ]
      ]
    },
    {
      present: String.raw`\^\[A-Z\]\*`,
      "index": 1,
      text: "A \"*\" matches one or more, not one or more."
    },
    {
      present: String.raw`\(`,
      "index": 1,
      text: "You do not need parentheses to solve this problem."
    },
    {
      absent: String.raw`(\[A-Z\]\+|
 \[A-Z\]\[A-Z\]\*)`,
      "index": 1,
      text: "You can use [A-Z]+ to match one or more uppercase Latin letters.",
      "examples": [
        [ "^[YN]$", "^[A-Z]$" ]
      ]
    },
    {
      present: "True",
      "index": 2,
      text: "Regular expressions are case-sensitive by default; use \"true\"."
    },
    {
      present: "False",
      "index": 2,
      text: "Regular expressions are case-sensitive by default; use \"false\"."
    },
    {
      absent: String.raw`\|`,
      "index": 2,
      text: "Use \"|\" to express alternatives."
    },
    {
      present: String.raw`^\^true\|false\$$`,
      "index": 2,
      text: "No. This would match anything beginning with the term true, or anything ending with the term false. Use parenthesis."
    },
    {
      present: String.raw`^\^false\|true\$$`,
      "index": 2,
      text: "No. This would match anything beginning with the term false, or anything ending with the term true. Use parenthesis."
    },
    {
      absent: String.raw`\(`,
      "index": 2,
      text: "Use parentheses."
    },
    {
      present: String.raw`\$`,
      "index": 3,
      text: "This is Python, not ECMAScript (JavaScript). Use \\Z at the end, not $."
    },
    {
      present: String.raw`\\z`,
      "index": 3,
      text: "This is Python. Use \\Z at the end, not \\z."
    },
    {
      absent: String.raw`^\\A`,
      "index": 4,
      text: "This is Ruby. Use \\A at the beginning."
    },
    {
      absent: String.raw`\\z$`,
      "index": 4,
      text: "This is Ruby. Use \\z at the end."
    },
    {
      absent: String.raw`\[A-Z\]`,
      "index": 4,
      text: "Use [A-Z] to match one uppercase Latin letter."
    },
    {
      present: String.raw`\[A-Z\](\*|\+)`,
      "index": 4,
      text: "In this case we are only matching one letter, not many of them. Do not use \"*\" or \"+\" after [A-Z]."
    }
  ],
  preprocessing: [
    [
      "\\s*",
      ""
    ]
  ]
}
