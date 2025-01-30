info =
{
  hints: [
    {
      present: "^$",
      text: "You need to enter a pattern."
    },
    {
      present: String.raw`^\^`,
      text: "We are looking for 'cat' anywhere, not just the beginning, in this exercise."
    },
    {
      present: "C",
      text: "Regexes are normally case-sensitive. Use a lowercase c.",
      examples: [
        [ "C" ]
      ],
    },
    {
      absent: "c",
      text: "If you are searching for \"cat\" you need to look for a \"c\"",
      examples: [
        [ "x" ]
      ],
    },
    {
      absent: "cat",
      text: "The pattern \"cat\" is needed to search for \"cat\"."
    },
    {
      absent: "A",
      index: 1,
      text: "You need to mention A."
    },
    {
      absent: "B",
      index: 1,
      text: "You need to mention B."
    },
    {
      absent: String.raw`A(\+|A\*)`,
      index: 1,
      text: "Use \"A+\" to indicate \"one or more A\". You could also write \"AA*\"."
    },
    {
      absent: String.raw`B(\+|B\*)`,
      index: 1,
      text: "Use \"B+\" to indicate \"one or more B\". You could also write \"BB*\"."
    },
  ],
  expected: [
    'cat',
    'A+BB*'
  ],
  correct: [
    'cat',
    // Spaces are removed by the preprocessor for this lab.
    String.raw`A(\+|A\*) B(\+|B\*)`
  ],
  successes: [
    [ 'cat', 'A+B+' ],
    [ 'cat', 'AA*BB*' ],
  ],
  failures: [
    [ 'Cat', 'A+B+' ],
    [ 'cat', 'A*B*' ],
  ],
  preprocessing: [
    [
      "\\s*",
      ""
    ],
  ],
};
