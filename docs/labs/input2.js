// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: ", $",
      text: "This is a parameter, it must end with a comma.",
      text_ja: "これはパラメータです。コンマで終わる必要があります。",
      examples: [
        [ "" ],
        [ "  query('id')" ],
      ],
    },
    {
      absent: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \)`,
      text: "Use query() with an 'id' parameter.",
      text_ja: "'id'をパラメータとしてquery()を使ってください。",
      examples: [
        [ "  query()," ],
      ],
    },
    {
      present: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \) [^. ]`,
      text: "After query(\"id\") use a period to invoke a verification method.",
      text_ja: "query(\"id\")の後にピリオドをつけて、検証メソッドを呼び出すようにしてください。",
      examples: [
        [ "  query('id')," ],
      ],
    },
    {
      present: "(islength|Islength|IsLength|ISLENGTH)",
      text: "JavaScript is case-sensitive. Use isLength instead of the case you have.",
      text_ja: "JavaScriptでは大文字小文字を区別します。isLengthと正確に入力してください。",
      examples: [
        [ "  query('id').IsLength({max: 80})," ],
      ],
    },
    {
      absent: "isLength",
      text: "Use isLength().",
      text_ja: "isLength()を使用してください。",
      examples: [
        [ "  query('id').length({max: 80})," ],
      ],
    },
    {
      present: String.raw`isLength \( [a-z]`,
      text: "You need to pass isLength() an object within {...}.",
      text_ja: "isLength()には、{...}という形のオブジェクトを与えてください。",
      examples: [
        [ "  query('id').isLength(max: 80)," ],
      ],
    },
    {
      absent: "matches",
      text: "Use matches().",
      text_ja: "matches()を使用してください。",
      examples: [
        [ "  query('id').isLength({max: 80})," ],
      ],
    },
    {
      present: String.raw`matches \( /[^^]`,
      text: "Match the whole string - begin the regular expression with ^",
      text_ja: "文字列全体にマッチするようにしてください。正規表現を^で始めてください。",
      examples: [
        [ "  query('id').isLength({max: 80}).matches(//)," ],
      ],
    },
    {
      present: String.raw`matches \( /[^$/]*[^$]/`,
      text: "Match the whole string - end the regular expression with $",
      text_ja: "文字列全体にマッチするようにしてください。正規表現の終わりは$にしてください。",
      examples: [
        [ "  query('id').isLength({max: 80}).matches(/^/)," ],
      ],
    },
    {
      present: String.raw`matches \( /\^\[A-Z\]-`,
      text: "That would match only one letter before the dash, you need two.",
      text_ja: "ハイフンの前は一文字しかマッチしないでしょう。二文字にマッチさせる必要があります。",
      examples: [
        [ "  query('id').isLength({max: 80}).matches(/^[A-Z]-\d+-\d+$/)," ],
      ],
    },
    {
      present: String.raw`matches \( /.*(\[0-9\]|\d)\*`,
      text: "You need to match one or more digits; * allows 0 or more. A + would be better suited for this task.",
      text_ja: "1桁以上の数字にマッチする必要があります。*は0桁以上にマッチするものです。この場合は+を使うのが適切でしょう。",
      examples: [
        [ "  query('id').isLength({max: 80}).matches(/^[A-Z]{2}-[0-9]*-\d*$/)," ],
      ],
    },
    {
      present: String.raw`\s*, , $`,
      text: "You have two commas at the end. Use only one. You may need to scroll or increase the text area to see both of them.",
      text_ja: "最後にコンマが二つあるようです。一つだけにしてください。隠れている場合には、テキストエリアをスクロールするか広げる必要があるかもしれません。",
      examples: [
        [
          "query('id').isLength({max:80}).matches( /^[A-Z]{2}-[0-9]+-[0-9]+$/ ), ,",
        ],
      ],
    },
  ],
  expected: [
    String.raw`  query('id').isLength({max:80}).
	matches( /^[A-Z]{2}-[0-9]+-[0-9]+$/ ),`,
  ],
  // Full pattern of correct answer.
  // This specific example is a worst case; we're using
  // a regex to check on a regex, requiring a large number of escapes.
  correct: [
    // This pattern is very generous, allowing
    // constructs like \d for digits and {1,} instead of +.
    String.raw`\s*
    query \( ('id'|"id"|${BACKQUOTE}id${BACKQUOTE}) \)
    \. isLength \( \{ max: 80 ,? \} \)
    \. matches \(
        \/\^\[A-Z\](\{2\}|\[A-Z\])-(\[0-9\]|\\d)(\+|\{1,\})-(\[0-9\]|\\d)(\+|\{1,\})\$\/
      \) , \s*`
  ],
  successes: [
    [
      "query(`id`).isLength( {max:80}).matches(/^[A-Z]{2}-\\d+-[0-9]+$/),",
    ],
    [
      "  query (`id`) . isLength( {max:80}).matches(/^[A-Z]{2}-\\d+-[0-9]+$/ ) ,  ",
    ],
  ],
  failures: [
    [
      "query('id').isLength({max:80}).matches( /^[A-Z]{2}-[0-9]+- [0-9]+$/ ),",
    ],
    [
      "query('id').isLength().matches( /^[A-Z]{2}-[0-9]+-[0-9]+$/ ),",
    ],
    [
      "query('id').isLength({max:80}).matches( /[A-Z]{2}-[0-9]+-[0-9]+/ ),",
    ],
    [
      "query(`id`).isLength( {max:80}).matches(/^[A-Z]{2}-\\d+-[0-9]+$/)",
    ],
    [
      "query(`id`).isLength( {max:80}).matches(/^[A-Z]{2}- \\d+-[0-9]+$/),",
    ],
  ],
};
