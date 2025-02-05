info =
{
  hints: [
    {
      present: String.raw`\s*free[^;]*; asprintf`,
      text: "Do not free the input first, you need to use it.",
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
      examples: [
        [
          "asprintf(&result, \"\"pre_%s_post\"\", s);"
        ],
      ],
    },
    {
      absent: "return",
      text: "This fails to return the result.",
    },
    {
      absent: String.raw`\s* [^;]+;[^;]+;[^;]+; \s*`,
      text: "There should be 3 statements, each terminated with a semicolon.",
      examples: [
        [
          "asprintf(&result, \"pre_%s_post\", s);\nfree(s);\nreturn result"
        ],
      ],
    },
    {
      present: String.raw`\s* return result ; free \s*`,
      text: "Do not do anything after the return, it will not execute.",
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
