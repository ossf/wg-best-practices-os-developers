// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: ", $",
      text: "This is a parameter, it must end with a comma.",
      text_ja: "これはパラメータです。カンマで終わる必要があります。",
    },
    {
      absent: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \)
`,
      text: "Use query() with an 'id' parameter.",
      text_ja: "`id` をパラメータとして query() を使用してください。",
    },
    {
      present: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \) [^. ]
`,
      text: "After query(\"id\") use a period to invoke a verification method.",
      text_ja: "検証メソッドを起動するため、query(\"id\") のあとにピリオドが必要です。",
    },
    {
      present: "(islength|Islength|IsLength|ISLENGTH)\n",
      text: "JavaScript is case-sensitive. Use isLength instead of the case you have.\n",
      text_ja: "JavaScript は大文字と小文字を区別します。isLength としてください。\n",
    },
    {
      absent: "isLength",
      text: "Limit the maximum length of input strings using isLength().",
      text_ja: "isLength() を使って入力文字列の長さを制限してください。",
    },
    {
      present: String.raw`isLength \( m
`,
      text: "You need to pass isLength() an object with the max parameter, e.g., isLength({max: VALUE}).\n",
      text_ja: "isLength() には最大値とともにオブジェクトを渡します。例：isLength({max: VALUE}).\n",
    },
    {
      absent: "matches",
      text: "Use matches().",
      text_ja: "matches() を使ってください。",
    },
    {
      present: String.raw`matches \( /[^^]
`,
      text: "Match the whole string - begin the regular expression with ^",
      text_ja: "文字列全体にマッチするよう、正規表現は ^ で始めてください。",
    },
    {
      present: String.raw`matches \( /.*[^$]/
`,
      text: "Match the whole string - end the regular expression with $",
      text_ja: "文字列全体にマッチするよう、正規表現の最後は $ としてください。",
    },
    {
      present: String.raw`matches \( /.*[^$]/
`,
      text: "Match the whole string - end the regular expression with $",
      text_ja: "文字列全体にマッチするよう、正規表現の最後は $ としてください。",
    },
    {
      present: String.raw`matches \( /\^\[A-Z\]
`,
      text: "That would match only letters, you need digits as well.",
      text_ja: "文字にしかマッチしません。数字にもマッチさせる必要があります。",
    },
    {
      present: String.raw`matches \( /\^\[a-z\]
`,
      text: "That would match only lower case letters, the format requirement is uppercase letters.",
      text_ja: "小文字にしかマッチしません。フォーマットへの要求は大文字です。",
    },
    {
      present: String.raw`matches \( /\^\(\[A-Z0-9\]\+\)\+\$ 
`,
      text: "Remember to fix the regex, the outer + quantifier causes backtracking by trying to match one or more sequences of one or more uppercase alphanumeric characters.",
      text_ja: "正規表現の修正を忘れないでください。外側の + は一つ以上の大文字アルファベットおよび数字にマッチしようとして処理をさかのぼって繰り返す必要があります。",
    },
    {
      present: String.raw`matches \( /\^\(\[A-Z0-9\]\+\)\$ 
`,
      text: "Remove the grouping, you don’t need the parentheses.",
      text_ja: "グルーピングを削除してください。カッコは必要ありません。",
    },
    {
      present: String.raw`\[0-9[Aa]-[Zz]\]`,
      text: "It's conventional to list letters first, so use [A-Z0-9] not [0-9A-Z]",
      text_ja: "文字を最初に並べるのが通例です。[0-9A-Z] ではなく、[A-Z0-9] とします。",
    },
  ],
  expected: [
    "query('id').isLength({max:50}).matches( /^[A-Z0-9]+$/ ),",
  ],
  correct: [
    String.raw`\s* query \(
      ('id'|"id"|${BACKQUOTE}id${BACKQUOTE}) \)
      \. isLength \( \{ max: 50 ,? \} \)
      \. matches \( \/\^\[A-Z0-9\]\+\$\/ \) , \s*`,
  ],
  successes: [
    [ " query ( `id` ) . isLength( {max:50} ).matches( /^[A-Z0-9]+$/ ) , " ],
  ],
  failures: [
    [ "query('id').isLength({max:50}).matches( /^[A-Z]+$/ ),", ],
  ],
};
