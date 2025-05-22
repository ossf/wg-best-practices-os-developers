// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      present: "assert",
      text: "The whole point of this exercise is to NOT use `assert` as a way to validate input from untrusted users.",
      text_ja: "この演習の全体的なポイントは、信頼できないユーザーからの入力検証の手段として `assert` を使用しないことです。",
      examples: [
        [ "assert !bindingResult.hasErrors();\n" ]
      ],
    },
    {
      absent: String.raw`^\s* if `,
      text: "Begin with `if` so you can return a result if there are errors.",
      text_ja: "エラーがある場合に結果を返せるように `if` で始めてください。",
      examples: [
        [ "return \"form\";" ]
      ],
    },
    {
      present: "(bindingresult|BindingResult)",
      text: "Java is case-sensitive. Use `bindingResult`, not `bindingresult` nor `BindingResult`.",
      text_ja: "Java では大文字と小文字が区別されます。`bindingresult` や `BindingResult` ではなく `bindingResult` としてください。",
    },
    {
      present: "(haserrors|HasErrors)",
      text: "Java is case-sensitive. Use `hasErrors`, not `haserrors` nor `HasErrors`.",
      text_ja: "Java では大文字と小文字が区別されます。`haserrors` や `HasErrors` ではなく`hasErrors` としてください。",
    },
    {
      present: String.raw`^\s*if\s*[^\(\s]`,
      text: "In Java, after the keyword `if` you must have an open left parenthesis. Conventionally there is one space between the `if` keyword and the open left parenthesis.",
      text_ja: "Java では キーワード `if` のあとには左側カッコを置く必要があります。通常、`if` と左側カッコの間にはスペースを入れます。",
      examples: [
        [ "if bindingResult.hasErrors" ]
      ],
    },
    {
      present: String.raw`^\s*if\s*\(\s*\!binding`,
      text: "You have an extraneous `!` (not operator). Use the expression if (bindingResult.hasErrors()) ...",
      text_ja: "余計な `!`（NOT 演算子）があります。if (bindingResult.hasErrors()) ... という表記を使用してください。",
      examples: [
        [ "if (!bindingResult.hasErrors())" ]
      ],
    },
    {
      absent: String.raw`^ if \( bindingResult \. hasErrors \( \) \) `,
      text: "Begin the answer with the text `if (bindingResult.hasErrors())` so that a statement will be executed if that condition is true.",
      text_ja: "`if (bindingResult.hasErrors())` で始めてください。これで条件が真の場合にステートメントが実行されます。",
    },
    {
      present: String.raw`if \( bindingResult \. hasErrors \( \) \) [^\{\s] `,
      text: "Follow the conditional with an open brace, e.g., `if (bindingResult.hasErrors()) {...`.",
      text_ja: "左側中カッコを条件の後に続けてください。e.g., `if (bindingResult.hasErrors()) {...`.",
    },
    {
      absent: String.raw`return "form"
`,
      text: "You need to use `return \"form\";` somewhere.",
      text_ja: "`return \"form\";` がどこかに必要です。",
    },
    {
      present: String.raw`return "form"`,
      absent: String.raw`return "form" ;`,
      text: "You need to use `;` (semicolon) after `return \"form\"` because in Java statements must be followed by a semicolon.",
      text_ja: "`return \"form\"` の後に `;`（セミコロン）が必要です。Java ではステートメントの後ろにセミコロンを置きます。",
    },
    {
      absent: String.raw`\} $`,
      text: "The answer needs to end with `}` (closing brace).",
      text_ja: "回答は `}`（右側中カッコ）で終わる必要があります。",
    },
  ],
  expected: [
`        if (bindingResult.hasErrors()) {
            return "form";
        }`
  ],
  correct: [
    String.raw`\s* if \( bindingResult \. hasErrors \( \) \) \{
           return "form" ;
       \} \s*`,
  ],
  successes: [
    [ "if ( bindingResult.hasErrors() ) {\n    return \"form\";\n}\n" ],
    [ "if ( bindingResult . hasErrors ( ) ) { return \"form\" ; }\n" ],
  ],
  failures: [
    [ "if ( bindingResult . hasErrors ( ) ) { return \"form\" }\n" ],
    [ "if ( ! bindingResult . hasErrors ( ) ) { return \"form\" ; }\n" ],
    [ "if bindingResult . hasErrors ( ) { return \"form\" ; }\n" ],
    [ "if ( bindingResult . hasErrors ) { return \"form\" ; }\n" ],
  ],
};
