// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  definitions: [
    {
      term: "COND0",
      value: String.raw`data \. username`
    },
    {
      term: "COND0",
      value: String.raw`(COND0|\( COND0 \))`
    },
    {
      term: "COND1",
      value: String.raw`typeof\s+data \. username == ('string'|"string"|${BACKQUOTE}string${BACKQUOTE})`
    },
    {
      term: "COND1",
      value: String.raw`(COND1|\( COND1 \))`
    },
    {
      term: "COND2",
      value: String.raw`data \. username \. length < 20`
    },
    {
      term: "COND2",
      value: String.raw`(COND2|\( COND2 \))`
    },
    {
      term: "CONDALL",
      value: "(COND0 && (COND1 && COND2|COND2 && COND1))",
    },
  ],
  hints: [
    {
      absent: "^ const data =\n",
      text: "The first section should begin with `const data =`",
      text_ja: "最初のセクションは、`const data =`で始めなければなりません。",
    },
    {
      present: "json",
      text: "the JSON built-in global object is witten in uppercase.",
      text_ja: "JSONというビルトインのグローバルオブジェクトは全て大文字で書かれます",
    },
    {
      absent: String.raw`JSON \. parse
`,
      text: "Make a call to `JSON.parse` with the data retrieved, e.g., `JSON.parse(base64Decoded)` should be stored in `data`.",
      text_ja: "取得したデータに対して`JSON.parse`を呼んでください。例: `JSON.parse(base64Decoded)`は`data`に格納されなければなりません",
    },
    {
      present: String.raw`\+
`,
      text: "You should not have any concatenation (`+`) in the first section.",
      text_ja: "最初のセクションでは、文字列連結(`+`)を用いるべきではありません。",
    },
    {
      absent: "; $\n",
      text: "JavaScript does not require semicolons at the end of a statement, but since the other statements terminate with semicolons, you should also terminate your statement with a semicolon to be consistent.",
      text_ja: "JavaScriptではステートメントの最後にセミコロンは必須ではありませんが、他のステートメントはセミコロンで終わっているため、一貫性を保つためにセミコロンでステートメントを終わらせなければなりません。",
    },
    {
      absent: String.raw`^ if \(`,
      index: 1,
      text: "The second section should start with `if (` followed by a condition.",
      text_ja: "二番目のセクションは、`if (`で始めてその次に条件を書かなくてはなりません。",
      examples: [
        [
          "const data = JSON.parse(base64Decoded);",
          "if data.username {\n"
        ],
      ],
    },
    {
      absent: String.raw`data \. username
`,
      index: 1,
      text: "Check if the data object has a property called username. You can do this by referencing data.username.",
      text_ja: "データオブジェクトがusernameというプロパティを持っているかをチェックしてください。これは、data.usernameを参照することによって行うことができます。",
    },
    {
      absent: String.raw`\&\&`,
      index: 1,
      text: "To combine multiple conditions in JavaScript use &&. This operator means 'and', so both conditions must be true for the entire statement to pass.",
      text_ja: "JavaScriptで複数の条件を結合するには&&を用います。この演算子は「かつ」(AND)を意味し、ステートメント全体をパスするためには両方の条件が真でなければなりません。",
    },
    {
      absent: "typeof",
      index: 1,
      text: "Use typeof to check the type of the operand's value. You should have `typeof data.username == 'string'` or similar.",
      text_ja: "typeofを用いてオペランドの値の型をチェックしてください。`typeof data.username == 'string'`のようになるはずです。",
    },
    {
      present: String.raw`typeof data \. username == 'String'
`,
      index: 1,
      text: "When using typeof, JavaScript expects \"string\" all lowercase.",
      text_ja: "JavaScriptでtypeofを使う際には、\"string\"を全て小文字で表記します。",
    },
    {
      absent: "length",
      index: 1,
      text: "check if the length of the string is smaller than 20 characters. Use the expression `data.username.length &lt; 20` to determine this.",
      text_ja: "文字列の長さが20文字より小さいことをチェックしてください。`data.username.length &lt; 20`というエクスプレッションを使って判断してください。",
    },
    {
      present: String.raw`^ if \(`,
      absent: String.raw`^ if \( data \. username &&`,
      index: 1,
      text: "Begin the second section with `if ( data.username && ... ` because you must check if data is even present before you can check various attributes of that data.",
      text_ja: "二番目のセクションを`if ( data.username && ... `で始めてください。これは、データのいろいろなアトリビュートをチェックする前に、それがそもそも存在するかをチェックしなければならないからです。",
      examples: [
        [
          "const data = JSON.parse(base64Decoded);",
          "if (typeof data.username == 'string' && data.username.length < 20 && data.username) {"
        ],
      ],
    },
  ],
  expected: [
    '  const data = JSON.parse(base64Decoded);',
    `  if (data.username && typeof data.username == 'string' && data.username.length < 20) {`
  ],
  correct: [
    String.raw`\s* const data = JSON \. parse \( base64Decoded \) \; \s*`,
    String.raw`\s* if \( CONDALL \) \{ \s*`
  ],
  successes: [
    [
      "const data = JSON.parse(base64Decoded);",
      "if (data.username && typeof data.username == 'string' && data.username.length < 20) {"
    ],
    [
      "const data = JSON . parse ( base64Decoded ) ;",
      "if ( data . username && typeof data . username == 'string' && data . username.length < 20) {"
    ],
    [
      "const data = JSON.parse(base64Decoded);",
      "if (data.username && (typeof data.username == 'string') && (data.username.length < 20)) {"
    ],
    [
      "const data = JSON.parse(base64Decoded);",
      "if (data.username && typeof data.username == 'string' && (data.username.length < 20)) {"
    ],
  ],
  failures: [
    [
      "const data = JSON.parse(base64Decoded);",
      "if (data.username && (typeof data.username == 'string')) && (data.username.length < 20)) {"
    ],
  ],
};
