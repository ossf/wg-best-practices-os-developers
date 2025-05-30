// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      present: "search_lastname",
      text: "You should replace \"search_lastname\" with a placeholder (?).",
      text_ja: "\"search_lastname\" をプレースホルダの (?) に置き換える必要があります。",
      index: 0,
      examples: [
        [
          "search_lastname"
        ],
      ],
    },
    {
      absent: String.raw`\?`,
      text: "Write an parameterized statement with the Special character \"?\" added.",
      text_ja: "特殊文字である \"?\" を使ってパラメータ化されたステートメントを書いてください。",
      index: 0
    },
    {
      present: String.raw`\+`,
      index: 0,
      text: "There is no need for string concatenation. Use a simple constant string using the form \"...\".",
      text_ja: "文字列連結は必要ありません。\"...\" の形で定数文字列を使ってください。",
      examples: [
        [
          "String QueryString =\n  \"select * from authors where lastname = \" + \"?\" + \" ; \";\n",
          ""
        ],
      ],
    },
    {
      absent: String.raw`\s* PreparedStatement\s+pstmt = connection \.
    prepareStatement \( QueryString \) \; \s*`,
      text: "After defining the query string you should create a prepared statement, using the form `PreparedStatement pstmt = connection.prepareStatement(QueryString);`",
      text_ja: "クエリ文字列を定義したあとに、`PreparedStatement pstmt = connection.prepareStatement(QueryString);` の形でプリペアドステートメントを作成する必要があります。",
    },
    {
      absent: "search_lastname",
      present: "lastname",
      index: 1,
      text: "The term `lastname` is the name of the database field to be searched, However, you want to search for a specific value in that field. That value is held in the variable `search_lastname`, not in `lastname`.",
      text_ja: "`lastname` は検索するデータベースのフィールド名です。このフィールドからある特定の値を検索したいはずです。その値は `lastname` ではなく `search_lastname` に格納されています。",
    },
    {
      absent: String.raw`pstmt \. setString \( 1 , search_lastname \) \;`,
      index: 1,
      text: "Start the second section with a statement like `pstmt.setString(1, search_lastname);`",
      text_ja: "２つ目のセクションは `pstmt.setString(1, search_lastname);` で始めてください。",
    },
    {
      absent: "executeQuery",
      present: "execute",
      index: 1,
      text: "Use `executeQuery` not `execute` so we can receive and use a potential series of results (a `ResultSet`).",
      text_ja: "`execute` ではなく `executeQuery` を使用してください。これで一連の結果（ResultSet）を得ることができます。",
    },
    {
      absent: String.raw`\s* ResultSet\s+results = pstmt \. executeQuery \( \) \; \s*`,
      index: 1,
      text: "After using `setString` execute the query and place the results in `results`, something like `ResultSet results = pstmt.executeQuery();`",
      text_ja: "`setString` のあとでクエリを実行し、結果を `result` に格納してください。`ResultSet results = pstmt.executeQuery();` のような形になるはずです。",
    },
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
};
