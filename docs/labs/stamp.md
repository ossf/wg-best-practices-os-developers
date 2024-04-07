# Stamp explanation

This document is for instructors who are using these labs.

The labs provided here are available for anyone.
You can ask students to do them and submit their completed page.
When a lab page is completed, a "stamp" is added at the bottom.
The stamp current has the form `Completed ${resultBeginning} ${hash}`
where `resultBeginning` is `${timeStamp} ${uuid}`.
The timestamp is the initial completion time in ISO format, and
uuid is a random value.
The hash is a cyrb64Hash hash of `resultBeginning`.
If two different students have the same stamp, at least one cheated.
Obviously it's possible for students to cheat by copying the
correct answers from someone else, but
some cheaters are lazy.
