// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: String.raw`^ \s* conn = DriverManager \. getConnection \( url \,`,
      text: "Your answer should start with  `conn = DriverManager.getConnection( url,` just as the initial value did. You might want to use the `Reset` button.",
      text_ja: "回答は元からあるように `conn = DriverManager.getConnection( url,` で始まるはずです。「リセット」ボタンを使うとよいかもしれません。",
    },
    {
      absent: String.raw`System \. getenv`,
      text: "Use `System.getenv` to retrieve an environment variable value. For example, use `System.getenv(\"USERNAME\")` to retrieve the username.",
      text_ja: "環境変数の値を取得するためには `System.getenv` を使います。例えばユーザ名を取得するためには `System.getenv(\"USERNAME\")` を使ってください。",
    },
    {
      present: String.raw`System \. getenv \( \"admin\" \)`,
      text: "You need to pass to `System.getenv` the name of an environment variable value, not the result you might get. Do not use constructs like `System.getenv(\"admin\")`. Instead, for example, use `System.getenv(\"USERNAME\")` to retrieve the username.",
      text_ja: "`System.getenv` には取得したい値ではなく、環境変数の名前を渡します。`System.getenv(\"admin\")` の代わりに、例えばユーザ名を取得するためには `System.getenv(\"USERNAME\")` としてください。",
    },
    {
      absent: String.raw`System \. getenv \( \"PASSWORD\" \)`,
      text: "Use `System.getenv` to retrieve an environment variable value. For example, use `System.getenv(\"USERNAME\")` to retrieve the username.",
      text_ja: "環境変数の値を取得するためには `System.getenv` を使います。例えばユーザ名を取得するためには `System.getenv(\"USERNAME\")` を使ってください。",
    },
    {
      present: "admin",
      text: "The term 'admin' should not be in your code. You should be retrieving both the username and the password from somewhere else, in this case, from environment variables.",
      text_ja: "'admin' という語句はコードに現れるべきではありません。ユーザ名とパスワードのどちらもどこか他の場所から、今回のケースでは環境変数の値から取得する必要があります。",
    },
    {
      present: "(system|Getenv|GetEnv)",
      text: "Java is case-sensitive. You need to use `System.getenv` and not some other variation of uppercase or lowercase.",
      text_ja: "Java は大文字と小文字を区別します。`System.getenv` 以外の大文字と小文字の組み合わせを使ってはいけません。",
    },
    {
      absent: String.raw`\; \s* $`,
      text: "Java statements must end with a semicolon.",
      text_ja: "Java のステートメントはセミコロンで終わる必要があります。",
    },
    {
      absent: String.raw`\) \) \; \s* $`,
      text: "Double-check your closing parentheses at the end of the statement.",
      text_ja: "ステートメント終わりの右側（閉じ）カッコをもう一度確認してください。",
    },
    {
      present: String.raw`new\s+String`,
      text: "You do not need to construct a new string to retrieve an environment variable value.",
      text_ja: "環境変数の値を取得するために新たに文字列を作成する必要はありません。",
    },
    {
      present: String.raw`^ conn = DriverManager \. getConnection \( url \) \; \s* $`,
      text: "In some sense this is correct, as long as the url is not hardcoded. However, it's often better if administrators can easily change the username or password separately, and it makes out point clearer. Please provide the username and password and separate values.",
      text_ja: "URL がハードコードされていない限り、ある意味これは正解です。しかしユーザ名とパスワードを容易にかつ個別に変更できることはしばしば管理者にとって望ましく、かつそれにより問題の本質が明確になります。ユーザ名とパスワードは個別の値としてください。",
    },
    {
      present: String.raw`^ \s* conn = DriverManager \. getConnection \( url \,
  System \. getenv \( "PASSWORD" \) \,
  System \. getenv \( "USERNAME" \) \) \; \s* $`,
      text: "The order of parameters is wrong. Provide the url, then the username, then the password. You're providing the url, then the password, then the username, which swaps the second and third parameters.",
      text_ja: "引数の順番に誤りがあります。URL、ユーザ名、パスワードの順としてください。URL、パスワード、ユーザ名の順になっており、二番目と三番目の引数が逆になっています。",
    },
  ],
  expected: [
    `conn = DriverManager.getConnection(url,
      System.getenv("USERNAME"), System.getenv("PASSWORD"));`
  ],
  correct: [
    String.raw`\s* conn = DriverManager \. getConnection \( url \,
      \s* System \. getenv \( "USERNAME" \) \,
      \s* System \. getenv \( "PASSWORD" \) \) \; \s*`
  ],
};
