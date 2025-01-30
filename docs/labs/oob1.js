info =
{
  hints: [
    {
      absent: "^ if",
      text: "Begin with \"if\" as we will return 0 when there is a problem.",
      examples: [
        [ " foo " ],
      ],
    },
    {
      absent: String.raw`\(.*\)`,
      text: "Need \"(...)\" around the condition after an if statement.",
      examples: [
        [ " if " ],
      ],
    },
    {
      absent: "[<>]",
      text: "Need comparison \"if ( ... > ....)\"",
      examples: [
        [ " if ( x )" ],
      ],
    },
    {
      absent: String.raw`s -> s3 -> rrec \. length`,
      text: "Need to compare a value with s->s3->rrec.length",
      examples: [
        [ " if ( length > 3 )" ],
      ],
    },
    {
      absent: "return 0 ;",
      text: "Need \"return 0;\" to skip attempts to send a too-long response.",
    },
    {
      absent: "^ if",
      text: "Begin with \"if\" as we will return 0 when there is a problem.",
      index: 1,
    },
    {
      absent: String.raw`\(.*\)`,
      text: "Need \"(...)\" around the condition after an if statement.",
      index: 1,
    },
    {
      absent: "[<>]",
      text: "Need comparison \"if ( ... > ....)\"",
      index: 1,
    },
    {
      absent: String.raw`s -> s3 -> rrec \. length`,
      text: "Need to compare a value with s->s3->rrec.length",
      index: 1,
    },
    {
      absent: "return 0 ;",
      text: "Need \"return 0;\" to skip attempts to send a too-long response.",
      index: 1,
    },
    {
      absent: "payload",
      text: "Need to consider the payload length.",
      index: 1,
    },
  ],
  definitions: [
    {
      term: "NINETEEN",
      value: String.raw`(1 \+ 2 \+ 16|19)`
    },
    {
      term: "NINETEEN",
      value: String.raw`(NINETEEN|\( NINETEEN \))`
    },
    {
      term: "PAYLOAD_LENGTH",
      value: String.raw`(1 \+ 2|3) \+ payload \+ 16`
    },
    {
      term: "PAYLOAD_LENGTH",
      value: String.raw`(PAYLOAD_LENGTH|payload \+ NINETEEN|NINETEEN \+ payload)`
    },
    {
      term: "PAYLOAD_LENGTH",
      value: String.raw`(PAYLOAD_LENGTH|\( PAYLOAD_LENGTH \))`
    },
    {
      term: "RETURN0",
      value: String.raw`return \s+ 0 ;`
    },
    {
      term: "FULL_LENGTH",
      value: String.raw`s -> s3 -> rrec \. length`
    },
    {
      term: "RETURN0",
      value: String.raw`(RETURN0|\{ RETURN0 \})`
    },
  ],
  expected: [
    `if (1 + 2 + 16 > s->s3->rrec.length)
       return 0;`,
    `if (1 + 2 + payload + 16 > s->s3->rrec.length)
      return 0;`
  ],
  correct: [
    String.raw` \s*
      if \( (NINETEEN > FULL_LENGTH|FULL_LENGTH < NINETEEN) \)
        RETURN0 \s*`,
    String.raw` \s*
      if \( (PAYLOAD_LENGTH > FULL_LENGTH|FULL_LENGTH < PAYLOAD_LENGTH) \)
        RETURN0 \s*`,
  ],
  successes: [
    [
      ` if ( s -> s3 -> rrec . length < 19 )
         return 0 ;`,
      ` if ( s -> s3 -> rrec . length < payload + 19 )
         return 0;`
    ],
    [
      `if(s->s3->rrec.length<19)
         return 0 ;`,
      `if(s->s3->rrec.length<payload+19)
         return 0;`
    ],
  ],
};
