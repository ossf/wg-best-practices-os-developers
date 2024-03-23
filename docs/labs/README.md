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
* [input1](input1.html) - input validation
* [input2](input2.html) - input validation
* [csp1](csp1.html) - Content Security Policy (CSP)

## How to create and submit labs

See [create labs](create_labs) if you want to learn how to create labs.
In particular, that page will link to how to
[create labs using checker](create_checker).

To submit new or updated labs, create a pull request on the
[OpenSSF Best Practices WG](https://github.com/ossf/wg-best-practices-os-developers/)
under the `docs/labs` directory.

## Desired labs

We want to create labs for the secure software development
fundamentals course;
[here is its development website](https://github.com/ossf/secure-sw-dev-fundamentals).

These are the sections that especially call out for labs, along with
mappings to existing labs or people who have agreed to work on one:

* Input Validation
  * Input Validation Basics
    * Input Validation Basics Introduction
    * How Do You Validate Input?
  * Input Validation: Numbers and Text
    * Input Validation: A Few Simple Data Types - [input1](input1.html)
    * Sidequest: Text, Unicode, and Locales
    * Validating Text
    * Introduction to Regular Expressions - NEED
    * Using Regular Expressions for Text Input Validation - [input2](input2.html)
    * Countering ReDoS Attacks on Regular Expressions - NEED
  * Input Validation: Beyond Numbers and Text
    * Insecure Deserialization - NEED
    * Input Data Structures (XML, HTML, CSV, JSON, & File Uploads) - NEED
    * Minimizing Attack Surface, Identification, Authentication, and Authorization - NEED
    * Search Paths and Environment Variables (including setuid/setgid Programs) - NEED
    * Special Inputs: Secure Defaults and Secure Startup - NEED
  * Consider Availability on All Inputs
    * Consider Availability on All Inputs Introduction - NEED
* Processing Data Securely
  * Processing Data Securely: General Issues
    * Prefer Trusted Data. Treat Untrusted Data as Dangerous - NEED
    * Avoid Default & Hardcoded Credentials - NEED
    * Avoid Incorrect Conversion or Cast - NEED
  * Processing Data Securely: Undefined Behavior / Memory Safety
    * Countering Out-of-Bounds Reads and Writes (Buffer Overflow) - NEED
    * Double-free, Use-after-free, and Missing Release - NEED
    * Avoid Undefined Behavior - NEED
  * Processing Data Securely: Calculate Correctly
    * Avoid Integer Overflow, Wraparound, and Underflow - NEED
* Calling Other Programs
  * Introduction to Securely Calling Programs
    * Introduction to Securely Calling Programs - The Basics
  * Calling Other Programs: Injection and Filenames
    * SQL Injection - NEED
    * OS Command (Shell) injection - NEED
    * Other Injection Attacks - NEED
    * Filenames (Including Path Traversal and Link Following) - NEED
  * Calling Other Programs: Other Issues
    * Call APIs for Programs and Check What Is Returned - NEED
    * Handling Errors - NEED
    * Logging - NEED
    * Debug and Assertion Code - NEED
    * Countering Denial-of-Service (DoS) Attacks - NEED
* Sending Output
  * Introduction to Sending Output - NEED
  * Countering Cross-Site Scripting (XSS) - NEED
  * Content Security Policy (CSP) - [csp1](csp1.html)
  * Other HTTP Hardening Headers - (probably continue csp1) NEED
  * Cookies & Login Sessions - NEED
  * CSRF / XSRF - NEED
  * Open Redirects and Forwards - NEED
  * HTML **target** and JavaScript **window.open()** - NEED
  * Using Inadequately Checked URLs / Server-Side Request Forgery (SSRF) - NEED
  * Same-Origin Policy and Cross-Origin Resource Sharing (CORS) - NEED
  * Format Strings and Templates - NEED
  * Minimize Feedback / Information Exposure - NEED
  * Avoid caching sensitive information - NEED
  * Side-Channel Attacks - NEED

## Other information

You can find the current version of this page at the
[OpenSSF Best Practices WG labs](https://best.openssf.org/labs/) site.

All code to implement the labs is released under the MIT license.
All text is released under the Creative Commons Attribution (CC-BY-4.0)
license.
