// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: String.raw`^ console \. log \(`,
      text: "Please use the form console.log(...);",
      text_ja: "console.log(...); の形式を使用してください。",
      text_fr: "Veuillez utiliser le formulaire console.log(...);",
      examples: [ [ "" ], [ "foo" ]
      ],
    },
    {
      present: "Goodbye",
      text: "You need to change the text Goodbye to something else.",
      text_ja: "Goodbyeというテキストを別の文字に変更する必要があります。",
      text_fr: "Vous devez remplacer le texte Goodbye par autre chose.",
      examples: [ [ "console.log(\"Goodbye.\");" ] ]
    },
    {
      present: "hello",
      text: "Please capitalize Hello.",
      text_ja: "Hello は大文字で入力してください。",
      text_fr: "Veuillez mettre une majuscule Hello.",
      examples: [ [ "console.log(\"hello.\");" ] ]
    },
    {
      present: "World",
      text: "Please lowercase world.",
      text_ja: "world という単語を小文字にしてください。",
      text_fr: "Veuillez mettre world en minuscule.",
      examples: [ [ "console.log(\"Hello, World!\");" ] ]
    },
    {
      present: "Hello[^,]",
      text: "Put a comma immediately after Hello.",
      text_ja: "Hello の直後にカンマを入れてください。",
      text_fr: "Mettez une virgule immédiatement après Hello.",
      examples: [ [ "console.log(\"Hello world.\");" ] ]
    },
    {
      present: "Hello",
      absent: "[Ww]orld",
      text: "There's a Hello, but you need to also mention the world.",
      text_ja: "Helloがありますが、worldという単語も必要です。",
      text_fr: "Il y a un Hello, mais il faut aussi mentionner le world.",
      examples: [ [ "console.log(\"Hello, \");" ] ]
    },
    {
      present: String.raw`world[^\!]`,
      text: "Put an exclamation point immediately after world.",
      text_ja: "world の直後に感嘆符を置いてください。",
      text_fr: "Mettez un point d'exclamation immédiatement après world.",
      examples: [ [ "console.log(\"Hello, world.\");" ] ]
    },
    {
      present: String.raw`Hello,\s*world!`,
      absent: String.raw`Hello,\x20world!`,
      text: "You need exactly one space between 'Hello,' and 'world!'",
      text_ja: "「Hello」と「world!」の間にはスペースが 1 つだけ必要です。",
      text_fr: "Vous avez besoin d'exactement un espace entre « Hello, » et « world! »",
      examples: [ [ "console.log(\"Hello,     world!\");" ] ]
    },
    {
      present: String.raw`^ console \. log \( Hello`,
      text: "You must quote constant strings using \", ', or `",
      text_ja: "文字列定数は \"、'、または ` を使用して引用符で囲む必要があります。",
      text_fr: "Vous devez citer les chaînes constantes en utilisant \", ' ou `",
      examples: [ [ "console.log(Hello, world" ], [ "console.log( Hello, world" ] ]
    },
    {
      absent: String.raw` ; $`,
      text: "Please end this statement with a semicolon. JavaScript does not require a semicolon in this case, but usually when modifying source code you should follow the style of the current code.",
      text_ja: "このステートメントはセミコロンで終了してください。JavaScript ではセミコロンは必要ありませんが、通常、ソースコードを変更する場合は、現在のコードのスタイルに従う必要があります。",
      text_fr: "Veuillez terminer cette déclaration par un point-virgule. JavaScript ne nécessite pas de point-virgule dans ce cas, mais généralement lors de la modification du code source, vous devez suivre le style du code actuel",
      examples: [ [ "  console.log(\"Hello, world!\")  " ] ]
    },
  ],
  expected: ['console.log("Hello, world!");'],
  correct:
    [String.raw`\s* console \. log \(
	       (["'${BACKQUOTE}])Hello,\x20world!\1 \) ; \s*`],
  successes: [
    [ " console . log( \"Hello, world!\" ) ; " ],
    [ " console . log( 'Hello, world!' ) ; " ],
    [ " console . log( `Hello, world!` ) ; " ]
  ],
  failures: [
    [ " console . log( Hello, world! ) ; " ],
    [ " console . log(\"hello, world!\") ; " ]
  ],
  // All regexes are preprocessed by a set of rules. You can replace them with your
  // own set. You can completely eliminate them by providing an empty set of rules:
  // "preprocessing" : [ ],
  // Here are tests for default preprocessing.
  // Don't do this in every lab. This merely demonstrates how to create tests for your preprocessing.
  "preprocessingTests": [
    [
      String.raw`\s* console \. log \( (["'${BACKQUOTE}])Hello,\x20world!\1 \) ; \s*`,
      String.raw`\s*console\s*\.\s*log\s*\(\s*(["'${BACKQUOTE}])Hello,\x20world!\1\s*\)\s*;\s*`
    ],
    [
      String.raw`\s* foo \s+ bar \\string\\ \s*`,
      String.raw`\s*foo\s+bar\s*\\string\\\s*`
    ],
  ],
};
