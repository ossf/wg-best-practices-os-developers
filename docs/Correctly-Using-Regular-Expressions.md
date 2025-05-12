# Correctly Using Regular Expressions for Secure Input Validation

by the OpenSSF Best Practices Working Group

## Introduction

A key part of developing secure software is input validation, that is, validating that untrusted input (at least) is checked so that _only_ valid data is accepted. For example, if a value is supposed to be an integer, then the software must _only_ accept integers for that value and reject anything else. Sometimes a particular data type (like an integer or email address) is so common that libraries and frameworks include validators for them; in such cases, consider using them. However, many applications have application-specific patterns that also need input validation.

Regular expressions (aka regexes) _can_ be a great way to validate input against specialized patterns. They’re widely available, widely understood, flexible, and efficient. However, they must be used _correctly_. A lot of advice is _wrong_ or _omits key points_. In particular:

1. _Only_ data that _completely_ matches that pattern should be accepted (by using a “fullmatch” or by adding the correct anchors at the pattern’s beginning and end).
2. The “&#x7c;” operator, which lets you list alternatives, has an operator precedence that requires developers to parenthesize the set of alternatives when using it for input validation.
3. Regex language syntax _varies_ between different platforms; it is _not_ standard. In particular, the “$” anchor does _not_ only match the end of the string in Python and PHP, but it _does_ in JavaScript. You _must_ use the correct symbols for the platform you’re using. Developers reusing a regex from the Internet must _translate_ it to its target platform.

Doing input validation wrong, such as incorrectly using “^” or “$”, _could_ lead to vulnerabilities.

## Guidance

When using regexes for secure validation of untrusted input, do the following so they’ll be correctly interpreted:

1. Where possible, use a method, function, or flag that requires that the pattern _only_ match if it matches the _entire_ input. For example, in Python3 (but not Python2), use re.fullmatch for input validation when practical.
2. If you can’t do that:
    1. If there are any branches (“&#x7c;”), make sure the alternatives are grouped. You can do this by surrounding them with parentheses like this: “(aa&#x7c;bb)”. If you don’t need the groups to be captured (you usually don’t), and your platform supports non-capturing groups (most do), it’s usually more efficient to use non-capturing groups - just change “(“ into “(?:”
    2. Use a regular expression in its normal mode (not “multiline” mode). Prepend a start-of-string marking (often “^” or “\A”) and append an “end-of-string” marking (often “$” or “\z”, but Python uses “\Z”). Do _not_ use “$” for input validation until you verify that “$” does what you want. See this table for many common platforms:

| Platform                                          | Prepend        | Append                                                                                              | $&nbsp;Permissive? |
|---------------------------------------------------|----------------|-----------------------------------------------------------------------------------------------------|--------------------|
| POSIX BRE, POSIX ERE, and ECMAScript (JavaScript) | “^” (not “\A”) | “$” (not “\z” nor “\Z”)                                                                             | No                 |
| Perl, .NET/C#                                     | “^” or “\A”    | “\z” (not “$”)                                                                                      | Yes                |
| Java                                              | “^” or “\A”    | “\z”; [“$” works but some documents conflict](./Correctly-Using-Regular-Expressions-Rationale#java) | No                 |
| PHP                                               | “^” or “\A”    | “\z”; “$” with “D” modifier                                                                         | Yes                |
| PCRE                                              | “^” or “\A”    | “\z”; “$” with PCRE2_ DOLLAR_ENDONLY                                                                | Yes                |
| Golang, Rust crate regex, and RE2                 | “^” or “\A”    | “\z” or “$”                                                                                         | No                 |
| Python                                            | “^” or “\A”    | “\Z” (not “$” nor “\z”)                                                                             | Yes                |
| Ruby                                              | “\A” (not “^”) | “\z” (not “$”)                                                                                      | Yes                |

For example, to validate in JavaScript that the input is only “ab” or “de”, use the regex “<tt>^(ab&#x7c;de)$</tt>”. To validate the same thing in Python, use “<tt>^(ab&#x7c;de)\Z</tt>” or “<tt>\A(ab&#x7c;de)\Z</tt>”. Note that the “$” anchor has different meanings among platforms and is often misunderstood; on many platforms it’s permissive by default and doesn’t match only the end of the input. Instead of using “$” on a platform if $ is permissive, consider using an explicit form instead (e.g., “`\n?\z`”). Consider preferring “\A” and “\z” where it’s supported (this is necessary when using Ruby).

In addition, ensure your regex is not vulnerable to a Regular Expression Denial of Service (ReDoS) attack. A ReDoS “[is a Denial of Service attack, that exploits the fact that most Regular Expression implementations may reach extreme situations that cause them to work very slowly (exponentially related to input size)](https://owasp.org/www-community/attacks/Regular_expression_Denial_of_Service_-_ReDoS)”. Many regex implementations are “backtracking” implementations, that is, they try all possible matches. In these implementations,  a poorly-written regular expression can be exploited by an attacker to take a vast amount of time.

1. One solution is to use a regex implementation that does not have this vulnerability because it never backtracks. E.g., use Go’s default regex system, RE2, or on .NET enable the RegexOptions.NonBacktracking option. Non-backtracking implementations can sometimes be orders of magnitude faster, but they also omit some features (e.g., backreferences).
2. Alternatively, create regexes that require no or little backtracking. Where a branch (“&#x7c;”) occurs, the next character should select one branch. Where there is optional repetition (e.g., “&#x2a;”), the next character should determine if there is a repetition or not. One common cause of unnecessary backtracking are poorly-written regexes with repetitions in repetitions, e.g., “(a+)&#x2a;”. Some tools can help find these defects.
3. A partial countermeasure is to greatly limit the length of the untrusted input and/or the number of repetitions. This can limit the impact of a vulnerability. For example, in a regex, use “{0,4}” (0 through 4 repetitions inclusive) instead of “*” (0 or more repetitions, with no maximum).

## Detailed Rationale

For detailed rationale, along with other information such as contributor credits, see [Correctly Using Regular Expressions for Secure Input Validation - Rationale](./Correctly-Using-Regular-Expressions-Rationale).

Our thanks to Seth Larson, whose article [Seth Larson’s Regex character “$” doesn't mean “end-of-string”](https://sethmlarson.dev/regex-$-matches-end-of-string-or-newline) raised awareness of some of the problems dicussed here.

## Contributions and Corrections Welcome

If you have any additions, changes, or corrections you'd like to suggest, please [open an issue](https://github.com/ossf/wg-best-practices-os-developers/issues) or [create a pull request](https://github.com/ossf/wg-best-practices-os-developers/pulls). We appreciate your contributions!

## License

This document is released under the [Creative Commons CC-BY-4.0 license](https://creativecommons.org/licenses/by/4.0/).
