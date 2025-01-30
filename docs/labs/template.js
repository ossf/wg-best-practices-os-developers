info =
{
  hints: [
    {
      present: "initial",
      text: "The term 'initial' is not part of the answer."
    },
    {
      present: "unknown",
      text: "Unknown is not part of the answer."
    },
    {
      absent: String.raw`EXPECTED`,
      text: "The word 'EXPECTED' is expected."
    },
    {
      present: "initial",
      index: 1,
      text: "The term 'initial' is not part of the answer."
    },
    {
      absent: String.raw`EXPECTED`,
      index: 1,
      text: "The word 'EXPECTED' is expected."
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
