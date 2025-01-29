info =
{
  hints: [
    {
      present: "assert",
      text: "The whole point of this exercise is to NOT use `assert` as a way to validate input from untrusted users.",
      examples: [
        [ "assert !bindingResult.hasErrors();\n" ]
      ]
    },
    {
      absent: String.raw`^\s* if `,
      text: "Begin with `if` so you can return a result if there are errors.",
      examples: [
        [ "return \"form\";" ]
      ]
    },
    {
      present: "(bindingresult|BindingResult)",
      text: "Java is case-sensitive. Use `bindingResult`, not `bindingresult` nor `BindingResult`."
    },
    {
      present: "(haserrors|HasErrors)",
      text: "Java is case-sensitive. Use `hasErrors`, not `haserrors` nor `HasErrors`."
    },
    {
      present: String.raw`^\s*if\s*[^\(\s]`,
      text: "In Java, after the keyword `if` you must have an open left parenthesis. Conventionally there is one space between the `if` keyword and the open left parenthesis.",
      examples: [
        [ "if bindingResult.hasErrors" ]
      ]
    },
    {
      present: String.raw`^\s*if\s*\(\s*\!binding`,
      text: "You have an extraneous `!` (not operator). Use the expression if (bindingResult.hasErrors()) ...",
      examples: [
        [ "if (!bindingResult.hasErrors())" ]
      ]
    },
    {
      absent: String.raw`^ if \( bindingResult \. hasErrors \( \) \) `,
      text: "Begin the answer with the text `if (bindingResult.hasErrors())` so that a statement will be executed if that condition is true."
    },
    {
      present: String.raw`if \( bindingResult \. hasErrors \( \) \) [^\{\s] `,
      text: "Follow the conditional with an open brace, e.g., `if (bindingResult.hasErrors()) {...`."
    },
    {
      absent: String.raw`return "form"
`,
      text: "You need to use `return \"form\";` somewhere."
    },
    {
      present: String.raw`return "form"`,
      absent: String.raw`return "form" ;`,
      text: "You need to use `;` (semicolon) after `return \"form\"` because in Java statements must be followed by a semicolon."
    },
    {
      absent: String.raw`\} $`,
      text: "The answer needs to end with `}` (closing brace)."
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
  ]
}
