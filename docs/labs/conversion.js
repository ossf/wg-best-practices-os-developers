// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: "unsigned",
      text: "The type defined for queue_count should exactly match the return type of get_queue.",
      text_ja: "queue_count の型定義は get_queue の戻り値の型と正確に一致している必要があります。",
    },
    {
      present: String.raw`unsigned\s+queue_count`,
      text: "The declared return type of get_queue is `unsigned int`; you should match it exactly instead of using a synonym like `unsigned`.",
      text_ja: "get_queue のの戻り値の型宣言は `unsigned int` です。`unsigned` のようなシノニム（同義語）ではなく、これに正確に一致させましょう。",
    },
  ],
  expected: [
    'unsigned int queue_count = 0;'
  ],
  correct: [
    String.raw`^ unsigned\s+int\s+queue_count = 0 ; $`
  ],
};
