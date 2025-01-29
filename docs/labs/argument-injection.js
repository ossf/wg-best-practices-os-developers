info =
{
  hints: [
    {
      present: String.raw`exec \(`,
      text: "The `exec` function is vulnerable to command injection. Replace it with `execFile` to improve security.\n"
    },
    {
      absent: String.raw`^[\n\r]*\s*execFile\s*\(`,
      text: "Use the `execFile` function instead of `exec` to avoid shell interpretation. Your line should start with `execFile(`.\n"
    },
    {
      absent: String.raw`execFile\s*\(\s*['"${BACKQUOTE}]git['"${BACKQUOTE}]\s*,`,
      text: "Separate the command and its arguments. The first argument to `execFile` should be the command 'git' without any of the command arguments.\n"
    },
    {
      present: String.raw`['"${BACKQUOTE}]git\x20blame['"${BACKQUOTE}]`,
      text: "Separate the command and its arguments. The first argument to `execFile` should be the command 'git', followed by an array with parameters, like this: `execFile('git', ['blame', ...])`.\n"
    },
    {
      absent: String.raw`\[ ['"${BACKQUOTE}]blame`,
      text: "Pass the arguments as an array, like this: `execFile('git', ['blame', ...])`.\n"
    },
    {
      present: "--",
      absent: String.raw`['"${BACKQUOTE}]--['"${BACKQUOTE}]`,
      text: "To pass `--` you need to pass it as a literal string. Typically this is notated as `'--'` or `\"--\"`.\n"
    },
    {
      absent: String.raw`\[ ['"${BACKQUOTE}]blame['"${BACKQUOTE}] , ['"${BACKQUOTE}]--['"${BACKQUOTE}] ,`,
      text: "Pass the arguments as an array. Include '--' before the file path to prevent argument injection. Your array should look like `['blame', '--', ...`.\n"
    },
    {
      present: String.raw`['"${BACKQUOTE}]filePath['"${BACKQUOTE}]`,
      text: "`filePath` is a variable, use it directly without using quote marks.\n"
    },
    {
      present: String.raw`['"]\$\{filePath\}['"]`,
      text: "`filePath` is a variable, use it directly without using quote marks. This is simply a constant string beginning with a dollar sign, which is not what you want.\n"
    },
    {
      present: String.raw`${BACKQUOTE}\$\{filePath\}${BACKQUOTE}`,
      text: "Strictly speaking, using a backquoted template with a single reference to a variable name works. In this case, it's being done to `filePath`. However, this is unnecessarily complicated. When you want to simply refer to a variable's value, use the variable name.\n"
    },
    {
      absent: String.raw`\[ ['"${BACKQUOTE}]blame['"${BACKQUOTE}] , ['"${BACKQUOTE}]--['"${BACKQUOTE}] , filePath \]`,
      text: "Pass the arguments as an array. Include '--' before the file path to prevent argument injection. Your array should look like `['blame', '--', filePath]`.\n"
    },
    {
      present: "shell = [fF]alse",
      text: "When passing options to execFile, you need an option with the options, and those use `:` not `=`. So you should say something like: `{shell: false}`.\n"
    },
    {
      present: "[F]alse",
      text: "JavaScript is case-sensitive. The false value is spelled as `false` and not `False`.\n"
    },
    {
      absent: String.raw`\{ shell : false \}`,
      present: "shell : false",
      text: "When passing options to execFile, you must provide those options as a JavaScript object. That means you must surround them with `{...}` like this: `{shell: false}`.\n"
    },
    {
      absent: String.raw`\{ shell : false \}`,
      text: "We encourage you to explicitly set `shell: false` in the options object to prevent shell interpretation. That is something like this: `execFile('git', ['blame', '--', filePath], { shell: false }, ...`\n"
    },
    {
      absent: String.raw`\(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*,\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*,\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\)\s*=>`,
      text: "Maintain the callback function structure with three parameters (typically named error, stdout, and stderr, but any valid variable names are acceptable).\n"
    },
    {
      present: String.raw`\) \) =>`,
      text: "The `exec` function should be closed in later lines, not here.\n"
    }
  ],
  expected: [
    `execFile('git', ['blame', '--', filePath], { shell: false }, (error, stdout, stderr) => {`
  ],
  correct: [
    String.raw`\s* execFile \(
      ('git'|"git"|${BACKQUOTE}git${BACKQUOTE}) ,
      \[ ('blame'|"blame"|${BACKQUOTE}blame${BACKQUOTE}) ,
         ('--'|"--"|${BACKQUOTE}--${BACKQUOTE}) , filePath \] ,
      (\{ (shell : false)? \} ,)?
      \( [a-zA-Z_$][a-zA-Z0-9_$]* ,
         [a-zA-Z_$][a-zA-Z0-9_$]* , [a-zA-Z_$][a-zA-Z0-9_$]* \) => \{ \s*`
  ],
  successes: [
    [
      "    execFile('git', ['blame', '--', filePath], { shell: false }, (error, stdout, stderr) => {",
      "    execFile('git', ['blame', '--', filePath], (error, stdout, stderr) => {",
      "    execFile('git', ['blame', '--', filePath], {}, (error, stdout, stderr) => {"
    ]
  ],
  failures: [
    [
      "    exec(`git blame ${filePath}`, (error, stdout, stderr) => {"
    ],
    [
      "    execFile('git', ['blame', filePath], { shell: false }, (error, stdout, stderr) => {"
    ],
    [
      "    execFile('git blame', [filePath], { shell: false }, (error, stdout, stderr) => {"
    ]
  ]
}
