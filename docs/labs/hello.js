info =
{
  hints: [
    {
      absent: String.raw`^ console \. log \(`,
      text: "Please use the form console.log(...);",
      text_ja: "console.log(...); の形式を使用してください。",
      examples: [ [ "" ], [ "foo" ]
      ]
    },
    {
      present: "Goodbye",
      text: "You need to change the text Goodbye to something else.",
      text_ja: "「Goodbye」というテキストを別の文字に変更する必要があります.",
      examples: [ [ "console.log(\"Goodbye.\");" ] ]
    },
    {
      present: "hello",
      text: "Please capitalize Hello.",
      text_ja: "Hello は大文字で入力してください。.",
      examples: [ [ "console.log(\"hello.\");" ] ]
    },
    {
      present: "World",
      text: "Please lowercase world.",
      text_ja: "world という単語を小文字にしてください。",
      examples: [ [ "console.log(\"Hello, World!\");" ] ]
    },
    {
      present: "Hello[^,]",
      text: "Put a comma immediately after Hello.",
      text_ja: "Hello の直後にカンマを入れます",
      examples: [ [ "console.log(\"Hello world.\");" ] ]
    },
    {
      present: "Hello",
      absent: "[Ww]orld",
      text: "There's a Hello, but you need to also mention the world.",
      text_ja: "「Hello」がありますが、「world」という単語にも言及する必要があります。",
      examples: [ [ "console.log(\"Hello, \");" ] ]
    },
    {
      present: String.raw`world[^\!]`,
      text: "Put an exclamation point immediately after world.",
      text_ja: "world の直後に感嘆符を置きます。",
      examples: [ [ "console.log(\"Hello, world.\");" ] ]
    },
    {
      present: String.raw`Hello,\s*world!`,
      absent: String.raw`Hello,\x20world!`,
      text: "You need exactly one space between 'Hello,' and 'world!'",
      text_ja: "「Hello」と「world!」の間にはスペースが 1 つだけ必要です。",
      examples: [ [ "console.log(\"Hello,     world!\");" ] ]
    },
    {
      present: String.raw`^ console \. log \( Hello`,
      text: "You must quote constant strings using \", ', or `",
      text_ja: "定数文字列は \"、'、または ` を使用して引用符で囲む必要があります。",
      examples: [ [ "console.log(Hello, world" ], [ "console.log( Hello, world" ] ]
    },
    {
      absent: String.raw` ; $`,
      text: "Please end this statement with a semicolon. JavaScript does not require a semicolon in this case, but usually when modifying source code you should follow the style of the current code.",
      text_ja: "このステートメントはセミコロンで終了してください。この場合、JavaScript ではセミコロンは必要ありませんが、通常、ソース コードを変更する場合は、現在のコードのスタイルに従う必要があります。",
      examples: [ [ "  console.log(\"Hello, world!\")  " ] ]
    }
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
    ]
  ]
};
