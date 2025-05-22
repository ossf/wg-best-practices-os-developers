// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      present: String.raw`def format_event \( user_format
`,
      text: "The `user_format` should no longer be used, so we should remove it from the list of parameters being passed into the function being defined by `def`. The first line should read `def format_event(new_event):`",
      text_ja: "`user_format` はもはや使うべきではないため、`def` で定義されている関数に渡される引数からこれを削除すべきです。最初の一行は `def format_event(new_event):` とすべきです。",
    },
    {
      present: "user_format",
      text: "Do not support a user-provided format at all. In this case there is no need for it.",
      text_ja: "ユーザがフォーマットを指定することを完全に禁止してください。このケースでは、その必要は全くありません。",
    },
    {
      absent: "event",
      text: "We want to see `event`, e.g., return '{event.level},...'.format(event=new_event)",
      text_ja: "`event` が必要です。例：return '{event.level},...'.format(event=new_event)",
    },
    {
      present: String.raw`\{0`,
      text: "For our purposes we want to use named parameters, so do not use `{0}` or similar.",
      text_ja: "この目的のためには名前の付いたパラメータが必要なので、`{0}` などは使用しないでください。",
    },
    {
      absent: String.raw`\'\{event.level\},\{event.message\}\'
`,
      text: "The constant text `'{event.level},{event.message}'` should be present.",
      text_ja: "`'{event.level},{event.message}'` といった定数文字列が必要です。",
    },
  ],
  expected: [
    String.raw`def format_event(new_event):
  return '{event.level},{event.message}'.format(event=new_event)`
  ],
  correct: [
    String.raw`(\r?\n)*def\x20+format_event\x20*\( new_event \)\x20*:(\r?\n)\x20+return\x20+'{event\.level},{event\.message}'\x20*\.\x20*format\x20*\( event = new_event \) \s*`
  ],
};
