// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      present: "/",
      text: "In JavaScript a constant regular expression is surrounded by forward slashes like /PATTERN/. However, for this exercise we only want the text inside the slashes (the pattern itself).",
      text_ja: "JavaScript では定数としての正規表現を /PATTERN/ のようにスラッシュで囲みます。しかしこの演習ではスラッシュの内側（パターンそれ自体）のテキストだけを書いてください。",
      examples: [
        [ "/" ],
      ],
    },
    {
      present: "[\"'`]",
      text: "In this exercise we only want the regular expression pattern itself. There is no need to use any kind of quote mark.",
      text_ja: "この演習では正規表現のパターンだけを書いてください。引用符は不要です。",
      examples: [
        [ "'" ],
      ],
    },
    {
      absent: String.raw`^\^`,
      text: "For input validation, start with '^' to indicate a full match.",
      text_ja: "入力検証のためには、全体へのマッチを表すため '^' を行頭に置いてください。",
      examples: [
        [ "(Y|N)" ],
      ],
    },
    {
      present: String.raw`\\[Zz]`,
      text: "The ECMAScript (JavaScript) specification does not support \\Z or \\z.",
      text_ja: "ECMAScript (JavaScript) では \\Z や \\z はサポートされていません。",
      examples: [
        [ "^Y|N\\z" ],
      ],
    },
    {
      absent: String.raw`\$$`,
      text: "For input validation, end with '$' to indicate a full match.",
      text_ja: "入力検証のためには、全体へのマッチを表すため '$' を末尾に置いてください。",
      examples: [
        [ "^(Y|N)" ],
      ],
    },
    {
      absent: String.raw`[\|\[]`,
      text: "Consider using [YN], to match either a Y or an N.",
      text_ja: "Y または N にマッチさせるためには [YN] を使います。",
      examples: [
        [ "^$" ],
      ],
    },
    {
      present: String.raw`\|`,
      absent: String.raw`\(`,
      text: "If you use \"|\" you must parentheses or the precedence will be wrong. For example, \"^A|B$\" accepts anything beginning with A, and it also accepts anything ending with B. That is not what you want.",
      text_ja: "\"|\" を使う場合は小カッコで囲まないとおかしな優先度で解釈されます。例えば \"^A|B$\" は、A で始まる全ての入力と、B で終わる全ての入力にマッチします。これは望ましい結果ではありません。",
      examples: [
        [ "^Y|N$" ],
      ],
    },
    {
      present: " ",
      text: "Spaces normally match spaces in a regex. Do not use them in this case, because a space is not one of the allowed characters.",
      text_ja: "正規表現では通常、空白は空白にマッチします。ここでは空白は許される入力ではないので使用しないでください。",
      examples: [
        [ "^[YN] $" ],
      ],
    },
    {
      absent: String.raw`^\^`,
      index: 1,
      text: "For input validation, start with '^' to indicate a full match.",
      text_ja: "入力検証のためには、全体へのマッチを表すため '^' を行頭に置いてください。",
      examples: [
        [ null, "" ],
      ],
    },
    {
      absent: String.raw`\$$`,
      index: 1,
      text: "For input validation, end with '$' to indicate a full match.",
      text_ja: "入力検証のためには、全体へのマッチを表すため '$' を末尾に置いてください。",
      examples: [
        [ null, "^" ],
      ],
    },
    {
      absent: String.raw`\[A-Z\]`,
      index: 1,
      text: "You can use [A-Z] to match one uppercase Latin letter (A through Z).",
      text_ja: "A から Z までの大文字アルファベット１文字にマッチさせるためには [A-Z] が使えます。",
      examples: [
        [ null, "^$" ],
      ],
    },
    {
      present: String.raw`\^\[A-Z\]\*`,
      index: 1,
      text: "A \"*\" matches one or more, not one or more.",
      text_ja: "\"*\" はゼロ個以上にマッチします。１個以上ではありません。",
      examples: [
        [ null, "^[A-Z]*$" ],
      ],
    },
    {
      present: String.raw`\(`,
      index: 1,
      text: "You do not need parentheses to solve this problem.",
      text_ja: "ここでは小カッコは必要ありません。",
      examples: [
        [ null, "^([A-Z])+$" ],
      ],
    },
    {
      absent: String.raw`\[A-Z\](\+|\[A-Z\]\*)`,
      index: 1,
      text: "You can use [A-Z]+ to match one or more uppercase Latin letters.",
      text_ja: "１文字以上の大文字アルファベットにマッチさせるためには [A-Z]+ が使えます。",
      examples: [
        [ null, "^[A-Z]$" ],
      ],
    },
    {
      present: "True",
      index: 2,
      text: "Regular expressions are case-sensitive by default; use \"true\"",
      text_ja: "正規表現はデフォルトで大文字小文字を区別します。ここでは \"true\" としてください。",
      examples: [
        [ null, null, "True" ],
      ],
    },
    {
      present: "False",
      index: 2,
      text: "Regular expressions are case-sensitive by default; use \"false\".",
      text_ja: "正規表現はデフォルトで大文字小文字を区別します。ここでは \"false\" としてください。",
      examples: [
        [ null, null, "False" ],
      ],
    },
    {
      absent: String.raw`\|`,
      index: 2,
      text: "Use \"|\" to express alternatives.",
      text_ja: "「または」を表すには \"|\" を使用してください。",
    },
    {
      present: String.raw`^\^true\|false\$$`,
      index: 2,
      text: "No. This would match anything beginning with the term true, or anything ending with the term false. Use parenthesis.",
      text_ja: "おっと。これは true で始まる全ての入力と、false で終わる全ての入力にマッチします。小カッコを使ってください。",
    },
    {
      present: String.raw`^\^false\|true\$$`,
      index: 2,
      text: "No. This would match anything beginning with the term false, or anything ending with the term true. Use parenthesis.",
      text_ja: "おっと。これは false で始まる全ての入力と、true で終わる全ての入力にマッチします。小カッコを使ってください。",
    },
    {
      absent: String.raw`\(`,
      index: 2,
      text: "Use parentheses.",
      text_ja: "小カッコを使ってください。",
    },
    {
      present: String.raw`\$`,
      index: 3,
      text: "This is Python, not ECMAScript (JavaScript). Use \\Z at the end, not $.",
      text_ja: "ECMAScript (JavaScript) ではなく Python 向けに書いてください。$ ではなく \\Z を末尾に置きます。",
      examples: [
        [ null, null, null, "^[A-Z]+$"],
      ],
    },
    {
      present: String.raw`\\z`,
      index: 3,
      text: "This is Python. Use \\Z at the end, not \\z.",
      text_ja: "Python 向けに書いてください。\\z ではなく \\Z を末尾に置きます。",
      examples: [
        [ null, null, null, "^[A-Z]+\\z"],
      ],
    },
    {
      absent: String.raw`^\\A`,
      index: 4,
      text: "This is Ruby. Use \\A at the beginning.",
      text_ja: "Ruby 向けに書いてください。\\A を先頭に置きます。",
      examples: [
        [ null, null, null, null, "^[A-Z]+$"],
      ],
    },
    {
      absent: String.raw`\\z$`,
      index: 4,
      text: "This is Ruby. Use \\z at the end.",
      text_ja: "Ruby 向けに書いてください。\\z を末尾に置きます。",
      examples: [
        [ null, null, null, null, "\\A[A-Z]+$"],
      ],
    },
    {
      absent: String.raw`\[A-Z\]`,
      index: 4,
      text: "Use [A-Z] to match one uppercase Latin letter.",
      text_ja: "大文字アルファベット１文字にマッチさせるためには [A-Z] を使います。",
    },
    {
      present: String.raw`\[A-Z\](\*|\+)`,
      index: 4,
      text: "In this case we are only matching one letter, not many of them. Do not use \"*\" or \"+\" after [A-Z].",
      text_ja: "ここでは複数文字ではなく、１文字だけにマッチさせます。\"*\" や \"+\" は [A-Z] の後ろに置かないでください。",
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
