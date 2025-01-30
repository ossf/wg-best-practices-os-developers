info =
{
  hints: [
    {
      absent: "unsigned",
      text: "The type defined for queue_count should exactly match the return type of get_queue."
    },
    {
      present: String.raw`unsigned\s+queue_count`,
      text: "The declared return type of get_queue is `unsigned int`; you should match it exactly instead of using a synonym like `unsigned`."
    }
  ],
  expected: [
    'unsigned int queue_count = 0;'
  ],
  correct: [
    String.raw`^ unsigned\s+int\s+queue_count = 0 ; $`
  ],
}
