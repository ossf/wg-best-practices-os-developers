info =
{
  hints: [
    {
      present: "search_lastname",
      text: "You should replace \"search_lastname\" with a placeholder (?).",
      index: 0,
      examples: [
        [
          "search_lastname"
        ]
      ]
    },
    {
      absent: String.raw`\?`,
      text: "Write an parameterized statement with the Special character \"?\" added.",
      index: 0
    },
    {
      present: String.raw`\+`,
      index: 0,
      text: "There is no need for string concatenation. Use a simple constant string using the form \"...\".",
      examples: [
        [
          "String QueryString =\n  \"select * from authors where lastname = \" + \"?\" + \" ; \";\n",
          ""
        ]
      ]
    },
    {
      absent: String.raw`\s* PreparedStatement\s+pstmt = connection \.
    prepareStatement \( QueryString \) \; \s*`,
      text: "After defining the query string you should create a prepared statement, using the form `PreparedStatement pstmt = connection.prepareStatement(QueryString);`"
    },
    {
      absent: "search_lastname",
      present: "lastname",
      index: 1,
      text: "The term `lastname` is the name of the database field to be searched, However, you want to search for a specific value in that field. That value is held in the variable `search_lastname`, not in `lastname`."
    },
    {
      absent: String.raw`pstmt \. setString \( 1 , search_lastname \) \;`,
      index: 1,
      text: "Start the second section with a statement like `pstmt.setString(1, search_lastname);`"
    },
    {
      absent: "executeQuery",
      present: "execute",
      index: 1,
      text: "Use `executeQuery` not `execute` so we can receive and use a potential series of results (a `ResultSet`)."
    },
    {
      absent: String.raw`\s* ResultSet\s+results = pstmt \. executeQuery \( \) \; \s*`,
      index: 1,
      text: "After using `setString` execute the query and place the results in `results`, something like `ResultSet results = pstmt.executeQuery();`"
    }
  ],
  expected: [
    String.raw`  String QueryString = "select * from authors where lastname=?";
  PreparedStatement pstmt = connection.prepareStatement(QueryString);`,
    String.raw`  pstmt.setString(1, search_lastname);
  ResultSet results = pstmt.executeQuery( );`,
  ],
  correct: [
    String.raw`\s* String\s+QueryString =
      \"select\s+\*\s+from\s+authors\s+where\s+lastname\s*\=\s*\?\s*;?\s*\" \;
      \s* PreparedStatement\s+pstmt = connection \.
          prepareStatement \( QueryString \) \; \s*`,
      // Note: Java Statement has an "executeQuery" method, of form:
      //   ResultSet executeQuery(String sql)
      // It requires exactly one parameter and does NOT accept added parameters.
      // So `executeQuery(sql, search_lastname)` is not legal Java.
      // Some documents and online help forums get this wrong.
      // For the authoritative answer (in Java 22), see:
      // https://docs.oracle.com/en/java/javase/22/docs/api/java.sql/java/sql/Statement.html
    String.raw`\s* pstmt \. setString \( 1 , search_lastname \) \;
      \s* ResultSet\s+results = pstmt \. executeQuery \( \) \; \s*`,
  ],
}
