# Compiler Options Hardening Guide for C and C++

This document is a guide for compiler and linker options that contribute to delivering reliable and secure code using native (or cross) toolchains for C and C++. The objective of compiler options hardening is to produce application binaries (executables) with security mechanisms against potential attacks and/or misbehavior.

Hardened compiler options should also produce applications that integrate well with existing platform security features in modern operating systems (OSs). Effectively configuring the compiler options also has several benefits during development such as enhanced compiler warnings, static analysis, and debug instrumentation.

This document is intended for:

- Those who write C or C++ code, to help them ensure that resulting code will work with hardened options, including for embedded devices, Internet of Things devices, smartphones, and personal computers.
- Those who build C or C++ code for use in production environments, including Linux distributions, device makers, and those who compile C or C++ for their local environment.

This document focuses on recommended options for the GNU Compiler Collection (GCC) and clang, and we expect to expand it to cover compilers that have similar option syntax (such as the Intel compiler).

**TL;DR: What compiler options should I use?**

When compiling C or C++ code on compilers such as GCC and clang, turn on these flags for detecting vulnerabilities at compile time and enable run-time protection mechanisms:

~~~~sh
-O2 -Wall -Wformat=2 -Wconversion -Wtrampolines -Werror \
-D_FORTIFY_SOURCE=3 \
-D_GLIBCXX_ASSERTIONS \
-fstack-clash-protection -fstack-protector-strong \
-Wl,-z,nodlopen -Wl,-z,noexecstack \
-Wl,-z,relro -Wl,-z,now \
-fPIE -pie -fPIC -shared
~~~~

Developers should use `-Werror`, but redistributors will probably want to omit `-Werror`. Developers who release source code should ensure that their programs compile and pass their automated tests with all these options, e.g., by setting these as the default options. We encourage developers to consider it a bug if the program cannot be compiled with these options. Those who build programs for production may choose to omit some options that hurt performance if the program only processes trusted data, but remember that it's not helpful to deploy programs that that are insecure and.rapidly do the wrong thing. Existing programs may need to be modified over time to work with some of these options.

See the discussion below for background and for detailed discussion of each option.

**Why do we need compiler options hardening?**

Sadly, attackers today attack the software we use every day. Many programming languages' compilers have options to detect potential vulnerabilities while compiling and/or insert runtime protections against potential attacks. These can be important in any language, but these options are *especially* important in C and C++.

Applications written in the C and C++ programming languages are prone to exhibit a class of software defects known as memory safety errors, a.k.a. memory errors. This class of defects include bugs such as buffer overflows, dereferencing a null pointer, and use-after-free errors. Memory errors can occur because the low-level memory management in C and C++ offers no language-level provisions for ensuring the memory safety of operations such as pointer arithmetic or direct memory accesses. Instead, they require software developers to write correct code when performing common operations, and this has proven to be difficult at scale. Memory errors have the potential to cause memory vulnerabilities, which can be exploited by threat actors to gain unauthorized access to computer systems through run-time attacks. Microsoft has found that 70% of all its security defects in 2006-2018 were memory safety failures[^Cimpanu2019], and the Chrome team similarly found 70% of all its vulnerabilities are memory safety issues.[^Cimpanu2020]

