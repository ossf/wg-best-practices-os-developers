// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: String.raw`^ \s* conn = DriverManager \. getConnection \( url \,`,
      text: "Your answer should start with  `conn = DriverManager.getConnection( url,` just as the initial value did. You might want to use the `Reset` button."
    },
    {
      absent: String.raw`System \. getenv`,
      text: "Use `System.getenv` to retrieve an environment variable value. For example, use `System.getenv(\"USERNAME\")` to retrieve the username."
    },
    {
      present: String.raw`System \. getenv \( \"admin\" \)`,
      text: "You need to pass to `System.getenv` the name of an environment variable value, not the result you might get. Do not use constructs like `System.getenv(\"admin\")`. Instead, for example, use `System.getenv(\"USERNAME\")` to retrieve the username."
    },
    {
      absent: String.raw`System \. getenv \( \"PASSWORD\" \)`,
      text: "Use `System.getenv` to retrieve an environment variable value. For example, use `System.getenv(\"USERNAME\")` to retrieve the username."
    },
    {
      present: "admin",
      text: "The term 'admin' should not be in your code. You should be retrieving both the username and the password from somewhere else, in this case, from environment variables."
    },
    {
      present: "(system|Getenv|GetEnv)",
      text: "Java is case-sensitive. You need to use `System.getenv` and not some other variation of uppercase or lowercase."
    },
    {
      absent: String.raw`\; \s* $`,
      text: "Java statements must end with a semicolon."
    },
    {
      absent: String.raw`\) \) \; \s* $`,
      text: "Double-check your closing parentheses at the end of the statement."
    },
    {
      present: String.raw`new\s+String`,
      text: "You do not need to construct a new string to retrieve an environment variable value."
    },
    {
      present: String.raw`^ conn = DriverManager \. getConnection \( url \) \; \s* $`,
      text: "In some sense this is correct, as long as the url is not hardcoded. However, it's often better if administrators can easily change the username or password separately, and it makes out point clearer. Please provide the username and password and separate values."
    },
    {
      present: String.raw`^ \s* conn = DriverManager \. getConnection \( url \,
  System \. getenv \( "PASSWORD" \) \,
  System \. getenv \( "USERNAME" \) \) \; \s* $`,
      text: "The order of parameters is wrong. Provide the url, then the username, then the password. You're providing the url, then the password, then the username, which swaps the second and third parameters."
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
