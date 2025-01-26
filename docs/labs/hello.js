info =
{
  "hints": [
    {
      "absent": String.raw`^ console \. log \(`,
      "text": " Please use the form console.log(\"...\");",
      "examples": [
        [ "" ],
        [ "foo" ]
      ]
    },
    {
      "present": "Goodbye",
      "text": "You need to change the text Goodbye to something else.",
      "examples": [
        [ "console.log(\"Goodbye.\");" ]
      ]
    },
    {
      "present": "hello",
      "text": "Please capitalize Hello.",
      "examples": [
        [ "console.log(\"hello.\");" ]
      ]
    },
    {
      "present": "World",
      "text": "Please lowercase world.",
      "examples": [
        [ "console.log(\"Hello, World!\");" ]
      ]
    },
    {
      "present": "Hello[^,]",
      "text": "Put a comma immediately after Hello.",
      "examples": [
        [ "console.log(\"Hello world.\");" ]
      ]
    },
    {
      "present": "Hello",
      "absent": "[Ww]orld",
      "text": "There's a Hello, but you need to also mention the world.",
      "examples": [
        [ "console.log(\"Hello, \");" ]
      ]
    },
    {
      "present": String.raw`world[^\!]`,
      "text": "Put an exclamation point immediately after world.",
      "examples": [
        [ "console.log(\"Hello, world.\");" ]
      ]
    },
    {
      "present": String.raw`Hello,\s*world!`,
      "absent": String.raw`Hello,\x20world!`,
      "text": "You need exactly one space between 'Hello,' and 'world!'",
      "examples": [
        [ "console.log(\"Hello,     world!\");" ]
      ]
    },
    {
      "present": String.raw`^ console \. log \( Hello`,
      "text": "You must quote constant strings using \", ', or `",
      "examples": [
        [ "console.log(Hello, world" ],
        [ "console.log( Hello, world" ]
      ]
    },
    {
      "absent": String.raw` ; $`,
      "text": "Please end this statement with a semicolon. JavaScript does not require a semicolon in this case, but usually when modifying source code you should follow the style of the current code.\n",
      "examples": [
        [ "  console.log(\"Hello, world!\")  " ]
      ]
    }
  ],
  "successes": [
    [ " console . log( \"Hello, world!\" ) ; " ],
    [ " console . log( 'Hello, world!' ) ; " ],
    [ " console . log( `Hello, world!` ) ; " ]
  ],
  "failures": [
    [ " console . log( Hello, world! ) ; " ],
    [ " console . log(\"hello, world!\") ; " ]
  ],
  // All regexes are preprocessed by a set of rules. You can replace them with your
  // own set. You can completely eliminate them by providing an empty set of rules:
  // "preprocessing" : [ ],
  // Here are tests for default preprocessing. You do not need this in
  // every lab, but it demonstrates how to create tests for your preprocessing.
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
