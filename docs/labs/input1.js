info =
{
  hints: [
    {
      absent: ", $",
      text: "This is a parameter, it must end with a comma.",
      examples: [
        [ "  " ]
      ]
    },
    {
      absent: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \)`,
      text: "Add query(\"id\") to verify its value.",
      examples: [
        [ "," ],
        [ "  query()," ]
      ]
    },
    {
      present: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \) [^. ]`,
      text: "After query(\"id\") use a period to invoke a verification method.",
      examples: [
        [ "  query('id')," ]
      ]
    },
    {
      present: "(isint|Isint|IsInt|ISINT)",
      text: "JavaScript is case-sensitive. Use isInt instead of the case you have.",
      examples: [
        [ "  query('id').isint()," ],
        [ "  query('id').IsInt()," ]
      ]
    },
    {
      absent: "isInt",
      text: "Use isInt to determine if the parameter is an integer.",
      examples: [
        [ "  query('id').," ]
      ]
    },
    {
      present: String.raw` query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \).*\([^)]*$`,
      text: "After query(\"id\") you have an ( but there's no matching ).",
      examples: [
        [ "  query('id').isInt(," ]
      ]
    },
    {
      absent: String.raw`isInt \(.*\)`,
      text: "isInt should be followed by (...).",
      examples: [
        [ "  query('id').isInt," ]
      ]
    },
    {
      present: String.raw`\{[^}]*$`,
      text: "You have started an object using { but there's no matching }.",
      examples: [
        [ "  query('id').isInt({)," ]
      ]
    },
    {
      absent: String.raw`isInt \( \{.*\} \)`,
      text: "Inside the parenthesis of isInt() you should have an object like {...}.",
      examples: [
        [ "  query('id').isInt()," ]
      ]
    },
    {
      absent: "min",
      text: "Use min: to specify a minimum value.",
      examples: [
        [ "  query('id').isInt({})," ]
      ]
    },
    {
      absent: "max",
      text: "Use max: to specify a minimum value.",
      examples: [
        [ "  query('id').isInt({min: 1})," ]
      ]
    },
    {
      present: "max.*min",
      text: "JavaScript allows hash entries to be in any order, but this can be confusing to humans. Conventionally minimum values are given before maximum values; please follow that convention.",
      examples: [
        [ "  query('id').isInt({max: 9999, min: 1})," ]
      ]
    }
  ],
  expected: [
    "query('id').isInt({min: 1, max: 9999}),"
  ],
  correct: [
     String.raw`\s* query \( ('id'|"id"|${BACKQUOTE}id${BACKQUOTE}) \) \.
                \s* isInt \( \{ min: 1 , max: 9_?999 ,? \} \) , \s*`
  ],
  successes: [
    [ " query ( 'id' ) . isInt ( {min: 1 , max: 9999 } ) ," ],
    [ " query ( `id` ) . isInt ( {min: 1 , max: 9_999 } ) ,   " ],
    [ "query ( \"id\" ) . isInt ( {min: 1 , max: 9_999 } ) ," ]
  ],
  failures: [
    [ " query," ],
    [ "query('id').isint({min: 1, max: 9999})" ],
    [ "query('id').isInt({min: 1, max: 9999})" ]
  ]
}
