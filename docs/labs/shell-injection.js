// Copyright (C) Open Source Security Foundation (OpenSSF) and its contributors.
// SPDX-License-Identifier: MIT

info =
{
  hints: [
    {
      absent: String.raw`^[\n\r]*\x20\x20[^\x20]`,
      text: "Python is an indentation-sensitive language, so your indentation must be consistent. In this case, your line in the first section must start with exactly 2 spaces followed by a non-space.\n",
      text_ja: "Python はインデントに依存する言語なので、インデントは構造と整合していなければなりません。この場合では、最初のセクションの最初の行は２つの空白で始まり、そのあとに空白ではない文字がこなければいけません。\n",
    },
    {
      absent: String.raw`^\x20\x20[^\x20]`,
      index: 1,
      text: "Python is an indentation-sensitive language, so your indentation must be consistent. In this case, your line in the second section must start with exactly 2 spaces followed by a non-space.\n",
      text_ja: "Python はインデントに依存する言語なので、インデントは構造と整合していなければなりません。この場合では、２つめのセクションの最初の行は２つの空白で始まり、そのあとに空白ではない文字がこなければいけません。\n",
    },
    {
      absent: String.raw`re \. sub`,
      text: "Use re.sub(PATTERN, REPLACETEXT, dir_to_list) to substitute anything that is not an alphanumeric character (removing the rest).\n",
      text_ja: "re.sub(PATTERN, REPLACETEXT, dir_to_list) を使って英数字以外の文字を置換（削除）してください。\n",
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
      text_ja: "re.sub を使って新しい文字列を生成し、結果を `clean_dir` に代入する必要があります。最初の行は `clean_dir = re.sub(PATTERN, REPLACETEXT, dir_to_list)` のようになるはずです。\n",
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
      text_ja: "`PATTERN` は説明のためのプレースホルダ（メタ変数）であり、回答に PATTERN は出てきません。最初の行は `clean_dir = re.sub(PATTERN, REPLACETEXT, dir_to_list)` のようになるはずですが、`PATTERN` は置換元の文字のパターンを表す正規表現の文字列に、`REPLACETEXT` は置換後の文字になります。PATTERN はおそらく `r'...'` の形で、`...` は削除したい部分にマッチする正規表現になります。\n",
      examples: [
        [
          "  clean_dir = re.sub(PATTERN, PATTERN, dir_to_list)",
          "  subprocess.run(f\"ls -l {dir_to_list}\", shell=True)"
        ],
      ],
    },
    {
      absent: String.raw`re \. sub \( r`,
      text: "Python re.sub uses strings to indicate a regex pattern. By convention these strings are usually 'raw' strings, so they have the form `r'PATTERN'`. We would recommend that you use raw strings, in the pattern `re.sub(r'...', ...)` even though raw strings don't make this *specific* example easier.\n",
      text_ja: "Python の re.sub は正規表現の文字列を引数に取ります。慣例的にこの文字列には `r'PATTERN'` の形の raw 文字列を用います。raw 文字列はこの例を *特に* 簡単にするものではありませんが、パターン `re.sub(r'...', ...)` として raw 文字列を使うことをお勧めします。\n",
    },
    {
      absent: String.raw`re \. sub \( r['"]`,
      text: "Python re.sub uses strings to indicate a regex pattern. By convention these strings usually 'raw' strings, so they have the form `r'PATTERN'`. You have the \"r\" but not the following single or double quote character.\n",
      text_ja: "Python の re.sub は正規表現の文字列を引数に取ります。慣例的にこの文字列には `r'PATTERN'` の形の raw 文字列を用います。回答には \"r\" に続くシングルまたはダブルクオーテーションがないようです。\n",
    },
    {
      present: String.raw`re \. sub \( r?['"]\(`,
      text: "It is syntactically *legal* to use unnecessary parentheses in a regular expression, e.g., `([^a-zA-Z0-9])`. However, it's usually best to make regular expressions as simple as possible. So please don't use unnecessary parentheses.\n",
      text_ja: "文法的には不必要なカッコを正規表現の中に書くことは *許されて* います。例：`([^a-zA-Z0-9])` しかし通常、正規表現はできる限りシンプルにすることが望まれます。不必要なカッコは使用しないでください。\n",
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
      text_ja: "マッチした全ての文字を置換することを示すために re.sub(r'[...]', ...) を使用してください。正規表現には大カッコ（[]）を使用してください。`...` が置換されるべき文字のパターンです。\n",
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
      text_ja: "英数字以外の文字を全て置換することを示すために、re.sub(r'[^ALPHANUMERIC_PATTERN]', '', dir_to_list) としてください。ここでは指定したパターンにマッチした文字 *以外* を置換したいので、キャレット `^` を使用します。入力検証は行っていないので、許容される入力 *以外* は全てフィルター（削除）する必要があります。そのためキャレットの使用は適切です。ALPHANUMERIC_PATTERN を、英数字を表す正規表現に変更することを忘れないでください！\n",
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
      text_ja: "置換される文字のパターンは `a-zA-Z0-9` としてください。",
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
      text_ja: "`re.sub` の第二引数は空の文字列、つまり `''` または `\"\"` とすべきです。望ましくないもの全てにマッチさせ、それらを無に置換します。\n",
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
      text: "Use subprocess.run",
      text_ja: "subprocess.run を使用してください。",
    },
    {
      present: "shell = [Tt]rue",
      index: 1,
      text: "Don't say `shell = True`; we don't want to unnecessarily run the shell.",
      text_ja: "`shell = True` は使用しないでください。不必要なシェルの実行は望ましくありません。",
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
      text_ja: "一般的に、実行コマンドを生成するための文字列連結は避けるべきです。f\"...\" は文字列連結のためのフォーマットです。このケースでは文字列連結を使ってはいけません。シェルは引数を空白で区切りますが、ここでは不必要なシェルの使用を避けることを目指します。ここではそれぞれ独立したパラメータのリストとして引数を渡します。パラメータは、\"ls\", \"-l\", clean_dir のようになるはずです。",
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
      text_ja: "シェルは引数を空白で区切りますが、ここでは不必要なシェルの使用を避けることを目指します。ここではそれぞれ独立したパラメータのリストとして引数を渡します。パラメータは、\"ls\", \"-l\", clean_dir のようになるはずです。",
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
      text_ja: "`subprocess.run` は実行するコマンドをパラメータのリストとして受け取ります。これは単純にカンマで区切ったパラメータではありません。つまり、`subprocess.run([P1, P2, ...])` のような形で渡す必要があるということです。カッコの中に大カッコ（[]）があることに注意してください。",
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
      text_ja: "{...} は不要です。各パラメータは独立しており、フォーマット文字列で連結する必要はありません。",
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
      text: "You have a double-quote after `dir_to_list`; you don't want that.",
      text_ja: "`dir_to_list` の後に不要なダブルクオーテーションがあります。",
    },
    {
      present: String.raw`clean_dir\"`,
      index: 1,
      text: "You have a double-quote after `clean_dir`; you don't want that.",
      text_ja: "`clean_dir` の後に不要なダブルクオーテーションがあります。",
    },
    {
      present: "dir_to_list",
      index: 1,
      text: "The parameter `dir_to_list` is what was provided, but you don't want to use that. You want to use the cleaned value `clean_dir` instead.",
      text_ja: "`dir_to_list` は入力値なので、subprocess.run のパラメータとしては不適当です。不要な文字が削除されている `clean_dir` を代わりに使うべきです。",
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
      text_ja: "2つ目のセクションには対になったカッコが必要です。",
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
      text_ja: "2つ目のセクションには対になった大カッコ（[]）が必要です。",
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
      text_ja: "惜しい！`subprocess.run` の行は、subprocess.run([\"ls\", \"-l\", clean_dir]) のようになるはずです。",
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
