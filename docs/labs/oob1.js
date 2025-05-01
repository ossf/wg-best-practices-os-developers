// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: "^ if",
      text: "Begin with \"if\" as we will return 0 when there is a problem.",
      text_ja: "問題があれば 0 を返せるように \"if\" で始めてください。",
      examples: [
        [ " foo " ],
      ],
    },
    {
      absent: String.raw`\(.*\)`,
      text: "Need \"(...)\" around the condition after an if statement.",
      text_ja: "if のあとの条件は (...) で囲む必要があります。",
      examples: [
        [ " if " ],
      ],
    },
    {
      absent: "[<>]",
      text: "Need comparison \"if ( ... > ....)\"",
      text_ja: "\"if ( ... > ....)\" のような比較が必要です。",
      examples: [
        [ " if ( x )" ],
      ],
    },
    {
      absent: String.raw`s -> s3 -> rrec \. length`,
      text: "Need to compare a value with s->s3->rrec.length",
      text_ja: "値を s->s3->rrec.length と比較する必要があります。",
      examples: [
        [ " if ( length > 3 )" ],
      ],
    },
    {
      absent: "return 0 ;",
      text: "Need \"return 0;\" to skip attempts to send a too-long response.",
      text_ja: "長すぎるレスポンスが送信されないように \"return 0;\" が必要です。",
    },
    {
      absent: "^ if",
      text: "Begin with \"if\" as we will return 0 when there is a problem.",
      text_ja: "問題があれば 0 を返せるように \"if\" で始めてください。",
      index: 1,
    },
    {
      absent: String.raw`\(.*\)`,
      text: "Need \"(...)\" around the condition after an if statement.",
      text_ja: "if のあとの条件は (...) で囲む必要があります。",
      index: 1,
    },
    {
      absent: "[<>]",
      text: "Need comparison \"if ( ... > ....)\"",
      text_ja: "\"if ( ... > ....)\" のような比較が必要です。",
      index: 1,
    },
    {
      absent: String.raw`s -> s3 -> rrec \. length`,
      text: "Need to compare a value with s->s3->rrec.length",
      text_ja: "値を s->s3->rrec.length と比較する必要があります。",
      index: 1,
    },
    {
      absent: "return 0 ;",
      text: "Need \"return 0;\" to skip attempts to send a too-long response.",
      text_ja: "長すぎるレスポンスが送信されないように \"return 0;\" が必要です。",
      index: 1,
    },
    {
      absent: "payload",
      text: "Need to consider the payload length.",
      text_ja: "ペイロードの長さも考慮に入れてください。",
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
