# Labs

These are labs for those who are learning how to develop secure software.
See our [introduction](introduction) for more information.

You can download the labs in these sections, e.g., to run locally
without Internet access.

We *want* people to create more labs! Here's more information about
how to do that and the labs we'd like created.

## Sample available labs

Here are some of the labs available, which you can use as examples:

* [hello](hello.html) - simple "Hello, world!" demo
* [input1](input1.html) - input validation (simple types)
* [regex0](regex0.html) - regular expressions (regexes) - introduction
* [regex1](regex1.html) - regular expressions (regexes)
* [input2](input2.html) - input validation (more complex situations)
* [csp1](csp1.html) - Content Security Policy (CSP)
* [oob1](oob1.html) - Out-of-bounds (OOB)

We also have a [template](template.html) available.

## Please contribute labs

[Please us create labs!](https://docs.google.com/document/d/1wNoNjLpdkgoXkRDvDBI32tm62rbASlfF6gxwyEkyTYs/edit)

We would love to have people contribute relevant labs to help
people learn how to develop secure software.
We'd be happy to give you credit through a "wall of fame".

If you're interested, please contact
[David A. Wheeler](mailto:dwheele&#114;&#64;linuxfoundation&#46;org).
See below for how to create labs and our lab roadmap.

## How to create and submit labs

See [create labs](create_labs) if you want to learn how to create labs.
In particular, that page will link to how to
[create labs using checker](create_checker).
We suggest using the [template](template.html) as a start.

To submit new or updated labs, create a pull request on the
[OpenSSF Best Practices WG](https://github.com/ossf/wg-best-practices-os-developers/)
under the `docs/labs` directory.

## Lab Roadmap

We plan to create labs for the secure software development
fundamentals course;
[here is its development website](https://github.com/ossf/secure-sw-dev-fundamentals).

Below are the sections where we plan to create labs, along with
mappings to existing labs or people who have agreed to work on one.
The items marked "PLANNED-1" are those we intend to do first;
"PLANNED-2" are planned in a second pass.

* Input Validation
  * Input Validation Basics
    * [Input Validation Basics Introduction](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#input-validation-basics-introduction) - [hello](hello.html)
    * [How Do You Validate Input?](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#how-do-you-validate-input), [Input Validation: Numbers and Text](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#input-validation-numbers-and-text)
  * Input Validation: Numbers and Text
    * Input Validation: A Few Simple Data Types - [input1](input1.html)
    * [Sidequest: Text, Unicode, and Locales](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#sidequest-text-unicode-and-locales)
    * [Validating Text](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#validating-text)
    * Introduction to Regular Expressions - [regex0](regex0.html)
    * Using Regular Expressions for Text Input Validation - [regex1](regex1.html), [input2](input2.html)
    * [Countering ReDoS Attacks on Regular Expressions](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#countering-redos-attacks-on-regular-expressions) - PLANNED-2
  * Input Validation: Beyond Numbers and Text
    * [Insecure Deserialization](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#insecure-deserialization) - PLANNED-2 (Tepas Jena)
    * [Input Validation: Beyond Numbers and Text](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#input-validation-beyond-numbers-and-text) - PLANNED-2
    * [Minimizing Attack Surface, Identification, Authentication, and Authorization](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#minimizing-attack-surface-identification-authentication-and-authorization) - PLANNED-2
    * [Search Paths and Environment Variables (including setuid/setgid Programs)](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#search-paths-and-environment-variables-including-setuidsetgid-programs) - PLANNED-2
    * [Special Inputs: Secure Defaults and Secure Startup](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#special-inputs-secure-defaults-and-secure-startup) - PLANNED-2
  * Consider Availability on All Inputs
    * [Consider Availability on All Inputs Introduction](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#consider-availability-on-all-inputs-introduction) - PLANNED-2
* Processing Data Securely
  * Processing Data Securely: General Issues
    * [Prefer Trusted Data. Treat Untrusted Data as Dangerous](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#prefer-trusted-data-treat-untrusted-data-as-dangerous) - PLANNED-2
    * [Avoid Default & Hardcoded Credentials](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#avoid-default--hardcoded-credentials) - PLANNED-1 (Tepas Jena)
    * [Avoid Incorrect Conversion or Cast](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#avoid-incorrect-conversion-or-cast) - PLANNED-2
  * Processing Data Securely: Undefined Behavior / Memory Safety
    * Countering Out-of-Bounds Reads and Writes (Buffer Overflow) - [oob1](oob1.html)
    * [Double-free, Use-after-free, and Missing Release](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#double-free-use-after-free-and-missing-release) - PLANNED-1 (Bennett Pursell)
    * [Avoid Undefined Behavior](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#avoid-undefined-behavior) - PLANNED-2
  * Processing Data Securely: Calculate Correctly
    * [Avoid Integer Overflow, Wraparound, and Underflow](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#avoid-integer-overflow-wraparound-and-underflow) - PLANNED-2
* Calling Other Programs
  * Introduction to Securely Calling Programs
    * Introduction to Securely Calling Programs - The Basics
  * Calling Other Programs: Injection and Filenames
    * [SQL Injection](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#sql-injection) - PLANNED-1 (Tepas Jena)
    * OS Command (Shell) injection - PLANNED-1 (Marta Rybczynska)
    * [Other Injection Attacks](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#other-injection-attacks) - PLANNED-2
    * Filenames (Including Path Traversal and Link Following) - PLANNED-2
  * Calling Other Programs: Other Issues
    * [Call APIs for Programs and Check What Is Returned](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#call-apis-for-programs-and-check-what-is-returned) - PLANNED-2
    * [Handling Errors](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#handling-errors) - PLANNED-2
    * [Logging](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#logging) - PLANNED-2
    * [Debug and Assertion Code](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#debug-and-assertion-code) - PLANNED-1 (Jason Shepherd)
    * Countering Denial-of-Service (DoS) Attacks - PLANNED-2
* Sending Output
  * [Introduction to Sending Output](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#introduction-to-sending-output) - PLANNED-2
  * Countering Cross-Site Scripting (XSS) - PLANNED-1 (Tepas Jena)
  * Content Security Policy (CSP) - [csp1](csp1.html)
  * Other HTTP Hardening Headers - (probably continue csp1) PLANNED-2
  * [Cookies Cookies & Login Sessions Login Sessions](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#cookies--login-sessions) - PLANNED-2
  * [CSRF / XSRF](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#csrf--xsrf) - PLANNED-2
  * [Open Redirects and Forwards](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#open-redirects-and-forwards) - PLANNED-2
  * HTML **target** and JavaScript **window.open()** - PLANNED-2
  * Using Inadequately Checked URLs / Server-Side Request Forgery (SSRF) - PLANNED-2
  * Same-Origin Policy and Cross-Origin Resource Sharing (CORS) - PLANNED-2
  * [Format Strings and Templates](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#format-strings-and-templates) - PLANNED-1 (Jason Shepherd)
  * [Minimize Feedback / Information Exposure](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#minimize-feedback--information-exposure) - PLANNED-2
  * [Avoid caching sensitive information](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#avoid-caching-sensitive-information) - PLANNED-2
  * [Side-Channel Attacks](https://github.com/ossf/secure-sw-dev-fundamentals/blob/main/secure_software_development_fundamentals.md#side-channel-attacks) - PLANNED-2

## Our thanks

Thanks to the following people who have created or offered to create labs
(sorted by first name):

* Bennett Pursell
* David A. Wheeler
* Jason Shepherd
* Marta Rybczynska
* Tepas Jena

## Other information

You can find the current version of this page at the
[OpenSSF Best Practices WG labs](https://best.openssf.org/labs/) site.

All code to implement the labs is released under the MIT license.
All text is released under the Creative Commons Attribution (CC-BY-4.0)
license.
