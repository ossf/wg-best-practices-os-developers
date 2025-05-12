// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      present: "import",
      text: "Yes, many JavaScript implementations support an import statement. However, in this exercise we will use a require form. Please use that instead.",
      text_ja: "確かに多くのJavaScript実装はimport文をサポートしています。しかし、この演習では代わりにrequireを使いましょう。",
      examples: [
        [
          "import express from \"express\";"
        ],
      ],
    },
    {
      absent: "const",
      text: "Start with const.",
      text_ja: "constから始めてください。",
    },
    {
      absent: String.raw`const\s+helmet =`,
      text: "Create a constant name named helmet using the form const helmet = ...",
      text_ja: "const helmet = ... という形でhelmetという名前の定数を定義してください。",
      examples: [
        [ "const" ],
        [ "consthelmet = " ]
      ],
    },
    {
      present: String.raw`require \( helmet \)`,
      text: "The parameter of a requirement statement must be string. Surround the term helment with double-quotes.",
      text_ja: "require文のパラメータは文字列でなければなりません。helmetをダブルクォーテーションで囲んでください。",
      examples: [
        [ "  const helmet = require(helmet);" ]
      ],
    },
    {
      absent: "; $",
      text: "JavaScript doesn''t require semicolon terminators, but the rest of the code uses them. You should try to match a coding style when modifying existing code unless there''s an important reason not to. Please update the first statment.",
      text_ja: "JavaScriptでは末尾のセミコロンは必須ではありませんが、このコードの他の部分では使用しています。特に重要な理由がない限り、コーディングスタイルに合わせるようにしてください。最初の文を修正してください。",
      examples: [
        [ "  const helmet = require(\"helmet\")" ]
      ],
    },
    {
      absent: String.raw`\s* app \. use \( helmet \( \{`,
      index: 1,
      text: "Your code should begin with app.use(helmet({",
      text_ja: "app.use(helmet({ でコードを始めてください。",
    },
    {
      absent: String.raw`\s* app \. use \( helmet \( \{
      contentSecurityPolicy: \{ \s*
`,
      index: 1,
      text: "Your code should begin with:\napp.use(helmet({\n  contentSecurityPolicy: {\n",
      text_ja: "app.use(helmet({\n  contentSecurityPolicy: {\nというコードで始めてください。",
    },
    {
      absent: String.raw`\s* app \. use \( helmet \( \{
      contentSecurityPolicy: \{
        directives: \{ \s*
`,
      index: 1,
      text: "Your code should begin with:\napp.use(helmet({\n  contentSecurityPolicy: {\n        directives: {\n",
      text_ja: "app.use(helmet({\n  contentSecurityPolicy: {\n        directives: {\nというコードで始めてください。",
    },
    {
      absent: String.raw`\s* app \. use \( helmet \( \{
      contentSecurityPolicy: \{
        directives: \{
            "script-src": \[ "'self'" , ["']https://example.com["'] \] , \s*
`,
      index: 1,
      text: "Your code should continue with:\napp.use(helmet({\n  contentSecurityPolicy: {\n        directives: {\n          \"script-src\": [\"'self'\", \"https://example.com\"],\n",
      text_ja: "コードの続きは、\napp.use(helmet({\n  contentSecurityPolicy: {\n        directives: {\n          \"script-src\": [\"'self'\", \"https://example.com\"],\nとしてください。",
    },
    {
      absent: String.raw`"style-src": \[ "'self'" \]
`,
      index: 1,
      text: "Don't forget to include \"style-src\": [\"'self'\"]\n",
      text_ja: "\"style-src\": [\"'self'\"] を忘れないでください",
    },
    {
      absent: "; $",
      index: 1,
      text: "JavaScript doesn''t require semicolon terminators, but the rest of the code uses them. You should try to match a coding style when modifying existing code unless there''s an important reason not to. Please update the second statement to use a semicolon terminator.",
      text_ja: "JavaScriptでは末尾のセミコロンは必須ではありませんが、このコードの他の部分では使用しています。特に重要な理由がない限り、コーディングスタイルに合わせるようにしてください。二番目の文をセミコロンで終わるように修正してください。",
    },
    {
      absent: String.raw`\} \} \) \) ; $`,
      index: 1,
      text: "The correct answer is expected to end with `} } ) ) ;` ignoring whitespace. Check that you have matching parentheses and braces.",
      text_ja: "正解はスペースを無視すると } } ) ) ; という形で終わるはずです。括弧が対応していることを確認してください。",
    },
    {
      text: "I do not have more specific hints to provide. Please ensure that the parentheses, braces, and brackets pair correctly, as that is often the problem.",
      text_ja: "ちょうどよいヒントがありません。括弧類の組が正しいことを確認してください。よくあるミスです。",
    },
  ],
  expected: [
    'const helmet = require("helmet");',
    `app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'", "https://example.com"],
      "style-src": ["'self'"]
    },
  },
}));`
  ],
  correct: [
    String.raw`\s* const\s+helmet = require \( ("helmet"|'helmet'|${BACKQUOTE}helmet${BACKQUOTE}) \) ; \s*`,
    String.raw`\s* app \. use \( helmet \( \{
    contentSecurityPolicy: \{
      directives: \{
        "script-src": \[ "'self'" , "https://example\.com" \] ,
        "style-src": \[ "'self'" \] ,?
      \} ,?
    \} ,?
  \} \) \) ; \s*`
  ],
};
