info =
{
  hints: [
    {
      present: String.raw`def format_event \( user_input
`,
      text: "The `user_format` should no longer be used, so we should remove it from the list of parameters being passed into the function being defined by `def`. The first line should read `def format_event(new_event):`"
    },
    {
      present: "user_input",
      text: "Do not support a user-provided format at all. In this case there is no need for it."
    },
    {
      absent: "event",
      text: "We want to see `event`, e.g., return '{event.level},...'.format(event=new_event)"
    },
    {
      present: String.raw`\{0`,
      text: "For our purposes we want to use named parameters, so do not use `{0}` or similar."
    },
    {
      absent: String.raw`\'\{event.level\},\{event.message\}\'
`,
      text: "The constant text `'{event.level},{event.message}'` should be present."
    }
  ]
}
