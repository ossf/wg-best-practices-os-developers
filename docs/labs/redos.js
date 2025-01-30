info =
{
  hints: [
    {
      absent: ", $",
      text: "This is a parameter, it must end with a comma."
    },
    {
      absent: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \)
`,
      text: "Use query() with an 'id' parameter."
    },
    {
      present: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \) [^. ]
`,
      text: "After query(\"id\") use a period to invoke a verification method."
    },
    {
      present: "(islength|Islength|IsLength|ISLENGTH)\n",
      text: "JavaScript is case-sensitive. Use isLength instead of the case you have.\n"
    },
    {
      absent: "isLength",
      text: "Limit the maximum length of input strings using isLength()."
    },
    {
      present: String.raw`isLength \( m
`,
      text: "You need to pass isLength() an object with the max parameter, e.g., isLength({max: VALUE}).\n"
    },
    {
      absent: "matches",
      text: "Use matches()."
    },
    {
      present: String.raw`matches \( /[^^]
`,
      text: "Match the whole string - begin the regular expression with ^"
    },
    {
      present: String.raw`matches \( /.*[^$]/
`,
      text: "Match the whole string - end the regular expression with $"
    },
    {
      present: String.raw`matches \( /.*[^$]/
`,
      text: "Match the whole string - end the regular expression with $"
    },
    {
      present: String.raw`matches \( /\^\[A-Z\]
`,
      text: "That would match only letters, you need digits as well."
    },
    {
      present: String.raw`matches \( /\^\[a-z\]
`,
      text: "That would match only lower case letters, the format requirement is uppercase letters."
    },
    {
      present: String.raw`matches \( /\^\(\[A-Z0-9\]\+\)\+\$ 
`,
      text: "Remember to fix the regex, the outer + quantifier causes backtracking by trying to match one or more sequences of one or more uppercase alphanumeric characters."
    },
    {
      present: String.raw`matches \( /\^\(\[A-Z0-9\]\+\)\$ 
`,
      text: "Remove the grouping, you don’t need the parentheses."
    },
    {
      present: String.raw`\[0-9[Aa]-[Zz]\]`,
      text: "It's conventional to list letters first, so use [A-Z0-9] not [0-9A-Z]"
    },
  ],
  expected: [
    "query('id').isLength({max:50}).matches( /^[A-Z0-9]+$/ ),",
  ],
  correct: [
    String.raw`\s* query \(
      ('id'|"id"|${BACKQUOTE}id${BACKQUOTE}) \)
      \. isLength \( \{ max: 50 ,? \} \)
      \. matches \( \/\^\[A-Z0-9\]\+\$\/ \) , \s*`,
  ],
  successes: [
    [ " query ( `id` ) . isLength( {max:50} ).matches( /^[A-Z0-9]+$/ ) , " ],
  ],
  failures: [
    [ "query('id').isLength({max:50}).matches( /^[A-Z]+$/ ),", ],
  ],
};
