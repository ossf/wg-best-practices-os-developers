info =
{
  hints: [
    {
      absent: ", $",
      text: "This is a parameter, it must end with a comma.",
      text_ja: "パラメータはカンマで終わる必要があります。",
      examples: [
        [ "  " ]
      ],
    },
    {
      absent: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \)`,
      text: "Add query(\"id\") to verify its value.",
      text_ja: "query(\"id\")を追加して、値を検証してください。",
      examples: [
        [ "," ],
        [ "  query()," ]
      ],
    },
    {
      present: String.raw`query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \) [^. ]`,
      text: "After query(\"id\") use a period to invoke a verification method.",
      text_ja: "query(\"id\")の後にピリオドを追加して、バリデーションメソッドを呼び出してください。",
      examples: [
        [ "  query('id')," ]
      ],
    },
    {
      present: "(isint|Isint|IsInt|ISINT)",
      text: "JavaScript is case-sensitive. Use isInt instead of the case you have.",
      text_ja: "JavaScriptは大文字と小文字を区別します。使用している文字の代わりにisIntを使用してください。",
      examples: [
        [ "  query('id').isint()," ],
        [ "  query('id').IsInt()," ]
      ],
    },
    {
      absent: "isInt",
      text: "Use isInt to determine if the parameter is an integer.",
      text_ja: "パラメータが整数かどうかを判断するためにisIntを使用してください。",
      examples: [
        [ "  query('id').," ]
      ],
    },
    {
      present: String.raw` query \( ["'${BACKQUOTE}]id["'${BACKQUOTE}] \).*\([^)]*$`,
      text: "After query(\"id\") you have an ( but there's no matching ).",
      text_ja: "query(\"id\") の後に必要なものがありません。",
      examples: [
        [ "  query('id').isInt(," ]
      ],
    },
    {
      absent: String.raw`isInt \(.*\)`,
      text: "isInt should be followed by (...).",
      text_ja: "isIntの後に書くべきものがあります。",
      examples: [
        [ "  query('id').isInt," ]
      ],
    },
    {
      present: String.raw`\{[^}]*$`,
      text: "You have started an object using { but there's no matching }.",
      text_ja: "{を使用してオブジェクトを開始していますが、対応する}がありません。",
      examples: [
        [ "  query('id').isInt({)," ]
      ],
    },
    {
      absent: String.raw`isInt \( \{.*\} \)`,
      text: "Inside the parenthesis of isInt() you should have an object like {...}.",
      text_ja: "isInt()の括弧内には、{...}のようなオブジェクトを記述する必要があります。",
      examples: [
        [ "  query('id').isInt()," ]
      ],
    },
    {
      absent: "min",
      text: "Use min: to specify a minimum value.",
      text_ja: "最小値を指定するには min: を使用してください。",
      examples: [
        [ "  query('id').isInt({})," ]
      ],
    },
    {
      absent: "max",
      text: "Use max: to specify a minimum value.",
      text_ja: "最大値を指定するには max: を使用してください。",
      examples: [
        [ "  query('id').isInt({min: 1})," ]
      ],
    },
    {
      present: "max.*min",
      text: "JavaScript allows hash entries to be in any order, but this can be confusing to humans. Conventionally minimum values are given before maximum values; please follow that convention.",
      text_ja: "JavaScriptではハッシュエントリの順序は任意ですが、人間にとっては混乱する可能性があります。慣例的に最小値は最大値の前に記述されますので、この慣例に従ってください。",
      examples: [
        [ "  query('id').isInt({max: 9999, min: 1})," ]
      ],
    },
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
    [ "query ( \"id\" ) . isInt ( {min: 1 , max: 9_999 } ) ," ],
  ],
  failures: [
    [ " query," ],
    [ "query('id').isint({min: 1, max: 9999})" ],
    [ "query('id').isInt({min: 1, max: 9999})" ],
  ],
};
