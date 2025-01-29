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
      value: "(COND0 && (COND1 && COND2|COND2 && COND1))"
    }
  ],
  hints: [
    {
      absent: "^ const data =\n",
      text: "The first section should begin with `const data =`"
    },
    {
      present: "json",
      text: "the JSON built-in global object is witten in uppercase."
    },
    {
      absent: String.raw`JSON \. parse
`,
      text: "Make a call to `JSON.parse` with the data retrieved, e.g., `JSON.parse(base64Decoded)` should be stored in `data`."
    },
    {
      present: String.raw`\+
`,
      text: "You should not have any concatenation (`+`) in the first section."
    },
    {
      absent: "; $\n",
      text: "JavaScript does not require semicolons at the end of a statement, but since the other statements terminate with semicolons, you should also terminate your statement with a semicolon to be consistent."
    },
    {
      absent: String.raw`^ if \(`,
      index: 1,
      text: "The second section should start with `if (` followed by a condition.",
      examples: [
        [
          "const data = JSON.parse(base64Decoded);",
          "if data.username {\n"
        ]
      ]
    },
    {
      absent: String.raw`data \. username
`,
      index: 1,
      text: "Check if the data object has a property called username. You can do this by referencing data.username."
    },
    {
      absent: String.raw`\&\&`,
      index: 1,
      text: "To combine multiple conditions in JavaScript use &&. This operator means 'and', so both conditions must be true for the entire statement to pass."
    },
    {
      absent: "typeof",
      index: 1,
      text: "Use typeof to check the type of the operand's value. You should have `typeof data.username == 'string'` or similar."
    },
    {
      present: String.raw`typeof data \. username == 'String'
`,
      index: 1,
      text: "When using typeof, JavaScript expects \"string\" all lowercase."
    },
    {
      absent: "length",
      index: 1,
      text: "check if the length of the string is smaller than 20 characters. Use the expression `data.username.length &lt; 20` to determine this."
    },
    {
      present: String.raw`^ if \(`,
      absent: String.raw`^ if \( data \. username &&`,
      index: 1,
      text: "Begin the second section with `if ( data.username && ... ` because you must check if data is even present before you can check various attributes of that data.",
      examples: [
        [
          "const data = JSON.parse(base64Decoded);",
          "if (typeof data.username == 'string' && data.username.length < 20 && data.username) {"
        ]
      ]
    }
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
    ]
  ],
  failures: [
    [
      "const data = JSON.parse(base64Decoded);",
      "if (data.username && (typeof data.username == 'string')) && (data.username.length < 20)) {"
    ]
  ]
}
