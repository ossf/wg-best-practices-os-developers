# Compiler Hardening Guides

This is the working area for Compiler hardening best practices guide.  The [C/C++ Compiler Hardening](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C%2B%2B.md) document is currently work-in-progress and in incubation state.

## Scope and Objectives

This document is a guide for compiler and linker options that contribute to delivering reliable and secure code using native (or cross) toolchains for C and C++.
The objective of compiler options hardening is to produce application binaries (executables) with security mechanisms against potential attacks and/or misbehavior.

## Usage in Tools

A python script is also provided that can fetch the latest version of the OpenSSF compiler hardening guide from the internet, obtain the recommended options tables from it and convert them to a machine readable JSON for usage in tools.

## How to Contribute

Contributions to the guide are always welcome, for instance:

* documentation of additional, currently not yet covered, compiler options which improve the security of binaries,
* documentation of similar/equivalent options of other (widely used) compilers which are currently not yet covered by this guide,
* improvements of the existing text

The group of authors meets online every other week to discuss open items and work on the document.
The [meeting details](https://github.com/ossf/wg-best-practices-os-developers/tree/main#meeting-times) can be found in the main [README](https://github.com/ossf/wg-best-practices-os-developers/blob/main/README.md) of the Best Practices Working Group.

Pull requests as always welcome!

### Guide Conventions

* Mention versions for compilers/dependencies in the "Supported Since" column until patch version (example: 2.95.3)
* Mention pre-requisite options in the "Description" column as the last statement, starting the statement with "Requires" keyword (example: see `-D_FORTIFY_SOURCE=3` in the recommended compiler options table)
