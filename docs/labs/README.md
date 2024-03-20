# Labs

These are labs for those who are learning how to develop secure software.
See our [introduction](introduction) for more information.

You can download the labs in these sections, e.g., to run locally
without Internet access.

We *want* people to create more labs! Here's more information about
how to do that and the labs we'd like created.

## Available labs

Here are the labs available:

* [input1](input1.html)
* [input2](input2.html)
* [csp1](csp1.html)

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
    * Introduction to Regular Expressions
    * Using Regular Expressions for Text Input Validation - [input2](input2.html)
    * Countering ReDoS Attacks on Regular Expressions
  * Input Validation: Beyond Numbers and Text
    * Insecure Deserialization
    * Input Data Structures (XML, HTML, CSV, JSON, & File Uploads)
    * Minimizing Attack Surface, Identification, Authentication, and Authorization
    * Search Paths and Environment Variables (including setuid/setgid Programs)
    * Special Inputs: Secure Defaults and Secure Startup
  * Consider Availability on All Inputs
    * Consider Availability on All Inputs Introduction
* Processing Data Securely
  * Processing Data Securely: General Issues
    * Prefer Trusted Data. Treat Untrusted Data as Dangerous
    * Avoid Default & Hardcoded Credentials
    * Avoid Incorrect Conversion or Cast
  * Processing Data Securely: Undefined Behavior / Memory Safety
    * Countering Out-of-Bounds Reads and Writes (Buffer Overflow)
    * Double-free, Use-after-free, and Missing Release
    * Avoid Undefined Behavior
  * Processing Data Securely: Calculate Correctly
    * Avoid Integer Overflow, Wraparound, and Underflow
* Calling Other Programs
  * Introduction to Securely Calling Programs
    * Introduction to Securely Calling Programs - The Basics
  * Calling Other Programs: Injection and Filenames
    * SQL Injection
    * OS Command (Shell) injection
    * Other Injection Attacks
    * Filenames (Including Path Traversal and Link Following)
  * Calling Other Programs: Other Issues
    * Call APIs for Programs and Check What Is Returned
    * Handling Errors
    * Logging
    * Debug and Assertion Code
    * Countering Denial-of-Service (DoS) Attacks
* Sending Output
  * Introduction to Sending Output
  * Countering Cross-Site Scripting (XSS)
  * Content Security Policy (CSP) - [csp1](csp1.html)
  * Other HTTP Hardening Headers
  * Cookies & Login Sessions
  * CSRF / XSRF
  * Open Redirects and Forwards
  * HTML **target** and JavaScript **window.open()**
  * Using Inadequately Checked URLs / Server-Side Request Forgery (SSRF)
  * Same-Origin Policy and Cross-Origin Resource Sharing (CORS)
  * Format Strings and Templates
  * Minimize Feedback / Information Exposure
  * Avoid caching sensitive information
  * Side-Channel Attacks

## Other information

You can find the current version of this page at the
[OpenSSF Best Practices WG labs](https://best.openssf.org/labs/) site.

All code to implement the labs is released under the MIT license.
All text is released under the Creative Commons Attribution (CC-BY-4.0)
license.
