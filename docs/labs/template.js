info =
{
  hints: [
    {
      present: "initial",
      text: "The term 'initial' is not part of the answer.",
      examples: [
        [ 'initial', ],
      ],
    },
    {
      present: "unknown",
      text: "Unknown is not part of the answer.",
      examples: [
        [ 'unknown', ],
      ],
    },
    {
      absent: String.raw`EXPECTED`,
      text: "The word 'EXPECTED' is expected.",
      examples: [
        [ '', ],
        [ 'fiddly', ],
      ],
    },
    {
      present: "initial",
      index: 1,
      text: "The term 'initial' is not part of the answer.",
      examples: [
        [ null, 'initial', ],
      ],
    },
    {
      absent: String.raw`EXPECTED`,
      index: 1,
      text: "The word 'EXPECTED' is expected.",
      examples: [
        [ null, 'not-here', ],
      ],
    },
  ],
  expected: [
    "EXPECTED0",
    "EXPECTED1"
  ],
  correct: [
    String.raw`\s* EXPECTED0 \s*`,
    String.raw`\s* EXPECTED1 \s*`
  ],
  successes: [
    [ " EXPECTED0 ", " EXPECTED1 " ],
    [ "   EXPECTED0   ", "   EXPECTED1   " ]
  ],
  failures: [
    [ "EXPECTED", "EXPECTED1" ],
    [ "Unknown", "EXPECTED1" ],
    [ "EXPECTED0", "EXPECTED" ],
    [ "EXPECTED0", "EXPECTED11" ]
  ],
  // debug: true, // to enable debug output
};