[^Cimpanu2019]: Cimpanu, Catalin, [Microsoft: 70 percent of all security bugs are memory safety issues](https://www.zdnet.com/article/microsoft-70-percent-of-all-security-bugs-are-memory-safety-issues/), ZDNet, 2019-02-11

[^Cimpanu2020]: Cimpanu, Catalin, [Chrome: 70% of all security bugs are memory safety issues](https://www.zdnet.com/article/chrome-70-of-all-security-bugs-are-memory-safety-issues/), ZDNet, 2020-05-22

Most programming languages prevent such defects by default. A few languages allow programs to temporarily suspend these protections in special circumstances, but they are intended for use in a few lines, not the whole program. There have been calls to rewrite C and C++ programs in other languages, but this is expensive and time-consuming, has its own risks, is sometimes impractical today (especially for less-common CPUs). Even with universal agreement, it would take decades to rewrite all such code. Consequently, it's important to take other steps to reduce the likelihood of defects becoming vulnerabilities. Aggressive use of compiler options can sometimes detect vulnerabilities or help counter their run-time effects.

Run-time attacks differ from conventional malware, which carries out its malicious program actions through a dedicated program executable, in that run-time attacks influence benign programs to behave maliciously. A run-time attack that exploits unmitigated memory vulnerabilities can be leveraged by threat actors as the initial attack vectors that allow them to gain a presence on a system, e.g., by injecting malicious code into running programs.

Modern, security-aware C and C++ software development practices, such as secure coding standards [^Seacord2014] and program analysis aim to proactively avoid introducing memory errors (and other software defects) to applications. However, in practice completely eradicating memory errors in production C and C++ software has turned out to be near-impossible.

[^Seacord2014]: Seacord, Robert. The CERT C Coding Standard: 98 Rules for Developing Safe, Reliable, and Secure Systems, 2nd Edition. Addison-Wesley Professional. 2014.

Consequently, modern operating systems deploy various run-time mechanisms to protect against potential security flaws. The principal purpose of such mechanisms is to mitigate potentially exploitable memory vulnerabilities in a way that prevents a threat actor from exploiting them to gain code execution capabilities. With mitigations in place the affected application may still crash if a memory error is triggered. However, such an outcome is still preferable if the alternative is the compromise of the system’s run-time environment.

To benefit from the protection mechanism provided by the OS the application binaries must be prepared at build time to be compatible with the mitigations. Typically, this means enabling specific option flags for the compiler or linker when the software is built.

Some mechanisms may require additional configuration and fine tuning, for example due to potential compilation issues for certain unlikely edge cases, or performance overhead the mitigation adds for certain program constructs. This problem is exacerbated in projects that rely on an outdated version of open source software (OSS) compilers such as the GNU Compiler Collection (GCC). In general, security mitigations are more likely to be enabled by default in modern versions of GCC included with Linux distributions; the defaults used by the upstream GCC project are more conservative.

If compiler options hardening is overlooked or neglected during build time it can become impossible to add hardening to already distributed executables. It is therefore good practice to evaluate which mitigations an application should support, and make conscious, informed decisions whenever not enabling a mitigation weakens the application’s defensive posture. Ensure that the software is *tested* with as many options as practical, to ensure it can be operated that way.

Some organizations require selecting hardening rules. For example, the US government's NIST SP 800-218 practice PW.6 requires configuring "the compilation, interpreter, and build processes to improve executable security" [^NIST-SP-800-218-1-1]. Carnegie Mellon University (CMU)'s "top 10 secure coding practices" recommends compiling "code using the highest warning level available for your compiler and eliminate warnings by modifying the code."[^CMU2018] This guide can help you do that.

[^NIST-SP-800-218-1-1]: US NIST, [Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities](https://csrc.nist.gov/publications/detail/sp/800-218/final), NIST SP 800-218

[^CMU2018]: Carnegie Mellon University (CMU), [Top 10 Secure Coding Practices](https://wiki.sei.cmu.edu/confluence/display/seccode/Top+10+Secure+Coding+Practices)

**What does compiler options hardening not do?**

Compiler options hardening is not a silver bullet; it is not sufficient to rely solely on security features and functions to achieve secure software. Security is an emergent property of the entire system that relies on building and integrating all parts properly. However, if properly used, secure compiler options will complement existing processes, such as static and dynamic analysis, secure coding practices, negative test suites, profiling tools, and most importantly: security hygiene as a part of a solid design and architecture.

## Recommended Compiler Options

This section describes recommendations for compiler and linker option flags that 1) enable compile-time checks that warn developers of potential defects in the source code (Table 1), and 2) enable run-time protection mechanisms, such as checks that are designed to detect when memory vulnerabilities in the application are exploited (Table 2).

The recommendations in Table 1 and Table 2 are primarily applicable to compiling user space code in GNU/Linux environments using either the GCC and Binutils toolchain or the Clang / LLVM toolchain and have been included in this document because they are:

- widely deployed and enabled by default for pre-built packages in major Linux distributions, including Debian, Ubuntu, Red Hat and SUSE Linux.
- supported both by the GCC and Clang / LLVM toolchains.
- cross-platform and supported on (at least) Intel and AMD 64-bit x86 architectures as well as the 64-bit version of the ARM architecture (AArch64).

For historical reasons, the GCC compiler and Binutils upstream projects do not enable optimization or security hardening options by default. While some aspects of the default options can be changed when building GCC and Binutils from source, the defaults used in the toolchains shipped with GNU/Linux distributions vary. Distributions may also ship multiple versions of toolchains with different defaults. Consequently, developers need to pay attention to compiler and linker option flags, and manage them according to their need of optimization, level of warning and error detection, and security hardening of the project.

To identify the default flags used by GCC or Clang on your system, you can examine the output of `cc -v` *`<sourcefile.c>`* and review the full command line used by the compiler to build the specified source file. This information serves two main purposes: understanding the setup of the compiler on your system and gaining insights into the options chosen by the distribution's maintainers. Additionally, it can be valuable for diagnosing option-related issues or troubleshooting problems that may arise during software compilation. For instance, certain option flags rely on their order of appearance; when a parameter is set more than once, the later occurrence usually takes precedence. By analyzing the complete list of utilized flags, it becomes easier to troubleshoot issues caused by interactions between order-sensitive flags.

Similarly, running `cc -O2 -dM -E - < /dev/null` will produce a comprehensive list of macro-defined constants. This output can be useful for troubleshooting problems related to compiler or library features that are enabled through specific macro definitions.

It's important to note that sourcing GCC from third-party vendor may result in your instance of GCC being preconfigured with certain default flags enabled or disabled. These flags can significantly impact the security of your compiled code. Therefore, it's essential to review the default flags if GCC is sourced through a Package Manager, Linux Distribution, or otherwise. We recommend explicitly enabling desired compiler flags in your build scripts or build system configuration rather than relying on the toolchain defaults. If you are creating packages for Linux distributions the distributions maintainers may have their own recommended ways of incorporating build flags. In such cases refer to the corresponding distribution documentation for, e.g., Debian[^debian-hardening], Gentoo[^gentoo-hardening], Fedora[^fedora-hardening], OpenSUSE[^opensuse-hardening], or Ubuntu[^ubuntu-hardening].

[^debian-hardening]: Software in the Public Interest, [Hardening in Debian](https://wiki.debian.org/Hardening), Debian Wiki

[^gentoo-hardening]: Gentoo Foundation, [Hardening in Gentoo](https://wiki.gentoo.org/wiki/Hardened/Toolchain), Gentoo Wiki

[^fedora-hardening]: Red Hat, [Using RPM build flags in Fedora](https://src.fedoraproject.org/rpms/redhat-rpm-config/blob/rawhide/f/buildflags.md), Fedora Package Sources (`redhat-rpm-config`)

[^opensuse-hardening]: SUSE, [openSUSE Security Features](https://en.opensuse.org/openSUSE:Security_Features), openSUSE Wiki

[^ubuntu-hardening]: Ubuntu, [Ubuntu Security Features](https://wiki.ubuntu.com/Security/Features), Ubuntu Wiki

Compile-time checks enabled by options in Table 1 do not have an impact on the binary code generated by the compiler and consequently do not incur any tradeoffs in terms of performance or other run-time characteristics. Rather, they only issue warnings (or errors if the `-Werror` option is enabled) that inform of potential defects found in the source code.

When such additional warnings are enabled, developers should take time to understand the underlying issues that are flagged by the compiler and address them.

The options in Table 2 can be categorized into two types:

1) options that cause the compiler to augment the produced binary with run-time checks aimed to detect memory errors, and
2) options that direct the compiler to adjust the properties of the generated binary or code to ensure the resulting binary is compatible with OS-enforced protection mechanisms.

Testing is essential to validate the impact of enabling any of the options listed in Table 2, as they affect the binary produced by the compiler. Some of the compiler options described below may influence the software's performance. However, this performance impact is usually context-specific, and in most cases, it is either minimal or the benefits outweigh the overhead. For further information on when significant performance impacts may occur, you can find detailed descriptions of these options later in this document.

When dealing with software for which performance is a critical factor developers should carefully assess the trades-offs between enabling more secure options and observed performance test data, taking into account the specific use cases of their software. Before implementing any changes in production environments, it is essential to conduct thorough benchmarking and testing. This will provide insights into how the compiler options influence both performance and security aspects of the software. Keep in mind that a system that works quickly but is vulnerable to adversaries is likely to be unacceptable to users. Benchmarks should consider any relevant performance characteristics such as average time, worst-case time, and memory use during execution. Additionally, the impact on the size of the produced binaries can be a concern, particularly for embedded systems.

Table 1: Recommended compiler options that enable strictly compile-time checks.

| Compiler Flag                                                                 |       Supported since       | Description                                                                         |
|:----------------------------------------------------------------------------- |:------------------------:|:----------------------------------------------------------------------------------- |
| [`-Wall`](#-Wall)<br/>[`-Wextra`](#-Wextra)                                   | GCC 2.95.3<br/>Clang 4.0 | Enable warnings for constructs often associated with defects                        |
| [`-Wformat=2`](#-Wformat=2)                                                   | GCC 2.95.3<br/>Clang 4.0 | Enable additional format function warnings                                          |
| [`-Wconversion`](#-Wconversion)<br/>[`-Wsign-conversion`](#-Wsign-conversion) | GCC 2.95.3<br/>Clang 4.0 | Enable implicit conversion warnings                                                 |
| [`-Wtrampolines`](#-Wtrampolines)                                             |         GCC 4.3          | Enable warnings about trampolines that require executable stacks                    |
| [`-Werror`](#-Werror)<br/>[`-Werror=`*`<warning-flag>`*](#-Werror-flag)       | GCC 2.95.3<br/>Clang 2.6 | Make compiler warnings into errors                                                  |

Table 2: Recommended compiler options that enable run-time protection mechanisms.

| Compiler Flag                                                                             |            Supported since            | Description                                                                                  |
|:----------------------------------------------------------------------------------------- |:----------------------------------:|:-------------------------------------------------------------------------------------------- |
| [`-D_FORTIFY_SOURCE=3`](#-D_FORTIFY_SOURCE=3) <br/>(requires `-O1` or higher) | GCC 12.0<br/>Clang 9.0.0[^1]  | Fortify sources with compile- and run-time checks for unsafe libc usage and buffer overflows. Some fortification levels can impact performance. |
| [`-D_GLIBCXX_ASSERTIONS`](#-D_GLIBCXX_ASSERTIONS)<br>[`-D_LIBCPP_ASSERT`](#-D_LIBCPP_ASSERT) | libstdc++ 6.0<br/>libc++ 3.3.0  | Precondition checks for C++ standard library calls. Can impact performance.                  |
| [`-fstack-clash-protection`](#-fstack-clash-protection)                                   |       GCC 8<br/>Clang 11.0.0       | Enable run-time checks for variable-size stack allocation validity. Can impact performance.  |
| [`-fstack-protector-strong`](#-fstack-protector-strong)                                   |     GCC 4.9.0<br/>Clang 5.0.0      | Enable run-time checks for stack-based buffer overflows. Can impact performance.             |
| [`-Wl,-z,nodlopen`](#-Wl,-z,nodlopen) |           Binutils 2.10            | Restrict `dlopen(3)` calls to shared objects                                 |
| [`-Wl,-z,noexecstack`](#-Wl,-z,noexecstack)                                               |           Binutils 2.14            | Enable data execution prevention by marking stack memory as non-executable                   |
| [`-Wl,-z,relro`](#-Wl,-z,relro)<br/>[`-Wl,-z,now`](#-Wl,-z,now)                           |           Binutils 2.15            | Mark relocation table entries resolved at load-time as read-only. `-Wl,-z,now` can impact startup performance.                            |
| [`-fPIE -pie`](#-fPIE_-pie)                                                               |   Binutils 2.16<br/>Clang 5.0.0    | Build as position-independent executable. Can impact performance on 32-bit architectures.                                                   |
| [`-fPIC -shared`](#-fPIC_-shared)                                                         | < Binutils 2.6<br/>Clang 5.0.0[^1] | Build as position-independent code. Can impact performance on 32-bit architectures.                                                         |

[^1]: The implementation of `-D_FORTIFY_SOURCE={1,2,3}` in the GNU libc (glibc) relies heavily on implementation details within GCC. Clang implements its own style of fortified function calls (originally introduced for Android’s bionic libc) and but as of Clang / LLVM 14.0.6 incorrectly produces non-fortified calls to some glibc functions with `_FORTIFY_SOURCE` . Code set to be fortified with Clang will still compile, but may not always benefit from the fortified function variants in glibc. For more information see: Guelton, Serge. Toward _FORTIFY_SOURCE parity between Clang and GCC. Red Hat Developer.
 <https://developers.redhat.com/blog/2020/02/11/toward-_fortify_source-parity-between-clang-and-gcc> and
 Poyarekar, Siddhesh. D91677 Avoid simplification of library functions when callee has an implementation. (LLVM Phabricator) <https://reviews.llvm.org/D91677>

---

### Enable warnings for constructs often associated with defects

| Compiler Flag                                                           |       Supported since       | Description                                                  |
|:----------------------------------------------------------------------- |:------------------------:|:------------------------------------------------------------ |
| <span id="-Wall">`-Wall`</span><br/><span id="-Wextra">`-Wextra`</span> | GCC 2.95.3<br/>Clang 4.0 | Enable warnings for constructs often associated with defects |

#### Synopsis

Warnings are compile-time diagnostics messages that indicate programming constructs that, while not inherently erroneous, are risky or suggest a programming error may have been made.

The `-Wall` and `-Wextra` compiler flags enable pre-defined sets of compile-time warnings.

The warnings in the `–Wall` set are generally easy to avoid or can be easily prevented by modifying the offending code.

The `-Wextra` set of warnings are either situational, or indicate problematic constructs that are harder to avoid and in some cases may be necessary.

NOTE: Despite its name the `-Wall` options does NOT enable all possible warning diagnostics, but a pre-defined subset. For a complete list of specific warnings enabled by the`-Wall` and `-Wextra` compiler please consult the GCC[^2] and Clang[^3] documentation respectively.

[^2]: Using the GNU Compiler Collection (GCC): Warning Options.
<https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html>

[^3]: Clang documentation: Diagnostics flags in Clang.
<https://clang.llvm.org/docs/DiagnosticsReference.html>

---

### Enable additional format function warnings

| Compiler Flag                              |       Supported since       | Description                                |
|:------------------------------------------ |:------------------------:|:------------------------------------------ |
| <span id="-Wformat=2">`-Wformat=2`</span>  | GCC 2.95.3<br/>Clang 4.0 | Enable additional format function warnings |

#### Synopsis

Check calls to the `printf` and `scanf` family of functions to ensure that the arguments supplied have types appropriate to the format string specified, and that the conversions specified in the format string make sense.

The `-Wformat=2` form of the option also enables certain additional checks, including:

- Warning if the format string is not a string literal and so cannot be checked, unless the format function takes its format arguments as a va_list (`-Wformat-nonliteral`).
- Warning about uses of format functions that represent possible security problems (`-Wformat-security`).
- Warning about `strftime` formats that may yield only a two-digit year (`-Wformat-y2k`).

---

### Enable implicit conversion warnings

| Compiler Flag                                                                                             |       Supported since       | Description                         |
|:--------------------------------------------------------------------------------------------------------- |:------------------------:|:----------------------------------- |
| <span id="-Wconversion">`-Wconversion`</span><br/><span id="-Wsign-conversion">`-Wsign-conversion`</span> | GCC 2.95.3<br/>Clang 4.0 | Enable implicit conversion warnings |

#### Synopsis

Check for implicit conversions that may alter a value such as:

- conversions between real and integer data types
- conversion between signed and unsigned data types
- conversion between data types of different size
- confusing overload resolution for user-defined conversions in C++
- conversions that never use a type conversion operator in C++:
    conversions to void, the same type, a base class or a reference.

Conversion between data types that cause the value of the data to be altered can cause   information to be omitted or translated in a way that produces unexpected values.

If the resulting values are used in a context where they control memory accesses or security decisions, then dangerous behaviors may occur, e.g., integer signedness or truncation errors can cause buffer overflows.

For C++ warnings about conversions between signed and unsigned integers are disabled by default unless `-Wsign-conversion` is explicitly enabled.

---

### Enable warning about trampolines that require executable stacks

| Compiler Flag                                   | Supported since | Description                                                      |
|:----------------------------------------------- |:------------:|:---------------------------------------------------------------- |
| <span id="-Wtrampolines">`-Wtrampolines`</span> |   GCC 4.3    | Enable warnings about trampolines that require executable stacks |

#### Synopsis

Check whether the compiler generates trampolines for pointer to nested functions which may interfere with stack virtual memory protection (non-executable stack.)

A trampoline is a small piece of data or code that is created at run time on the stack when the address of a nested function is taken and is used to call the nested function indirectly.

For most target architectures, including 64-bit x86, trampolines are made up of code and thus requires the stack to be made executable for the program to work properly. This interferes with the non-executable stack mitigation which is used by all major operating system to prevent code injection attacks (see Section 2.10).

---

### Make compiler warnings into errors

| Compiler Flag                                                                                        |       Supported since       | Description                        |
|:---------------------------------------------------------------------------------------------------- |:------------------------:|:---------------------------------- |
| <span id="-Werror">`-Werror`</span><br/> <span id="-Werror-flag">`-Werror=`*`<warning-flag>`*</span> | GCC 2.95.3<br/>Clang 2.6 | Make compiler warnings into errors |

#### Synopsis

Make the compiler treat all or specific warning diagnostics as errors.

A blanket `-Werror` can be used to implement a zero-warning policy, although such policies can also be enforced at CI level. CI-based zero- or bounded-warning policies are often preferable as they can be expanded beyond compiler warning. For example, they can also include warnings from static analysis tools or generate warnings when `FIXME` and `TODO` comments are found.

The selective form: `-Werror=`*`<warning-flag>`* can be used for refined warnings-as-error control without introducing a blanket zero-warning policy. This is beneficial to ensure that certain undesirable constructs or defects do not make into produced builds.

For example, developers can decide to promote warnings that indicate interference with OS defense mechanisms (e.g., `-Werror=trampolines`), undefined behavior (e.g., `-Werror=return-type`), or constructs associated with software weaknesses (e.g., `-Werror=conversion`) to errors.

---

### Fortify sources for unsafe libc usage and buffer overflows

| Compiler Flag                                                                              | Supported since            | Description                                                                                  |
| ------------------------------------------------------------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------- |
| <span id="-D_FORTIFY_SOURCE=1">`-D_FORTIFY_SOURCE=1`</span>                                | GCC 4.0<br/>Clang 5.0.0     | Fortify sources with compile- and run-time checks for unsafe libc usage and buffer overflows         |
| <span id="-D_FORTIFY_SOURCE=2">`-D_FORTIFY_SOURCE=2`</span><br/>(requires `-O1` or higher) | GCC 4.0<br/>Clang 5.0.0[^1] | In addition to checks covered by `-D_FORTIFY_SOURCE=1`, also trap code that may be conforming to the C standard but still unsafe |
| <span id="-D_FORTIFY_SOURCE=3">`-D_FORTIFY_SOURCE=3`</span><br/>(requires `-O1` or higher) | GCC 12.0<br/>Clang 9.0.0[^1] | Same checks as in `-D_FORTIFY_SOURCE=2`, but with significantly more calls fortified with a potential to impact performance in some rare cases |

#### Synopsis

The `_FORTIFY_SOURCE` macro enables a set of extensions to the GNU C library (glibc) that enable checking at entry points of a number of functions to immediately abort execution when it encounters unsafe behavior. A key feature of this checking is validation of objects passed to these function calls to ensure that the call will not result in a buffer overflow. This relies on the compiler being able to compute the size of the protected object at compile time. A full list of these functions is maintained in the GNU C Library manual[^28]:

> memcpy, mempcpy, memmove, memset, strcpy, stpcpy, strncpy, strcat, strncat, sprintf, vsprintf, snprintf, vsnprintf, gets

The `_FORTIFY_SOURCE` mechanisms have three modes of operation:

- `-D_FORTIFY_SOURCE=1`: conservative, compile-time and runtime checks; will not change (defined) behavior of programs. Checking for overflows is enabled when the compiler is able to estimate a compile time constant size for the protected object.
- `-D_FORTIFY_SOURCE=2`: stricter checks that also detect behavior that may be unsafe even though it conforms to the C standard; may affect program behavior by disallowing certain programming constructs. An example of such checks is restricting of the `%n` format specifier to read-only format strings.
- `-D_FORTIFY_SOURCE=3`: Same checks as those covered by `-D_FORTIFY_SOURCE=2` except that checking is enabled even when the compiler is able to estimate the size of the protected object as an expression, not just a compile time constant.

To benefit from `_FORTIFY_SOURCE` checks following requirements must be met:  

- the application must be built with `-O1` optimizations or higher; at least `-O2` is recommended.
- the compiler should be able to estimate sizes of the destination buffers at compile time. This can be facilitated by applications and libraries by using function attribute extensions supported by GCC and Clang[^29].
- the application code must use glibc versions of the aforementioned functions (included with standard headers, e.g. `<stdio.h>` and `<string.h>`)

If checks added by `_FORTIFY_SOURCE` detect unsafe behavior at run-time they will print an error message and terminate the application.

#### Performance implications

Both `_FORTIFY_SOURCE=1` and `_FORTIFY_SOURCE=2` are expected to have a negligible run-time performance impact (~0.1% ).

#### When not to use?

`_FORTIFY_SOURCE` is recommended for all application that depend on glibc and should be widely deployed. Most packages in all major Linux distributions enable at least `_FORTIFY_SOURCE=2` and some even enable `_FORTIFY_SOURCE=3`. There are a couple of situations when `_FORTIFY_SOURCE` may break existing applications:

- If the fortified glibc function calls show up as hotspots in your application performance profile, there is a chance that `_FORTIFY_SOURCE` may have a negative performance impact. This is not a common or widespread slowdown[^29] but worth keeping in mind if slowdowns are observed due to this option
- Applications that use the GNU extension for flexible array members in structs[^30] may confuse the compiler into thinking that an object is smaller than it actually is, resulting in spurious aborts. The safe resolution for this is to port these uses to C99 flexible arrays but if that is not possible (e.g. due to the need to support a compiler that does not support C99 flexible arrays), one may need to downgrade or disable `_FORTIFY_SOURCE` protections.

[^28]: Source Fortification in the GNU C Library
<https://www.gnu.org/software/libc/manual/2.37/html_node/Source-Fortification.html>

[^29]: How to improve application security using _FORTIFY_SOURCE=3
<https://developers.redhat.com/articles/2023/02/06/how-improve-application-security-using-fortifysource3>

[^30]: Arrays of Length Zero
<https://gcc.gnu.org/onlinedocs/gcc/extensions-to-the-c-language-family/arrays-of-length-zero.html>

---

### Precondition checks for C++ standard library calls

| Compiler Flag                                                                              | Supported since            | Description                                                                                  |
| ------------------------------------------------------------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------- |
| <span id="-D_GLIBCXX_ASSERTIONS">`-D_GLIBCXX_ASSERTIONS`</span>                            | libstdc++ 6.0           | (C++ using libcstdc++ only) Precondition checks for libstdc++ calls; can impact performance. |
| <span id="-D_LIBCPP_ASSERT">`-D_LIBCPP_ASSERT`</span>                                      | libc++ 3.3.0       | (C++ using libc++ only) Constant-time precondition checks for libc++ calls. |

#### Synopsis

The C++ standard library implementations in GCC (libstdc++) and LLVM (libc++) provide run-time precondition checks for C++ standard library calls, such as bounds-checks for C++ strings and containers, and null-pointer checks when dereferencing smart pointers.

These precondition checks can be enabled by defining the corresponding pre-processor macros in when compiling C++ code that calls into libstdc++ or libc++:

- The `-D_GLIBCXX_ASSERTIONS` macro enables precondition checks for libstdc++[^libstdcpp_macros].
  It can only affect C++ code that uses GCC’s libstdc++.
- The `-D_LIBCPP_ASSERT` macro enables precondition checks for libc++[^Clow19].  
  It can only affect C++ code that uses LLVM’s libc++.

#### Performance implications

Most calls into the C++ standard library have preconditions. Some preconditions can be checked in constant-time, others are more expensive.
Both `-D_GLIBCXX_ASSERTIONS` and `-D_LIBCPP_ASSERT` are intended to enable only lightweight[^Wakely15], i.e., constant-time checks[^Dionne22] but the exact behavior can differ between standard library versions .

The `-D_GLIBCXX_ASSERTIONS` macro can have a non-trivial impact on performance.
Impacts of [up to 6% on performance have been reported](https://gitlab.psi.ch/OPAL/src/-/merge_requests/468).

#### When not to use?

`-D_GLIBCXX_ASSERTIONS` and `-D_LIBCPP_ASSERT` are recommended for C++ applications that may handle untrusted data, as well as for any C++ application during testing.

These options are unnecessary for security for applications in production that only handle completely trusted data.

[^libstdcpp_macros]: Free Software Foundation, [Using Macros in the GNU C++ Library](https://gcc.gnu.org/onlinedocs/libstdc++/manual/using_macros.html), The GNU C++ Library Manual

[^Clow19]: Marshall Clow, [Hardening the C++ standard template library](https://www.youtube.com/watch?v=1iHs_K2HpGo&t=990s), C++ Russia 2019

[^Wakely15]: Jonathan Wakely, [Enable lightweight checks with _GLIBCXX_ASSERTIONS](https://patchwork.ozlabs.org/project/gcc/patch/20150907182755.GP2631@redhat.com/), GCC Mailing List, 2015-09-07

[^Dionne22]: Loius Dionne, [Audit all uses of \_LIBCPP_ASSERT and \_LIBCPP_DEBUG_ASSERT](https://github.com/llvm/llvm-project/commit/c87c8917e3662532f0aa75a91caea857c093f8f4)

---

### Enable run-time checks for variable-size stack allocation validity

| Compiler Flag                                                         |      Supported since      | Description                                                                                   |
|:--------------------------------------------------------------------- |:----------------------:|:--------------------------------------------------------------------------------------------- |
| <span id="-fstack-clash-protection">`-fstack-clash-protection`</span> | GCC 8<br/>Clang 11.0.0 | Enable run-time checks for variable-size stack allocation validity                            |
| `-param stack-clash-protection-guard-size=`*`<gap size>`*             | GCC 8<br/>Clang 11.0.0 | Set the stack guard gap size used to determine the probe granularity of the instrumented code |

#### Synopsis

Stack clash protection mitigates attacks that aim to bypass the operating system’s *stack guard gap*. The stack guard gap is a security feature in the Linux kernel that protects processes against sequential stack overflows that overflow the stack in order to corrupt adjacent memory regions.

To avoid the stack guard gap from being bypassed each fresh allocation on the stack needs to probe the freshly allocated memory for the stack guard gap if it is present. Stack clash protection ensures a single allocation may not be larger than the stack guard gap size and the compiler translates larger allocations into a series of smaller sub-allocations. In addition, it ensures that any series of sub-allocations can not exceed the stack guard gap size without an intervening probe.

Probe instructions can either be implicit or explicit. Implicit probes occur naturally as part of the application’s code, such as when x86 and x86_64 call instructions push the return address onto the stack. Implicit probes do not incur any additional performance cost. Explicit probes, on the other hand, consists of additional probe instructions emitted by the compiler.

#### Performance implications

Applications for which functions allocate at most the size of the stack guard gap of stack space memory at a time do not exhibit adverse performance impact from stack clash protection.

However, stack clash protection may cause performance degradation for applications that perform large allocations that exceed the stack guard gap size. Performance impact scales with the size of large allocations and number of explicit probes required. The performance degradation can be mitigated by increasing the Linux stack guard gap size controlled via the `vm.heap-stack-gap` sysctl parameter) and compiling the application with the corresponding `-param stack-clash-protection-guard-size`. Higher values reduce the number of explicit probes, but a value larger than the kernel guard gap will leave code vulnerable to stack clash style attacks.

Note that `vm.heap-stack-gap` expresses the gap as multiple of page size whereas `stack-clash-protection-guard-size` is expressed as a power of two in bytes. Hence for `vm.heap-stack-gap=256` on x86 (256 * 4KiB = 1MiB gap) the corresponding `stack-clash-protection-guard-size` is 20 (2^20 = 1MiB gap).

---

### Enable run-time checks for stack-based buffer overflows

| Compiler Flag                                                          |       Supported since        | Description                                                                                                      |
|:---------------------------------------------------------------------- |:-------------------------:|:---------------------------------------------------------------------------------------------------------------- |
| <span id="-fstack-protector-strong">`-fstack-protector-strong`</span>  | GCC 4.9.0<br/>Clang 5.0.0 | Enable run-time checks for stack-based buffer overflows using strong heuristic                                   |
| `-fstack-protector-all`                                                |       GCC<br/>Clang       | Enable run-time checks for stack-based buffer overflows for all functions                                        |
| `-fstack-protector`<br/>`--param=ssp-buffer-size=`*`<n>`*              |       GCC<br/>Clang       | Enable run-time checks for stack-based buffer overflows for functions with character arrays if *n* or more bytes |

#### Synopsis

Stack protector instruments code produced by the compiler to detect overflows in buffers allocated on the program stack at run-time (colloquially referred to as *“stack smashing”*).

The detection is based on inserting a *canary* value into the stack frame in the function prologue. The canary is verified against a reference value in the function epilogue. If they differ the runtime calls `__stack_chk_fail()`, which will terminate the offending application.

This mitigates potential control-flow hijacking attacks that may lead to arbitrary code execution by corrupting return addresses stored on the stack.

#### Performance implications

Stack protector supports three different heuristics that are used to determine which functions are instrumented with run-time checks during compilation:

- `-fstack-protector-strong`[^4]: instrument any function that  
  - takes the address of any of its local variables on the right-hand-side of an assignment or as part of a function argument  
  - allocates a local array, regardless of type or length  
  - allocates a local struct or union which contains an array, regardless of the type of length of the array  
  - has explicit local register variables

- `-fstack-protector`: instrument functions that call alloca() or allocate character arrays of n bytes or more in size . The threshold for instrumentation is adjustable via the `--param=ssp-buffer-size=`*`n`* option (default: 8 bytes).  
- `-fstack-protector-all`: instrument all functions.

The performance overhead is dependent on the number of function’s instrumented and the frequency at which instrumented functions are activated at run-time. Enabling `-fstack-protector-strong` is recommended as it provides the best balance between function coverage and performance. Projects using older compiler versions can consider `-fstack-protector-all` or `-fstack-protector` with a stricter threshold, e.g. `--param=ssp-buffer-size=4`.

#### When not to use?

`-fstack-protector-strong` is recommended for all applications with conventional stack behavior. Applications with hand-written assembler optimization that make assumptions about the layout of the stack may be incompatible with stack-protector functionality.

[^4]: Shen, Han. New stack protector option for gcc (Google Docs).
<https://docs.google.com/document/d/1xXBH6rRZue4f296vGt9YQcuLVQHeE516stHwt8M9xyU>

---

### Restrict dlopen calls to shared objects

| Compiler Flag                                                                                            | Supported since  | Description                                                  |
|:-------------------------------------------------------------------------------------------------------- |:-------------:|:------------------------------------------------------------ |
|  <span id="-Wl,-z,nodlopen">`-Wl,-z,nodlopen`</span><br/> | Binutils 2.10 | Restrict `dlopen(3)` calls to shared objects |

#### Synopsis

The `nodlopen` option passed to the linker when building shared objects will mark the resulting object as not available to `dlopen(3)` calls. This can help in reducing an attacker's ability to load and manipulate shared objects. Loading new objects or duplicating an already existing shared object in a process can constitute a part of the attack chain in runtime exploitation.

The `nodlopen` restrictions are based on setting the `DF_1_NOOPEN` flags in the object’s `.dynamic` section tags. Since the enforcement of restricted calls is done inside libc when `dlopen(3)` are called it is possible for attackers to bypass check by 1) manipulating the tag embedded in the object if they have the ability to modify the object file on disk, or 2) bypassing `dlopen(3)` and loading shared objects through attacker controlled code, e.g., pieces of shellcode or return-oriented-programming gadgets. However, restrictions on `dlopen(3)` put in place at link time can still be useful in restricting the attacker before they have obtained arbitrary code execution capabilities.

#### Performance implications

None, marking shared objects as restricted to `dlopen(3)` does not have an impact on performance at run time.

#### When not to use?

In some cases it is desirable for applications to manage the loading of libraries directly via `dlopen(3)` without relying on the conventional dynamic linking. Such situations include:

- Selecting application plugins to load
- Selecting a version of a library optimized for particular CPUs. Leveraged by, e.g., math libraries that provide different implementations of mathematical operations for different environments.
- Selecting an implementation of an API by different vendors
- Delay loading of shared libraries to decrease application start times. (See also lazy binding in Section 2.11)

Since `nodlopen` interfere with applications that rely on to `dlopen(3)` to manipulate shared objects they cannot be used with applications that rely on such functionality.

---

### Enable data execution prevention

| Compiler Flag                                                                                                         | Supported since  | Description                                                                         |
|:--------------------------------------------------------------------------------------------------------------------- |:-------------:|:----------------------------------------------------------------------------------- |
| <span id="-Wl,-z,noexecstack">`-Wl,-z,noexecstack`</span> | Binutils 2.14 | Enable data execution prevention by marking stack memory as non-executable |

#### Synopsis

All major modern processor architectures incorporate memory management primitives that give the OS the ability to mark certain memory areas, such as the stack and heap, as non-executable, e.g., the AMD *“non-execute”* (NX) bit and the Intel *“execute disable”* (XD) bit. This mechanism prevents the stack or heap from being used inject malicious code during a run-time attack.

The `-Wl,-z,noexecstack` option tells the linker to mark the corresponding program segment as non-executable which enables the OS to configure memory access rights correctly when the program executable is loaded into memory.

However, some language-level programming constructs, such as taking the address of a nested function (a GNU C extension to ISO standard C) requires special compiler handling which may prevent the linker from marking stack segments correctly as non-executable[^5].

Consequently the `-Wl,-z,noexecstack` option works best when combined with appropriate warning flags (`-Wtrampolines` where available) that indicate whether language constructs interfere with stack virtual memory protection.

#### Performance implications

None, marking the stack and/or heap as non-executable does not have an impact on performance at run time.

#### When not to use?

Applications that leverage just-in-time (JIT) compilation for managed bytecode or interpreted language runtimes may require specific writable memory areas, such as part of the heap to remain executable in order to execute JIT code.

Such applications require sandboxing techniques to protect the application’s memory integrity from potentially malicious JIT code.

In addition to protection against malicious code injection such applications may also require special mitigations against speculative execution side channels [^6].

[^5]: Trampolines (GNU Compiler Collection (GCC) Internals). 18.11 Support for Nested Functions.
<https://gcc.gnu.org/onlinedocs/gccint/Trampolines.html>

[^6]: Managed Runtime Speculative Execution Side Channel Mitigations (Intel Developer Zone).
<https://www.intel.com/content/www/us/en/developer/articles/technical/software-security-guidance/technical-documentation/runtime-speculative-side-channel-mitigations.html>

---

### Mark relocation table entries resolved at load-time as read-only

| Compiler Flag                                                                               | Supported since  | Description                                                       |
|:------------------------------------------------------------------------------------------- |:-------------:|:----------------------------------------------------------------- |
| <span id="-Wl,-z,relro">`-Wl,-z,relro`</span><br/><span id="-Wl,-z,now">`-Wl,-z,now`</span> | Binutils 2.15 | Mark relocation table entries resolved at load- time as read-only |

*“Read-only relocation”* (RELRO) marks relocation table entries as read-only after they have been resolved by the dynamic linker/loader (`ld.so`). Relocation is the process performed by `ld.so` that connects unresolved symbolic references to proper addresses of corresponding in-memory objects.

Marking relocations read-only will mitigate run-time attacks that corrupt Global Offset Table (GOT) entries to hijack program execution or to cause unintended data accesses. Collectively such attacks are referred to as *GOT overwrite attacks* or *GOT hijacking*.

RELRO can be instantiated in one of two modes: partial RELRO or full RELRO. Full RELRO is necessary for effective mitigation for GOT overwrite attacks; partial RELRO is not sufficient.

Partial RELRO (`-Wl,-z,relro`) will mark certain ELF section as read-only after initialization by runtime loader. These include `.init_array`, `.fini_array`, `.dynamic`, and the non-PLT portion of `.got`. However, in partial RELRO the auxiliary procedure linkage portion of the GOT (`.got.plt`) is still left writable to facilitate late binding.

Full RELRO (`-Wl,-z,relro -Wl,-z,now`) disables lazy binding. This allows `ld.so` to resolve the entire GOT at application startup and mark also the PLT portion of the GOT as read-only.

#### Performance implications

Since lazy binding is primarily intended to speed up application startup times by spreading out the symbol resolution operations throughout the lifetime of the application enabling full RELRO can increase the startup time for applications with large numbers of dynamic dependencies. Performance impact scales with number of dynamically linked functions.

#### When not to use?

Applications that are sensitive to the performance impact on startup time should consider whether the increase in startup time caused by full RELRO impacts the user experience. As an alternative, developers can consider statically linking large library dependencies to the application executable

Static linking avoids the need for dynamic symbol resolution altogether but can make it more difficult to deploy patches to dependencies compared upgrading shared library. Developers need to consider whether static linking is discouraged in their deployment scenarios, e.g., major Linux distributions generally forbid static linking of shared application dependencies.

---

### Build as position-independent code

| Compiler Flag                                  |            Supported since            | Description                               |
|:---------------------------------------------- |:----------------------------------:|:----------------------------------------- |
| <span id="-fPIE_-pie">`-fPIE -pie`</span>      |   Binutils 2.16<br/>Clang 5.0.0    | Build as position-independent executable. |
| <span id="-fPIC_-shared">`-fPIC -shared`</span> | < Binutils 2.6<br/>Clang 5.0.0[^1] | Build as position-independent code.       |

#### Synopsis

Position-independent code (PIC) and executables (PIE) are machine code objects that execute properly regardless of the exact address at which they are loaded at in process memory.

GNU/Linux requires program executable to be built as PIE in order to benefit from address-space layout randomization (ASLR). ASLR is the primary means of mitigating code-reuse exploits, e.g., *return-to-libc* and *return-oriented programming* in modern GNU/Linux distributions. In code-reuse exploits the adversary corrupts vulnerable code pointers, such as return addresses stored on the program stack and makes them refer to pre-existing executable code in program memory. ASLR randomizes the location of shared libraries and the program executable every time the object is loaded into memory to make memory addresses useful in exploits harder to predict.

#### Performance implications

Negligible on 64-bit architectures.

On 32-bit x86 PIC exhibits moderate performance penalties (5-10%)[^7]. This is due to data accesses using mov instructions on 32-bit x86 only support absolute addresses. To make the code position-independent memory references are transformed to lookup memory addresses from a global offset table (GOT) populated at load-time with the correct addresses to program data. Consequently, data references require an additional memory load compared to non-PIC code on 32-bit x86. However, the main reason for the performance penalty is the increased register pressure resulting from keeping the lookup address to the GOT available in a register[^8].

The x86_64 architecture supports mov instructions that address memory using offsets relative to the instruction pointer (i.e., the address of the currently executing instruction). This is referred to as RIP addressing. PIC on x86_64 uses RIP addressing for accessing the GOT which relieves the register pressure associated with PIC on 32-bit x86 and results in a smaller impact on performance. Shared libraries are created PIC on x86_64 by default[^9].

#### When not to use?

Resource-constrained embedded systems may save memory by *prelinking* executables at compile time. Prelinking performs some relocation decisions, normally made by the dynamic linker, ahead of time. As a result, fewer relocations need to be performed by the dynamic linker, reducing startup time and memory consumption for applications. PIE does not prevent prelinking but enabling ASLR on prelinked binaries overrides the compile-time decisions, thus nullifying the run-time memory savings gained by prelinking. If the memory savings gained by prelinking are important for a system PIE can be enabled for a subset of executables that are at higher risk, e.g., applications that process untrusted external input.

[^7]: Security Features (Ubuntu Wiki). Built as PIE.
<https://wiki.ubuntu.com/Security/Features#pie>

[^8]: Bendersky, Eli. Position Independent Code (PIC) in shared libraries.
 <https://eli.thegreenplace.net/2011/11/03/position-independent-code-pic-in-shared-libraries/>

[^9]: Bendersky, Eli. Position Independent Code (PIC) in shared libraries on x64.
<https://eli.thegreenplace.net/2011/11/11/position-independent-code-pic-in-shared-libraries-on-x64>

---

## Discouraged Compiler Options

This section describes discouraged compiler and linker option flags that may lead to potential defects with security implications in produced binaries.

Table 3: List of discouraged compiler and linker options.

| Compiler Flag                   | Supported since  | Description                                                       |
|:------------------------------- |:-------------:|:----------------------------------------------------------------- |
| `-Wl,-rpath,`*`path_to_so`*<br/><br/>`-Wl,-rpath,`*`path_to_so`*<br/>`-Wl,--enable-new-dtags` | Binutils | Hard-code run-time search paths in executable files or libraries |

---

### Hard-code run-time search paths in executable files or libraries

| Compiler Flag                   | Supported since  | Description                                                       |
|:------------------------------- |:-------------:|:----------------------------------------------------------------- |
| `-Wl,-rpath,`*`path_to_so`*<br/><br/>`-Wl,-rpath,`*`path_to_so`*<br/>`-Wl,--enable-new-dtags` | Binutils | Hard-code run-time search paths in executable files or libraries |

#### Synopsis

The `-rpath` option records the specified path to a shared object files to the `DT_RPATH` or `DT_RUNPATH` header value in the produced ELF binary. The recorded rpath may override or supplement the system default search path used by the dynamic linker to find the specified library dependency the executable or library requires.

The rpath provided by the original (and default) `DT_RPATH` entry takes precedence over environmental overrides such as `LD_LIBRARY_PATH` and one object’s `DT_RPATH` can be used for resolving dependencies of another object. These were design errors rectified with the introduction of `DT_RUNPATH` value which has a lower precedence with respect to `LD_LIBRARY_PATH` and only affect the search path of an object’s own, immediate dependencies[^10].

Setting rpath in release binaries (irrespective of whether `DT_RPATH` or `DT_RUNPATH` is used) is an unsafe programming practice and may under certain conditions lead to security vulnerabilities. For instance, an attacker may be able to supply their own shared files in directories where rpath is pointing to, thereby overriding those libraries that would be supplied by the operating system. This could occur as a result of setting a relative rpath (i.e. `foo.so` rather than `/usr/lib/foo.so`) in environments where an attacker can control the working directory, and point it to a directory where they can place a malicious dependency.

The keyword `$ORIGIN` in rpath is expanded (by the dynamic loader) to be path of the directory where the object is found. Attackers who can control the location of the object with a rpath set (e.g., via hard links) can manipulate the `$ORIGIN` to point to a directory which they can control.

Setting rpath in setuid/setgid programs can lead to privilege escalation under conditions where untrusted libraries loaded via a set rpath are executed as part of the privileged program. While setuid/setgid binaries ignore environmental overrides to search path (such as `LD_PRELOAD`, `LD_LIBRARY_PATH` etc.) rpath within such binaries can provide an attacker with equivalent capabilities to manipulate the dependency search paths.

[^10]: Kerrisk, Michael. Building and Using Shared Libraries on Linux, Shared Libraries: The Dynamic Linker.
<https://man7.org/training/download/shlib_dynlinker_slides.pdf>

---

## Sanitizers

Sanitizers are a suite of compiler-based tools designed to detect and pinpoint memory- safety issues and other defects in applications written in C and C++. They provide similar capabilities as dynamic analysis tools built on frameworks such as Valgrind. However, unlike Valgrind, sanitizers leverage compile-time instrumentation to intercept and monitor memory accesses. This allows sanitizers to be more efficient and accurate compared to dynamic analyzers. On average, Sanitizers impose a 2× to 4× slowdown in instrumented binaries, whereas dynamic instrumentation can exhibit slowdowns as large as 20× to 50×[^11]. As a tradeoff, sanitizers must be enabled at compile time whereas Valgrind can be used with unmodified binaries. Table 4 lists sanitizer options supported by GCC and Clang.

While more efficient compared to dynamic analysis, sanitizers are still prohibitively expensive in terms of performance penalty and memory overhead to be used with Release builds, but excel at providing memory diagnostics in Debug, and in certain cases Test builds. For example, fuzz testing (or “fuzzing”) is a common security assurance activity designed to identify conditions that trigger memory-related bugs. Fuzzing is primarily useful for identifying memory errors that lead to application crashes. However, if fuzz testing is performed in binaries equipped with sanitizer functionality it is possible to also identify bugs which do not crash the application. Another benefit is the enhanced diagnostics information produced by sanitizers.

As with all testing practices, sanitizers cannot absolutely prove the absence of bugs. However, when used appropriately and regularly they can help in identifying latent memory, concurrency, and undefined behavior-related bugs which may be difficult to pinpoint.

Table 4: Sanitizer options in GCC and Clang.

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=address`   | GCC 4.8<br/>Clang 3.1 | Enables AddressSanitizer to detect memory errors at run-time                |
| `-fsanitize=thread`    | GCC 4.8<br/>Clang 3.2 | Enables ThreadSanitizer to detect data race bugs at run time                |
| `-fsanitize=leak`      | GCC 4.8<br/>Clang 3.1 | Enables LeakSanitizer to detect memory leaks at run time                    |
| `-fsanitize=undefined` |   GCC 4.9<br/>Clang 3.3   | Enables UndefinedBehaviorSanitizer to detect undefined behavior at run time |

[^11]:: Kratochvil, Jan. Memory error checking in C and C++: Comparing Sanitizers and Valgrind (Red hat Developers).
<https://developers.redhat.com/blog/2021/05/05/memory-error-checking-in-c-and-c-comparing-sanitizers-and-valgrind>

---

### AddressSanitizer

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=address`   | GCC 4.8<br/>Clang 3.1 | Enables AddressSanitizer to detect memory errors at run-time                || `-fsanitize=thread`    | GCC 4.8<br/>Clang 3.2 | Enables ThreadSanitizer to detect data race bugs at run time                |

AddressSanitizer (ASan) is a memory error detector that can identify memory defects that involve:

- Buffer overflows in the stack, on the heap, and in global variables
- Use-after-free conditions (dereference of dangling pointers)
- Use-after-return (use of stack memory reserved for locals after return from function)
- Use-after-scope conditions (use of stack address outside the lexical scope of variable)
- Initialization order bugs
- Memory leaks (see also LeakSanitizer in Section 0)

To enable ASan add `-fsanitize=address` to the compiler flags (`CFLAGS` for C, `CXXFLAGS` for C++) and linker flags (`LDFLAGS`). Consider combining ASan with the following compiler flags:

- `-O1` (disables inlining and improves stack traces, higher levels improve performance)
- `-g` (to display source file names and line numbers in the produced error messages)
- `-fno-omit-frame-pointer` (to further improve stack traces)
- `-fno-optimize-sibling-calls` (disable tail call optimizations)
- `-fno-common` (disable common symbols to improve tracking of globals)

The run-time behavior of ASan can be influenced using the `ASAN_OPTIONS` environment variable. The run-time options can be used enable additional memory error checks and to tweak ASan performance. An up-to-date list of supported options are available on the AddressSanitizerFlags article on the project's GitHub Wiki[^12]. If set to `ASAN_OPTIONS=help=1` the available options are shown at startup of the instrumented program. This is particularly useful for determining which options are supported by the specific version ASan integrated to the compiler being used. A useful pre-set to enable more aggressive diagnostics compared to the default behavior is given below:

 ASAN_OPTIONS=strict_string_checks=1:detect_stack_use_after_return=1: \
 check_initialization_order=1:strict_init_order=1 ./instrumented-executable

When ASan encounters a memory error it (by default) terminates the application and prints an error message and stack trace describing the nature and location of the detected error. A systematic description of the different error types and the corresponding root causes reported by ASan can be found in the AddressSanitizer article on the project's GitHub Wiki[^13].

ASan cannot be used simultaneously with ThreadSanitizer or LeakSanitizer. It is not possible to mix ASan-instrumented code produced by GCC with ASan-instrumented code produced Clang as the ASan implementations in GCC and Clang are mutually incompatible.

[^12]: AddressSanitizerFlags (GitHub google/sanitizers Wiki).
<https://github.com/google/sanitizers/wiki/AddressSanitizerFlags>

[^13]: AddressSanitizer (GitHub google/sanitizers Wiki).
<https://github.com/google/sanitizers/wiki/AddressSanitizer>

---

### ThreadSanitizer

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=thread`    | GCC 4.8<br/>Clang 3.2 | Enables ThreadSanitizer to detect data race bugs at run time                |

ThreadSanitizer (TSan) is a data race detector for C/C++. Data races occur when two (or more) threads of the same process access the same memory location concurrently and without synchronization. If at least one of the accesses is a write the application risks entering an inconsistent internal state. If two or more threads attempt to write to the memory location simultaneously a data race may cause memory corruption. Data races are notoriously difficult to debug since the order of accesses is typically non-deterministic and dependent on the precise timing of events in the offending threads.

To enable TSan add `-fsanitize=thread` to the compiler flags (`CFLAGS` for C, `CXXFLAGS` for C++) and linker flags (`LDFLAGS`). Consider combining TSan with the following compiler flags:

- `-O2` (or higher for reasonable performance)
- `-g` (to display source file names and line numbers in the produced warning messages)

The run-time behavior of TSan can be influenced using the `TSAN_OPTIONS` environment variable. An up-to-date list of supported options are available on the ThreadSanitizerFlags article on the project's GitHub Wiki[^14]. If set to `TSAN_OPTIONS=help=1` the available options are shown at startup of the instrumented program.

When TSan encounters a potential data race it (by default) reports the race by printing a warning message with a description of the program state that lead to the data race. A detailed description of the report format can be found in the ThreadSanitizerReportFormat article on the project's Github Wiki[^15].

TSan cannot be used simultaneously with AddressSanitizer (ASan) or LeakSanitizer (LSan). It is not possible to mix TSan-instrumented code produced by GCC with TSan-instrumented code produced Clang as the TSan implementations in GCC and Clang are mutually incompatible. TSan generally requires all code to be compiled with `-fsanitize=thread` to operate correctly.

[^14]: ThreadSanitizerFlags (GitHub google/sanitizers Wiki).
<https://github.com/google/sanitizers/wiki/ThreadSanitizerFlags>

[^15]: ThreadSanitizerReportFormat (GitHub google/sanitizers Wiki).

---

### LeakSanitizer

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=leak`      | GCC 4.8<br/>Clang 3.1 | Enables LeakSanitizer to detect memory leaks at run time                    |

LeakSanitizer (LSan) is a stand-alone version of the memory leak detection built into ASan. It allows analysis of memory leaks without the associated slowdown introduced by ASan. Unlike ASan, LSan does not require compile-time instrumentation, but consists only of a runtime library. The `-fsanitize=leak` option instructs the linker to link the application executable against the LSan library which overrides `malloc()` and other allocator functions.

The run-time behavior of LSan can be influenced using the `LSAN_OPTIONS` environment variable. If set to `LSAN_OPTIONS=help=1` the available options are shown at startup of the program.

LSan cannot be used simultaneously with AddressSanitizer (ASan) or ThreadSanitizer (TSan). If either ASan or TSan is enabled during the build the `-fsanitize=leak` option is ignored by the linker.

---

### UndefinedBehaviorSanitizer

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=undefined`<br/>(requires `-O1` or higher) |   GCC 4.9<br/>Clang 3.3   | Enables UndefinedBehaviorSanitizer to detect undefined behavior at run time |

UndefinedBehaviorSanitizer (UBSan) is a detector of non-portable or erroneous program constructs which cause behavior which is not clearly defined in the ISO C standard. UBSan provides a large number of sub-options to enable / disable individual checks for different classes of undefined behavior. Consult the GCC[^16] and Clang[^17] documentation respectively for up-to-date information on supported sub-options.

To enable UBSan add `-fsanitize=undefined` to the compiler flags (`CFLAGS` for C, `CXXFLAGS` for C++) and linker flags (`LDFLAGS`) together with any desired sub-options. Consider combining TSan with the following compiler flags:

- `-O1` (required or higher for reasonable performance)
- `-g` (to display source file names and line numbers in the produced warning messages)

The run-time behavior of UBSan can be influenced using the `UBSAN_OPTIONS` environment variable. If set to `UBSAN_OPTIONS=help=1` the available options are shown at startup of the instrumented program.

[^16]: Using the GNU Compiler Collection (GCC). 3.12 Program Instrumentation Options.
<https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html#Instrumentation-Options>

[^17]: Clang documentation. UndefinedBehaviorSanitizer.
<https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html>

---

## Maintaining debug information in separate files

An application’s debugging information can be placed in a debug info file separate from the application’s executable. This allows the executable to be shipped stripped of debug information while still allowing a debugger to obtain the debugging information from the debug info files when problems in the release executable are being diagnosed. Both the GNU Debugger (GDB) and LLVM Debugger (LLDB) allows debug information for stripped binaries to be loaded from separate debug info files.

There are several reasons why developers may wish to separate the debug information from the executable:

- Avoid inadvertently revealing sensitive implementation details about the application. The availability of symbol information makes binary analysis and reverse engineering of the application’s executable easier.
- Debug information can be very large – in some cases even larger than the executable code itself! For this reason, most Linux distributions distribute debug information for application packages in separate debug info files

The following series of commands needed to the generate the debug info file, strip the debugging information from the main executable, and to add the debug link section.

 objcopy --only-keep-debug executable_file executable_file.debug
 objcopy --strip-unneeded executable_file  
 objcopy --add-gnu-debuglink=executable_file.debug executable_file

### Debug information in the ELF binary format

In ELF binaries debug and symbol information are stored in discrete ELF sections unless separate debug info files are created. Table 5 shows the ELF sections which normally contain debug, symbol or other auxiliary information.

| Elf Section | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| `.debug`    | Symbolic debug information for debuggers (typically in DWARF format[^18]) |
| `.comment`  | GCC version information                                                   |
| `.dynstr`   | Strings needed for dynamic symbol name lookup via .dynsym                 |
| `.dynsym`   | Dynamic symbol lookup table used for run-time relocations                 |
| `.note`     | Auxiliary metadata, e.g, ABI tags[^19] and Build ID[^20]                  |
| `.strtab`   | Strings representing names in `.symtab`                                   |
| `.symtab`   | Global symbol table used for symbol name lookup by debuggers              |

Whether a particular section is present or absent in an ELF binary indicates what type of information is available. The availability of symbol information makes binary analysis easier as debuggers, disassemblers and binary code analysis tools, such as Ghidra[^21] and IDA Pro[^21], can use available symbol information to automatically annotate decompiled machine code. Similarly, the availability of debug information makes dynamic analysis of the application in a debugger easier. Stripping unnecessary debug and symbol information from the binary does not make it impervious against reverse engineering, however it does considerably increase the cost and manual effort required for successful exploitation.

[^18]: DWARF Debugging Information Format Version 4.
<https://sourceware.org/binutils/docs/ld/Options.html#Options>

[^19]: Linux Standard Base Core Specification, Generic Part. Chapter 10.8. ABI note tag.
<https://refspecs.linuxfoundation.org/LSB_5.0.0/LSB-Core-generic/LSB-Core-generic/noteabitag.html>

[^20]: LD Options.
<https://sourceware.org/binutils/docs/ld/Options.html#Options>

[^21]: Ghidra homepage.
 <https://ghidra-sre.org>
<https://www.hex-rays.com/products/ida>

### Creating debug info files

The debug info files are ordinary executables with an identical section layout as the application’s original executable, but without the executable’s data. The debug info file is

created by compiling the application executable with the desired debug information included, then processing the executable with the `objcopy` utility to produce the stripped executable (without debugging information) and the debug info file (without executable data). Both GNU binutils `objcopy`[^23] and LLVM `llvm-objcopy`[^24] support the same options for stripping debug information and creating the debug info file. The shell snippet below shows the `objcopy` invocation for creating a debug info file from an executable with debug information.

 objcopy --only-keep-debug executable_file executable_file.debug

There are no particular requirements for the debug link filename, although a common convention is to name debug info for an executable , e.g., “executable.debug”. While the debug info file can have the same name as the executable it is preferred to use an extension such as “.debug” as it means that the debug info file can be placed in the same directory as the executable.

Debug info files allows the binary to be analyzed in the same way as the original binary with debug and symbol information intact. They should be handled with care and not exposed in computing environments where they may be obtained by adversaries.

[^23]: objcopy (GNU Binary Utilities).
<https://sourceware.org/binutils/docs/binutils/objcopy.html>

[^24]: llvm-objcopy - object copying and editing tool.
<https://llvm.org/docs/CommandGuide/llvm-objcopy.html>

### Strip debug and symbol information

Once the debug info file has been created the debug and symbol information can be stripped from the original binary using either the `objcopy` or `strip`[^25] utilities provided by Binutils, or the `llvm-objcopy` or `llvm-strip`[^26] equivalents provided by LLVM. The shell snippets below show how the debug and unneeded symbol information can removed from an executable using `objcopy` and `strip` respectively. If code signing is enforced on the application binaries the debug and symbol information must be stripped away before the binaries are signed.

 strip --strip-unneeded executable_file

 objcopy --strip-unneeded executable_file

The `--strip-unneeded` option in `objcopy` and will remove all symbol information (ELF `.symtab` and `.strtab` sections) from the binary that is not needed for processing relocations. In addition, it will trigger the removal of any symbolic debug information from the binary (ELF `.debug` sections and all sections with the `.debug` prefix).

Removing symbol information used for relocations is discouraged as it may interfere with resolving dynamically linked symbols (ELF `.dynsym` and `.dynstr` sections) and Address Space Layout Randomization (ASLR) at run-time. As a result, it should be expected that debuggers and binary analysis will be able to resolve calls to dynamically linked functions to the correct symbol information. Static linking can be considered as an alternative where applicable to avoid dynamically linked symbols to remain visible in resulting binaries.

**Stripping additional sections**

Note that `--strip-unneeded` only discards standard ELF sections as unneeded. Since an ELF binary can have any number of additional sections which are unknown to `objcopy` and strip they cannot determine whether such unrecognized sections are safe to remove. This includes for example the .comment section added by GCC.  The shell snippets below show how non-standard sections, such as .comment can be removed in addition to the unneeded sections identified by `--strip-unneeded`. If the application includes custom, application-specific ELF sections with possible sensitive diagnostics information or metadata which is not required at run-time during normal operations developers may wish to strip such additional sections from release binaries.

 objcopy --strip-unneeded --remove-section=.comment executable_file

 strip --strip-unneeded --remove-section=.comment executable_file

[^25]: strip (GNU binary Utilities
<https://sourceware.org/binutils/docs/binutils/strip.html>

[^26]: llvm-strip - object stripping tool
<https://llvm.org/docs/CommandGuide/llvm-strip.html>

### Add a debug link to the binary

To allow the debugger to identify the correct debug information the executable must be associated with its corresponding debug info file. This can be done in two ways:

- Include a “debug link” within the executable that specifies the name of the corresponding debug info file.
- Include a “build ID”, a unique bit string, within the executable from which the debug info file’s name can be derived.

In most cases the debug link is preferrable as it allows the developers to name the debug info file and verifies a checksum over the debug information files content before the symbol information is sourced from the file during debugging.

**Debug link**

A debug link is a special section (`.gnu_debuglink`) in the executable file that contains the name of the corresponding debug info file and a 32-bit cyclic redundancy checksum (CRC) computed over the debug info file’s full contents. Any executable file format can carry debug link information as long is can contain a section named `.gnu_debuglink`. The shell snippet below shows how a debug link can be added to an executable using `objcopy` (or `llvm-objcopy`).

 objcopy --add-gnu-debuglink=executable_file.debug executable_file

If the debug information file is built in one location but is going to be later installed at a different location the `--add-gnu-debuglink` option should be used with the path to the built debug information file. The debug info file must exist at the specified path as it is required for the CRC calculation which allows the debugger to validate that the debug info file it loads matches that of the executable.

Note that `.gnu_debuglink` does not contain the full pathname to the debug info; only a filename with the leading directory components removed. GDB looks for the debug info file with the specified filename in a series of search directories starting from the directory where the executable is placed. For a complete list of search paths refer to the GDB documentation[^27].

[^27]: : Debugging Information in Separate Files (Debugging with GDB).
<https://sourceware.org/gdb/onlinedocs/gdb/Separate-Debug-Files.html>

**Build ID**

A build ID is a unique bit string stored in `.note.gnu.build-id` of the ELF .note section that is (statistically) unique to the binary file. A debugger can use the build ID to identify the corresponding debug info file if the same build ID is also present in the debug info file.

If the build ID method is used the debug info file’s name is computed from the build ID. GDB searches the global debug directories (typically /usr/lib/debug) for a .build- id/xx/yyyy.debug file, where xx are the first two hex characters of the build ID and yyyy are the rest of the build ID bit string in hex (actual build ID strings are 32 or more hex characters).

Note that the build ID does not act as a checksum for the executable or debug info file. For more information on the build ID feature please refer to the GDB[^23] and GNU linker[^20] documentation.

## Contributors

- Thomas Nyman, Ericsson
- Robert Byrne, Ericsson
- Jussi Auvinen, Ericsson

## License

Copyright 2023, OpenSSF contributors, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Appendix: List of Considered Compiler Options

Many more security-relevant compiler options exist than are recommended in this guide. Some of these have been considered for inclusion, but for various reasons have, in-the-end been excluded from the set of recommended options. The following table lists options that have been reviewed and the rationale for their exclusion. While they are not in the recommended list, you may find them useful for your purposes.

| Compiler Flag | Supported since  | Rationale |
|---------------|------------------|-----------|
| <span id="-Wl,-z,nodump">`-Wl,-z,nodump`</span>         | Binutils 2.10 | Single-purpose feature for Solaris compatibility[^nodump].
| <span id="-Wl,-z,noexecheap">`-Wl,-z,noexecheap`</span> | Binutils 2.15 (Hardened Gentoo / PaX only ) | Hardened Gentoo / PaX specific Binutils extension[^noexecheap], not present in upstream toolchains.

[^nodump]: The `-Wl,-z,nodump` option sets `DF_1_NODUMP` flag in the object’s `.dynamic` section tags. On Solaris this restricts calls to `dldump(3)` for the object. However, other operating systems ignore the `DF_1_NODUMP` flag. While Binutils implements `-Wl,-z,nodump` for Solaris compatibility a choice was made to not support it in `lld` ([D52096 lld: add -z nodump support](https://reviews.llvm.org/D52096)).

[^noexecheap]: The `-Wl,-z,noexecheap` option is a [Hardened Gentoo](https://wiki.gentoo.org/wiki/Hardened/PaX_Quickstart) extension to Binutils ported from [PaX](https://pax.grsecurity.net/). PaX is a patch to the Linux kernel and Binutils that adds a `PT_PAX_FLAGS` program header to ELF objects that stores memory protection information the PaX kernel can enforce. The protection information stored in `PT_PAX_FLAGS` will not benefit software running on systems without a PaX kernel. The Gentoo patch (`63_all_binutils-`*\<version\>*`-pt-pax-flags-`*\<date\>*`.patch`) for various versions of Binutils since 2.15 can be found at [https://dev.gentoo.org/~vapier/dist/](https://dev.gentoo.org/~vapier/dist/).

## References
