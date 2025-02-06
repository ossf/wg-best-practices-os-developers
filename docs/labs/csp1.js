// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      present: "import",
      text: "Yes, many JavaScript implementations support an import statement. However, in this exercise we will use a require form. Please use that instead.",
      examples: [
        [
          "import express from \"express\";"
        ],
      ],
    },
    {
      absent: "const",
      text: "Start with const."
    },
    {
      absent: String.raw`const\s+helmet =`,
      text: "Create a constant name named helmet using the form const helmet = ...",
      examples: [
        [ "const" ],
        [ "consthelmet = " ]
      ],
    },
    {
      present: String.raw`require \( helmet \)`,
      text: "The parameter of a requirement statement must be string. Surround the term helment with double-quotes.",
      examples: [
        [ "  const helmet = require(helmet);" ]
      ],
    },
    {
      absent: "; $",
      text: "JavaScript doesn''t require semicolon terminators, but the rest of the code uses them. You should try to match a coding style when modifying existing code unless there''s an important reason not to. Please update the first statment.",
      examples: [
        [ "  const helmet = require(\"helmet\")" ]
      ],
    },
    {
      absent: String.raw`\s* app \. use \( helmet \( \{`,
      index: 1,
      text: "Your code should begin with app.use(helmet({"
    },
    {
      absent: String.raw`\s* app \. use \( helmet \( \{
      contentSecurityPolicy: \{ \s*
`,
      index: 1,
      text: "Your code should begin with:\napp.use(helmet({\n  contentSecurityPolicy: {\n"
    },
    {
      absent: String.raw`\s* app \. use \( helmet \( \{
      contentSecurityPolicy: \{
        directives: \{ \s*
`,
      index: 1,
      text: "Your code should begin with:\napp.use(helmet({\n  contentSecurityPolicy: {\n        directives: {\n"
    },
    {
      absent: String.raw`\s* app \. use \( helmet \( \{
      contentSecurityPolicy: \{
        directives: \{
            "script-src": \[ "'self'" , ["']https://example.com["'] \] , \s*
`,
      index: 1,
      text: "Your code should continue with:\napp.use(helmet({\n  contentSecurityPolicy: {\n        directives: {\n          \"script-src\": [\"'self'\", \"https://example.com\"],\n"
    },
    {
      absent: String.raw`"style-src": \[ "'self'" \]
`,
      index: 1,
      text: "Don't forget to include \"style-src\": [\"'self'\"]\n"
    },
    {
      absent: "; $",
      index: 1,
      text: "JavaScript doesn''t require semicolon terminators, but the rest of the code uses them. You should try to match a coding style when modifying existing code unless there''s an important reason not to. Please update the second statement to use a semicolon terminator."
    },
    {
      absent: String.raw`\} \} \) \) ; $`,
      index: 1,
      text: "The correct answer is expected to end with `} } ) ) ;` ignoring whitespace. Check that you have matching parentheses and braces."
    },
    {
      text: "I do not have more specific hints to provide. Please ensure that the parentheses, braces, and brackets pair correctly, as that is often the problem."
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
