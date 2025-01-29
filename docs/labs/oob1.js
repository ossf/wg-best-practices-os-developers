info =
{
  hints: [
    {
      absent: "if",
      text: "Begin with \"if\" as we will return 0 when there is a problem."
    },
    {
      absent: String.raw`\(
`,
      text: "Need \"(...)\" around the condition after an if statement."
    },
    {
      absent: ">\n",
      text: "Need comparison \"if ( ... > ....)\""
    },
    {
      absent: String.raw`s -> s3 -> rrec \. length`,
      text: "Need to compare a value with s->s3->rrec.length"
    },
    {
      absent: "return",
      text: "Need \"return 0;\" to skip attempts to send a too-long response."
    }
  ],
  definitions: [
    {
      term: "NINETEEN",
      value: String.raw`(1 \+ 2 \+ 16|19)
`
    },
    {
      term: "NINETEEN",
      value: String.raw`(NINETEEN|\( NINETEEN \))
`
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
      value: String.raw`(PAYLOAD_LENGTH|\( PAYLOAD_LENGTH \))
`
    },
    {
      term: "RETURN0",
      value: String.raw`return \s+ 0 ;
`
    },
    {
      term: "FULL_LENGTH",
      value: String.raw`s -> s3 -> rrec \. length
`
    },
    {
      term: "RETURN0",
      value: String.raw`(RETURN0|\{ RETURN0 \})
`
    }
  ]
}
