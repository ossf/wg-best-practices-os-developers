info =
{
  hints: [
    {
      absent: "autoescape",
      text: "Add an `autoescape=` parameter."
    },
    {
      present: String.raw`autoescape [^:\x20]`,
      text: "The name `autoescape` needs to be followed by `=`."
    },
    {
      present: "(Autoescape|AUTOESCAPE)",
      text: "The name `autoescape` must be in all lowercase."
    },
    {
      present: "([Aa]uto_[Ee]scape|AUTO_ESCAPE)",
      text: "Use `autoescape` in all lowercase with no underscores."
    },
    {
      present: String.raw`\| safe`,
      index: 1,
      text: "The text `| safe` indicates that this text is trusted and should not be escaped further. However, in context this data could be provided from an attacker and is NOT safe. Remove the marking."
    },
    {
      present: String.raw`\|`,
      index: 1,
      text: "The `|` is used to separate the computed value from the safe marking, but we will not use that marking. Remove the vertical bar."
    },
    {
      present: String.raw`Markup \(.*\+.*\)`,
      index: 2,
      text: "Having a concatenation (+) *inside* the call to Markup is a vulnerability. The call to Markup presumes we are passing text that is *not* supposed be escaped. If it is supposed to be escaped, it should be concatenated outside the initial construction of the Markup object."
    },
    {
      absent: String.raw`\+`,
      index: 2,
      text: "Our expected answer includes concatentation using `+`. We expect something like `Markup('Original name='` followed by `+` followed by the variable containing the data that needs to be escaped."
    },
  ],
  expected: [
    'autoescape=select_autoescape()',
    '<h1>Hello {{ person }}!</h1>',
    `result = Markup('Original name=') + name`
  ],
  correct: [
     String.raw`\s* autoescape = select_autoescape \( \) \s*`,
     String.raw`\s* < h1 >Hello\x20{{ person }}!< /h1 > \s*`,
     String.raw`\s* result = Markup \( ('Original name='|"Original name=") \) \+ name \s*`
  ],
};
