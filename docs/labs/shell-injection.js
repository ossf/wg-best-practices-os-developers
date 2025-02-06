// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: String.raw`^[\n\r]*\x20\x20[^\x20]`,
      text: "Python is an indentation-sensitive language, so your indentation must be consistent. In this case, your line in the first section must start with exactly 2 spaces followed by a non-space.\n"
    },
    {
      absent: String.raw`^\x20\x20[^\x20]`,
      index: 1,
      text: "Python is an indentation-sensitive language, so your indentation must be consistent. In this case, your line in the second section must start with exactly 2 spaces followed by a non-space.\n"
    },
    {
      absent: String.raw`re \. sub`,
      text: "Use re.sub(PATTERN, REPLACETEXT, dir_to_list) to substitute anything that is not an alphanumeric character (removing the rest).\n",
      examples: [
        [
          "  clean_dir = dir_to_list",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      absent: String.raw`clean_dir = re \. sub \(`,
      present: String.raw`re \. sub`,
      text: "You need to compute a new string using re.sub and assign the result to `clean_dir`. Your first line should look like `clean_dir = re.sub(PATTERN, REPLACETEXT, dir_to_list)`.\n",
      examples: [
        [
          "  clean_dir re.sub = dir_to_list",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      present: "PATTERN",
      text: "We use `PATTERN` as a placeholder (metavariable) for the expression you should use.  The answer won't actually say PATTERN anywhere. Your first line should look like `clean_dir = re.sub(PATTERN, REPLACETEXT, dir_to_list)` but `PATTERN` is a string with the regex of the pattern of text you want to replace, and `REPLACETEXT` is what you want to replace it with. The PATTERN would probably look like `r'...'` where the `...` is the regular expression matching what you want to eliminate.\n",
      examples: [
        [
          "  clean_dir = re.sub(PATTERN, PATTERN, dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      absent: String.raw`re \. sub \( r`,
      text: "Python re.sub uses strings to indicate a regex pattern. By convention these strings are usually 'raw' strings, so they have the form `r'PATTERN'`. We would recommend that you use raw strings, in the pattern `re.sub(r'...', ...)` even though raw strings don't make this *specific* example easier.\n"
    },
    {
      absent: String.raw`re \. sub \( r['"]`,
      text: "Python re.sub uses strings to indicate a regex pattern. By convention these strings usually 'raw' strings, so they have the form `r'PATTERN'`. You have the \"r\" but not the following single or double quote character.\n"
    },
    {
      present: String.raw`re \. sub \( r?['"]\(`,
      text: "It is syntactically *legal* to use unnecessary parentheses in a regular expression, e.g., `([^a-zA-Z0-9])`. However, it's usually best to make regular expressions as simple as possible. So please don't use unnecessary parentheses.\n",
      examples: [
        [
          "  clean_dir = re.sub(r'([^a-zA-Z0-9])', '', dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      absent: String.raw`re \. sub \( r?['"]\[`,
      text: "Use re.sub(r'[...]', ...) to indicate that you want to replace every character matching a certain pattern. Note the square brackets in the regular expression. Replace the `...` with the pattern of characters to be replaced.\n",
      examples: [
        [
          "  clean_dir = re.sub(r'', '', dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      absent: String.raw`re \. sub \( r?['"]\[\^`,
      text: "Use re.sub(r'[^ALPHANUMERIC_PATTERN]', '', dir_to_list) to indicate that you want to replace everything that is not an alphanumeric character. Notice the use of the caret symbol `^`; we are replacing everything *not* matching a certain pattern. It's okay to use a caret here, because we aren't validating input, we are filtering (removing) all the input *not* permitted. Be sure to replace ALPHANUMERIC_PATTERN with a regular expression pattern that describes alphanumerics!\n",
      examples: [
        [
          "  clean_dir = re.sub(r'[a-zA-Z0-9]', '', dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      absent: "a-zA-Z0-9",
      text: "Use `a-zA-Z0-9` in your substitution pattern.",
      examples: [
        [
          "  clean_dir = re.sub(r'[^]', '', dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\")"
        ],
      ],
    },
    {
      absent: String.raw`re \. sub \( r?('\[\^a-zA-Z0-9\]'|"\[\^a-zA-Z0-9\]") , r?(''|"")`,
      text: "The second parameter of `re.sub` should be an empty string, that is, `''` or `\"\"`. You are matching everything you don't want, and replacing it with nothing at all.\n",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', NOWWHAT, dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      absent: "subprocess.run",
      index: 1,
      text: "Use subprocess.run"
    },
    {
      present: "shell = [Tt]rue",
      index: 1,
      text: "Don't say `shell = True`; we don't want to unnecessarily run the shell.",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      present: String.raw`f["']ls\s+-l`,
      index: 1,
      text: "You should generally avoid using string concatenation when creating a command to execute. Formatted strings like f\"...\" are a form of string concatenation. In addition, you MUST avoid string concatenation in this case. The shell uses spaces to separate arguments, but we're trying to avoid using the shell when it's not needed. You must instead provide the arguments as a list that contains separate parameters. The parameters should be something like \"ls\", \"-l\", clean_dir",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\")"
        ],
      ],
    },
    {
      present: String.raw`["']ls\s+-l`,
      index: 1,
      text: "The shell uses spaces to separate arguments, but we're trying to avoid using the shell when it's not needed. You must instead provide the arguments as a list that contains separate parameters. The parameters should be something like \"ls\", \"-l\", clean_dir",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', dir_to_list)",
          "  subprocess.run(\"ls -l {dir_to_list}\")"
        ],
      ],
    },
    {
      present: String.raw`subprocess \. run \( [A-Za-z0-9"']`,
      index: 1,
      text: "The `subprocess.run` function takes a LIST of parameters as its command, not just comma-separated parameters. This means you need something like the form `subprocess.run([P1, P2, ...])`. Note the square brackets inside the parentheses.",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', dir_to_list)",
          "  subprocess.run(\"ls\", \"-l\", clean_dir)"
        ],
      ],
    },
    {
      present: String.raw`\{(dir_to_list|clean_dir)\}`,
      index: 1,
      text: "You don't need {...} in your result. Each parameter should be free-standing, not an expression concatenated within a formatted string.",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', dir_to_list)",
          "  subprocess.run([\"ls\", \"-l\", {dir_to_list}])"
        ],
      ],
    },
    {
      present: String.raw`dir_to_list\"`,
      index: 1,
      text: "You have a double-quote after `dir_to_list`; you don't want that."
    },
    {
      present: String.raw`clean_dir\"`,
      index: 1,
      text: "You have a double-quote after `clean_dir`; you don't want that."
    },
    {
      present: "dir_to_list",
      index: 1,
      text: "The parameter `dir_to_list` is what was provided, but you don't want to use that. You want to use the cleaned value `clean_dir` instead.",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', dir_to_list)",
          "  subprocess.run([\"ls\", \"-l\", dir_to_list])"
        ],
      ],
    },
    {
      absent: String.raw`run \(.*\)`,
      index: 1,
      text: "You need a pair of matching parentheses in the second section.",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', clean_dir)",
          "  subprocess.run([\"ls\", \"-l\", clean_dir]"
        ],
      ],
    },
    {
      absent: String.raw`run \( \[.*\]`,
      index: 1,
      text: "You need a pair of matching square brackets in the second section.",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', clean_dir)",
          "  subprocess.run([\"ls\", \"-l\", clean_dir)"
        ],
      ],
    },
    {
      absent: String.raw`^ subprocess . run \( \[ ('ls'|"ls") , ('-l'|"-l") , clean_dir \] \) $`,
      index: 1,
      text: "You are getting close. The `subprocess.run` line should look like subprocess.run([\"ls\", \"-l\", clean_dir]) or similar.",
      examples: [
        [
          "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', clean_dir)",
          "  subprocess.run([\"ls\", \"-l\", clean_dir, foo])"
        ],
      ],
    },
  ],
  successes: [
    [
      "  clean_dir = re . sub( '[^a-zA-Z0-9]' , '' , dir_to_list )",
      "  subprocess . run ( [ \"ls\" , \"-l\" , clean_dir ] )"
    ],
    [
      "\r\n\n  clean_dir = re . sub( r'[^a-zA-Z0-9]' , '' , dir_to_list )",
      "  subprocess . run ( [ \"ls\" , \"-l\" , clean_dir ] )"
    ],
    [
      "  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', dir_to_list)",
      "  subprocess.run([\"ls\", \"-l\", clean_dir], shell=False)"
    ],
  ],
  failures: [
    [
      "  clean_dir =\n re . sub( r'[^a-zA-Z0-9]' , '' , dir_to_list )",
      "  subprocess . run ( [ \"ls\" , \"-l\" , clean_dir ] )"
    ],
    [
      "clean_dir = re . sub( r'[^a-zA-Z0-9]' , '' , dir_to_list )",
      "subprocess . run ( [ \"ls\" , \"-l\" , clean_dir ] )"
    ],
    [
      "   clean_dir = re . sub( r'[^a-zA-Z0-9]' , '' , dir_to_list )",
      "   subprocess . run ( [ \"ls\" , \"-l\" , clean_dir ] )"
    ],
  ],
  expected: [
    String.raw`  clean_dir = re.sub(r'[^a-zA-Z0-9]', '', dir_to_list)`,
    String.raw`  subprocess.run(["ls", "-l", clean_dir])`
  ],
  // In Python, newline and carriage return are whitespace but are *meaningful*
  // outside of (...). So we match specifically on space (\x20) instead.
  // This makes our patterns harder to read, unfortunately.
  // It's conventional to use raw strings in Python for regexes, so we allow
  // and encourage them, but we'll accept *not* using raw strings since they
  // don't add value in this situation.
  correct: [
    String.raw`[\n\r]*\x20\x20clean_dir\x20*=\x20*re\x20*\.\x20*sub\x20*\(
      r?('\[\^a-zA-Z0-9\]'|"\[\^a-zA-Z0-9\]") ,
      r?(''|"") , dir_to_list \) \s*`,
    String.raw`[\n\r]*\x20\x20subprocess\x20*\.\x20*run\x20*\(
      \[ ('ls'|"ls") , ('-l'|"-l") , clean_dir \]
      ( , shell = False )? \) \s*`
  ],
};
