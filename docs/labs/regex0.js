// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  // Note: Regular expressions are preprocessed specially in this lab.
  // We simply remove whitespace in them.
  hints: [
    {
      present: "^$",
      text: "You need to enter a pattern.",
      text_ja: "パターンを入力してください。",
      examples: [
        [ "" ]
      ],
    },
    {
      present: String.raw`^\^`,
      text: "We are looking for 'cat' anywhere, not just the beginning, in this exercise.",
      text_ja: "文の先頭だけではなく、どこに 'cat' があっても検索できるようにしましょう。",
      examples: [
        [ "^cat" ],
      ],
    },
    {
      present: "C",
      text: "Regexes are normally case-sensitive. Use a lowercase c.",
      text_ja: "正規表現は通常大文字と小文字を区別します。ここでは小文字の c を使いましょう。",
      examples: [
        [ "C" ],
      ],
    },
    {
      present: String.raw`\(`,
      text: "Parentheses are not necessary or clarifying in this regex. Prefer simpler regex expressions.",
      examples: [
        [ "(cat)" ],
      ],
    },
    {
      absent: "c",
      text: "If you are searching for \"cat\" you need to look for a \"c\"",
      text_ja: "\"cat\" を検索するにはまず \"c\" を検索する必要があります。",
      examples: [
        [ "x" ],
      ],
    },
    {
      present: String.raw`\[(cat|act)\]`,
      text: "The pattern '[cat]' or '[act]' matches one latter, a 'c', an 'a', or 't'. That is not what you want.",
      text_ja: "'[cat]' や '[act]' は一文字の 'c'、一文字の 'a'、または一文字の 't' にマッチします。これは望ましい結果ではありません。",
      examples: [
        [ "[cat]" ],
        [ "[act]" ],
      ],
    },
    {
      absent: "cat",
      text: "The pattern \"cat\" is needed to search for \"cat\".",
      text_ja: "\"cat\" を検索するためにはパターンとして \"cat\" が必要です。",
      examples: [
        [ "c" ],
      ],
    },
    {
      absent: "A",
      index: 1,
      text: "You need to mention A.",
      text_ja: "A を忘れていませんか？",
      examples: [
        [ null, "B" ],
      ],
    },
    {
      absent: String.raw`A(\+|A\*)`,
      index: 1,
      text: "Use \"A+\" to indicate \"one or more A\". You could also write \"AA*\".",
      text_ja: "\"一つかそれ以上の A\" には \"A+\" を使用します。または \"AA*\" とも書けます。",
      examples: [
        [ null, "A" ],
        [ null, "AA" ],
      ],
    },
    {
      absent: "B",
      index: 1,
      text: "You need to mention B.",
      text_ja: "B を忘れていませんか？",
      examples: [
        [ null, "A+" ],
      ],
    },
    {
      absent: String.raw`B(\+|B\*)`,
      present: 'A',
      index: 1,
      text: "Use \"B+\" to indicate \"one or more B\". You could also write \"BB*\".",
      text_ja: "\"一つかそれ以上の B\" には \"B+\" を使用します。または \"BB*\" とも書けます。",
      examples: [
        [ null, "A+B" ],
      ],
    },
    {
      present: String.raw`\(`,
      index: 1,
      text: "Parentheses are not necessary or clarifying in this regex. Prefer simpler regex expressions.",
      examples: [
        [ null, "(A+B+)" ],
      ],
    },
  ],
  expected: [
    'cat',
    'A+BB*'
  ],
  correct: [
    'cat',
    // Spaces are removed by the preprocessor for this lab.
    String.raw`A(\+|A\*) B(\+|B\*)`
  ],
  successes: [
    [ 'cat', 'A+B+' ],
    [ 'cat', 'AA*BB*' ],
  ],
  failures: [
    [ 'Cat', 'A+B+' ],
    [ 'cat', 'A*B*' ],
  ],
  preprocessing: [
    [
      "\\s*",
      "",
    ],
  ],
};
