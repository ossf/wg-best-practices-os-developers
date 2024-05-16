# Labs

These are labs for those who are learning how to develop secure software.
See our [introduction](introduction) for more information.

You can download the labs in these sections, e.g., to run locally
without Internet access.

We *want* people to create more labs! Here's more information about
how to do that and the labs we'd like created.

## Available labs

Here are the labs available:

* [hello](hello.html) - simple "Hello, world!" demo
* [input1](input1.html) - input validation (simple types)
* [regex0](regex0.html) - regular expressions (regexes) - introduction
* [regex1](regex1.html) - regular expressions (regexes)
* [input2](input2.html) - input validation (more complex situations)
* [csp1](csp1.html) - Content Security Policy (CSP)
* [oob1](oob1.html) - Out-of-bounds (OOB)

We also have a [template](template.html) available.

## Please contribute labs

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
    * Input Validation Basics Introduction - [hello](hello.html)
    * How Do You Validate Input?
  * Input Validation: Numbers and Text
    * Input Validation: A Few Simple Data Types - [input1](input1.html)
    * Sidequest: Text, Unicode, and Locales
    * Validating Text
    * Introduction to Regular Expressions - [regex0](regex0.html)
    * Using Regular Expressions for Text Input Validation - [regex1](regex1.html), [input2](input2.html)
    * Countering ReDoS Attacks on Regular Expressions - PLANNED-2
  * Input Validation: Beyond Numbers and Text
    * Insecure Deserialization - PLANNED-2 (Tepas Jena)
    * Input Data Structures (XML, HTML, CSV, JSON, & File Uploads) - PLANNED-2
    * Minimizing Attack Surface, Identification, Authentication, and Authorization - PLANNED-2
    * Search Paths and Environment Variables (including setuid/setgid Programs) - PLANNED-2
    * Special Inputs: Secure Defaults and Secure Startup - PLANNED-2
  * Consider Availability on All Inputs
    * Consider Availability on All Inputs Introduction - PLANNED-2
* Processing Data Securely
  * Processing Data Securely: General Issues
    * Prefer Trusted Data. Treat Untrusted Data as Dangerous - PLANNED-2
    * Avoid Default & Hardcoded Credentials - PLANNED-1 (Tepas Jena)
    * Avoid Incorrect Conversion or Cast - PLANNED-2
  * Processing Data Securely: Undefined Behavior / Memory Safety
    * Countering Out-of-Bounds Reads and Writes (Buffer Overflow) - [oob1](oob1.html)
    * Double-free, Use-after-free, and Missing Release - PLANNED-1
    * Avoid Undefined Behavior - PLANNED-2
  * Processing Data Securely: Calculate Correctly
    * Avoid Integer Overflow, Wraparound, and Underflow - PLANNED-2
* Calling Other Programs
  * Introduction to Securely Calling Programs
    * Introduction to Securely Calling Programs - The Basics
  * Calling Other Programs: Injection and Filenames
    * SQL Injection - PLANNED-1 (Tepas Jena)
    * OS Command (Shell) injection - PLANNED-1 (Marta Rybczynska)
    * Other Injection Attacks - PLANNED-2
    * Filenames (Including Path Traversal and Link Following) - PLANNED-2
  * Calling Other Programs: Other Issues
    * Call APIs for Programs and Check What Is Returned - PLANNED-2
    * Handling Errors - PLANNED-2
    * Logging - PLANNED-2
    * Debug and Assertion Code - PLANNED-1
    * Countering Denial-of-Service (DoS) Attacks - PLANNED-2
* Sending Output
  * Introduction to Sending Output - PLANNED-2
  * Countering Cross-Site Scripting (XSS) - PLANNED-1 (Tepas Jena)
  * Content Security Policy (CSP) - [csp1](csp1.html)
  * Other HTTP Hardening Headers - (probably continue csp1) PLANNED-2
  * Cookies & Login Sessions - PLANNED-2
  * CSRF / XSRF - PLANNED-2
  * Open Redirects and Forwards - PLANNED-2
  * HTML **target** and JavaScript **window.open()** - PLANNED-2
  * Using Inadequately Checked URLs / Server-Side Request Forgery (SSRF) - PLANNED-2
  * Same-Origin Policy and Cross-Origin Resource Sharing (CORS) - PLANNED-2
  * Format Strings and Templates - PLANNED-1
  * Minimize Feedback / Information Exposure - PLANNED-2
  * Avoid caching sensitive information - PLANNED-2
  * Side-Channel Attacks - PLANNED-2

## Other information

You can find the current version of this page at the
[OpenSSF Best Practices WG labs](https://best.openssf.org/labs/) site.

All code to implement the labs is released under the MIT license.
All text is released under the Creative Commons Attribution (CC-BY-4.0)
license.
