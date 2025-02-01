info =
{
  // Note: Regular expressions are preprocessed specially in this lab.
  // We simply remove whitespace in them.
  hints: [
    {
      present: "^$",
      text: "You need to enter a pattern.",
      examples: [
        [ "" ]
      ],
    },
    {
      present: String.raw`^\^`,
      text: "We are looking for 'cat' anywhere, not just the beginning, in this exercise.",
      examples: [
        [ "^cat" ],
      ],
    },
    {
      present: "C",
      text: "Regexes are normally case-sensitive. Use a lowercase c.",
      examples: [
        [ "C" ],
      ],
    },
    {
      absent: "c",
      text: "If you are searching for \"cat\" you need to look for a \"c\"",
      examples: [
        [ "x" ],
      ],
    },
    {
      present: String.raw`\[(cat|act)\]`,
      text: "The pattern '[cat]' or '[act]' matches one latter, a 'c', an 'a', or 't'. That is not what you want.",
      examples: [
        [ "[cat]" ],
        [ "[act]" ],
      ],
    },
    {
      absent: "cat",
      text: "The pattern \"cat\" is needed to search for \"cat\".",
      examples: [
        [ "c" ],
      ],
    },
    {
      absent: "A",
      index: 1,
      text: "You need to mention A.",
      examples: [
        [ null, "B" ],
      ],
    },
    {
      absent: String.raw`A(\+|A\*)`,
      index: 1,
      text: "Use \"A+\" to indicate \"one or more A\". You could also write \"AA*\".",
      examples: [
        [ null, "A" ],
        [ null, "AA" ],
      ],
    },
    {
      absent: "B",
      index: 1,
      text: "You need to mention B.",
      examples: [
        [ null, "A+" ],
      ],
    },
    {
      absent: String.raw`B(\+|B\*)`,
      present: 'A',
      index: 1,
      text: "Use \"B+\" to indicate \"one or more B\". You could also write \"BB*\".",
      examples: [
        [ null, "A+B" ],
      ],
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
      "",
    ],
  ],
};
