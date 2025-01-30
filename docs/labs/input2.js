info =
{
  hints: [
    {
      absent: ", $",
      text: "This is a parameter, it must end with a comma."
    },
    {
      absent: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \)`,
      text: "Use query() with an 'id' parameter."
    },
    {
      present: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \) [^. ]`,
      text: "After query(\"id\") use a period to invoke a verification method."
    },
    {
      present: "(islength|Islength|IsLength|ISLENGTH)",
      text: "JavaScript is case-sensitive. Use isLength instead of the case you have."
    },
    {
      absent: "isLength",
      text: "Use isLength()."
    },
    {
      present: String.raw`isLength \( [a-z]`,
      text: "You need to pass isLength() an object within {...}."
    },
    {
      absent: "matches",
      text: "Use matches()."
    },
    {
      present: String.raw`matches \( /[^^]`,
      text: "Match the whole string - begin the regular expression with ^"
    },
    {
      present: String.raw`matches \( /[^$/]*[^$]/`,
      text: "Match the whole string - end the regular expression with $"
    },
    {
      present: String.raw`matches \( /[^$/]*[^$]/`,
      text: "Match the whole string - end the regular expression with $"
    },
    {
      present: String.raw`matches \( /\^\[A-Z\]-`,
      text: "That would match only one letter before the dash, you need two."
    },
    {
      present: String.raw`matches \( /.*(\[0-9\]|\d)\*`,
      text: "You need to match one or more digits; * allows 0 or more. A + would be better suited for this task."
    },
    {
      present: String.raw`\s*, , $`,
      text: "You have two commas at the end. Use only one. You may need to scroll or increase the text area to see both of them."
    },
  ],
  expected: [
    String.raw`  query('id').isLength({max:80}).
	matches( /^[A-Z]{2}-[0-9]+-[0-9]+$/ ),`,
  ],
  // Full pattern of correct answer.
  // This specific example is a worst case; we're using
  // a regex to check on a regex, requiring a large number of escapes.
  correct: [
    // This pattern is very generous, allowing
    // constructs like \d for digits and {1,} instead of +.
    String.raw`\s*
    query \( ('id'|"id"|${BACKQUOTE}id${BACKQUOTE}) \)
    \. isLength \( \{ max: 80 ,? \} \)
    \. matches \(
        \/\^\[A-Z\](\{2\}|\[A-Z\])-(\[0-9\]|\\d)(\+|\{1,\})-(\[0-9\]|\\d)(\+|\{1,\})\$\/
      \) , \s*`
  ],
  successes: [
    [
      "query(`id`).isLength( {max:80}).matches(/^[A-Z]{2}-\\d+-[0-9]+$/),"
    ],
    [
      "  query (`id`) . isLength( {max:80}).matches(/^[A-Z]{2}-\\d+-[0-9]+$/ ) ,  "
    ],
  ],
  failures: [
    [
      "query('id').isLength({max:80}).matches( /^[A-Z]{2}-[0-9]+- [0-9]+$/ ),"
    ],
    [
      "query('id').isLength().matches( /^[A-Z]{2}-[0-9]+-[0-9]+$/ ),"
    ],
    [
      "query('id').isLength({max:80}).matches( /[A-Z]{2}-[0-9]+-[0-9]+/ ),"
    ],
    [
      "query(`id`).isLength( {max:80}).matches(/^[A-Z]{2}-\\d+-[0-9]+$/)"
    ],
    [
      "query(`id`).isLength( {max:80}).matches(/^[A-Z]{2}- \\d+-[0-9]+$/),"
    ],
  ],
};
