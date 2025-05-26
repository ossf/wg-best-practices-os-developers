// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      present: String.raw`\s*free[^;]*; asprintf`,
      text: "Do not free the input first, you need to use it.",
      text_ja: "入力を最初に free しないでください。それは使う必要があります。",
      examples: [
        [
          "free(s);\nasprintf(&result, \"pre_%s_post\", s);"
        ],
      ],
    },
    {
      present: String.raw`\s* asprintf \(`,
      absent: "free",
      text: "This fails to free the memory, likely leading to a missing release.",
      text_ja: "メモリを解放し忘れています。",
      examples: [
        [
          "asprintf(&result, \"\"pre_%s_post\"\", s);"
        ],
      ],
    },
    {
      absent: "return",
      text: "This fails to return the result.",
      text_ja: "結果を返し忘れています。",
    },
    {
      absent: String.raw`\s* [^;]+;[^;]+;[^;]+; \s*`,
      text: "There should be 3 statements, each terminated with a semicolon.",
      text_ja: "それぞれがセミコロンで終わる３つのステートメントが必要です。",
      examples: [
        [
          "asprintf(&result, \"pre_%s_post\", s);\nfree(s);\nreturn result"
        ],
      ],
    },
    {
      present: String.raw`\s* return result ; free \s*`,
      text: "Do not do anything after the return, it will not execute.",
      text_ja: "return のあとは何もしないでください。それは実行されません。",
      examples: [
        [
          "asprintf(&result, \"pre_%s_post\", s);\nreturn result;\nfree(s);"
        ],
      ],
    },
  ],
  expected: [
`  asprintf(&result, "pre_%s_post", s);
  free(s);
  return result;`
  ],
  correct: [
    String.raw`\s*
      asprintf \( & result , "pre_%s_post" , s \) ;
      free \( s \) ;
      return result ; \s*`
  ],
};
