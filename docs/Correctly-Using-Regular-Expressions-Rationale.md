# Correctly Using Regular Expressions for Secure Input Validation - Rationale

by the OpenSSF Best Practices Working Group

This is detailed rationale for the document [Correctly Using Regular Expressions for Secure Input Validation](./Correctly-Using-Regular-Expressions).

If you just want to know what to do, you can stop reading now, and instead consult [Correctly Using Regular Expressions for Secure Input Validation](./Correctly-Using-Regular-Expressions). However, if you want to know _why_ we make these recommendations, here is our detailed rationale, with commentary and supporting evidence. We’ve examined the specifications of various systems, and in some cases, written sample code to verify what implementations do.

A key question for each platform (such as a programming language) is determining if a regular expression like /x$/ only matches inputs like “ax” or if it will also match other inputs such as “ax\n”. Similarly, we must check if /^d/ matches only “dog”, or if it will match other beginnings like “\ndog” or “x\ndog”. We also need to determine if there are symbols for beginning of string (typically “\A”) or end of string (typically “\z” though Python uses “\Z”).

For more information, see [Seth Larson’s Regex character “$” doesn't mean “end-of-string”](https://sethmlarson.dev/regex-$-matches-end-of-string-or-newline) which identified the problem of many people thinking “$” always means “end of string”. See also _Mastering Regular Expressions_ by Jeffrey E.F. Friedl (especially 3rd edition pages 129-130), which noted these variations but didn’t note that many people misunderstand them. We should also note the xkcd cartoon [I know regular expressions](https://xkcd.com/208/). The [site “regular-expressions.info” section “anchors”](https://www.regular-expressions.info/anchors.html) discusses this, though its text can be misleading; as of 2024-04-09 near its beginning it says that "$ matches right after the last character in the string. c$ matches c in abc..." and only later in the text does it note that its behavior varies by language.

In this rationale, we’ll provide a brief history of regular expression implementations, which explains how we got here. This is followed by a survey of various platforms.

## History

Some historical context of “how we got here” will explain how we got to this complicated state:

1. Unix’s regular expression implementations were created (other regex notations derive from this early work in Unix). A fast non-backtracking algorithm for implementing regexes was reported in Ken Thompson’s 1968 paper “[Programming Techniques: Regular expression search algorithm](https://dl.acm.org/doi/10.1145/363347.363387)”.
2. The POSIX BRE and POSIX ERE notations were defined based on this work. They both use “^” for “beginning of string” and “$” for “end of string”. However, the fact that there were two different regular expression notations, which slightly different notations, probably encouraged others to create other “slightly incompatible” notations (since there was more than one to start with). Note:
    1. Regexes were originally created to _search_ in strings, but people who wanted to validate strings realized it was easier to use the same pattern language to _validate_ that strings matched a pattern, using these beginning/end notations.
    2. POSIX supports a “REG_NEWLINE” mode which, when enabled, changed the meaning of “^” to “match the zero-length string immediately after a &lt;newline> in string” and also changed “$” to mean “match the zero-length string immediately before a &lt;newline> in string”. In POSIX there is no way to match the beginning and ending of the string in REG_NEWLINE mode.
3. Perl was created with greatly expanded support for regexes. When Perl reads lines it _retains_ the trailing newline, which makes looping over lines easy (a non-empty string is false, and a line with only a newline is still false and thus the loop will process the line). Perl _redefined_ “$” so it would _also_ match a trailing newline. Thus, in Perl, “$” does _not_ match just the end of a string, making Perl regex notation different from POSIX. Perl also created new sequences \A, \Z, and \z to better support its mode for supporting multiple lines (aka “/m” or “multiline mode”; terminology varies between platforms, but it’s essentially equivalent to POSIX REG_NEWLINE mode).
    3. As noted by Russ Cox’s 2007 post “[Regular Expression Matching Can Be Simple And Fast (but is slow in Java, Perl, PHP, Python, Ruby, ...)](https://dl.acm.org/doi/10.1145/363347.363387)”, Perl (and thus many other languages) chose to use a _backtracking_ regex implementation instead of Thompson’s fast non-backtracking approach.
    4. A backtracking regex implementation is sometimes many orders of magnitude slower, however, a backtracking implementation can have more features (such as backreferences, lookaheads, and lookbehinds).
4. Perl Compatible Regular Expressions (PCRE), originally implemented in summer 1997, implemented Perl’s regex notation in a way that could be easily embedded into other implementations. PCRE spread widely. As a result, many other languages used PCRE notation and its implementation approach, or through familiarity, a notation and approach similar to it. This spread the changed definition of “$” much further.
5. RE2 (originally by Russ Cox and first released 2010-03-11) implemented a regular expression library that does _not_ backtrack, based on the approach described in Thompson’s 1968 paper. Its greater speed is compelling for many, so RE2 eventually spread many places. RE2 does support “\A” for beginning of text and “\z” for end of text. However, when multiline mode is not on (the default), “^” also only matches the beginning of text and “$” only matches the end, which is like POSIX ERE and JavaScript, and _not_ like PCRE. The author of RE2 was clearly aware of PCRE but rejected its semantics for “$” when not in multiline mode. See Russ Cox’s “[Implementing Regular Expressions](https://swtch.com/~rsc/regexp/)” for more.
6. [Davis et al’s “Why Aren’t Regular Expressions a Lingua Franca?...” (2019)](https://arxiv.org/abs/2105.04397) found that of surveyed developers, 94% reuse regexes, 50% use reuse regexes at least half the time, and 47% incorrectly believed that regex notation is a “lingua franca” (that is, that it’s the same everywhere). It did not specifically note the confusion about “$”.
7. [Wang et al’s “An Empirical Study on Regular Expression Bugs” (2020)](https://chbrown13.github.io/papers/regex.pdf) found that incorrect regex behavior is the dominant root cause of regex bugs (46.3%).
8. [Seth Larson’s 2024 Regex character “$” doesn't mean “end-of-string”](https://sethmlarson.dev/regex-$-matches-end-of-string-or-newline) noted that many people thought “$” always means “end of string” even though it’s platform-specific.

The error of using the anchor “$” to mean “match end of string” on platforms where it doesn’t mean “end of string” appears to be especially prevalent. As of April 2024, [MITRE’s “CWE-625: Permissive Regular Expression”](https://cwe.mitre.org/data/definitions/625.html) discusses the problem of permissive regexes, and it specifically notes the need for anchors. However, it incorrectly recommends using “$” to match the end of a string in Perl, which is _not_ the end-of-string marker in Perl. Thus, we’ve especially focused on checking where pattern “x$” matches “x\n” (if it does, then by definition it’s permissive). Permissive systems may allow additional matches (e.g., carriage return).

## Information on specific platforms

### ECMAScript (JavaScript)

The [MDN page on regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions) explains the ECMAScript (JavaScript) regular expression notation (for a detailed view see the [ECMAScript® 2025 Language Specification (Draft ECMA-262 / April 25, 2024)](https://tc39.es/ecma262/)). In ECMAScript (JavaScript) in its default mode:

* ^ matches the beginning of the text
* $ matches the end of the text

When doing input validation you typically don’t want group match results, so in most cases you’ll want to use the method test (which simply returns true or false if the pattern matches).

The proposal “[Regular Expression Buffer Boundaries for ECMAScript](https://github.com/tc39/proposal-regexp-buffer-boundaries)” seeks to “introduce \A and \z character escapes to Unicode-mode regular expressions as synonyms for ^ and $ that are not affected by the m (multiline) flag.”

### GNU Gnulib library

The GNU [Gnulib library](https://www.gnu.org/software/gnulib/) implements POSIX BRE and POSIX ERE. This library is widely used to implement regular expressions in C, C++, and various command-line tools. The Gnulib documentation and the [regular-expressions.info GNU](regular-expressions.info) page notes that in the Gnulib implementation of POSIX BRE and POSIX ERE, “the anchor \` (backtick) matches at the very start of the subject string, while \' (single quote) matches at the very end.”

Since input validation normally doesn’t use a multi-line mode, using the standard “^” and “$” also works. Since those are standard, there’s no obvious reason to point out these Gnulib extensions just for input validation.

### Golang

Go’s standard library includes [regexp](https://pkg.go.dev/regexp), and it uses the [syntax of RE2](https://github.com/google/re2/wiki/Syntax). Thus, by default, ^ and \A are start-of-string, while $ and \z are end-of-string. This uses a non-backtracking implementation and thus is immune to reDoS attacks.

### Java

In the case of Java, experiments with every implementation we’ve tried shows that “$” matches _only_ the end-of-string and that “$” is _not_ permissive. Similarly, “^” by default matches only the beginning of a string. This is consistent with the Java 8 documentation.

However, the [Oracle Java 21 documentation for java.util.regex.Pattern](https://docs.oracle.com/en%2Fjava%2Fjavase%2F21%2Fdocs%2Fapi%2F%2F/java.base/java/util/regex/Pattern.html) and some other documentation instead says that “$” is permissive. We see no evidence that this is true, or that this change has been implemented, so we suspect this is in error in the Oracle 21 documentation. However, since this is a claimed difference that _might_ be implemented at some time in the future, using “\z” instead of “$” might be a safer choice.

[As of 2022, 46% of Java programs use JDK 8](https://www.linkedin.com/pulse/why-companies-stuck-java-8-ashutosh-sharma/) (released in 2014) instead of a more recent version, so Java 8’s results are important. The [Java 8 documentation for java.util.regex.Pattern](https://docs.oracle.com/javase/8/docs/api/java/util/regex/Pattern.html) makes it clear that “$” only matches the end of the string (Java 8 is _not_ permissive). Its first part says:

* ^ The beginning of a line
* $ The end of a line
* \A The beginning of the input
* \Z The end of the input but for the final terminator, if any
* \z The end of the input

By itself this Java 8 text is ambiguous. That’s because the text saying “\z” is “end of the input” in contrast to “$” which is defined as “end of a line”; for a typical reader it’s not clear that this difference in terminology matters. However, this ambiguity is later resolved in the text, which says that “by default, the regular expressions ^ and $ ignore line terminators and only match at the beginning and the end, respectively, of the entire input sequence. If MULTILINE mode is activated then ^ matches at the beginning of input and after any line terminator except at the end of input. When in MULTILINE mode $ matches just before a line terminator or the end of the input sequence.” This added text seems to clearly state that “$” would _not_ match an input with an extra newline at the end by default. As of 2024-03-24, the same text applies to [Pattern for the draft specification for Java SE 20 & JDK 20 (DRAFT 20-valhalla+1-75](https://download.java.net/java/early_access/valhalla/docs/api/java.base/java/util/regex/Pattern.html).

Unfortunately, the [Oracle Java 21 documentation for java.util.regex.Pattern](https://docs.oracle.com/en%2Fjava%2Fjavase%2F21%2Fdocs%2Fapi%2F%2F/java.base/java/util/regex/Pattern.html), says that the meaning of “$” is different. It uses the same bulleted text shown earlier, but changes the text to make “$” permissive. It does this by adding the following text instead: “If MULTILINE mode is not activated, the regular expression ^ ignores line terminators and only matches at the beginning of the entire input sequence. The regular expression $ matches at the end of the entire input sequence, but also matches just before the last line terminator if this is not followed by any other input character. Other line terminators are ignored, including the last one if it is followed by other input characters.” In short, this documentation claims that “$” is permissive, just like Perl and Python.

In April-May 2024, Nikita Koselev ran a number of tests with Java on a variety of versions. He wrote this small Java class to test if “$” is permissive:

~~~~java
public class RegexMatchTest {
    public static void main(String[] args) {
        // Define the test string and the regex pattern
        String testString = "x\n";
        String pattern = "x$";
        // Check if the pattern matches the test string
        boolean isMatch = testString.matches(pattern);
        // Get JVM version information
        String javaVersion = System.getProperty("java.version");
        String javaRuntimeVersion = System.getProperty("java.runtime.version");
        // Output the JVM version and the result
        System.out.println("Java Version: " + javaVersion);
        System.out.println("Java Runtime Version: " + javaRuntimeVersion);
        // Output the result
        System.out.println("Testing if 'x$' matches 'x\\n': " + isMatch);
        System.out.println("Explanation: 'x$' is expected to match strings that end with 'x' right before a newline.");
        System.out.println("Result: The pattern " + (isMatch ? "matches" : "does not match") + " the string 'x\\n'.");
    }
}
~~~~

All tests indicate that “$” is not permissive in Java implementations. Tests were run on the compilers from Amazon for both Java 8 (8.0.412-amzn, Java version 1.8.0\_412, Java runtime version 1.8.0\_412-b08) and Java 21 (21.0.3-amzn, Java version 21.0.3, Java runtime version 21.0.3+9-LTS) on Ubuntu. We also tested on Windows 10 with Java 8 and Java 17. In all cases we found that testing if 'x$' matches 'x\n' returned “false” (that is, “$” is _not_ permissive). This was also tested on a Java online system (which we believe uses Java 17) at &lt;[https://onecompiler.com/java/42by2e6vc](https://onecompiler.com/java/42by2e6vc)>.

This assertion that “$” is not permissive is also consistent with the posting [How to do in Java’s “Regex – Match Start or End of String (Line Anchors)”](https://howtodoinjava.com/java/regex/start-end-of-string/) which says that “The dollar $ matches the position after the last character in the string.”

However, both [Seth Larson’s Regex character “$” doesn't mean “end-of-string”](https://sethmlarson.dev/regex-$-matches-end-of-string-or-newline) (which identified the problem of many people thinking “$” always means “end of string”) and _Mastering Regular Expressions_ by Jeffrey E.F. Friedl (especially 3rd edition pages 129-130) state that in Java “$” matches the end of string _or_ just before a line terminator. That is, these claim that “$” is permissive. These claims are understandable, but they appear to be incorrect.

In all implementations we’ve tested, “$” only matches the end of string by default.

### .NET / C&#x23;

There are multiple versions of .NET, which can make discussions on .NET complex. “.NET Standard is a formal specification of .NET APIs that are available on multiple .NET implementations. The motivation behind .NET Standard was to establish greater uniformity in the .NET ecosystem. .NET 5 and later versions adopt a different approach to establishing uniformity that eliminates the need for .NET Standard in most scenarios. However, if you want to share code between .NET Framework and any other .NET implementation, such as .NET Core, your library should target .NET Standard 2.0.” ([.NET Standard](https://learn.microsoft.com/en-us/dotnet/standard/net-standard)) There are also various [target frameworks in SDK-style projects](https://learn.microsoft.com/en-us/dotnet/standard/frameworks), specifically .NET 8.

Still, regular expressions are a basic part of .NET (via System.Text.RegularExpressions).

[Microsoft’s .NET “Regular Expression Language - Quick Reference”](https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference) says the following, clearly documenting that “$” is permissive:

* ^ By default, the match must start at the beginning of the string; in multiline mode, it must start at the beginning of the line.

* $ By default, the match must occur at the end of the string or before \n at the end of the string; in multiline mode, it must occur before the end of the line or before \n at the end of the line.

* \A The match must occur at the start of the string.

* \Z The match must occur at the end of the string or before \n at the end of the string.

* \z The match must occur at the end of the string.

The Regex Hero page “[.NET Regex Reference](https://regexhero.net/reference/)” says the same thing. [Seth Larson’s Regex character “$” doesn't mean “end-of-string”](https://sethmlarson.dev/regex-$-matches-end-of-string-or-newline) (which identified the problem of many people thinking “$” always means “end of string”) and _Mastering Regular Expressions_ by Jeffrey E.F. Friedl (especially 3rd edition pages 129-130) also clearly state that “$” in .NET/C# is permissive.

As explained in [“Learn .NET  Fundamentals / Regular expression options” section “Nonbacktracking mode”](https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-options#nonbacktracking-mode), “By default, .NET's regex engine uses backtracking to try to find pattern matches. A backtracking engine is one that tries to match one pattern, and if that fails, goes backs and tries to match an alternate pattern, and so on. A backtracking engine is very fast for typical cases, but slows down as the number of pattern alternations increases, which can lead to catastrophic backtracking. The RegexOptions.NonBacktracking option, which was introduced in .NET 7, doesn't use backtracking and avoids that worst-case scenario. Its goal is to provide consistently good behavior, regardless of the input being searched. The RegexOptions.NonBacktracking option doesn't support everything the other built-in engines support. In particular, the option can't be used in conjunction with RegexOptions.RightToLeft or RegexOptions.ECMAScript. It also doesn't allow for the following constructs…”

Microsoft [recommends](https://learn.microsoft.com/en-us/dotnet/standard/base-types/regular-expressions) that, “When using System.Text.RegularExpressions to process untrusted input, pass a timeout. A malicious user can provide input to RegularExpressions, causing a Denial-of-Service attack. ASP.NET Core framework APIs that use RegularExpressions pass a timeout.”

### PHP

In PHP the “[PCRE extension is a core PHP extension, so it is always enabled](https://www.php.net/manual/en/pcre.installation.php).” This is the usual library for PHP, and unsurprisingly has PCRE semantics.

Per [anchors](https://www.php.net/manual/en/regexp.reference.anchors.php), by default, “A dollar character ($) is an assertion which is true only if the current matching point is at the end of the subject string, or immediately before a newline character that is the last character in the string (by default).” It notes that “The meaning of dollar can be changed so that it matches only at the very end of the string, by setting the PCRE_DOLLAR_ENDONLY option at compile or matching time. This does not affect the \Z assertion.”

As noted in [PHP’s PCRE pattern modifiers](https://www.php.net/manual/en/reference.pcre.pattern.modifiers.php), if you set the D (PCRE_DOLLAR_ENDONLY) modifier, ”a dollar metacharacter in the pattern matches only at the end of the subject string. Without this modifier, a dollar also matches immediately before the final character if it is a newline (but not before any other newlines). This modifier is ignored if m modifier is set. There is no equivalent to this modifier in Perl.”

### POSIX BRE and POSIX ERE

POSIX BRE and POSIX ERE are defined in the POSIX standard. For our purposes we’ll use the

[The Open Group Base Specifications Issue 7, 2018 edition](https://pubs.opengroup.org/onlinepubs/9699919799.2018edition/) because it is publicly available. It has some helpful comments in its section on [regcomp (which compiles regular expressions)](https://pubs.opengroup.org/onlinepubs/9699919799.2018edition/), but its real meat is in its [chapter on regular expressions](https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap09.html#tag_09).

In both BRE and ERE notation, by default “^” means beginning-of-string and “$” means end-of-string, per sections “9.3.8 BRE Expression Anchoring” and “9.4.9 ERE Expression Anchoring”.

The [regcomp function (which compiles regular expressions)](https://pubs.opengroup.org/onlinepubs/9699919799.2018edition/) accepts a “REG_NEWLINE” flag, to help text editors search many lines. If REG_NEW_LINE is set, the interpretation changes: a “^”  matches the zero-length string immediately after a &lt;newline> in string, and “$” matches the zero-length string immediately before a &lt;newline> in string. There’s no way in the POSIX specification to separately match the beginning of a string nor an end of a string when REG_NEWLINE is enabled, which is why \A, \Z, and \z were later created by Perl. When validating input from untrusted users the REG_NEWLINE option is normally not used.

The Austin Group (who maintain the POSIX specification) in 2025 [added \A and \z to POSIX for EREs](https://www.austingroupbugs.net/view.php?id=1919) and recommends that BREs also implement them.

### Perl

[Perl documentation for perlre (perl regular expressions)](https://perldoc.perl.org/perlre) describes its support for regular expressions. Version 5.38.2 documents the following, where “/m” is the “multiple lines” modifier (the multiple lines modifier is _not_ enabled by default):

* ^ Match the beginning of the string (or line, if /m is used)
* $ Match the end of the string (or before newline at the end of the string; or before any newline if /m is used)
* \A     Match only at beginning of string
* \Z     Match only at end of string, or before newline at the end
* \z     Match only at end of string

### PCRE

The [Perl Compatible Regular Expressions (PCRE)](https://www.pcre.org/) library “is a set of functions that implement regular expression pattern matching using the same syntax and semantics as Perl 5. PCRE was originally written for the Exim MTA, but is now used by many… [programs]”. PCRE includes various extensions not in the Perl implementation.

The “CIRCUMFLEX AND DOLLAR” section describes “^” and “$”. By default “$” is “an assertion that is true only if the current matching point is at the end of the subject string, or immediately before a newline at the end of the string (by default), unless PCRE2_NOTEOL is set.” The meaning of “$” can be changed to match _only_ the very end of the string by setting PCRE2_DOLLAR_ENDONLY option at compile time. This does not affect the \Z assertion.

PCRE supports various named options which are converted in a bit pattern (and thus PCRE doesn’t standardize text option flags). The main 32 options are documented in [pcre2_compile](https://www.pcre.org/current/doc/html/pcre2_compile.html); a [full description of options and extended options is in PCRE2 API](https://www.pcre.org/current/doc/html/pcre2api.html).

* PCRE2_ANCHORED           Force pattern anchoring
* PCRE2_DOLLAR_ENDONLY     $ not to match newline at end
* PCRE2_MULTILINE          ^ and $ match newlines within data

Setting both PCRE2_ANCHORED and PCRE2_ENDANCHORED forces a full-string match, but it also disables JIT compilation, so don’t do that unnecessarily.

### Python3

The [Python3 language documentation on re](https://docs.python.org/3/library/re.html) notes that its operations are “similar to those found in Perl” - but note that they are _similar_ not _identical_. In this library:

* ^ (Caret.) Matches the start of the string, and in MULTILINE mode also matches immediately after each newline.
* $ Matches the end of the string or just before the newline at the end of the string (it is _permissive_), and in MULTILINE mode it also matches before a newline.
* \A Matches only at the start of the string.
* \Z Matches only at the end of the string. Note that this is spelled \Z not \z, and there is no \z.

As with many languages, there are alternative libraries. The Python3 documentation specifically notes that the “third-party regex module, which has an API compatible with the standard library re module, but offers additional functionality and a more thorough Unicode support.”

Python3’s regular expression library “re” has the method “fullmatch” which exactly matches the string (like prepending “\A(?:” and appending “)\Z”). However, this can’t always be used. Flask is a common server-side web application framework for Python3, and a common way to validate data in Flask is Webargs (here’s an [example of a recommendation](https://stackoverflow.com/questions/55772012/how-to-validate-html-forms-in-python-flask)). The validators of Webargs reuse [marshmallow.validate](https://marshmallow.readthedocs.io/en/latest/marshmallow.validate.html#module-marshmallow.validate)., which has a marshmallow.validate.Regexp but no equivalent marshmallow.validate.FullRegexp. Thus, you still need to prefix and suffix regular expressions sometimes.

As of 2024-03-24, [Tutorialspoints incorrectly claims that “$ matches the end of a string” in Python](https://www.tutorialspoint.com/How-to-match-at-the-end-of-string-in-python-using-Regular-Expression#). StackOverflow answer [1218783](https://stackoverflow.com/a/12187839) is also incorrect.​​

In 2025 Python decided to add support for [\z as end-of-string](https://github.com/python/cpython/issues/133306) and modified various libraries to use it.

### RE2

[RE2](https://github.com/google/re2) is a regular expression library using a non-backtracking impllementation approach. Such implementations are don’t have catestrophic cases and are sometimes orders of magnitude faster, but they’re less featureful (e.g., they don’t support backreferences). RE2’s speed is compelling in many cases, so RE2 ended up being used in many places.

The [RE2 syntax page](https://github.com/google/re2/wiki/Syntax) notes that the flag “m” enables “^ and $ match begin/end line in addition to begin/end text (default false):

* ^ at beginning of text (and also of a line when m=true)
* $ at end of text (like \z not \Z) (and also of a line line when m=true)
* \A at beginning of text
* \Z at end of text, or before newline at end of text (NOT SUPPORTED)
* \z at end of text

### Ruby

As documented in the [Ruby version 3.3.0 documentation on class Regexp](https://ruby-doc.org/3.3.0/Regexp.html):

* ^ Matches the beginning of a line (any line)
* $ Matches the end of a line (any line)
* \A Matches the beginning of the string
* \Z Matches the end of the string; if string ends with a single newline, it matches just before the ending newline
* \z Matches the end of the string

As noted in the [Ruby on Rails guide on security](https://guides.rubyonrails.org/security.html#regular-expressions), “A common pitfall in Ruby's regular expressions is to match the string's beginning and end by ^ and $, instead of \A and \z.” The Brakeman tool warns in many cases when ^ and $ are used in Ruby regular expressions (instead of \A and \z).

### Rust

Rust doesn’t include a regular expression library in its default set of libraries. The [crate regex](https://docs.rs/regex/latest/regex/) is widely used in Rust development, so that’s what we used here. In crate regex:

* ^               the beginning of a haystack (or start-of-line with multi-line mode)
* $               the end of a haystack (or end-of-line with multi-line mode)
* \A              only the beginning of a haystack (even with multi-line mode enabled)
* \z              only the end of a haystack (even with multi-line mode enabled)

## Survey Table

The following survey table shows specifics for a number of common platforms using their default/built-in regex system in default mode (e.g., _not_ multiline). We abbreviate Portable Operating System Interface (POSIX) Extended Regular Expressions (ERE), and POSIX Basic Regular Expressions (BRE).

<table>
  <tr>
   <td>Platform
   </td>
   <td colspan="2" >Start of text symbol(s)
   </td>
   <td colspan="3" >End of text symbol(s)
   </td>
   <td>$ Permissive
   </td>
   <td>Notes
   </td>
  </tr>
  <tr>
   <td>ECMAScript (JavaScript)
   </td>
   <td>^
   </td>
   <td>
   </td>
   <td>$
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>No
   </td>
   <td>Use test. Adding \A and \z has been proposed.
   </td>
  </tr>
  <tr>
   <td>Golang
   </td>
   <td>^
   </td>
   <td>\A
   </td>
   <td>$
   </td>
   <td>
   </td>
   <td>\z
   </td>
   <td>No
   </td>
   <td>Uses RE2.
   </td>
  </tr>
  <tr>
   <td>Java
   </td>
   <td>^
   </td>
   <td>\A
   </td>
   <td>$
   </td>
   <td>
   </td>
   <td>\z
   </td>
   <td>Yes
   </td>
   <td>Oracle Java 21 documentation disagrees.
   </td>
  </tr>
  <tr>
   <td>.NET
   </td>
   <td>^
   </td>
   <td>\A
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>\z
   </td>
   <td>Yes
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>PHP
   </td>
   <td>^
   </td>
   <td>\A
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>\z
   </td>
   <td>Yes
   </td>
   <td>Using PCRE built-in.
   </td>
  </tr>
  <tr>
   <td>POSIX BRE
   </td>
   <td>^
   </td>
   <td>
   </td>
   <td>$
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>No
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>POSIX ERE
   </td>
   <td>^
   </td>
   <td>
   </td>
   <td>$
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>No
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Perl/PCRE
   </td>
   <td>^
   </td>
   <td>\A
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>\z
   </td>
   <td>Yes
   </td>
   <td>
   </td>
  </tr>
  <tr>
   <td>Python3
   </td>
   <td>^
   </td>
   <td>\A
   </td>
   <td>
   </td>
   <td>\Z
   </td>
   <td>
   </td>
   <td>Yes
   </td>
   <td>End is <em>capital</em> \Z. Prefer using “fullmatch” method
   </td>
  </tr>
  <tr>
   <td>Ruby
   </td>
   <td>
   </td>
   <td>\A
   </td>
   <td>
   </td>
   <td>
   </td>
   <td>\z
   </td>
   <td>Yes
   </td>
   <td><em>Always</em> use \A…\z
   </td>
  </tr>
  <tr>
   <td>Rust
   </td>
   <td>^
   </td>
   <td>\A
   </td>
   <td>$
   </td>
   <td>
   </td>
   <td>\z
   </td>
   <td>No
   </td>
   <td>Using crate regex.
   </td>
  </tr>
</table>

The “$ Permissive” column indicates whether or not the “$” is permissive in the default (not multiline) mode. A “$” is permissive if it would also match at least a newline at the end of the string being validated (it may match other sequences). That is, if the input string “cat\n” (where \n is a newline) would match the regex string “^cat$” then $ is permissive.

### For those who don’t like tables

Here’s the summary information as text:

* On POSIX and ECMAScript (JavaScript), prepend “^” and append “$”
* On .NET, PHP, and Perl/PCRE, prepend “^” or “\A”, and append “\z”
* On Java, Golang, and Rust crate regex,  prepend “^” or “\A”, and append “$” or “\z”
* On Python, prepend “^” or “\A”, and append “\Z” (note the different capitalization)
* On Ruby, prepend “\A” and append “\z”

## How can we fix this?

Beyond releasing this guide, here are some ways we can reduce the incidence of incorrect regular expressions leading to vulnerabilities.

### Education

We plan to modify the OpenSSF fundamentals course. Tools will miss things, not everyone uses tools, and developers will sometimes ignore tool reports if they believe the tool is incorrect.

### Static analysis tools

We should encourage modifying various static tools (e.g., linters, style checkers, SAST) to detect and warn on these errors in using regexes. In particular, where “$” is permissive, warning on “$” but allowing “\n?\z” doesn’t limit functionality and makes the result clearer. Good examples of these are various tools in the Ruby ecosystem; Ruby has very unusual rules for ^ and $, so they’ve seen the problem more often and thus have tools specifically to look for these problems.

### Dynamic analysis tools

Modify fuzzers to add extra newlines at the end of inputs. Another approach would be to interpose regex compilation and warn about problematic regex patterns, especially in systems that have a permissive $ anchor.

### Tests

Include tests that start with valid values but extend them, and add newlines to valid data to see if slips through. More generally, include tests that are almost correct inputs to ensure they are correctly rejected.

### Long-term change

Many developers believe that regex notation is the same everywhere, even though it isn’t. It would be dangerous for existing systems to change the meaning of their existing symbols. However, we could take steps so that more regex symbols _did_ mean the same thing everywhere. E.g.:

1. Ensure all systems support \A and \z for “beginning of string” and “end of string” respectively. This would require adding them to POSIX and JavaScript, and adding \z to Python (in addition to \Z). It’s too late to get agreement on ^ and $, but all systems listed here _could_ be modified to agree on the meanings of \A and \z.
2. Create a regex option that is the same everywhere, and implemented everywhere, which would mean “only accept if this pattern completely matches the input from beginning to end”. This would be similar to \A(…)\z but without capturing a group. This would eliminate many specific problems and would make it easier to _safely_ use regexes for input validation.
3. More generally, search for opportunities to “heal the rift” between various regex notations by adding constructs with the same meaning everywhere. It’s probably impossible to make all regex notations identical, but common notations for common cases would help.

Such changes would take years to adopt. Even worse, these changes might not be accepted in some cases because some people may think that merely being possible to do something is adequate. We don’t agree; we think it’s important to make it _easy_ to do the secure action, not just possible, and it’s best to make avoidable mistakes les likely. These changes require implementations in many systems and modifications of many specifications; doing this has been historically challenging. Still, such changes would reduce the likelihood of these problems worldwide.

#### Status of adding \A and \z across ecosystems

As previously noted, one start is to have a _single_ regex syntax
that _always_ means "match beginning of input and "match end of input"
_even_ when a multi-line mode is enabled.
This notation is especially important for security, because they make it
practical to use regexes for input validation.

Many platforms already support \A and \z respectively for beginning-of-input
and end-of-input.
These platforms are
Perl, .NET/C#, Java, PHP, PCRE, Golang, Rust crate regex, RE2, and Ruby.

If the following platforms made adjustments, the notation would
be nearly universal:

* POSIX: On 2024-04-24 the Austin Group "accepted as marked"
  [bug 1919](https://www.austingroupbugs.net/view.php?id=1919) the
  proposed change to add \A and \z to extended regular expressions (EREs).
  They decided to not require the older BRE syntax to support it at this time,
  but do plan to add a NOTE saying "a future version of this standard is likely
  to require such characters to be supported in a regular expression.
  Implementors are encouraged to provide this as an extension using
  "\A" for the beginning and "\z" for the end of strings as they are
  already in widespread use for this purpose in other languages."
* ECMAScript/JavaScript: In 2021 Ron Buckton (@rbuckton) created the proposal
  [Regular Expression Buffer Boundaries for ECMAScript](https://github.com/tc39/proposal-regexp-buffer-boundaries)
  to add \A and \z to ECMAScript/JavaScript, and it advanced to stage 2,
  but it seems to be stuck there. We intend to see if we can help it advance.
* Python: Python supports \A, but historically it uses
  the rare \Z instead of the \z used almost everywhere else for end-of-string.
  In current versions of Python3 a \z in a regex raises an exception, so
  adding \z for end-of-string would be a backwards-compatible addition.
  In [CPython issue 133306](https://github.com/python/cpython/issues/133306)
  it was agreed to add \z in addition to \Z to match end-of-string,
  which was implemented in
  [PR 133314](https://github.com/python/cpython/pull/133314).
  They noted that Tcl also uses \Z instead of \z (another group to contact).
  Our thanks to the Python community!

## Authors and contributors

We would like to thank the following contributors:

* David A. Wheeler (original author & lead of the effort to create this guide)
* Nikita Koselev
* Seth Larson

For detailed rationale, along with other information such as contributor credits, see [Correctly Using Regular Expressions Rationale](./Correctly-Using-Regular-Expressions-Rationale).

## Contributions and Corrections Welcome

If you have any additions, changes, or corrections you'd like to suggest, please [open an issue](https://github.com/ossf/wg-best-practices-os-developers/issues) or [open a pull request](https://github.com/ossf/wg-best-practices-os-developers/pulls). We appreciate your contributions!

## License

This document is released under the [Creative Commons CC-BY-4.0 license](https://creativecommons.org/licenses/by/4.0/).
