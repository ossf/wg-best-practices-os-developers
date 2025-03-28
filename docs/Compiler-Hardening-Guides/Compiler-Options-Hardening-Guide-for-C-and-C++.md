# Compiler Options Hardening Guide for C and C++

*by the [Open Source Security Foundation (OpenSSF)](https://openssf.org) [Best Practices Working Group](https://best.openssf.org/), 2025-03-28*

This document is a guide for compiler and linker options that contribute to delivering reliable and secure code using native (or cross) toolchains for C and C++. The objective of compiler options hardening is to produce application binaries (executables) with security mechanisms against potential attacks and/or misbehavior.

Hardened compiler options should also produce applications that integrate well with existing platform security features in modern operating systems (OSs). Effectively configuring the compiler options also has several benefits during development such as enhanced compiler warnings, static analysis, and debug instrumentation.

This document is intended for:

- Those who write C or C++ code, to help them ensure that resulting code will work with hardened options, including for embedded devices, Internet of Things devices, smartphones, and personal computers.
- Those who build C or C++ code for use in production environments, including Linux distributions, device makers, and those who compile C or C++ for their local environment.

This document focuses on recommended options for the GNU Compiler Collection (GCC) and Clang/LLVM, and we expect the recommendations to be applicable to other compilers based on GCC and Clang technology[^gcc-clang-compilers]. In the future, we aim to expand to guide to also cover other compilers, such as Microsoft MSVC.

[^gcc-clang-compilers]: Such as the Intel C/C++ Compiler, the Arm Compiler for Embedded, the Apple Clang compiler included in Xcode, IBM Open XL C/C++ Compiler, the Red Hat Developer Toolset, the Siemens Sourcery Toolchain, and AdaCore GNAT Pro Enterprise.

## TL;DR: What compiler options should I use?

When compiling C or C++ code on compilers such as GCC and clang, turn on these flags in all cases for detecting vulnerabilities at compile time and enable run-time protection mechanisms:

~~~sh
-O2 -Wall -Wformat -Wformat=2 -Wconversion -Wimplicit-fallthrough \
-Werror=format-security \
-U_FORTIFY_SOURCE -D_FORTIFY_SOURCE=3 \
-D_GLIBCXX_ASSERTIONS \
-fstrict-flex-arrays=3 \
-fstack-clash-protection -fstack-protector-strong \
-Wl,-z,nodlopen -Wl,-z,noexecstack \
-Wl,-z,relro -Wl,-z,now \
-Wl,--as-needed -Wl,--no-copy-dt-needed-entries
~~~

**In addition**, when compiling code in any of the situations in the below table, **add** the corresponding additional options:

| When                                                    | Additional options flags                                                                                 |
|:------------------------------------------------------- |:---------------------------------------------------------------------------------------------------------|
| using GCC                                               | `-Wtrampolines`                                                                                          |
| using GCC and only left-to-right writing in source code | `-Wbidi-chars=any`                                                                                       |
| for executables                                         | `-fPIE -pie`                                                                                             |
| for shared libraries                                    | `-fPIC -shared`                                                                                          |
| for x86_64                                              | `-fcf-protection=full`                                                                                   |
| for aarch64                                             | `-mbranch-protection=standard`                                                                           |
| for production code                                     | `-fno-delete-null-pointer-checks -fno-strict-overflow -fno-strict-aliasing -ftrivial-auto-var-init=zero` |
| for treating obsolete C constructs as errors            | `-Werror=implicit -Werror=incompatible-pointer-types -Werror=int-conversion`                             |
| for multi-threaded C code using GNU C library pthreads  | `-fexceptions`                                                                                           |
| during development but *not* when distributing source   | `-Werror`                                                                                                |

Note that support for some options may differ between different compilers, e.g. support for [`-D_FORTIFY_SOURCE`](#-D_FORTIFY_SOURCE=3) varies depending on the compiler[^Guelton20] and C standard library implementations. See the discussion below for [background](#background) and for [detailed discussion of each option](#recommended-compiler-options).

We recommend developers to additionally use a blanket [`-Werror`](#-Werror) to treat all warnings as errors during development. However, `-Werror` should **not** be used in this blanket form when **distributing** source code, as this use of `-Werror` creates a dependency on specific toolchain vendors and versions. The selective form[`-Werror=`*`<warning-flag>`*](#-Werror-flag) that promotes specific warnings as error in cases that should never occur in the code can be used both during development and when distributing sources. For example, we encourage developers to promote warnings regarding obsolete C constructs removed by the 1999 C standard to errors (see the "for disabling obsolete C constructs" in the above table). These options often cannot be added by those who independently build the software, because the options may require non-trivial changes to the source code.

In this guide, we use the term *production code* for executable code intended for use in the real world with real effects; it should be maximally reliable and performant. We use the term *instrumented test code* for executable code that is instrumented to improve defect detection and debuggability, and as such, often crashes more and is slower. Test processes should use both instrumented test code and production code.

Developers should ensure that both their production code and their instrumented test code pass their automated test suite with all their relevant options. We encourage developers to consider it a bug if the program cannot be compiled with these options. Those who build production code may choose to omit some hardening options that hurt performance if the program only processes trusted data, but remember that it's not helpful to deploy programs that that are insecure and rapidly do the wrong thing. Existing programs may need to be modified over time to work with some of these options.

## Background

### Why do we need compiler options hardening?

Sadly, attackers today attack the software we use every day. Many programming languages' compilers have options to detect potential vulnerabilities while compiling and/or insert runtime protections against potential attacks. These can be important in any language, but these options are *especially* important in C and C++.

Applications written in the C and C++ programming languages are prone to exhibit a class of software defects known as memory safety errors, a.k.a. memory errors. This class of defects include bugs such as buffer overflows, dereferencing a null pointer, and use-after-free errors. Memory errors can occur because the low-level memory management in C and C++ offers no language-level provisions for ensuring the memory safety of operations such as pointer arithmetic or direct memory accesses. Instead, they require software developers to write correct code when performing common operations, and this has proven to be difficult at scale. Memory errors have the potential to cause memory vulnerabilities, which can be exploited by threat actors to gain unauthorized access to computer systems through run-time attacks. Microsoft has found that 70% of all its security defects in 2006-2018 were memory safety failures[^Cimpanu2019], and the Chrome team similarly found 70% of all its vulnerabilities are memory safety issues.[^Cimpanu2020]

[^Cimpanu2019]: Cimpanu, Catalin, [Microsoft: 70 percent of all security bugs are memory safety issues](https://www.zdnet.com/article/microsoft-70-percent-of-all-security-bugs-are-memory-safety-issues/), ZDNet, 2019-02-11

[^Cimpanu2020]: Cimpanu, Catalin, [Chrome: 70% of all security bugs are memory safety issues](https://www.zdnet.com/article/chrome-70-of-all-security-bugs-are-memory-safety-issues/), ZDNet, 2020-05-22

Most high-level programming languages are *"memory safe"* and prevent such defects by default. Many of these languages allow programs to temporarily suspend memory-safety protections in special circumstances, such as when calling into operating system APIs written in C, but such suspensions are intended to be limited for a few lines of code, not for the whole program. There have been calls to rewrite C and C++ programs in memory-safe languages. This has happened in some cases[^Prossimo2024]; however, such rewriting is expensive and time-consuming, has its own risks, and is sometimes impractical today, especially for uncommon CPUs. Even if universally agreed upon, rewriting all C and C++ code would take decades and incur massive monetary costs. One rough estimate of such rewrites puts the cost at $2.4 trillion US dollars[^Wheeler2024], which would make rewriting C and C++ a problem of similar scale (in terms of monetary investment required) as keeping global climate change goals within reach[^Volcovici2024]. Consequently, not all C and C++ can be revised or discarded[^Claburn2024]. For example, Google anticipates *"a residual amount of mature and stable memory-unsafe code will remain for the foreseeable future"*[^Rebert2024].

[^Claburn2024]: Claburn, Thomas, [Google's memory safety plan includes rehab for unsafe languages: Large C and C++ codebases will be around for the 'foreseeable future'](https://www.theregister.com/2024/10/16/google_legacy_code/), The Register, 2024-10-16.

[^Prossimo2024]: Internet Security Research Group, [Prossimo](https://www.memorysafety.org/), Prossimo project homepage. 2024-10-22.

[^Rebert2024]: Rebert, Alex; Carruth, Chandler; Engel, Jen, and Qin, Andy, [Safer with Google: Advancing Memory Safety](https://security.googleblog.com/2024/10/safer-with-google-advancing-memory.html), Google Security Blog, 2024-10-15.

[^Volcovici2024]: Volcovici, Valerie, [UN climate chief calls for $2.4 trillion in climate finance](https://www.reuters.com/sustainability/sustainable-finance-reporting/un-climate-chief-calls-24-trillion-climate-finance-2024-02-02/), Reuters, 2024-02-02.

[^Wheeler2024]: Wheeler, David A., [Improving Memory Safety without a Trillion Dollars](https://docs.google.com/presentation/d/1EDQL-6MUKrqbILBtYjpiF96uW5LXcnIuE-HxzyCIr68/edit), 2024.

Consequently, it's important to accept that C and C++ will continue to be used, and to take *other* steps to reduce risks. To reduce risk, we must reduce the likelihood of defects becoming vulnerabilities, or reduce the impact of such defects. Aggressive use of compiler options can sometimes detect vulnerabilities or help counter their run-time effects.

Run-time attacks differ from conventional malware, which carries out its malicious program actions through a dedicated program executable, in that run-time attacks influence benign programs to behave maliciously. A run-time attack that exploits unmitigated memory vulnerabilities can be leveraged by threat actors as the initial attack vectors that allow them to gain a presence on a system, e.g., by injecting malicious code into running programs.

Modern, security-aware C and C++ software development practices, e.g., secure coding standards such as SEI CERT C[^CMU2016C] and C++[^CMU2016CPP], and program analysis aim to proactively avoid introducing memory errors (and other software defects) to applications. However, in practice completely eradicating memory errors in production C and C++ software has turned out to be near-impossible.

[^CMU2016C]: Carnegie Mellon University (CMU), [SEI CERT C Coding Standard Rules for Developing Safe, Reliable, and Secure Systems, 2016 edition](https://resources.sei.cmu.edu/library/asset-view.cfm?assetID=454220), June 2016.

[^CMU2016CPP]: Carnegie Mellon University (CMU), [SEI CERT C++ Coding Standard Rules for Developing Safe, Reliable, and Secure Systems, 2016 edition](https://resources.sei.cmu.edu/library/asset-view.cfm?assetID=494932), March 2017.

Consequently, modern operating systems (including their C and C++ compilers along with their run-time infrastructure) deploy various run-time mechanisms to protect against potential security flaws. The principal purpose of such mechanisms is to mitigate potentially exploitable memory vulnerabilities in a way that prevents a threat actor from exploiting them to gain code execution capabilities. With mitigations in place the affected application may still crash if a memory error is triggered. However, such an outcome is still preferable if the alternative is the compromise of the system’s run-time environment.

When used, these run-time mechanisms *can* prevent attacks, reduce their likelihood, or reduce their impact. [^Esler2025]

[^Esler2025]: Esler, Mark, 2025-03-19, [Mitigating a rsync Vulnerability: A Lesson in Compiler Hardening](https://www.chainguard.dev/unchained/mitigating-a-rsync-vulnerability-a-lesson-in-compiler-hardening), *Chainguard Unchained Security Blog*

To benefit from the protection mechanism provided by the OS the application binaries must be prepared at build time to be compatible with the mitigations. Typically, this means enabling specific option flags for the compiler or linker when the software is built.

Some mechanisms may require additional configuration and fine tuning, for example due to potential compilation issues for certain unlikely edge cases, or performance overhead the mitigation adds for certain program constructs. Some compiler security features depend on data flow analysis of programs and heuristics, results of which may vary depending on program source code details. As a result, the protection mechanisms implemented by these features may not always provide full coverage.

These problems are exacerbated in projects that rely on an outdated version of an open source software (OSS) compiler. In general, security mitigations are more likely to be enabled by default in modern versions of compilers included with Linux distributions. Note that the defaults used by the upstream GCC project do not enable some of these mitigations.

If compiler options hardening is overlooked or neglected during build time it can become impossible to add hardening to already distributed executables. It is therefore good practice to evaluate which mitigations an application should support, and make conscious, informed decisions whenever not enabling a mitigation weakens the application’s defensive posture. Ensure that the software is *tested* with as many options as practical, to ensure it can be operated that way.

Some organizations require selecting hardening rules. For example, the US government's NIST SP 800-218 practice PW.6 requires configuring "the compilation, interpreter, and build processes to improve executable security" [^NIST-SP-800-218-1-1]. Carnegie Mellon University (CMU)'s "top 10 secure coding practices" recommends compiling "code using the highest warning level available for your compiler and eliminate warnings by modifying the code."[^CMU2018] This guide can help you do that.

[^NIST-SP-800-218-1-1]: US NIST, [Secure Software Development Framework (SSDF) Version 1.1: Recommendations for Mitigating the Risk of Software Vulnerabilities](https://csrc.nist.gov/publications/detail/sp/800-218/final), NIST SP 800-218, February 2018.

[^CMU2018]: Carnegie Mellon University (CMU), [Top 10 Secure Coding Practices](https://wiki.sei.cmu.edu/confluence/display/seccode/Top+10+Secure+Coding+Practices), SEI CERT Coding Standards Wiki, 2018-05-02.

### How should this guide be applied?

How you apply this guide depends on your circumstances:

- New or nearly-new project ("Green field"): If you're starting a new project, enable everything as soon as you can, preferably before any code is written for it. That way, you'll be immediately notified of any problematic constructs and avoid it in the future.
- Existing non-trivial project ("Brown field"): It's usually impractical to enable all options at once. First, the number of warnings will probably be overwhelming. Second, while the run-time protection mechanisms will usually not cause correctly-working programs to fail, it's still possible for them to cause problems (e.g., due to increased binary size). Instead, enable one or a few options at a time, assess their impact, resolve any problems, and repeat over time. Some flags (like [`-Wall`](#-Wall)) are groups of other flags; consider breaking them down and enabling a few of those specific flags at a time.

Applications should work towards compiling warning-free. This takes time, but warnings indicate a potential problem. Once done, any new warning indicates a potential problem.

### What does compiler options hardening not do?

Compiler options hardening is not a silver bullet; it is not sufficient to rely solely on security features and functions to achieve secure software. Security is an emergent property of the entire system that relies on building and integrating all parts properly. However, if properly used, secure compiler options will complement existing processes, such as static and dynamic analysis, secure coding practices, negative test suites, profiling tools, and most importantly: security hygiene as a part of a solid design and architecture.

In most cases hardened compiler options only take effect in code that is compiled with the hardened options. Consequently, most compiler options hardening does not benefit software that has been pre-built before hardened options have been adopted. This is particularly a concern for projects that incorporate pre-built (possibly third-party) libraries or other components. In such cases, it is important to understand what components a project is being linked against, and how they in turn are built, to determine which components benefit from compiler options hardening.

### What is our threat model, goal, and objective?

Our threat model is that all software developers make mistakes, and sometimes those mistakes lead to vulnerabilities. In addition, some malicious developers may intentionally create code that *appears* to be an unintentional vulnerability, or *appears* correct but is intentionally deceiving to reviewers (aka underhanded code[^Wheeler2020]).

Our primary goal is to counter vulnerabilities that *appear* to be unintentional (whether or not they're intentional). Our secondary goal is to counter malicious code where its source code's appearance is designed to deceive reviewers.

Many vulnerabilities are caused by common mistakes. Therefore, when implementing these goals, much of our focus is on detecting and countering *common* mistakes, whether or not they are vulnerabilities in a particular circumstance. We especially (but not exclusively) focus on countering memory safety issues, since as discussed above, memory safety issues cause most of the vulnerabilities in C and C++ code.

We are *not* trying to counter software whose source code is clearly written to be malicious. Compilers generally can't counter that, and other countermeasures (such as source code peer review) are more effective countermeasures.

Given these goals, this guidance has the following objectives:

1. *Minimize* the likelihood and/or impact of vulnerabilities that are released in production code.
2. *Maximize* the detection of vulnerabilities during compilation or test (especially when using instrumented test code), so they can be repaired before release.
3. Detect underhanded code[^Wheeler2020] (especially Trojan source[^Boucher2021]), where practical, to make peer review more effective.

This guidance cannot guarantee these results. However, when combined with other measures, they can significantly help.

[^Wheeler2020]: Wheeler, David, [Initial Analysis of Underhanded Source Code](https://www.ida.org/research-and-publications/publications/all/i/in/initial-analysis-of-underhanded-source-code), Institute for Defense Analysis, April 2020.

[^Boucher2021]: Boucher, Nicholas and Anderson, Ross, ["Trojan Source: Invisible Vulnerabilities"](https://doi.org/10.48550/arXiv.2111.00169), arXiv:2111.00169 [cs.CR], 2021-10-30. Published in the [32nd USENIX Security Symposium](https://www.usenix.org/conference/usenixsecurity23/presentation/boucher) (USENIX Security '23). For more context see, e.g., Krebs, Brian [‘Trojan Source’ Bug Threatens the Security of All Code](https://krebsonsecurity.com/2021/11/trojan-source-bug-threatens-the-security-of-all-code/), KrebsOnSecurity, 2021-11-01 and the [related Hacker News discussion](https://news.ycombinator.com/item?id=29062982), Wikipedia contributors, [Trojan Source](https://en.wikipedia.org/w/index.php?title=Trojan_Source&oldid=1187570322), Wikipedia, 2023-11-01, and Common Vulnerability Enumeration Database, [CVE-2021-42574](https://www.cve.org/CVERecord?id=CVE-2021-42574), 2021-11-01.

## Recommended Compiler Options

This section describes recommendations for compiler and linker option flags that 1) enable compile-time checks that warn developers of potential defects in the source code (Table 1), and 2) enable run-time protection mechanisms, such as checks that are designed to detect when memory vulnerabilities in the application are exploited (Table 2).

The recommendations in Table 1 and Table 2 are primarily applicable to compiling user space code in GNU/Linux environments using either the GCC and Binutils toolchain or the Clang / LLVM toolchain and have been included in this document because they are:

- widely deployed and enabled by default for pre-built packages in at least some major Linux distributions, including Debian, Ubuntu, Red Hat and SUSE Linux. See Voisin et al.'s continuous survey of compiler options used by distributions[^compiler-flags-distro].
- supported both by the GCC and Clang / LLVM toolchains.
- cross-platform and supported on (at least) Intel and AMD 64-bit x86 architectures as well as the 64-bit version of the ARM architecture (AArch64).

[^compiler-flags-distro]: Voisin, Julien et al., [Default compiler hardening flags used to build packages for Linux distributions](https://github.com/jvoisin/compiler-flags-distro), Github jvoisin/compiler-flags-distro, 2025-02-14.

For historical reasons, the GCC compiler and Binutils upstream projects do not enable optimization or security hardening options by default. While some aspects of the default options can be changed when building GCC and Binutils from source, the defaults used in the toolchains shipped with GNU/Linux distributions vary. Distributions may also ship multiple versions of toolchains with different defaults. Consequently, developers need to pay attention to compiler and linker option flags, and manage them according to their need of optimization, level of warning and error detection, and security hardening of the project.

To identify the default flags used by GCC or Clang on your system, you can examine the output of `cc -v` *`<sourcefile.c>`* and review the full command line used by the compiler to build the specified source file. This information serves two main purposes: understanding the setup of the compiler on your system and gaining insights into the options chosen by the distribution's maintainers. Additionally, it can be valuable for diagnosing option-related issues or troubleshooting problems that may arise during software compilation. For instance, certain option flags rely on their order of appearance; when a parameter is set more than once, the later occurrence usually takes precedence. By analyzing the complete list of utilized flags, it becomes easier to troubleshoot issues caused by interactions between order-sensitive flags.

Similarly, running `cc -O2 -dM -E - < /dev/null` will produce a comprehensive list of macro-defined constants. This output can be useful for troubleshooting problems related to compiler or library features that are enabled through specific macro definitions.

It's important to note that sourcing GCC from third-party vendor may result in your instance of GCC being preconfigured with certain default flags enabled or disabled. These flags can significantly impact the security of your compiled code. Therefore, it's essential to review the default flags if GCC is sourced through a Package Manager, Linux Distribution, or otherwise. We recommend explicitly enabling desired compiler flags in your build scripts or build system configuration rather than relying on the toolchain defaults. If you are creating packages for Linux distributions the distributions maintainers may have their own recommended ways of incorporating build flags. In such cases refer to the corresponding distribution documentation for, e.g., Debian[^debian-hardening], Gentoo[^gentoo-hardening], Fedora[^fedora-hardening], OpenSUSE[^opensuse-hardening], or Ubuntu[^ubuntu-hardening].

[^debian-hardening]: Software in the Public Interest, [Hardening in Debian](https://wiki.debian.org/Hardening), Debian Wiki, 2022-01-07.

[^gentoo-hardening]: Gentoo Foundation, [Hardening in Gentoo](https://wiki.gentoo.org/wiki/Hardened/Toolchain), Gentoo Wiki, 2023-03-08.

[^fedora-hardening]: Red Hat, [Using RPM build flags in Fedora](https://src.fedoraproject.org/rpms/redhat-rpm-config/blob/rawhide/f/buildflags.md), Fedora Package Sources (`redhat-rpm-config`), 2023-08-04.

[^opensuse-hardening]: SUSE, [openSUSE Security Features](https://en.opensuse.org/openSUSE:Security_Features), openSUSE Wiki, 2022-12-8.

[^ubuntu-hardening]: Ubuntu, [Ubuntu Security Features](https://wiki.ubuntu.com/Security/Features), Ubuntu Wiki, 2023-08-07.

Typical compiler configurations do not report warnings from system headers, since application developers typically don't control those headers.  In GCC this is because `-Wno-system-headers` is on by default, and clang also normally suppresses warnings from system headers [^clang-system-headers]. You will probably want to also mark third party include files as system headers so you can strongly increase the warning levels. Directories added with the command line option `-isystem` are treated as system header directories by GCC [^gcc-directory-search] and Clang [^clang-isystem]. In a Cmake configuration file you can do this with `include_directories` by adding `SYSTEM` before its parameter [^cmake-include-directories]. There are trade-offs. Silencing warnings from system headers and third party libraries may hide vulnerabilities in them that affect the application. On the other hand, *not* silencing them focuses efforts on issues that the developer typically cannot control, impede progress when using `-Werror` in CI jobs, and often make it difficult to support building with older versions of third party code, making incremental upgrades difficult.

[^clang-system-headers]: LLVM team, [Controlling Diagnostics in System Headers](https://clang.llvm.org/docs/UsersManual.html#controlling-diagnostics-in-system-headers), Clang Compiler User's Manual, 2017-03-08.

[^gcc-directory-search]: GCC team, [Options for Directory Search](https://gcc.gnu.org/onlinedocs/gcc/Directory-Options.html), GCC Manual, 2023-07-27.

[^clang-isystem]: LLVM team, [Clang command line argument reference¶: -isystem\<directory\>](https://clang.llvm.org/docs/ClangCommandLineReference.html#cmdoption-clang-isystem-directory), Clang documentation, 2017-09-05.

[^cmake-include-directories]: Kitware, [include_directories¶](https://cmake.org/cmake/help/latest/command/include_directories.html), Cmake Documentation, 2023-10-23.

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
| [`-Wall`](#-Wall)<br/>[`-Wextra`](#-Wextra)                                   | GCC 2.95.3<br/>Clang 4.0.0 | Enable warnings for constructs often associated with defects                        |
| [`-Wformat`](#-Wformat)<br/>[`-Wformat=2`](#-Wformat=2)                       | GCC 2.95.3<br/>Clang 4.0.0 | Enable additional format function warnings                                          |
| [`-Wconversion`](#-Wconversion)<br/>[`-Wsign-conversion`](#-Wsign-conversion) | GCC 2.95.3<br/>Clang 4.0.0 | Enable implicit conversion warnings                                                 |
| [`-Wtrampolines`](#-Wtrampolines)                                             |         GCC 4.3.0          | Enable warnings about trampolines that require executable stacks                    |
| [`-Wimplicit-fallthrough`](#-Wimplicit-fallthrough)                           |         GCC 7.0.0<br>Clang 4.0.0   | Warn when a switch case falls through                                           |
| [`-Wbidi-chars=any`](#-Wbidi-chars=any)                                       | GCC 12.0.0                   | Enable warnings for possibly misleading Unicode bidirectional control characters    |
| [`-Werror`](#-Werror)<br/>[`-Werror=`*`<warning-flag>`*](#-Werror-flag)       | GCC 2.95.3<br/>Clang 2.6.0 | Treat all or selected compiler warnings as errors. Use the blanket form `-Werror` only during development, not in source distribution. |
| [`-Werror=format-security`](#-Werror=format-security)                         | GCC 2.95.3<br/>Clang 4.0.0 | Treat format strings that are not string literals and used without arguments as errors                                                 |
| [`-Werror=implicit`](#-Werror=implicit)<br/>[`-Werror=incompatible-pointer-types`](#-Werror=incompatible-pointer-types)<br/>[`-Werror=int-conversion`](#-Werror=int-conversion)<br/> | GCC 2.95.3<br/>Clang 2.6.0 | Treat obsolete C constructs as errors |

Table 2: Recommended compiler options that enable run-time protection mechanisms.

| Compiler Flag                                                                             |            Supported since            | Description                                                                                  |
|:----------------------------------------------------------------------------------------- |:----------------------------------:|:-------------------------------------------------------------------------------------------- |
| [`-D_FORTIFY_SOURCE=3`](#-D_FORTIFY_SOURCE=3)| GCC 12.0.0<br/>Clang 9.0.0[^Guelton20]  | Fortify sources with compile- and run-time checks for unsafe libc usage and buffer overflows. Some fortification levels can impact performance. Requires `-O1` or higher, may require prepending `-U_FORTIFY_SOURCE`. |
| [`-D_GLIBCXX_ASSERTIONS`](#-D_GLIBCXX_ASSERTIONS) | libstdc++ 6.0.0  | Precondition checks for C++ standard library calls. Can impact performance.                  |
| [`-fstrict-flex-arrays=3`](#-fstrict-flex-arrays)                             |       GCC 13.0.0<br/>Clang 16.0.0       | Consider a trailing array in a struct as a flexible array if declared as `[]`                           |
| [`-fstack-clash-protection`](#-fstack-clash-protection)                                   |       GCC 8.0.0<br/>Clang 11.0.0       | Enable run-time checks for variable-size stack allocation validity. Can impact performance.  |
| [`-fstack-protector-strong`](#-fstack-protector-strong)                                   | GCC 4.9.0<br/>Clang 6.0.0          | Enable run-time checks for stack-based buffer overflows. Can impact performance.             |
| [`-fcf-protection=full`](#-fcf-protection=full)                                           | GCC 8.0.0<br/>Clang 7.0.0          | Enable control-flow protection against return-oriented programming (ROP) and jump-oriented programming (JOP) attacks on x86_64 |
| [`-mbranch-protection=standard`](#-mbranch-protection-standard)                           | GCC 9.0.0<br/>Clang 8.0.0          | Enable branch protection against ROP and JOP attacks on AArch64 |
| [`-Wl,-z,nodlopen`](#-Wl,-z,nodlopen) |           Binutils 2.10.0            | Restrict `dlopen(3)` calls to shared objects                                 |
| [`-Wl,-z,noexecstack`](#-Wl,-z,noexecstack)                                               |           Binutils 2.14.0            | Enable data execution prevention by marking stack memory as non-executable                   |
| [`-Wl,-z,relro`](#-Wl,-z,relro)<br/>[`-Wl,-z,now`](#-Wl,-z,now)                           |           Binutils 2.15.0            | Mark relocation table entries resolved at load-time as read-only. `-Wl,-z,now` can impact startup performance.                            |
| [`-fPIE -pie`](#-fPIE_-pie)                                                               |   Binutils 2.16.0<br/>Clang 5.0.0    | Build as position-independent executable. Can impact performance on 32-bit architectures.                                                   |
| [`-fPIC -shared`](#-fPIC_-shared)                                                         | < Binutils 2.6.0<br/>Clang 5.0.0     | Build as position-independent code. Can impact performance on 32-bit architectures.                                                         |
| [`-fno-delete-null-pointer-checks`](#-fno-delete-null-pointer-checks)                     | GCC 3.0.0<br/>Clang 7.0.0            | Force retention of null pointer checks                                                       |
| [`-fno-strict-overflow`](#-fno-strict-overflow)                                           | GCC 4.2.0                            | Define behavior for signed integer and pointer arithmetic overflows                        |
| [`-fno-strict-aliasing`](#-fno-strict-aliasing)                                           | GCC 2.95.3<br/>Clang 2.9.0        | Do not assume strict aliasing                                                                |
| [`-ftrivial-auto-var-init`](#-ftrivial-auto-var-init)                                     | GCC 12.0.0<br/>Clang 8.0.0               | Perform trivial auto variable initialization                                                 |
| [`-fexceptions`](#-fexceptions)                                                           | GCC 2.95.3<br/>Clang 2.6.0           | Enable exception propagation to harden multi-threaded C code                                 |
| [`-fhardened`](#-fhardened)                                                               | GCC 14.0.0                           | Enable pre-determined set of hardening options in GCC                                        |
| [`-Wl,--as-needed`](#-Wl,--as-needed)<br/>[`-Wl,--no-copy-dt-needed-entries`](#-Wl,--no-copy-dt-needed-entries) | Binutils 2.20.0 | Allow linker to omit libraries specified on the command line to link against if they are not used |

[^Guelton20]: The implementation of `-D_FORTIFY_SOURCE={1,2,3}` in the GNU libc (glibc) relies heavily on implementation details within GCC. Clang implements its own style of fortified function calls (originally introduced for Android’s bionic libc) but as of Clang / LLVM 14.0.6 incorrectly produces non-fortified calls to some glibc functions with `_FORTIFY_SOURCE` . Code set to be fortified with Clang will still compile, but may not always benefit from the fortified function variants in glibc. For more information see: Guelton, Serge, [Toward _FORTIFY_SOURCE parity between Clang and GCC. Red Hat Developer](https://developers.redhat.com/blog/2020/02/11/toward-_fortify_source-parity-between-clang-and-gcc), Red Hat Developer, 2020-02-11 and Poyarekar, Siddhesh, [D91677 Avoid simplification of library functions when callee has an implementation](https://reviews.llvm.org/D91677), LLVM Phabricator, 2020-11-17.

---

### Enable warnings for constructs often associated with defects

| Compiler Flag                                                           |       Supported since       | Description                                                  |
|:----------------------------------------------------------------------- |:------------------------:|:------------------------------------------------------------ |
| <span id="-Wall">`-Wall`</span><br/><span id="-Wextra">`-Wextra`</span> | GCC 2.95.3<br/>Clang 4.0.0 | Enable warnings for constructs often associated with defects |

#### Synopsis

Warnings are compile-time diagnostics messages that indicate programming constructs that, while not inherently erroneous, are risky or suggest a programming error may have been made.

The `-Wall` and `-Wextra` compiler flags enable pre-defined sets of compile-time warnings.

The warnings in the `–Wall` set are generally easy to avoid or can be easily prevented by modifying the offending code.

The `-Wextra` set of warnings are either situational, or indicate problematic constructs that are harder to avoid and in some cases may be necessary.

NOTE: Despite its name the `-Wall` options does NOT enable all possible warning diagnostics, but a pre-defined subset. For a complete list of specific warnings enabled by the`-Wall` and `-Wextra` compiler please consult the GCC[^gcc-warnings] and Clang[^clang-diagnostics] documentation respectively.

[^gcc-warnings]: GCC team, [Using the GNU Compiler Collection (GCC): Warning Options.](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html), GCC Manual, 2023-07-27.

[^clang-diagnostics]: LLVM Team, [Clang documentation: Diagnostics flags in Clang](https://clang.llvm.org/docs/DiagnosticsReference.html), Clang documentation, 2023-03-17.

---

### Enable additional format function warnings

| Compiler Flag                              | Supported since          | Description                                |
|:------------------------------------------ |:------------------------:|:------------------------------------------ |
| <span id="-Wformat">`-Wformat`</span>      | GCC 2.95.3<br/>Clang 4.0.0 | Enable additional format function warnings |
| <span id="-Wformat=2">`-Wformat=2`</span>  | GCC 2.95.3<br/>Clang 4.0.0 | Enable additional format function warnings |

#### Synopsis

Check calls to the `printf` and `scanf` family of functions to ensure that the arguments supplied have types appropriate to the format string specified, and that the conversions specified in the format string make sense.

In GCC, the `-Wformat=2` form of the option also enables certain additional checks, including:

- Warning if the format string is not a string literal and so cannot be checked, unless the format function takes its format arguments as a va_list (`-Wformat-nonliteral`).
- Warning about uses of format functions that represent possible security problems (`-Wformat-security`).
- Warning about `strftime` formats that may yield only a two-digit year (`-Wformat-y2k`).

In Clang, `-Wformat` includes the same diagnostics as `-Wformat=2`, but unlike in GCC `-Wformat=2` in Clang does not include the `-Wformat` diagnostics. Due to this divergent behavior we recommend specifying both `-Wformat` and `-Wformat=2` in projects that may be built with both GCC and Clang.

---

### Enable implicit conversion warnings

| Compiler Flag                                                                                             |       Supported since       | Description                         |
|:--------------------------------------------------------------------------------------------------------- |:------------------------:|:----------------------------------- |
| <span id="-Wconversion">`-Wconversion`</span><br/><span id="-Wsign-conversion">`-Wsign-conversion`</span> | GCC 2.95.3<br/>Clang 4.0.0 | Enable implicit conversion warnings |

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
| <span id="-Wtrampolines">`-Wtrampolines`</span> |   GCC 4.3.0    | Enable warnings about trampolines that require executable stacks |

#### Synopsis

Check whether the compiler generates trampolines for pointers to nested functions[^gnuc-nestedfuncs] (a GNU C extension to ISO standard C) which stack virtual memory protection (non-executable stack) may interfere with.

A trampoline is a small piece of data or code that is created at run time on the stack when the address of a nested function is taken and is used to call the nested function indirectly.

For most target architectures, including 64-bit x86, trampolines are made up of code and thus requires the stack to be made executable for the program to work properly. The non-executable stack mitigation (see [`-Wl,-z,noexecstack`](#-Wl,-z,noexecstack)) used by all major operating system to prevent code injection attacks may interfere with the operation such trampolines causing a non-compatible programs to crash when they transfer control flow to a trampoline on a non-executable stack.

Enabling `-Wtrampolines` warns of programming constructs which are not compatible with the non-executable stack mitigation.

[^gnuc-nestedfuncs]: Stallman, Richard, [Nested Functions](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Nested-Functions.html), GNU C Language Introduction and Reference Manual, 2023-10-15.

---

### Warn about implicit fallthrough in switch statements

| Compiler Flag                                                                                        |       Supported since       | Description                        |
|:---------------------------------------------------------------------------------------------------- |:------------------------:|:---------------------------------- |
| <span id="-Wimplicit-fallthrough">`-Wimplicit-fallthrough`</span>                           |         GCC 7.0.0<br>Clang 4.0.0   | Warn when a switch case falls through                                                 |

<!-- Here "a fallthrough" is a noun, "to fall through" is the verb. -->

#### Synopsis

Warn when an implicit fallthrough occurs in a switch statement that has not been specifically marked as intended.

The `switch` statement in C and C++ allows a case block to fall through to the following case block (unless preceded by break, return, goto, or similar). This is widely considered a design defect in C, because a common mistake is to have a fallthrough occur when it was *not* intended[^Polacek17].

This warning flag warns when a fallthrough occurs unless it is specially marked as being *intended*. The Linux kernel project uses this flag; it led to the discovery and fixing of many bugs[^Corbet19].

This warning flag does not have a performance impact. However, sometimes a fallthrough *is* intentional. This flag requires developers annotate those (rare) cases in the source code where a fallthrough *is* intentional, to suppress the warning. Obviously, this annotation should *only* be used when it is intentional. C++17 (or later) code should simply use the attribute `[[fallthrough]]` as it is standard (remember to add `;` after it).

The C17 standard[^C2017] does not provide a mechanism to mark intentional fallthroughs. Different tools support different mechanisms for marking one, including attributes and comments in various forms[^Shafik15]. A portable way to mark one is to define a function-like macro named `fallthrough()` to mark an intentional fallthrough that adjusts to the relevant tool (e.g., compiler) mechanism. We suggest using this construct below, inspired by the keyword-like construct used by the Linux kernel version 6.4 and later[^Howlett23]. We suggest using a function call syntax instead so more editors and other tools will deal with it correctly:

~~~c
#ifdef __has_attribute
# if __has_attribute(__fallthrough__)
#  define fallthrough()                    __attribute__((__fallthrough__))
# endif
#endif
#ifndef fallthrough
# define fallthrough()                    do {} while (0)  /* fallthrough */
#endif
~~~

The `__fallthrough__` attribute is supported since GCC 7.0.0[^gcc-release-notes-7] and Clang 4.0.0[^clang-fallthrough]. Feature testing via `__has_attribute` is supported since GCC 5.0.0[^gcc-release-notes-5] and Clang 2.9.

[^Polacek17]: Polacek, Marek, ["-Wimplicit-fallthrough in GCC 7"](https://developers.redhat.com/blog/2017/03/10/wimplicit-fallthrough-in-gcc-7), Red Hat Developer, 2017-03-10

[^Corbet19]: Corbet, Jonathan.  ["An end to implicit fall-throughs in the kernel"](https://lwn.net/Articles/794944/), LWN, 2019-08-01.

[^C2017]: ISO/IEC, [Programming languages — C ("C17")](https://web.archive.org/web/20181230041359/http://www.open-std.org/jtc1/sc22/wg14/www/abq/c17_updated_proposed_fdis.pdf), ISO/IEC 9899:2018, 2017. Note: The official ISO/IEC specification is paywalled and therefore not publicly available. The final specification draft is publicly available.

[^Shafik15]: Shafik, Yaghmour, ["GCC 7, -Wimplicit-fallthrough warnings, and portable way to clear them?"](https://stackoverflow.com/questions/27965722/c-force-compile-time-error-warning-on-implicit-fall-through-in-switch/27965827#27965827), StackOverflow, 2015-01-15.

[^Howlett23]: Howlett, Liam,[tools: Rename __fallthrough to fallthrough](https://github.com/torvalds/linux/commit/f7a858bffcddaaf70c71b6b656e7cc21b6107cec), Linux Kernel Source, 2023-04-07.

[^gcc-release-notes-5]: GCC team, [GCC 5 Release Series Changes, New Features, and Fixes](https://gcc.gnu.org/gcc-5/changes.html), 2017-10-10.

[^gcc-release-notes-7]: GCC team, [GCC 7 Release Series Changes, New Features, and Fixes](https://gcc.gnu.org/gcc-7/changes.html), 2019-11-14.

[^clang-fallthrough]: LLVM team, [Attributes in Clang: fallthrough, clang::fallthrough](https://releases.llvm.org/4.0.0/tools/clang/docs/AttributeReference.html#fallthrough-clang-fallthrough), Clang Documentation, 2017-03-13.

---

### Enable warnings for possibly misleading Unicode bidirectional control characters

| Compiler Flag                                                            | Supported since | Description                                                                                                                                                     |
|:------------------------------------------------------------------------ |:---------------:|:----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <span id="-Wbidi-chars=any">`-Wbidi-chars=any`</span>                    | GCC 12.0.0          | Enable warnings for any UTF-8 bidirectional control characters in comments, string literals, character constants, and identifiers                               |
| <span id="-Wbidi-chars=any,ucn">`-Wbidi-chars=any,ucn`</span>            | GCC 12.0.0          | As `any` and additionally warn of UCNs corresponding to bidirectional control characters in string literals, character constants, and identifiers               |
| <span id="-Wbidi-chars=unpaired">`-Wbidi-chars=unpaired`</span>          | GCC 12.0.0          | Enable warnings for unpaired UTF-8 bidirectional control characters in comments, string literals, character constants, and identifiers                          |
| <span id="-Wbidi-chars=unpaired,ucn">`-Wbidi-chars=unpaired,ucn`</span>  | GCC 12.0.0          | As `unpaired` and additionally warn of UCNs corresponding to unpaired bidirectional control characters in string literals, character constants, and identifiers |

#### Synopsis

Check for possibly misleading Unicode bidirectional (bidi) control characters in comments, string literals, character constants, and identifiers.

Some writing systems (such as Arabic, Hebrew, Persian, and Urdu) are typically written right-to-left (RTL), while many others (such as English) are written left-to-right (LTR). Some documents must mix writing systems with different orders, e.g. source code with comments in right-to-left writing. Unicode supports various control sequences to support this visual reordering. Unfortunately, attackers can use such control sequences to obfuscate source code to hide vulnerabilities from human reviewers. Careful human review is usually one of the strongest methods available to detect malicious code. Unfortunately, maliciously misleading code, aka *"underhanded code"*, attempts to subvert human review[^Wheeler2020]. *"Trojan Source"*[^Boucher2021] is a specific kind of underhanded code that exploits the Unicode bidirectional algorithm that produce the correct order of characters when bidirectional text is displayed.

The GCC `-Wbidi-chars` option helps to counter Trojan Source attacks[^gcc-Wbidi-chars]. By default its value is `-Wbidi-chars=unpaired`, which warns about improperly terminated bidi contexts (this should never happen in source code). However, this default is somewhat permissive.

In many cases using `-Wbidi-chars=any` is a stronger defense. This option forbids *any* use of bidirectional control characters in comments, string literals, character constants, and identifiers, completely eliminating the Trojan Source attack. This setting is appropriate when bidi characters are *not* expected in the source code, and their only use would be as part of an attack on reviewers.

Both `-Wbidi-chars=any` and `-Wbidi-chars=unpaired` can be combined with the `ucn` argument which additionally warns of corresponding bidirectional control characters expressed as universal-character-names (UCNs), i.e., using the `\uXXXX` notation,in string literals, character constants, and identifiers.

Note that this option does *not* interfere with creating internationalized programs. Current best practice is to put human-readable text strings in separate files, not in source code, and then use an internationalization (i18n) framework like `gettext` to retrieve the correct text for the user's locale.

<!-- Implemented in: https://gcc.gnu.org/bugzilla/show_bug.cgi?id=103026 -->

[^gcc-Wbidi-chars]: GCC team, [Using the GNU Compiler Collection (GCC): Warning Options: `-Wbidi-chars`](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wbidi-chars_003d),

#### When not to use?

Do *not* use `-Wbidi-chars=any` or `-Wbidi-chars=any,ucn` in cases where some of the source code *is* expected to include bidirectional control characters. This is typically the case where some of the source code text, e.g., comments, are in a right-to-left script such as Arabic, Hebrew, Persian, or Urdu. In such cases, use `-Wbidi-chars=unpaired` (the default) or `-Wbidi-chars=unpaired,ucn` instead.

#### Additional Considerations

It is best to use other static code analysis tools to also warn about Trojan Source, since it's not an issue developers typically consider. Some editors have mechanisms to warn about Trojan Source; using them is recommended where practical. However, it's sometimes difficult to verify whether developers and reviewers have used such tools.

`clang-tidy` has multiple lints to help identify Trojan Source:

- `misc-misleading-bidirectional` check warns about unterminated bidirectional Unicode sequences, similar to GCC's `-Wbidi-chars=unpaired`[^clang-tidy-bidi].
- `misc-confusable-identifiers` check warns about characters that are visually similar [^clang-tidy-confusable].
- `misc-misleading-identifier` check warns about bidirectional Unicode that can change the meaning of the code [^clang-tidy-misleading].

[^clang-tidy-bidi]: LLVM team, [clang-tidy - misc-misleading-bidirectional](https://clang.llvm.org/extra/clang-tidy/checks/misc/misleading-bidirectional.html), Extra Clang Tools Documentation, 2024-03-28.
[^clang-tidy-confusable]: LLVM team, [clang-tidy - misc-confusable-identifiers](https://clang.llvm.org/extra/clang-tidy/checks/misc/confusable-identifiers.html), Extra Clang Tools Documentation, 2024-03-28.
[^clang-tidy-misleading]: LLVM team, [clang-tidy - misc-misleading-identifier](https://clang.llvm.org/extra/clang-tidy/checks/misc/misleading-identifier.html), Extra Clang Tools Documentation, 2024-03-28.

---

### Treat compiler warnings as errors

| Compiler Flag                                                                                        |       Supported since       | Description                        |
|:---------------------------------------------------------------------------------------------------- |:------------------------:|:---------------------------------- |
| <span id="-Werror">`-Werror`</span><br/> <span id="-Werror-flag">`-Werror=`*`<warning-flag>`*</span> | GCC 2.95.3<br/>Clang 2.6.0 | Treat compiler warnings as errors |

#### Synopsis

Make the compiler treat all or specific warning diagnostics as errors.

The blanket form, `-Werror` without a selector, treats all warnings as errors and can be used to implement a zero-warning policy during development. However, we recommend developers to omit the blanket form when distributing source code as it creates a dependency on specific toolchain vendors and versions [^Johnston17]. If necessary, such toolchain dependencies, i.e., which compiler version(s) the project is expected to work with, should be clearly noted in the project documentation or the build environment should be completely captured, e.g., via container recipes. However, it's better to ensure that source code is not so dependent on a specific toolchain version.

The selective form, `-Werror=`*`<warning-flag>`* (note the selector), can be used for refined warnings-as-error control without introducing a blanket zero-warning policy. This is beneficial to ensure that certain undesirable constructs or defects *never* occur in produced builds. The selective form does *not* introduce a dependency on the toolchain or version if the corresponding warning is for a specific construct. For example, developers can decide to promote warnings that indicate interference with OS defense mechanisms (e.g., `-Werror=trampolines`), undefined behavior (e.g., `-Werror=return-type`), or constructs associated with software weaknesses (e.g., `-Werror=conversion`) to errors. Using a set of selecting form `-Werror` flags can help ensure that the software is ported to and correctly uses more modern versions of their language (and avoids using more risky or problematic constructs)[^Weimer2023].

Zero-warning policies can also be enforced at CI level. CI-based zero- or bounded-warning policies are often preferable, for the reasons explained above, and because they can be expanded beyond compiler warnings. For example, they can also include warnings from static analysis tools or generate warnings when `FIXME` and `TODO` comments are found.

[^Johnston17]: Johnston, Philip. [-Werror is Not Your Friend](https://embeddedartistry.com/blog/2017/05/22/werror-is-not-your-friend/). Embedded Artistry Blog, 2017-05-22.

---

### Treat format strings that are not string literals and used without arguments as errors

| Compiler Flag                                                                             | Supported since            | Description                                                                           |
|:----------------------------------------------------------------------------------------- |:--------------------------:|:--------------------------------------------------------------------------------------|
| <span id="-Werror=format-security">`-Werror=format-security`</span>                       | GCC 2.95.3<br/> Clang 4.0.0  | Treat format strings that are not string literals and used without arguments as errors |

#### Synopsis

Treat calls to printf- and scanf-family of functions where the format string is not a string literal and there are no additional format arguments as errors.

Format strings that can be influenced at run-time from outside the program are likely to cause format string vulnerabilities[^scut2001]. We recommend treating format strings that are not string literals and used without addition arguments as errors as invocations of the form:

~~~C
printf(fmt);
printf(gettext("Hello World\n"));
fprintf(stderr, fmt);
~~~

always indicates a bug and, if the format string can be controlled by external input, can be used in a format string attack. Code of this form where the format string `fmt` is not expected to contain format specifiers can be rewritten in a safe form using a fixed format string:

~~~C
printf("%s", fmt);
printf("%s", gettext("Hello World\n"));
fprintf(stderr, "%s", fmt);
~~~

Some Linux distributions, such as Arch Linux[^arch-buildflags], Fedora[^fedora-formatsecurityfaq], and Ubuntu[^ubuntu-compilerflags], are enforcing the use of `-Werror=format-security` when building software for distribution.

[^scut2001]: scut \[TESO\], [Exploiting Format String Vulnerabilities](https://web.archive.org/web/20240402183013/https://cs155.stanford.edu/papers/formatstring-1.2.pdf), version 1.2, 2001-09-01.

[^arch-buildflags]: Arch Linux, [rfc/0003-buildflags.rst](https://gitlab.archlinux.org/archlinux/rfcs/-/blob/2136adc4a86afe37f351f8f564af3dcc6d7681ae/rfcs/0003-buildflags.rstt), ArchLinux RFC, 2023-09-03.

[^fedora-formatsecurityfaq]: Fedora, [Format-Security-FAQ](https://fedoraproject.org/wiki/Format-Security-FAQ), Fedora Wiki, 2013-12-05.

[^ubuntu-compilerflags]: Ubuntu, [ToolChain/CompilerFlags](https://wiki.ubuntu.com/ToolChain/CompilerFlags#A-Wformat_-Wformat-security), Ubuntu Wiki, 2024-03-22.

---

### Treat obsolete C constructs as errors

| Compiler Flag                                                                             | Supported since            | Description                                                                                      |
|:----------------------------------------------------------------------------------------- |:--------------------------:|:-------------------------------------------------------------------------------------------------|
| <span id="-Werror=implicit">`-Werror=implicit`</span>                                     | GCC 2.95.3<br/> Clang 2.6.0  | Treat declarations that do not specify as type or functions used before being declared as errors |
| <span id="-Werror=incompatible-pointer-types">`-Werror=incompatible-pointer-types`</span> | GCC 5.5.0<br/> Clang 7.0.0 | Treat conversion between pointers that have incompatible types as errors                         |
| <span id="-Werror=int-conversion">`-Werror=int-conversion`</span>                         | GCC 2.95.3<br/> Clang 2.6.0  | Treat implicit integer to pointer and pointer to integer conversions as errors                   |

#### Synopsis

Make the compiler treat obsolete C constructs as errors.

The ISO/IEC 9899:1999 standard, commonly referred to as C99, removed several backwards compatibility features, such as implicit function declarations and implicit return types from the C language. Similarly, the earlier C89/C90 standard (ANSI X3.159-1989 / ISO/IEC 9899:1990) removed certain implicit type conversion, such as implicit conversions from integer to pointer types. Such implicit declarations[^DCL31-C] and type conversions (whether implicit or explicit[^INT36-C]) can be considered dangerous for the correctness and security of C code as they lead to less stringent type checking and may rely on implementation-defined behavior. However, modern compilers still accept these obsolete constructs by default unless instructed to pedantically give errors whenever the base standard requires them.

The `-Werror=implicit`, `-Werror=incompatible-pointer-types`, and `-Werror=int-conversion` options instruct the compiler to treat the following obsolete constructs as errors:

- Declarations that do not specify as type, or functions used before being declared as errors.
- Conversion between pointers that have incompatible types.
- Implicit integer to pointer and pointer to integer conversions.

Using these options will make the compiler treat the corresponding obsolete construsts as errors regardless of the language standard the compiler is instructed to follow. GCC 14[^gcc-porting-to-14] and Clang 15[^clang-release-notes-15] disable support for these legacy language constructs by default so enabling these options will also prepare the codebase for transitioning to these and later compilers. Some Linux distributions, such as Fedora[^Weimer2023], are enforcing the use of the these options when building software for distribution. We recommend developers adopt the options, as enabling them may require non-trivial changes to the source code in codebases that rely on the obsolete constructs.

Note that in particular, `_FORTIFY_SOURCE` is of either limited or entirely neutered effect in the presence of implicit function declarations.

Note that the list of options indicated here do not capture a complete list of removed features. Some changes to the expected changes to compiler default cannot be previewed using compiler flags but require instructing the compiler to support a specific langauge standard (C99 or later dialect) and to give errors whenever the base standard requires a diagnostic[^gcc-pedantic-errors].

Some tools, such as `autoconf`, automatically determine what the compiler supports by generating code and compiling it. Old versions of these tools may not use more modern practices internally, so enabling errors can cause spurious reports that some functionality isn't available. The best solution is to update the tool. Where that isn't an option, consider adding `-Werror` forms *after* the tool has determined the mechanisms supported by the compiler.

[^DCL31-C]: Carnegie Mellon University (CMU), [DCL31-C. Declare identifiers before using them](https://wiki.sei.cmu.edu/confluence/display/c/DCL31-C.+Declare+identifiers+before+using+them), SEI CERT C Coding Standard, 2023-10-09.

[^INT36-C]: Carnegie Mellon University (CMU), [INT36-C. Converting a pointer to integer or integer to pointer](https://wiki.sei.cmu.edu/confluence/display/c/INT36-C.+Converting+a+pointer+to+integer+or+integer+to+pointer), SEI CERT C Coding Standard, 2023-04-20.

[^gcc-porting-to-14]: GCC team, [Porting to GCC 14](https://gcc.gnu.org/gcc-14/porting_to.html), GCC Supplementary Documentation, 2024-02-19.

[^clang-release-notes-15]: LLVM team, [Clang 15.0.0 Release Notes](https://releases.llvm.org/15.0.0/tools/clang/docs/ReleaseNotes.html), Clang documentation, 2022-09-06.

[^Weimer2023]: Weimer, Florian, [Porting to Modern C](https://fedoraproject.org/wiki/Changes/PortingToModernC), Fedora Project Wiki, 2023-12-22.

[^gcc-pedantic-errors]: GCC team, [Using the GNU Compiler Collection (GCC): Warning Options: `-pedantic-errors`](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-pedantic-errors-1), GCC Manual, 2023-07-27.

---

### Fortify sources for unsafe libc usage and buffer overflows

| Compiler Flag                                               | Supported since                        | Description                                                                                                                                                               |
| ----------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| <span id="-D_FORTIFY_SOURCE=3">`-D_FORTIFY_SOURCE=3`</span> | GCC 12.0.0<br/>Clang 9.0.0[^Guelton20] | Same checks as in `-D_FORTIFY_SOURCE=2`, but with significantly more calls fortified with a potential to impact performance in some rare cases. Requires `-O1` or higher. |
| <span id="-D_FORTIFY_SOURCE=2">`-D_FORTIFY_SOURCE=2`</span> | GCC 4.0.0<br/>Clang 5.0.0[^Guelton20]  | In addition to checks covered by `-D_FORTIFY_SOURCE=1`, also trap code that may be conforming to the C standard but still unsafe. Requires `-O1` or higher.               |
| <span id="-D_FORTIFY_SOURCE=1">`-D_FORTIFY_SOURCE=1`</span> | GCC 4.0.0<br/>Clang 5.0.0              | Fortify sources with compile- and run-time checks for unsafe libc usage and buffer overflows                                                                              |

#### Synopsis

The `_FORTIFY_SOURCE` macro enables a set of extensions to the GNU C library (glibc) that enable checking at entry points of a number of functions to immediately abort execution when it encounters unsafe behavior. A key feature of this checking is validation of objects passed to these function calls to ensure that the call will not result in a buffer overflow. This relies on the compiler being able to compute the size of the protected object at compile time. A full list of these functions is maintained in the GNU C Library manual[^glibc-fortification]:

> memcpy, mempcpy, memmove, memset, strcpy, stpcpy, strncpy, strcat, strncat, sprintf, vsprintf, snprintf, vsnprintf, gets

The `_FORTIFY_SOURCE` mechanisms have three modes of operation:

- `-D_FORTIFY_SOURCE=1`: conservative, compile-time and runtime checks; will not change (defined) behavior of programs. Checking for overflows is enabled when the compiler is able to estimate a compile time constant size for the protected object.
- `-D_FORTIFY_SOURCE=2`: stricter checks that also detect behavior that may be unsafe even though it conforms to the C standard; may affect program behavior by disallowing certain programming constructs. An example of such checks is restricting of the `%n` format specifier to read-only format strings.
- `-D_FORTIFY_SOURCE=3`: Same checks as those covered by `-D_FORTIFY_SOURCE=2` except that checking is enabled even when the compiler is able to estimate the size of the protected object as an expression, not just a compile time constant.

To benefit from `_FORTIFY_SOURCE` checks the following requirements must be met:

- the application must be built with `-O1` optimizations or higher; at least `-O2` is recommended.
- the compiler should be able to estimate sizes of the destination buffers at compile time. This can be facilitated by applications and libraries by using function attribute extensions supported by GCC and Clang[^Poyarekar23].
- the application code must use glibc versions of the aforementioned functions (included with standard headers, e.g. `<stdio.h>` and `<string.h>`)

If checks added by `_FORTIFY_SOURCE` detect unsafe behavior at run-time they will print an error message and terminate the application.

A default mode for FORTIFY_SOURCE may be predefined for a given compiler, for instance GCC shipped with Ubuntu 22.04 uses FORTIFY_SOURCE=2 by default. If a mode of FORTIFY_SOURCE is set on the command line which differs from the default, the compiler warns about redefining the FORTIFY_SOURCE macro. To avoid this, the predefined mode can be unset with -U_FORTIFY_SOURCE before setting the desired value.

#### Performance implications

Both `_FORTIFY_SOURCE=1` and `_FORTIFY_SOURCE=2` are expected to have a negligible run-time performance impact (~0.1% ).

#### When not to use?

`_FORTIFY_SOURCE` is recommended for all application that depend on glibc and should be widely deployed. Most packages in all major Linux distributions enable at least `_FORTIFY_SOURCE=2` and some even enable `_FORTIFY_SOURCE=3`. There are a couple of situations when `_FORTIFY_SOURCE` may break existing applications:

- If the fortified glibc function calls show up as hotspots in your application performance profile, there is a chance that `_FORTIFY_SOURCE` may have a negative performance impact. This is not a common or widespread slowdown[^Poyarekar23] but worth keeping in mind if slowdowns are observed due to this option.
- Applications that use the GNU extension for flexible array members in structs[^gcc-zerolengtharrays] may confuse the compiler into thinking that an object is smaller than it actually is, resulting in spurious aborts. The safe resolution for this is to port these uses to C99 flexible arrays but if that is not possible (e.g., due to the need to support a compiler that does not support C99 flexible arrays), one may need to downgrade or disable `_FORTIFY_SOURCE` protections.

#### Additional Considerations

Internally `-D_FORTIFY_SOURCE` relies on the built-in functions for object size checking in GCC[^gcc-objectsizechecks] and Clang[^clang-evaluatingobjectsize], namely `__builtin_object_size` and `__builtin_dynamic_object_size`. These builtins provide conservative approximations of the object size and are sensitive to compiler optimizations. With optimization enabled they produce more accurate estimates, especially when a call to `__builtin_object_size` is in a different function from where its argument pointer is formed. In addition, GCC allows more information about subobject bounds to be determined with higher optimization levels. Hence we recommending enabling `-D_FORTIFY_SOURCE=3` with at least optimization level `-O2`.

Applications that incorrectly use `malloc_usable_size`[^malloc_usable_size] to use the additional size reported by the function may abort at runtime. This is a bug in the application because the additional size reported by `malloc_usable_size` is not generally safe to dereference and is for diagnostic uses only. The correct fix for such issues is to avoid using `malloc_usable_size` as the glibc manual specifically states that it is for diagnostic purposes *only* [^malloc_usable_size]. On many Linux systems these incorrect uses can be detected by running `readelf -Ws <path>` on the ELF binaries and searching for `malloc_usable_size@GLIBC`[^kpyrd23]. If avoiding `malloc_usable_size` is not possible, one may call `realloc` to resize the block to its usable size and to benefit from `_FORTIFY_SOURCE=3`.

[^glibc-fortification]: GNU C Library team, [Source Fortification in the GNU C Library](https://www.gnu.org/software/libc/manual/html_node/Source-Fortification.html), GNU C Library (glibc) manual, 2023-02-01.

[^Poyarekar23]: Poyarekar, Siddhesh, [How to improve application security using _FORTIFY_SOURCE=3](https://developers.redhat.com/articles/2023/02/06/how-improve-application-security-using-fortifysource3), Red Hat Developer, 2023-02-06.

[^gcc-zerolengtharrays]: GCC team, [Arrays of Length Zero](https://gcc.gnu.org/onlinedocs/gcc/extensions-to-the-c-language-family/arrays-of-length-zero.html), GCC Manual (experimental 20221114 documentation), 2022-11-14.

[^gcc-objectsizechecks]: GCC team, [Using the GNU Compiler Collection (GCC): 6.62 Object Size Checking](https://gcc.gnu.org/onlinedocs/gcc/Object-Size-Checking.html), GCC Manual, 2024-08-01.

[^clang-evaluatingobjectsize]: LLVM team, [Clang Language Extensions: Evaluating Object Size](https://clang.llvm.org/docs/LanguageExtensions.html#evaluating-object-size), Clang Documentation, 2024-09-17.

[^malloc_usable_size]: Linux Man Pages team, [malloc_usable_size(3)](https://man7.org/linux/man-pages/man3/malloc_usable_size.3.html), Linux manual page, 2023-03-30.

[^kpyrd23]: kpcyrd, [Task Todo List Prepare packages for -D_FORTIFY_SOURCE=3](https://archlinux.org/todo/prepare-packages-for-d_fortify_source3/), Arch Linux Task Todo List, 2023-09-05.

---

### Precondition checks for C++ standard library calls

| Compiler Flag                                                                              | Supported since            | Description                                                                                  |
| ------------------------------------------------------------------------------------------ | ----------------------- | -------------------------------------------------------------------------------------------- |
| <span id="-D_GLIBCXX_ASSERTIONS">`-D_GLIBCXX_ASSERTIONS`</span>                            | libstdc++ 6.0.0           | (C++ using libcstdc++ only) Precondition checks for libstdc++ calls; can impact performance. |

#### Synopsis

The C++ standard library implementation in GCC (libstdc++) provides run-time precondition checks for C++ standard library calls, such as bounds-checks for C++ strings and containers, and null-pointer checks when dereferencing smart pointers.

These precondition checks can be enabled by defining the `-D_GLIBCXX_ASSERTIONS` macro when compiling C++ code that calls into libstdc++[^libsdcpp-macros].

#### Performance implications

Most calls into the C++ standard library have preconditions. Some preconditions can be checked in constant-time, others are more expensive. The checks enabled by `-D_GLIBCXX_ASSERTIONS` are  intended to be lightweight[^Wakely15], i.e., constant-time checks but the exact behavior can differ between standard library versions. In some versions of libstdc++ the `-D_GLIBCXX_ASSERTIONS` macro can have a non-trivial impact on performance. Slowdowns of up to 6% have been reported[^Kraus21].

#### When not to use?

`-D_GLIBCXX_ASSERTIONS` is recommended for C++ applications that may handle untrusted data, as well as for any C++ application during testing.

This option is unnecessary for security for applications in production that only handle completely trusted data.

[^libsdcpp-macros]: GCC team, [Using Macros in the GNU C++ Library](https://gcc.gnu.org/onlinedocs/libstdc++/manual/using_macros.html), The GNU C++ Library Manual, 2023-07-27.

[^Wakely15]: Wakely, Jonathan, [Enable lightweight checks with _GLIBCXX_ASSERTIONS](https://patchwork.ozlabs.org/project/gcc/patch/20150907182755.GP2631@redhat.com/), GCC Mailing List, 2015-09-07

[^Kraus21]: Metzger-Kraus, Christof. [Don't use GLIBCXX_ASSERTIONS in production](https://gitlab.psi.ch/OPAL/src/-/merge_requests/468), Object Oriented Particle Accelerator Library (OPAL) Issue Tracker, 2021-01-16.

---

### Enable strict flexible arrays

| Compiler Flag                                                   |     Supported since     | Description                                                                               |
|:--------------------------------------------------------------- |:-----------------------:|:------------------------------------------------------------------------------------------|
| <span id="-fstrict-flex-arrays">`-fstrict-flex-arrays=3`</span> | GCC 13.0.0<br/>Clang 16.0.0 | Consider trailing array (at the end of struct) as flexible array only if declared as `[]` |
| `-fstrict-flex-arrays=2`                                        | GCC 13.0.0<br/>Clang 15.0.0 | Consider trailing array as a flexible array only if declared as `[]`, or `[0]`            |
| `-fstrict-flex-arrays=1`                                        | GCC 13.0.0<br/>Clang 15.0.0 | Consider trailing array as a flexible array only if declared as `[]`, `[0]`, or `[1]`     |
| `-fstrict-flex-arrays=0`                                        | GCC 13.0.0<br/>Clang 15.0.0 | Consider any trailing array (at the end of a struct) a flexible array (the default)       |

#### Synopsis

Modify what the compiler determines is a trailing array. The higher levels make the compiler respect the sizes of trailing arrays more strictly[^gcc-Wstrict-flex-arrays] (this affects bounds checking)[^Guelton22].

By default, GCC and Clang treat all trailing arrays (arrays that are placed as the last member or a structure) as flexible-sized arrays, *regardless* of *declared* size for the purposes of `__builtin_object_size()` calculations used by `_FORTIFY_SOURCE`[^Cook21]. This disables various bounds checks that do not always need to be disabled. For example, with the default settings, given:

~~~c
struct trailing_array {
    int a;
    int b;
    int c[4];
};
struct trailing_array *trailing;
~~~

The value of `__builtin_object_size(trailing->c, 1)` is  `-1` ("unknown size"), inhibiting bounds checking. The rationale for this default behavior is to allow for the "struct hack" idiom that allows for trailing arrays to be treated as variable sized (regardless of their declared size)[^Guelton22].

The `-fstrict-flex-arrays` option makes the compiler respect the sizes of trailing array member more strictly. This allows bounds checks added by instrumentation such as `_FORTIFY_SOURCE` or `-fsanitize=bounds`[^gcc-fsanitize-bounds] to be able to correctly determine the size of trailing arrays.

The tradeoff is that code that relies on the "struct hack" for arbitrary sized trailing arrays may break as a result[^Corbet23]. Such code may need to be modified to clearly state that it does not have a specific bound.

The C99 flexible array notation `[]` is the standards-based approach for notating when an array bound is not specifically stated. However, some codebases use the GCC zero-length array extension `[0]`, and some codebases use a one-sized array `[1]` to indicate a flexible array member. Option values `1` and `2` were created so programs that use `[0]` and `[1]` for such cases can have some bounds-checking without modifying their source code.[^Zhao22]

In this guide we recommend using the standard C99 flexible array notation `[]` instead of non-standard `[0]` or misleading `[1]`, and then using `-fstrict-flex-arrays=3` to improve bounds checking in such cases. In this case, code that uses `[0]` for a flexible array will need to be modified to use `[]` instead. Code that uses `[1]` for a flexible arrays needs to be modified to use `[]` and also extensively modified to eliminate off-by-one errors. Using `[1]` is not just misleading[^Edge22], it's error-prone; beware that *existing* code using `[1]` to indicate a flexible array may *currently* have off-by-one errors[^Cook23].

Once in place, bounds-checking can occur in arrays with fixed declared sizes at the end of a struct. In addition, the source code unambiguously indicates, in a standard way, the cases where a flexible array is in use. There is normally no significant performance trade-off for this option (once any necessary changes have been made).

[^gcc-Wstrict-flex-arrays]: GCC team, [Using the GNU Compiler Collection (GCC): Warning Options: `-Wstrict-flex-arrays`](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wstrict-flex-arrays), GCC Manual, 2023-07-27.

[^gcc-fsanitize-bounds]: GCC team, [Program Instrumentation Options: `-Wsanitize=bounds`](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html#index-fsanitize_003dbounds), GCC Manual, 2023-07-27.

[^Zhao22]: Zhao, Qing, "[\[GCC13\]\[Patch\]\[V2\]\[1/2\]Add a new option -fstrict-flex-array[=n] and attribute strict_flex_array(n) and use it in PR101836"](https://gcc.gnu.org/pipermail/gcc-patches/2022-August/599151.html), GCC Mailing List, 2022-08-01.

[^Cook23]: Cook, Kees, and Gustavo A.R. Silva, ["Progress on Bounds Checking in C and the Linux Kernel"](https://www.youtube.com/watch?v=V2kzptQG5_A), Linux Security Summit North America 2023, 2023-05-12.

[^Guelton22]: Guelton, Serge, [The benefits and limitations of flexible array members](https://developers.redhat.com/articles/2022/09/29/benefits-limitations-flexible-array-members), Red Hat Developer, 2022-09-29.

[^Cook21]: Cook, Kees, [GCC Bug 101836 - `__builtin_object_size(P->M, 1) where M is an array and the last member of a struct fails`](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=101836), GCC Bugzilla, 2021-08-09.

[^Edge22]: Edge, Jake, [Safer flexible arrays for the kernel](https://lwn.net/Articles/908817/), LWN, 2022-09-22.

[^Corbet23]: Corbet, Jonathan, ["GCC features to help harden the kernel"](https://lwn.net/Articles/946041/), LWN, 2023-09-05.

---

### Enable run-time checks for variable-size stack allocation validity

| Compiler Flag                                                         |      Supported since      | Description                                                                                   |
|:--------------------------------------------------------------------- |:----------------------:|:--------------------------------------------------------------------------------------------- |
| <span id="-fstack-clash-protection">`-fstack-clash-protection`</span> | GCC 8.0.0<br/>Clang 11.0.0 | Enable run-time checks for variable-size stack allocation validity                            |
| `-param stack-clash-protection-guard-size=`*`<gap size>`*             | GCC 8.0.0<br/>Clang 11.0.0 | Set the stack guard gap size used to determine the probe granularity of the instrumented code |

#### Synopsis

Stack clash protection mitigates attacks that aim to bypass the operating system’s *stack guard gap*. The stack guard gap is a security feature in the Linux kernel that protects processes against sequential stack overflows that overflow the stack in order to corrupt adjacent memory regions.

To avoid the stack guard gap from being bypassed each fresh allocation on the stack needs to probe the freshly allocated memory for the stack guard gap if it is present. Stack clash protection ensures a single allocation may not be larger than the stack guard gap size and the compiler translates larger allocations into a series of smaller sub-allocations. In addition, it ensures that any series of sub-allocations cannot exceed the stack guard gap size without an intervening probe.

Probe instructions can either be implicit or explicit. Implicit probes occur naturally as part of the application’s code, such as when x86 and x86_64 call instructions push the return address onto the stack. Implicit probes do not incur any additional performance cost. Explicit probes, on the other hand, consists of additional probe instructions emitted by the compiler.

#### Performance implications

Applications for which functions allocate at most the size of the stack guard gap of stack space memory at a time do not exhibit adverse performance impact from stack clash protection.

However, stack clash protection may cause performance degradation for applications that perform large allocations that exceed the stack guard gap size. Performance impact scales with the size of large allocations and number of explicit probes required. The performance degradation can be mitigated by increasing the Linux stack guard gap size controlled via the `vm.heap-stack-gap` sysctl parameter) and compiling the application with the corresponding `-param stack-clash-protection-guard-size`. Higher values reduce the number of explicit probes, but a value larger than the kernel guard gap will leave code vulnerable to stack clash style attacks.

Note that `vm.heap-stack-gap` expresses the gap as multiple of page size whereas `stack-clash-protection-guard-size` is expressed as a power of two in bytes. Hence for `vm.heap-stack-gap=256` on x86 (256 * 4KiB = 1MiB gap) the corresponding `stack-clash-protection-guard-size` is 20 (2^20 = 1MiB gap).

---

### Enable run-time checks for stack-based buffer overflows

| Compiler Flag                                                          |       Supported since        | Description                                                                                                      |
|:---------------------------------------------------------------------- |:-------------------------:|:---------------------------------------------------------------------------------------------------------------- |
| <span id="-fstack-protector-strong">`-fstack-protector-strong`</span>  | GCC 4.9.0<br/>Clang 6.0.0 | Enable run-time checks for stack-based buffer overflows using strong heuristic                                   |
| `-fstack-protector-all`                                                | GCC 4.1.2<br/>Clang 6.0.0 | Enable run-time checks for stack-based buffer overflows for all functions                                        |
| `-fstack-protector`<br/>`--param=ssp-buffer-size=`*`<n>`*              | GCC 4.1.2<br/>Clang 6.0.0 | Enable run-time checks for stack-based buffer overflows for functions with character arrays if *n* or more bytes |

#### Synopsis

Stack protector instruments code produced by the compiler to detect overflows in buffers allocated on the program stack at run-time (colloquially referred to as *“stack smashing”*).

The detection is based on inserting a *canary* value into the stack frame in the function prologue. The canary is verified against a reference value in the function epilogue. If they differ the runtime calls `__stack_chk_fail()`, which will terminate the offending application.

This mitigates potential control-flow hijacking attacks that may lead to arbitrary code execution by corrupting return addresses stored on the stack.

Out-of-date versions of GCC may not detect or defend against overflows of dynamically-sized local variables such as variable-length arrays or buffers allocated using `alloca()` when compiling for 64-bit Arm (Aarch64) processors[^Meta23]. Users of GCC-based toolchains for Aarch64 should ensure they use up-to-date versions of GCC 7 or later that support an alternative stack frame layout that places all local variables below saved registers, with the stack-protector canary between them[^Arm23].

Some versions of GCC[^CVE-2023-4039] may not detect or defend against overflows of dynamically-sized local variables such as variable-length arrays or buffers allocated using alloca() when compiling for 64-bit Arm (Aarch64) processors[^Meta23]. Users of GCC-based toolchains for Aarch64 should, before depending on it, determine if they support an alternative stack frame layout that places all local variables below saved registers, with the stack-protector canary between them[^Arm23].

#### Performance implications

Stack protector supports three different heuristics that are used to determine which functions are instrumented with run-time checks during compilation:

- `-fstack-protector-strong`[^Han11]: instrument any function that  
  - takes the address of any of its local variables on the right-hand-side of an assignment or as part of a function argument  
  - allocates a local array, regardless of type or length  
  - allocates a local struct or union which contains an array, regardless of the type of length of the array  
  - has explicit local register variables

- `-fstack-protector`: instrument functions that call alloca() or allocate character arrays of n bytes or more in size . The threshold for instrumentation is adjustable via the `--param=ssp-buffer-size=`*`n`* option (default: 8 bytes).  
- `-fstack-protector-all`: instrument all functions.

The performance overhead is dependent on the number of function’s instrumented and the frequency at which instrumented functions are activated at run-time. Enabling `-fstack-protector-strong` is recommended as it provides a good balance between function coverage and performance. Projects using older compiler versions can consider `-fstack-protector-all` or `-fstack-protector` with a stricter threshold, e.g. `--param=ssp-buffer-size=4`.

#### When not to use?

`-fstack-protector-strong` is recommended for all applications with conventional stack behavior. Applications with hand-written assembler optimization that make assumptions about the layout of the stack may be incompatible with stack-protector functionality.

[^Han11]: Shen, Han, [New stack protector option for gcc](https://docs.google.com/document/d/1xXBH6rRZue4f296vGt9YQcuLVQHeE516stHwt8M9xyU), Google Docs, 2011-11-30.

[^CVE-2023-4039]: Common Vulnerability Enumeration Database, [CVE-2023-4039](https://www.cve.org/CVERecord?id=CVE-2023-4039), 2023-09-13.

[^Meta23]: Hebb, Tom, [GCC's -fstack-protector fails to guard dynamic stack allocations on ARM64](https://github.com/metaredteam/external-disclosures/security/advisories/GHSA-x7ch-h5rf-w2mf), GitHub metaredteam/external-disclosures Advisories, 2023-09-12.

[^Arm23]: Arm, [GCC Stack Protector Vulnerability AArch64](https://developer.arm.com/Arm%20Security%20Center/GCC%20Stack%20Protector%20Vulnerability%20AArch64), Arm Security Center, 2023-09-12.

---

### Enable control-flow and branch protection against return-oriented programming and jump-oriented programming attacks

| Compiler Flag                                                                 | Supported since           | Description                                                                                                                                     |
|:------------------------------------------------------------------------------|:-------------------------:|:----------------------------------------------------------------------------------------------------------------------------------------------- |
| <span id="-fcf-protection=full">`-fcf-protection=full`</span><br/>            | GCC 8.0.0<br/>Clang 7.0.0 | Enable control-flow protection against return-oriented programming (ROP) and jump-priented programming (JOP) attacks on x86_64                  |
| <span id="-fcf-protection=branch">`-fcf-protection=branch`</span><br/>        | GCC 8.0.0<br/>Clang 7.0.0 | Enable control-flow protection against JOP on x86_64                                                                                            |
| <span id="-fcf-protection=return">`-fcf-protection=return`</span><br/>        | GCC 8.0.0<br/>Clang 7.0.0 | Enable control-flow protection against ROP on x86_64                                                                                            |
| <span id="-fcf-protection=none">`-fcf-protection=none`</span><br/>            | GCC 8.0.0<br/>Clang 7.0.0 | Disable control-flow protections                                                                                                                |
| <span id="-fcf-protection=check">`-fcf-protection=check`</span><br/>          | GCC 8.0.0<br/>Clang 7.0.0 | Instruct linker to verify all object files in final link with link-time optimization (LTO) are compiled with identical control-flow protections |
| <span id="-mbranch-protection-standard">`-mbranch-protection=standard`</span> | GCC 9.0.0<br/>Clang 8.0.0 | Enable branch protection to counter ROP and JOP attacks on AArch64                                                                              |

#### Synopsis

Return-oriented programming (ROP) uses an initial subversion (such as a buffer overflow) to perform an indirect jump that executes a different sequence of instructions. This is often existing code being misused, so these are often called "code-reuse attacks". A countermeasure is to ensure that return addresses are correct and jump addresses point to known targets for indirect calls or branches. This is not a complete solution, but it makes attacks harder to perform.

Since GCC 14 changing the default control-flow protection value for x86_64 architectures (`full`, equivalent to `branch` and `return`) requires passing `-fcf-protection=none` followed by the desired `-fcf-protection` option, e.g, `-fcf-protection=none -fcf-protection=branch` or `-fcf-protection=none -fcf-protection=return`[^gcc-release-notes-14].

The `-fcf-protection=check` is ignored at compilation time but instructs the linker to verify that all object files in final link with link-time optimization (LTO) are compiled with identical control-flow protections. Mixing object files with different control-flow protections may cause run-time failures.

#### Performance implications

There are performance implications but they are typically mild due to hardware assistance. The `-fcf-protection=full` flag enables Intel's Control-Flow Enforcement Technology (CET) [^IntelCET], which introduces shadow stack (SHSTK) and indirect branch tracking (IBT).

The `-mbranch-protection=standard` flag invokes similar protections in the AArch64. In clang `-mbranch-protection=standard` is equivalent to `-mbranch-protection=bti+pac-ret` and invokes the AArch64 Branch Target Identification (BTI) and Pointer Authentication using key A (pac-ret) [^Armclang]. It is important to note that, depending on the target platform, the compiler may generate hint-space instructions for both AArch64 PAC and BTI [^ArmclangExample]. These hint instructions allow the binary to run on machines that do not support the underlying hardware features. However, they are sometimes less efficient, and the intended branch protection is not enforced when the hardware support is missing.

#### Additional Considerations

Intel CET shadow stack requires Linux Kernel version 6.6 or higher and glibc version 2.39 or higher. Shadow stack support must, in addition, be enabled at run-time by setting the corresponding hardware capability tunable for glibc via the `GLIBC_TUNABLES` environmental variable [^glibc-tunables]: `export GLIBC_TUNABLES=glibc.cpu.hwcaps=SHSTK`.

AArch64 BTI and PAC are only usable on platforms that expose these architectural features. Specifically, PAC requires a CPU based on Arm v8.3-A or later, while BTI requires a CPU based on Arm v8.5-A or later. For userspace applications — particularly in GNU/Linux environments, as recommended in Tables 1 and 2 — the operating system plays a crucial role. On modern Linux systems (typically Linux Kernel version 5.8 or later), PAC and BTI support is enabled by default if the hardware provides the feature.

[^Armclang]: ARM Developer, [Arm Compiler armclang Reference Guide version 6.24 -mbranch-protection](https://developer.arm.com/documentation/101754/0624/armclang-Reference/armclang-Command-line-Options/-mbranch-protection), 2025-03-28.

[^ArmclangExample]: ARM Developer, [Examples for the armclang -mbranch-protection command-line option, version 6.24](https://developer.arm.com/documentation/101754/0624/armclang-Reference/armclang-Command-line-Options/Examples-for-the-armclang--mbranch-protection-command-line-option), 2025-03-28.

[^IntelCET]: Intel, ["A Technical Look at Intel’s Control-flow Enforcement Technology"](https://www.intel.com/content/www/us/en/developer/articles/technical/technical-look-control-flow-enforcement-technology.html), 2020-06-13.

[^glibc-tunables]: GNU C Library team, [Tunables](https://www.gnu.org/software/libc/manual/html_node/Tunables.html), GNU C Library (glibc) manual, 2024-07-22.

[^gcc-release-notes-14]: GCC team, [GCC 14 Release Series Changes, New Features, and Fixes](https://gcc.gnu.org/gcc-14/changes.html), 2024-08-10.

### Restrict dlopen calls to shared objects

| Compiler Flag                                                                                            | Supported since  | Description                                                  |
|:-------------------------------------------------------------------------------------------------------- |:-------------:|:------------------------------------------------------------ |
|  <span id="-Wl,-z,nodlopen">`-Wl,-z,nodlopen`</span><br/> | Binutils 2.10.0 | Restrict `dlopen(3)` calls to shared objects |

#### Synopsis

The `nodlopen` option passed to the linker when building shared objects will mark the resulting object as not available to `dlopen(3)` calls. This can help in reducing an attacker's ability to load and manipulate shared objects. Loading new objects or duplicating an already existing shared object in a process can constitute a part of the attack chain in runtime exploitation.

The `nodlopen` restrictions are based on setting the `DF_1_NOOPEN` flags in the object’s `.dynamic` section tags. Since the enforcement of restricted calls is done inside libc when `dlopen(3)` are called it is possible for attackers to bypass the check by 1) manipulating the tag embedded in the object if they have the ability to modify the object file on disk, or 2) bypassing `dlopen(3)` and loading shared objects through attacker controlled code, e.g., pieces of shellcode or return-oriented-programming gadgets. However, restrictions on `dlopen(3)` put in place at link time can still be useful in restricting the attacker before they have obtained arbitrary code execution capabilities.

#### Performance implications

None, marking shared objects as restricted to `dlopen(3)` does not have an impact on performance at run time.

#### When not to use?

In some cases it is desirable for applications to manage the loading of libraries directly via `dlopen(3)` without relying on the conventional dynamic linking. Such situations include:

- Selecting application plugins to load
- Selecting a version of a library optimized for particular CPUs. Leveraged by, e.g., math libraries that provide different implementations of mathematical operations for different environments.
- Selecting an implementation of an API by different vendors
- Delay loading of shared libraries to decrease application start times. (See also lazy binding in Section 2.11)

Since `nodlopen` interferes with applications that rely on to `dlopen(3)` to manipulate shared objects they cannot be used with applications that rely on such functionality.

---

### Enable data execution prevention

| Compiler Flag                                                                                                         | Supported since  | Description                                                                         |
|:--------------------------------------------------------------------------------------------------------------------- |:-------------:|:----------------------------------------------------------------------------------- |
| <span id="-Wl,-z,noexecstack">`-Wl,-z,noexecstack`</span> | Binutils 2.14.0 | Enable data execution prevention by marking stack memory as non-executable |

#### Synopsis

All major modern processor architectures incorporate memory management primitives that give the OS the ability to mark certain memory areas, such as the stack and heap, as non-executable, e.g., the AMD *“non-execute”* (NX) bit and the Intel *“execute disable”* (XD) bit. This mechanism prevents the stack or heap from being used to inject malicious code during a run-time attack.

The `-Wl,-z,noexecstack` option tells the linker to mark the corresponding program segment as non-executable which enables the OS to configure memory access rights correctly when the program executable is loaded into memory.

#### Performance implications

None, marking the stack and/or heap as non-executable does not have an impact on performance at run time.

#### When not to use?

Some language-level programming constructs, such as taking the address of a nested function[^gnuc-nestedfuncs] (a GNU C extension to ISO standard C) requires special compiler handling which may not work correctly if the linker mark stack segments as non-executable[^gcc-trampolines].

Consequently the `-Wl,-z,noexecstack` option works best when combined with appropriate warning flags ([`-Wtrampolines`](#-Wtrampolines) where available) that indicate whether stack virtual memory protection interferes with language constructs.

#### Additional Considerations

Modern compilers perform this marking automatically through the `p_flags` field in the `PT_GNU_STACK` program header entry and the linker consults the entries for consituent objects when deciding the marking for the produced binary. If the marking is missing the kernel or the dynamic linker needs to assume the binary might need executable stack.

In Linux prior to kernel version 5.8 a missing `PT_GNU_STACK` marking on x86_64 will also expose other readable pages (such as the program `.data` section) as executable[^Hernandez2013], not just their stack memory. While this behavior has since changed for x86_64[^Cook2020], we recommend enabling `-Wl,-z,noexecstack` explicitly during linking to ensure produced binaries benefit from data execution prevention for both the stack and other program data as widely as possible and guarding against compatibility issues by using the [`-Wtrampolines`](#-Wtrampolines) in tandem when available. For example, binaries on 32-bit x86 architectures must be equipped with a `PT_GNU_STACK` marking to benefit from data execution prevention for stack and other program data even on more recent Linux kernel versions.

[^gcc-trampolines]: GCC team, [Support for Nested Functions.](https://gcc.gnu.org/onlinedocs/gccint/Trampolines.html), GCC Internals, 2023-07-27.

[^Hernandez2013]: Hernandez, Alejandro, [A Short Tale About executable_stack in elf_read_implies_exec() in the Linux Kernel](https://ioactive.com/a-short-tale-about-executable_stack-in-elf_read_implies_exec-in-the-linux-kernel/), IOActive, 2013-11-27.

[^Cook2020]: Cook, Kees, [x86/elf: Disable automatic READ_IMPLIES_EXEC on 64-bit](https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=9fccc5c0c99f238aa1b0460fccbdb30a887e7036), Linux Kernel Source, 2020-03-26.

---

### Mark relocation table entries resolved at load-time as read-only

| Compiler Flag                                                                               | Supported since  | Description                                                       |
|:------------------------------------------------------------------------------------------- |:-------------:|:----------------------------------------------------------------- |
| <span id="-Wl,-z,relro">`-Wl,-z,relro`</span><br/><span id="-Wl,-z,now">`-Wl,-z,now`</span> | Binutils 2.15.0 | Mark relocation table entries resolved at load- time as read-only |

*“Read-only relocation”* (RELRO) marks relocation table entries as read-only after they have been resolved by the dynamic linker/loader (`ld.so`). Relocation is the process performed by `ld.so` that connects unresolved symbolic references to proper addresses of corresponding in-memory objects.

Marking relocations read-only will mitigate run-time attacks that corrupt Global Offset Table (GOT) entries to hijack program execution or to cause unintended data accesses. Collectively such attacks are referred to as *GOT overwrite attacks* or *GOT hijacking*.

RELRO can be instantiated in one of two modes: partial RELRO or full RELRO. Full RELRO is necessary for effective mitigation for GOT overwrite attacks; partial RELRO is not sufficient.

Partial RELRO (`-Wl,-z,relro`) will mark certain ELF sections as read-only after initialization by the runtime loader. These include `.init_array`, `.fini_array`, `.dynamic`, and the non-PLT portion of `.got`. However, in partial RELRO the auxiliary procedure linkage portion of the GOT (`.got.plt`) is still left writable to facilitate late binding.

Full RELRO (`-Wl,-z,relro -Wl,-z,now`) disables lazy binding. This allows `ld.so` to resolve the entire GOT at application startup and mark also the PLT portion of the GOT as read-only.

#### Performance implications

Since lazy binding is primarily intended to speed up application startup times by spreading out the symbol resolution operations throughout the lifetime of the application, enabling full RELRO can increase the startup time for applications with large numbers of dynamic dependencies. The performance impact scales with the number of dynamically linked functions.

#### When not to use?

Applications that are sensitive to the performance impact on startup time should consider whether the increase in startup time caused by full RELRO impacts the user experience. As an alternative, developers can consider statically linking large library dependencies to the application executable.

Static linking avoids the need for dynamic symbol resolution altogether but can make it more difficult to deploy patches to dependencies compared to upgrading shared libraries. Developers need to consider whether static linking is discouraged in their deployment scenarios, e.g., major Linux distributions generally forbid static linking of shared application dependencies.

#### Additional considerations

To benefit from partial and full RELRO both the application executable and any libraries that are linked to the application must be built with the appropriate compiler options. If `ld.so` loads any non-RELRO libraries, RELRO will be disabled for that application.

---

### Build as position-independent code

| Compiler Flag                                  |            Supported since            | Description                               |
|:---------------------------------------------- |:----------------------------------:|:----------------------------------------- |
| <span id="-fPIE_-pie">`-fPIE -pie`</span>      |   Binutils 2.16.0<br/>Clang 5.0.0    | Build as position-independent executable. |
| <span id="-fPIC_-shared">`-fPIC -shared`</span> | < Binutils 2.6.0<br/>Clang 5.0.0    | Build as position-independent code.       |

#### Synopsis

Position-independent code (PIC) and executables (PIE) are machine code objects that execute properly regardless of the exact address at which they are loaded at in process memory.

GNU/Linux requires program executable to be built as PIE in order to benefit from address-space layout randomization (ASLR). ASLR is the primary means of mitigating code-reuse exploits, e.g., *return-to-libc* and *return-oriented programming* in modern GNU/Linux distributions. In code-reuse exploits the adversary corrupts vulnerable code pointers, such as return addresses stored on the program stack and makes them refer to pre-existing executable code in program memory. ASLR randomizes the location of shared libraries and the program executable every time the object is loaded into memory to make memory addresses useful in exploits harder to predict.

#### Performance implications

Negligible on 64-bit architectures.

On 32-bit x86 PIC exhibits moderate performance penalties (5-10%)[^ubuntu-hardening]. This is due to data accesses using mov instructions on 32-bit x86 only support absolute addresses. To make the code position-independent memory references are transformed to lookup memory addresses from a global offset table (GOT) populated at load-time with the correct addresses to program data. Consequently, data references require an additional memory load compared to non-PIC code on 32-bit x86. However, the main reason for the performance penalty is the increased register pressure resulting from keeping the lookup address to the GOT available in a register[^Bendersky11a].

The x86_64 architecture supports a variant of mov and certain other instructions that address memory using offsets relative to the instruction pointer (i.e., the address of the currently executing instruction). This is referred to as RIP-relative addressing. PIC on x86_64 uses RIP-relative addressing for accessing the GOT which relieves the register pressure associated with PIC on 32-bit x86 and results in a smaller impact on performance. Shared libraries are created PIC on x86_64 by default[^Bendersky11b].

#### When not to use?

Resource-constrained embedded systems may save memory by *prelinking* executables at compile time. Prelinking performs some relocation decisions, normally made by the dynamic linker, ahead of time. As a result, fewer relocations need to be performed by the dynamic linker, reducing startup time and memory consumption for applications. PIE does not prevent prelinking but enabling ASLR on prelinked binaries overrides the compile-time decisions, thus nullifying the run-time memory savings gained by prelinking. If the memory savings gained by prelinking are important for a system PIE can be enabled for a subset of executables that are at higher risk, e.g., applications that process untrusted external input.

[^Bendersky11a]: Bendersky, Eli, [Position Independent Code (PIC) in shared libraries](https://eli.thegreenplace.net/2011/11/03/position-independent-code-pic-in-shared-libraries/), Eli Bendersky's website, 2011-11-03.

[^Bendersky11b]: Bendersky, Eli. [Position Independent Code (PIC) in shared libraries on x64](https://eli.thegreenplace.net/2011/11/11/position-independent-code-pic-in-shared-libraries-on-x64), Eli Bendersky's website, 2011-11-11.

---

### Do not delete null pointer checks

| Compiler Flag                   | Supported since  | Description                                                       |
|:------------------------------- |:-------------:|:----------------------------------------------------------------- |
| <span id="-fno-delete-null-pointer-checks">`-fno-delete-null-pointer-checks`</span> | GCC 3.0.0<br/>Clang 7.0.0   | Force retention of null pointer checks                                                        |

#### Synopsis

If a code defect references a potentially-null pointer, compilers are allowed to remove the null pointer check, under the theory that since developers never make mistakes, the pointer check is unnecessary.

Since developers *do* make mistakes, without this option, the result is that the source code may *appear* to request a check, one that is necessary for security, but the check will *not* be done by the compiled executable. This option is one of several that are recommended and used by various sources to address real-world errors [^Wang2012].

[^Wang2012]: Wang, Xi, Haogang Chen, Alvin Cheung, Zhihao Jia, Nickolai Zeldovich, and M. Frans Kaashoek, 2012, "Undefined Behavior:What Happened to My Code?", APSys ‘12, ACM, <https://pdos.csail.mit.edu/papers/ub:apsys12.pdf>

An example of this defect occurred in the Linux kernel and led to a serious vulnerability. In the following simplified Linux kernel code, the construct `dev->priv` presumes `dev` is non-null. That means that if `dev` is null, we have undefined behavior.  In this case, the C compiler presumed that `dev` is not null, and threw away the code `if (!dev) return` ([^Zdrnja2009] for more):

~~~ c
static void __devexit agnx_pci_remove (struct pci_dev *pdev)
{
  struct ieee80211_hw *dev = pci_get_drvdata(pdev);
  struct agnx_priv *priv = dev->priv; 

  if (!dev) return;

  ... do stuff using dev ...
}
~~~

[^Zdrnja2009]: Zdrnja, Bojan Zdrnja, 2009-07-17, A new fascinating Linux kernel vulnerability, <https://isc.sans.edu/diary/A+new+fascinating+Linux+kernel+vulnerability/6820>

The Linux kernel now enables `-fno-delete-null-pointer-checks`; as explained later by Linux Torvalds [^Torvalds2018], "we had buggy code that accessed a pointer before the NULL pointer check, but the bug was "benign" as long as the compiler didn't actually remove the check. ...  Removing the NULL pointer check turned a benign bug into a trivially exploitable one by just mapping user space data at NULL ... (which avoided the kernel oops, and then made the kernel use the user value!)... the kernel generally really doesn't want optimizations that are perhaps allowed by the standard, but that result in code generation that doesn't match the source code."

[^Torvalds2018]: Torvalds, Linus, 2018-04-04, <https://lkml.org/lkml/2018/4/4/601>

The option `-fno-delete-null-pointer-checks` forces the retention of such checks even when in theory they are unnecessary, and is in use in the Linux kernel.

#### Performance implications

There are normally no significant performance implications. Null pointer checks are extremely quick and can often be performed in parallel by the CPU.

---

### Define behavior for signed integer and pointer arithmetic overflows

| Compiler Flag                                                 | Supported since | Description                                                                                                                                    |
|:------------------------------------------------------------- |:---------------:|:---------------------------------------------------------------------------------------------------------------------------------------------- |
| <span id="-fno-strict-overflow">`-fno-strict-overflow`</span> |  GCC 8.5.0      | Signed integer overflows on addition, subtraction, multiplication, and pointer arithmetic wraps around using two's-completment representation  |
| <span id="-fwrapv">`-fwrapv`</span>                           |  GCC 3.4.0      | Signed integer overflows on addition, subtraction, and multiplication wraps around using twos-completment representation                       |
| <span id="-fwrapv-pointer">`-fwrapv-pointer`</span>           |  GCC 8.5.0      | Pointer arithmetic and multiplication wraps around using two's-complement representation                                                       |
| <span id="-ftrapv">`-ftrapv`</span>                           |  GCC 3.3.0      | Signed integer overflows on addition, subtraction and multiplication trap with `SIGABRT`                                                       |

#### Synopsis

In C and C++ unsigned integers have long been defined as "wrapping around". However, C and C++ compilers, by default, assume that overflows do not occur in other circumstances. Overflow when doing arithmetic with signed numbers is considered undefined in the language specifications. This allows the compiler to assume strict pointer semantics: if adding an offset to a pointer does not produce a pointer to the same object, the addition is undefined. In practice, this means that important security checks written in the source code may be silently ignored when generating executable code.

For example, here is some code from `fs/open.c` of the Linux kernel [^Wang2012]:

~~~ c
int do_fallocate(..., loff_t offset, loff_t len)
{
    struct inode *inode = ...;
    if (offset < 0 || len <= 0)
        return -EINVAL;
    /* Check for wrap through zero too */
    if ((offset + len > inode->i_sb->s_maxbytes)
        || (offset + len < 0))
        return -EFBIG;
    ...
}
~~~

A developer *might* expect that the computation `offset + len` would produce a useful value for comparison. However, if the compiler is in `strict-overflow` mode, the compiler is free to determine that `offset + len` is always more than 0, and thus it can omit an important security check.

The Linux kernel enables `-no-strict-overflow` to reduce the likelihood that important security checks in the source code will be silently ignored by the compiler.

Alternatives to `-no-strict-overflow` are the `-fwrapv` and `-ftrapv` options. With `-fwrapv`, integer signed overflow wraps (and is thus defined). With `-ftrapv`, signed integer overflows trap, e.g., on x86 an overflow causes a `SIGABRT` signal to the application.

Since GCC 8.5 `-no-strict-overflow` is equivalent to `-fwrapv -fwrapv-pointer` while GCC documentation recommends `-fsanitize=signed-integer-overflow` for diagnosing signed integer overflow issues during testing and debugging. In prior GCC versions `-no-strict-overflow` does not fully enforce two's complement on signed integers, allowing for additional optimizations[^Wang2012]. In Clang, `-no-strict-overflow` option is considered a synonym for `-fwrapv`.

#### When not to use?

The C and C++ standards since C23[^C2023] and C++20[^CPP2020] only support two’s complement representation for signed integer types[^Bastien2024]. Previous editions of these standards additionally allowed other sign representations. Code targeting one these previous language editions and requires a specific signed integer representation becomes less portable in a very subtle way. However, in practice, neither GCC nor Clang support other representations [^Bastien2018]. This means that even prior to C23 and C++20 the GCC and Clang implementations of these langauges are effectively two’s complement. Consequently we believe most code will benefit from `-fno-strict-overflow` or its alternatives.

#### Performance implications

Each of these options gives the compiler less freedom for optimizing the resulting machine code compared to the default `-fstrict-overflow` behavior. For example, under `-fstrict-overflow` semantics, expressions such as `i + 10 > i` will always be true for signed `i`, allowing the expression to be replaced at compile time with a constant value. As discussed above, if such expressions occur in condition checks the compiler may optimize away entire code paths when the expression can be evaluated at compile time. In contrast, under `-fno-strict-overflow` those expression must be evaluated at run-time in case of overflows that wrap around the value, thus preventing some optimizations. On the other hand, treating overflows as undefined behavior will only yield optimal behavior if the programmer can be certain the program will never accept inputs that cause overflows.

The `-ftrapv` option requires the compiler to emit checks to detect and trap overflows on signed integers unless it has compile time information of the value range to prove the operation doesn't overflow. As a result, `-ftrapv` is expected to have the largest performance impact out the options covered in this section.

### Other considerations

During link-time optimization (LTO), different compilation units may have been built with different arithmetic overflow behavior. The `-fno-strict-overflow`, `-fwrapv`, `-fno-trapv` and `-fno-strict-aliasing` are passed through to the link stage and take precedece over `-fstrict-overflow` semantics for compilation units with conflicting behavior[^gcc-flto]. In practice this means that software where certain modules benefit from `-fstrict-overflow` for perormance, but others use `-fno-strict-overflow` to improve security, may loose out on the performance benefits with `-fno-strict-overflow` taking precedence during LTO.

[^gcc-flto]: GCC team, [Options That Control Optimization: -flto](https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html#index-flto), GCC Manual, 2024-05-07.

[^C2023]: ISO/IEC, [Programming languages — C ("C23")](https://www.open-std.org/jtc1/sc22/wg14/www/docs/n3220.pdf), ISO/IEC ISO/IEC 9899:2024, 2024. Note: The official ISO/IEC specification is paywalled and therefore not publicly available. The final specification draft is publicly available.

[^CPP2020]: ISO/IEC, [Programming languages — C++ ("C++20")](https://isocpp.org/files/papers/N4860.pdf), ISO/IEC ISO/IEC 14882:2020, 2022. Note: The official ISO/IEC specification is paywalled and therefore not publicly available. The final specification draft is publicly available.

[^Bastien2024]: Bastien, JF, [P3477R0: There are exactly 8 bits in a byte](https://open-std.org/JTC1/SC22/WG21/docs/papers/2024/p3477r0.html), Published ISO/IEC JTC1/SC22/WG21 Proposal, 2024-10-15.

[^Bastien2018]: Bastien, JF, [P0907R4: Signed Integers are Two’s Complement](https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2018/p0907r4.html), Published ISO/IEC JTC1/SC22/WG21 Proposal, 2018-10-06

---

### Do not assume strict aliasing

| Compiler Flag                                                 | Supported since             | Description                   |
|:------------------------------------------------------------- |:---------------------------:|:------------------------------|
| <span id="-fno-strict-aliasing">`-fno-strict-aliasing`</span> | GCC 2.95.3<br/>Clang 18.0.0 | Do not assume strict aliasing |

#### Synopsis

Pointers can be cast from one type to another. Standards have strict rules for aliasing, requiring that pointers of different types do *not* alias in most cases. However, in practice, many constructs depend on such aliasing even though it is undefined. By default, undefined code can do *anything* and this is undesirable. [^Wang2012]

This option eliminates this problem. It's used by the Linux kernel.

---

### Perform trivial auto variable initialization

| Compiler Flag                                                       | Supported since     | Description                                  |
|:--------------------------------------------------------------------|:-------------------:|:---------------------------------------------|
| <span id="-ftrivial-auto-var-init">`-ftrivial-auto-var-init`</span> | GCC 12.0.0<br/>Clang 8.0.0| Perform trivial auto variable initialization |

#### Synopsis

This option controls if (and how) automatic variables are initialized. Even with the option, the compiler will consider an automatic variable as uninitialized unless it is explicitly initialized.

This option has three choices:

- `uninitialized` - automatic variables are not initialized. This is the default.
- `pattern` - automatic variables are initialized with a value likely to cause a crash if there is a logic bug.
- `zero` - automatic variables are initialized with zeros, to reduce the risk of a logic bug leading to a security vulnerability or other problems.

We recommend using `zero` for production code, to reduce the risk of a logic bug leading to a security vulnerability.

This setting can sometimes interfere with other tools that are being used to monitor executable code, since it is expressly setting a value that was not set by the source code.

<!-- More information
https://gcc.gnu.org/onlinedocs/gcc/Optimize-Options.html#index-ftrivial-auto-var-init
https://reviews.llvm.org/D125142
https://godbolt.org/z/6qTPz9n6h
-->

---

### Enable exception propagation to harden multi-threaded C code

| Compiler Flag                                | Supported since          | Description                                                  |
|:---------------------------------------------|:------------------------:|:-------------------------------------------------------------|
|<span id="-fexceptions">`-fexceptions`</span> | GCC 2.95.3<br/>Clang 2.6.0 | Enable exception propagation to harden multi-threaded C code |

#### Synopsis

The `-fexceptions` option, when enabled for C code, makes GCC and Clang generate frame unwind information for all functions. This option is enabled by default for C++ that require exception handling but enabling it for also C code allows glibc's implementation of POSIX thread cancellation[^man7-pthreads] to use the same unwind information instead of `setjmp` / `longjmp` for stack unwinding[^Weimer2017a].

Enabling `-fexceptions` is recommended for hardening of multi-threaded C code as without it, the implementation Glibc's thread cancellation handlers may spill a completely unprotected function pointer onto the stack[^Weimer2017b]. This function pointer can simplify the exploitation of stack-based buffer overflows even if the thread in question is never canceled[^Weimer2018].

#### Performance implications

Enabling C++ style exception propagation for C code generally does not impact its performance as it does not impact the program's normal control flow. However, on some target architectures such as x86_64, `-fexceptions` causes the compiler to generate frame unwind information for all functions, which can produce significant increases in the size of the produced binaries.

#### When not to use?

When developing single-threaded C code which does not need to interoperate with C++ for resource-constrained systems where the associated binary size increase is undesirable this option can be safely omitted.

#### Additional Considerations

The `-fexceptions` option is also needed for C code that needs to interoperate with C++ code that relies on exceptions. For this reason `-fexceptions` is often enabled by default for C language libraries provided by major Linux distributions.

[^man7-pthreads]: Kerrisk, Michael, [pthread_cancel](https://man7.org/linux/man-pages/man3/pthread_cancel.3.html), man7.org, 2023-12-22.

[^Weimer2017a]: Weimer, Florian, [\[PATCH\] pthread_cleanup_push macro generates warning when -Wclobbered is set](https://sourceware.org/pipermail/libc-alpha/2017-November/088474.html), Libc-alpha mailing list, 2017-11-14.

[^Weimer2017b]: Weimer, Florian, [\[11/12/13/14 Regression\] Indirect call generated for pthread_cleanup_push with constant cleanup function](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=61118#c13), GCC Bugzilla, 2017-11-21.

[^Weimer2018]: Weimer, Florian, [Recommended compiler and linker flags for GCC](https://developers.redhat.com/blog/2018/03/21/compiler-and-linker-flags-gcc), Red Hat Developer, 2018-03-21.

---

### Enable pre-determined set of hardening options in GCC

| Compiler Flag                             | Supported since | Description                                                         |
|:----------------------------------------- |:---------------:|:------------------------------------------------------------------- |
| <span id="-fhardened">`-fhardened`</span> | GCC 14.0.0      | Enable pre-determined set of hardening options for C and C++ in GCC |
| <span id="-Whardened">`-Whardened`</span> | GCC 14.0.0      | Warn if options implied by `-fhardened` are downgraded or disabled  |

The `-fhardened` umbrella option enables a pre-determined set of hardening options for C and C++ on GNU/Linux targets[^gcc-fhardened]. The precise set of options may change between major releases of GCC. The exact set of options for a specific GCC version can be displayed using the `--help=hardened` option.

#### Additional Considerations

Options explicitly specified on the compiler command line always take precedence over options implied by `-fhardened`. For example, `-fhardened` in GCC 14 enables [`-fstack-protector-strong`](#-fstack-protector-strong) but specifying `-fstack-protector -fhardened` or `-fhardened -fstack-protector` on the compiler command line will enable the weaker `-fstack-protector` instead of `-fstack-protector-strong`.

By default, GCC will issue a warning when flags implied by `-fhardened` are downgraded or disabled due to options on the command line taking precedence or missing pre-requirements, such as using [`_FORTIFY_SOURCE`](#-D_FORTIFY_SOURCE=3) without optimization level `-O1` or higher:

~~~shell
warning: '-fstack-protector-strong' is not enabled by '-fhardened' because it was specified on the command line [-Whardened]`
warning: '_FORTIFY_SOURCE' is not enabled by '-fhardened' because optimizations are turned off [-Whardened]
~~~

These warnings can be controlled explcitily via the `-Whardened` option.

[^gcc-fhardened]: GCC team, [Program Instrumentation Options: `-fhardened`](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html#index-fhardened), GCC Manual, 2024-05-07.

---

### Allow linker to omit libraries specified on the command line to link against if they are not used

| Compiler Flag                                                                       | Supported since | Description                                                                                       |
|:----------------------------------------------------------------------------------- |:---------------:|:------------------------------------------------------------------------------------------------- |
| <span id="-Wl,--as-needed">`-Wl,--as-needed`</span>                                 | Binutils 2.20.0 | Allow linker to omit libraries specified on the command line to link against if they are not used |
| <span id="-Wl,--no-copy-dt-needed-entries">`-Wl,--no-copy-dt-needed-entries`</span> | Binutils 2.20.0 | Stop linker from resolving symbols in produced binary to transitive dependencies                  |

The `--as-needed` option tells the GNU linker to only link the libraries containing symbols actually used by the produced binary. This contributes to minimizing the attack surface of the produced binary by precluding the execution of static initializers and deconstructors from unneeded libraries, and can also reduce the set of code available to code-reuse exploits, e.g., return-oriented programming.

The `--as-needed` option is enabled by default by many Linux distributions including Debian[^debian-dsolinking], Gentoo[^Berkholz08], Red Hat[^fedora-hardening], and SUSE Linux[^debian-dsolinking].

The `--no-copy-dt-needed-entries` stops the linker from resolving symbols in the produced binary to transitive library depenendecies. This enforces that the produced binary must be made to explicitly link against all of its actual dependencies. This is the default behavior in the GNU linker since 2.22.

#### Performance implications

The `--as-needed` and `--no-copy-dt-needed-entries` can improve startup times by precluding unneeded libraries from being loaded and avoid the execution of initialization code in such libraries.

#### When not to use?

In rare cases applications may link to libraries solely for the purpose of running their static initializers. As `--as-needed` precludes the produced binary from being linked against libraries from which no symbols are resolved it conflicts with software that relies on such static initialization[^gentoo-as-needed].

[^debian-dsolinking]: Software in the Public Interest, [ToolChain DSOLinking](https://wiki.debian.org/ToolChain/DSOLinking), Debian Wiki,  2018-10-14.

[^Berkholz08]: Berkholz, Donnie, [Bug 234710 - as-needed by default](https://bugs.gentoo.org/234710), Gentoo's Bugzilla, 2008-08-14.

[^gentoo-as-needed]: Gentoo Foundation, [Project:Quality Assurance/As-needed](https://wiki.gentoo.org/wiki/Project:Quality_Assurance/As-needed), Gentoo Wiki, 2022-07-22.

---

## Discouraged Compiler Options

This section describes discouraged compiler and linker option flags that may lead to potential defects with security implications in produced binaries.

Table 3: List of discouraged compiler and linker options.

| Compiler Flag                   | Supported since  | Description                                                       |
|:------------------------------- |:-------------:|:----------------------------------------------------------------- |
| [`-Wl,-rpath,`*`path_to_so`*](#-Wl,-rpath) | Binutils 2.11.0 | Hard-code run-time search paths in executable files or libraries |

---

### Hard-code run-time search paths in executable files or libraries

| Compiler Flag                   | Supported since  | Description                                                       |
|:------------------------------- |:-------------:|:----------------------------------------------------------------- |
| <span id="-Wl,-rpath">`-Wl,-rpath,`*`path_to_so`*</span> | Binutils 2.11.0 | Hard-code run-time search paths in executable files or libraries |

#### Synopsis

The `-rpath` option records the specified path to a shared object files to the `DT_RPATH` or `DT_RUNPATH` header value in the produced ELF binary. The recorded rpath may override or supplement the system default search path used by the dynamic linker to find the specified library dependency.

The rpath provided by the original (and default) `DT_RPATH` entry takes precedence over environmental overrides such as `LD_LIBRARY_PATH`, and an object’s `DT_RPATH` can be used for resolving dependencies of another object. These design errors were rectified with `DT_RUNPATH`, which has a lower precedence with respect to `LD_LIBRARY_PATH` and only affects the search path of an object’s own, immediate dependencies[^Kerrisk23].

Setting either `DT_RPATH` or `DT_RUNPATH` in release binaries may lead to security vulnerabilities under certain conditions. An attacker may be able to supply their own shared files in the target directories and override the operating system's libraries, resulting in arbitrary code execution.

Relative paths (e.g. `.` or `./lib`) are resolved relative to the working directory, which may be set by an attacker to a directory with a malicious dependency.

The keyword `$ORIGIN` in rpath is expanded by the dynamic loader to the path of the directory where the object is found, which may be set by an attacker (e.g., via hard links) to a directory with a malicious dependency. On Linux, the `fs.protected_hardlinks` sysctl can help prevent this attack.

Setting rpath in setuid/setgid programs can lead to privilege escalation under conditions where untrusted libraries loaded via a set rpath are executed as part of the privileged program. While setuid/setgid binaries ignore environmental overrides to search path (such as `LD_PRELOAD`, `LD_LIBRARY_PATH` etc.), rpath within such binaries can provide an attacker with equivalent capabilities to manipulate the dependency search paths.

[^Kerrisk23]: Kerrisk, Michael, [Building and Using Shared Libraries on Linux, Shared Libraries: The Dynamic Linker](https://man7.org/training/download/shlib_dynlinker_slides.pdf), man7.org, February 2023.

---

## Sanitizers

Sanitizers are a suite of compiler-based tools designed to detect and pinpoint memory-safety issues and other defects in applications written in C and C++. They provide similar capabilities as dynamic analysis tools built on frameworks such as Valgrind. However, unlike Valgrind, sanitizers leverage compile-time instrumentation to intercept and monitor memory accesses. This allows sanitizers to be more efficient and accurate compared to dynamic analyzers. On average, Sanitizers impose a 2× to 4× slowdown in instrumented binaries, whereas dynamic instrumentation can exhibit slowdowns as large as 20× to 50×[^Kratochvil21]. As a tradeoff, sanitizers must be enabled at compile time whereas Valgrind can be used with unmodified binaries. Table 4 lists sanitizer options supported by GCC and Clang.

While more efficient compared to dynamic analysis, sanitizers are still prohibitively expensive in terms of performance penalty and memory overhead to be used with Release builds, but excel at providing memory diagnostics in Debug, and in certain cases Test builds. For example, fuzz testing (or “fuzzing”) is a common security assurance activity designed to identify conditions that trigger memory-related bugs. Fuzzing is primarily useful for identifying memory errors that lead to application crashes. However, if fuzz testing is performed in binaries equipped with sanitizer functionality it is possible to also identify bugs which do not crash the application. Another benefit is the enhanced diagnostics information produced by sanitizers.

As with all testing practices, sanitizers cannot absolutely prove the absence of bugs. However, when used appropriately and regularly they can help in identifying latent memory, concurrency, and undefined behavior-related bugs which may be difficult to pinpoint.

Sanitizers should not be used for hardening in production environments, particularly for Set User ID (SUID) binaries, as they expose operational parameters via environmental variables which can be manipulated to clobber root-owned files and privilege escalation[^Nagy2016].

[^Nagy2016]: Nagy , Szabolcs, [Address Sanitizer local root](https://www.openwall.com/lists/oss-security/2016/02/17/9), Openwall mailing list, 2016-02-16.

Table 4: Sanitizer options in GCC and Clang.

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=address`   | GCC 4.8.0<br/>Clang 3.1.0 | Enables AddressSanitizer to detect memory errors at run-time                |
| `-fsanitize=thread`    | GCC 4.8.0<br/>Clang 3.2.0 | Enables ThreadSanitizer to detect data race bugs at run time                |
| `-fsanitize=leak`      | GCC 4.8.0<br/>Clang 3.1.0 | Enables LeakSanitizer to detect memory leaks at run time                    |
| `-fsanitize=undefined` |   GCC 4.9.0<br/>Clang 3.3.0   | Enables UndefinedBehaviorSanitizer to detect undefined behavior at run time |

[^Kratochvil21]: Kratochvil, Jan, [Memory error checking in C and C++: Comparing Sanitizers and Valgrind](https://developers.redhat.com/blog/2021/05/05/memory-error-checking-in-c-and-c-comparing-sanitizers-and-valgrind),  Red hat Developers, 2021-05-05.

---

### AddressSanitizer

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=address`   | GCC 4.8.0<br/>Clang 3.1.0 | Enables AddressSanitizer to detect memory errors at run-time                |
| `-fsanitize=thread`    | GCC 4.8.0<br/>Clang 3.2.0 | Enables ThreadSanitizer to detect data race bugs at run time                |

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

The run-time behavior of ASan can be influenced using the `ASAN_OPTIONS` environment variable. The run-time options can be used enable additional memory error checks and to tweak ASan performance. An up-to-date list of supported options are available on the AddressSanitizerFlags article on the project's GitHub Wiki[^asan-flags]. If set to `ASAN_OPTIONS=help=1` the available options are shown at startup of the instrumented program. This is particularly useful for determining which options are supported by the specific version ASan integrated to the compiler being used. A useful pre-set to enable more aggressive diagnostics compared to the default behavior is given below:

 ASAN_OPTIONS=strict_string_checks=1:detect_stack_use_after_return=1: \
 check_initialization_order=1:strict_init_order=1 ./instrumented-executable

When ASan encounters a memory error it (by default) terminates the application and prints an error message and stack trace describing the nature and location of the detected error. A systematic description of the different error types and the corresponding root causes reported by ASan can be found in the AddressSanitizer article on the project's GitHub Wiki[^asan].

ASan cannot be used simultaneously with ThreadSanitizer or LeakSanitizer. It is not possible to mix ASan-instrumented code produced by GCC with ASan-instrumented code produced Clang as the ASan implementations in GCC and Clang are mutually incompatible.

[^asan-flags]: LLVM Sanitizers team, [AddressSanitizerFlags](https://github.com/google/sanitizers/wiki/AddressSanitizerFlags), GitHub google/sanitizers Wiki, 2019-05-15.

[^asan]: LLVM Sanitizers team, [AddressSanitizer](https://github.com/google/sanitizers/wiki/AddressSanitizer), GitHub google/sanitizers Wiki, 2019-05-15.

---

### ThreadSanitizer

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=thread`    | GCC 4.8.0<br/>Clang 3.2.0 | Enables ThreadSanitizer to detect data race bugs at run time                |

ThreadSanitizer (TSan) is a data race detector for C/C++. Data races occur when two (or more) threads of the same process access the same memory location concurrently and without synchronization. If at least one of the accesses is a write, the application risks entering an inconsistent internal state. If two or more threads attempt to write to the memory location simultaneously, a data race may cause memory corruption. Data races are notoriously difficult to debug since the order of accesses is typically non-deterministic and dependent on the precise timing of events in the offending threads.

To enable TSan add `-fsanitize=thread` to the compiler flags (`CFLAGS` for C, `CXXFLAGS` for C++) and linker flags (`LDFLAGS`). Consider combining TSan with the following compiler flags:

- `-O2` (or higher for reasonable performance)
- `-g` (to display source file names and line numbers in the produced warning messages)

The run-time behavior of TSan can be influenced using the `TSAN_OPTIONS` environment variable. An up-to-date list of supported options are available on the ThreadSanitizerFlags article on the project's GitHub Wiki[^tsan-flags]. If set to `TSAN_OPTIONS=help=1` the available options are shown at startup of the instrumented program.

When TSan encounters a potential data race it (by default) reports the race by printing a warning message with a description of the program state that led to the data race. A detailed description of the report format can be found in the ThreadSanitizerReportFormat article on the project's GitHub Wiki[^tsan-reportformat].

TSan cannot be used simultaneously with AddressSanitizer (ASan) or LeakSanitizer (LSan). It is not possible to mix TSan-instrumented code produced by GCC with TSan-instrumented code produced Clang as the TSan implementations in GCC and Clang are mutually incompatible. TSan generally requires all code to be compiled with `-fsanitize=thread` to operate correctly.

[^tsan-flags]: LLVM Sanitizers team, [ThreadSanitizerFlags](https://github.com/google/sanitizers/wiki/ThreadSanitizerFlags), GitHub google/sanitizers Wiki, 2015-08-31.

[^tsan-reportformat]: LLVM Sanitizers team, [ThreadSanitizerReportFormat](https://github.com/google/sanitizers/wiki/ThreadSanitizerReportFormat), GitHub google/sanitizers Wiki, 2015-08-31.

---

### LeakSanitizer

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=leak`      | GCC 4.8.0<br/>Clang 3.1.0 | Enables LeakSanitizer to detect memory leaks at run time                    |

LeakSanitizer (LSan) is a stand-alone version of the memory leak detection built into ASan. It allows analysis of memory leaks without the associated slowdown introduced by ASan. Unlike ASan, LSan does not require compile-time instrumentation, but consists only of a runtime library. The `-fsanitize=leak` option instructs the linker to link the application executable against the LSan library which overrides `malloc()` and other allocator functions.

The run-time behavior of LSan can be influenced using the `LSAN_OPTIONS` environment variable. If set to `LSAN_OPTIONS=help=1` the available options are shown at startup of the program.

LSan cannot be used simultaneously with AddressSanitizer (ASan) or ThreadSanitizer (TSan). If either ASan or TSan is enabled during the build the `-fsanitize=leak` option is ignored by the linker.

---

### UndefinedBehaviorSanitizer

| Compiler Flag          |     Supported since      | Description                                                                 |
|:---------------------- |:---------------------:|:--------------------------------------------------------------------------- |
| `-fsanitize=undefined`<br/>(requires `-O1` or higher) |   GCC 4.9.0<br/>Clang 3.3.0   | Enables UndefinedBehaviorSanitizer to detect undefined behavior at run time |

UndefinedBehaviorSanitizer (UBSan) is a detector of non-portable or erroneous program constructs which cause behavior which is not clearly defined in the ISO C standard. UBSan provides a large number of sub-options to enable / disable individual checks for different classes of undefined behavior. Consult the GCC[^gcc-instrumentation] and Clang[^clang-ubsan] documentation respectively for up-to-date information on supported sub-options.

To enable UBSan add `-fsanitize=undefined` to the compiler flags (`CFLAGS` for C, `CXXFLAGS` for C++) and linker flags (`LDFLAGS`) together with any desired sub-options. Consider combining TSan with the following compiler flags:

- `-O1` (required or higher for reasonable performance)
- `-g` (to display source file names and line numbers in the produced warning messages)

The run-time behavior of UBSan can be influenced using the `UBSAN_OPTIONS` environment variable. If set to `UBSAN_OPTIONS=help=1` the available options are shown at startup of the instrumented program.

[^gcc-instrumentation]: GCC team, [Program Instrumentation Options](https://gcc.gnu.org/onlinedocs/gcc/Instrumentation-Options.html#Instrumentation-Options), GCC Manual, 2023-07-27.

[^clang-ubsan]: LLVM team, [UndefinedBehaviorSanitizer](https://clang.llvm.org/docs/UndefinedBehaviorSanitizer.html), Clang documentation, 2023-03-17.

---

## Maintaining debug information in separate files

An application’s debugging information can be placed in a debug info file separate from the application’s executable. This allows the executable to be shipped stripped of debug information while still allowing a debugger to obtain the debugging information from the debug info files when problems in the release executable are being diagnosed. Both the GNU Debugger (GDB) and LLVM Debugger (LLDB) allows debug information for stripped binaries to be loaded from separate debug info files.

There are several reasons why developers may wish to separate the debug information from the executable:

- Debug information can be very large – in some cases even larger than the executable code itself! If separate, it can be omitted where it is not needed. For this reason, most Linux distributions distribute debug information for application packages in separate debug info files.
- It avoids inadvertently revealing some sensitive implementation details about the application if its source code is not available. The availability of symbol information makes binary analysis and reverse engineering of the application’s executable easier. However, tools like decompilers can work without debug information, so the security of a system must *not* depend on omitting such information.

The following series of commands generate the debug info file, strip the debugging information from the main executable, and add the debug link section.

~~~sh
objcopy --only-keep-debug executable_file executable_file.debug
objcopy --strip-unneeded executable_file
objcopy --add-gnu-debuglink=executable_file.debug executable_file
~~~

### Debug information in the ELF binary format

In ELF binaries debug and symbol information are stored in discrete ELF sections unless separate debug info files are created. Table 5 shows the ELF sections which normally contain debug, symbol or other auxiliary information.

| Elf Section | Description                                                               |
| ----------- | ------------------------------------------------------------------------- |
| `.debug`    | Symbolic debug information for debuggers (typically in DWARF format[^DWARF17]) |
| `.comment`  | GCC version information                                                   |
| `.dynstr`   | Strings needed for dynamic symbol name lookup via .dynsym                 |
| `.dynsym`   | Dynamic symbol lookup table used for run-time relocations                 |
| `.note`     | Auxiliary metadata, e.g, ABI tags[^LF15] and Build ID[^binutils-ld]       |
| `.strtab`   | Strings representing names in `.symtab`                                   |
| `.symtab`   | Global symbol table used for symbol name lookup by debuggers              |

Whether a particular section is present or absent in an ELF binary indicates what type of information is available. The availability of symbol information makes binary analysis easier as debuggers, disassemblers and binary code analysis tools, such as Ghidra[^ghidra-homepage] and IDA Pro[^idapro-homepage], can use available symbol information to automatically annotate decompiled machine code. Similarly, the availability of debug information makes dynamic analysis of the application in a debugger easier. Stripping unnecessary debug and symbol information from the binary does not make it impervious against reverse engineering, however it does considerably increase the cost and manual effort required for successful exploitation.

[^DWARF17]: DWARF Debugging Information Format Committee, [DWARF Version 5 Debugging Format Standard](https://dwarfstd.org/dwarf5std.html), DWARF Debugging Standard Website, 2017-02-13.

[^LF15]: Linux Foundation, [Linux Standard Base Core Specification, Generic Part, Chapter 10.8. ABI note tag.](https://refspecs.linuxfoundation.org/LSB_5.0.0/LSB-Core-generic/LSB-Core-generic/noteabitag.html), Linux Foundation Referenced Specifications, 2015-05-27.

[^binutils-ld]: Binutils team, [LD Options](https://sourceware.org/binutils/docs/ld/Options.html#Options), Documentation for binutils, 2023-07-30.

[^ghidra-homepage]: US NSA, [Ghidra homepage](https://ghidra-sre.org)

[^idapro-homepage]: Hex-Rays, [IDA Pro homepage](https://www.hex-rays.com/products/ida)

### Creating debug info files

The debug info files are ordinary executables with an identical section layout as the application’s original executable, but without the executable’s data. The debug info file is created by compiling the application executable with the desired debug information included, then processing the executable with the `objcopy` utility to produce the stripped executable (without debugging information) and the debug info file (without executable data). Both GNU binutils `objcopy`[^binutils-objcopy] and LLVM `llvm-objcopy`[^llvm-objcopy] support the same options for stripping debug information and creating the debug info file. The shell snippet below shows the `objcopy` invocation for creating a debug info file from an executable with debug information.

~~~sh
objcopy --only-keep-debug executable_file executable_file.debug
~~~

There are no particular requirements for the debug link filename, although a common convention is to name debug info for an executable, e.g., “executable.debug”. While the debug info file can have the same name as the executable it is preferred to use an extension such as “.debug” as it means that the debug info file can be placed in the same directory as the executable.

Debug info files allows the binary to be analyzed in the same way as the original binary with debug and symbol information intact. They should be handled with care and not exposed in computing environments where they may be obtained by adversaries.

[^binutils-objcopy]: Binutils team, [objcopy](https://sourceware.org/binutils/docs/binutils/objcopy.html), Documentation for binutils, 2023-07-30.

[^llvm-objcopy]: LLVM team, [llvm-objcopy](https://llvm.org/docs/CommandGuide/llvm-objcopy.html), LLVM Command Guide, 2023-03-17.

### Strip debug and symbol information

Once the debug info file has been created the debug and symbol information can be stripped from the original binary using either the `objcopy` or `strip`[^binutils-strip] utilities provided by Binutils, or the `llvm-objcopy` or `llvm-strip`[^llvm-strip] equivalents provided by LLVM. The shell snippets below show how the debug and unneeded symbol information can be removed from an executable using `objcopy` and `strip` respectively. If code signing is enforced on the application binaries the debug and symbol information must be stripped away before the binaries are signed.

~~~sh
strip --strip-unneeded executable_file

objcopy --strip-unneeded executable_file
~~~

The `--strip-unneeded` option in `objcopy` and will remove all symbol information (ELF `.symtab` and `.strtab` sections) from the binary that is not needed for processing relocations. In addition, it will trigger the removal of any symbolic debug information from the binary (ELF `.debug` sections and all sections with the `.debug` prefix).

Removing symbol information used for relocations is discouraged as it may interfere with resolving dynamically linked symbols (ELF `.dynsym` and `.dynstr` sections) and Address Space Layout Randomization (ASLR) at run-time. As a result, it should be expected that debuggers and binary analysis will be able to resolve calls to dynamically linked functions to the correct symbol information. Static linking can be considered as an alternative where applicable to avoid dynamically linked symbols to remain visible in resulting binaries.

**Stripping additional sections**

Note that `--strip-unneeded` only discards standard ELF sections as unneeded. Since an ELF binary can have any number of additional sections which are unknown to `objcopy` and `strip` they cannot determine whether such unrecognized sections are safe to remove. This includes for example the `.comment` section added by GCC.  The shell snippets below show how non-standard sections, such as `.comment` can be removed in addition to the unneeded sections identified by `--strip-unneeded`. If the application includes custom, application-specific ELF sections with possible sensitive diagnostics information or metadata which is not required at run-time during normal operations developers may wish to strip such additional sections from release binaries.

~~~sh
objcopy --strip-unneeded --remove-section=.comment executable_file

strip --strip-unneeded --remove-section=.comment executable_file
~~~

[^binutils-strip]: Binutils team, [strip](https://sourceware.org/binutils/docs/binutils/strip.html), Documentation for binutils, 2023-07-30.

[^llvm-strip]: LLVM team, [llvm-strip](https://llvm.org/docs/CommandGuide/llvm-strip.html), LLVM Command Guide, 2023-03-17.

### Add a debug link to the binary

To allow the debugger to identify the correct debug information the executable must be associated with its corresponding debug info file. This can be done in two ways:

- Include a “debug link” within the executable that specifies the name of the corresponding debug info file.
- Include a “build ID”, a unique bit string, within the executable from which the debug info file’s name can be derived.

In most cases the debug link is preferrable as it allows the developers to name the debug info file and verifies a checksum over the debug information files content before the symbol information is sourced from the file during debugging.

**Debug link**

A debug link is a special section (`.gnu_debuglink`) in the executable file that contains the name of the corresponding debug info file and a 32-bit cyclic redundancy checksum (CRC) computed over the debug info file’s full contents. Any executable file format can carry debug link information as long is can contain a section named `.gnu_debuglink`. The shell snippet below shows how a debug link can be added to an executable using `objcopy` (or `llvm-objcopy`).

~~~sh
objcopy --add-gnu-debuglink=executable_file.debug executable_file
~~~

If the debug information file is built in one location but is going to be later installed at a different location the `--add-gnu-debuglink` option should be used with the path to the built debug information file. The debug info file must exist at the specified path as it is required for the CRC calculation which allows the debugger to validate that the debug info file it loads matches that of the executable.

Note that `.gnu_debuglink` does not contain the full pathname to the debug info; only a filename with the leading directory components removed. GDB looks for the debug info file with the specified filename in a series of search directories starting from the directory where the executable is placed. For a complete list of search paths refer to the GDB documentation[^gdb-debugfiles].

[^gdb-debugfiles]:  GDB team, [Debugging Information in Separate Files](https://sourceware.org/gdb/onlinedocs/gdb/Separate-Debug-Files.html), Debugging with GDB, 2023-08-16.

**Build ID**

A build ID is a unique bit string stored in `.note.gnu.build-id` of the ELF `.note` section that is (statistically) unique to the binary file. A debugger can use the build ID to identify the corresponding debug info file if the same build ID is also present in the debug info file.

If the build ID method is used, the debug info file’s name is computed from the build ID. GDB searches the global debug directories (typically `/usr/lib/debug`) for a `.build-id/xx/yyyy.debug` file, where `xx` are the first two hex characters of the build ID and `yyyy` are the rest of the build ID bit string in hex (actual build ID strings are 32 or more hex characters).

Note that the build ID does not act as a checksum for the executable or debug info file. For more information on the build ID feature please refer to the GDB[^binutils-objcopy] and GNU linker[^binutils-ld] documentation.

## What should you do when compiling compilers?

If you are compiling a C/C++ compiler, where practical make the generated compiler's default options the *secure* options. The below table summarizes relevant options that can be specified when building GCC or Clang that affect the defaults of the compiler:

| Compiler Flag                   | Supported since  | Description                                                       |
|:--- |:---:|:---- |
| <span id="--enable-default-pie">`--enable-default-pie`</span>             | GCC 6.1.0      | Turn on [`-fPIE`](#-fPIE_-pie) and [`-pie`](#-fPIE_-pie) by default for binaries produced by the compiler |
| <span id="--enable-default-ssp">`--enable-default-ssp`</span>             | GCC 6.1.0      | Turn on [`-fstack-protector-strong`](#-fstack-protector-strong) by default for binaries produced by the compiler |
| <span id="--enable-host-pie">`--enable-host-pie`</span>                   | GCC 14.0.0       | Build the compiler executables with [`-fPIE`](#-fPIE_-pie) and [`-pie`](#-fPIE_-pie) |
| <span id="--enable-host-bind-now">`--enable-host-bind-now`</span>         | GCC 14.0.0       | Build the compiler executables with [`-Wl,-z,now`](#-Wl,-z,now) |

Note that LLVM recommends using Clang configuration files[^clang-config] to pass the relevant defaults to the compiler. Command-line options provided in a configuration file are prepended to the rest of the options on the command line.

## What should you do when compiling linkers?

If you are compiling a linker, where practical make the generated linker's default options the *secure* options. The below table summarizes relevant options that can be specifed when building GNU Binutils that affect the defaults of the linker:

| Linker Flag                   | Supported since  | Description                                                       |
|:--- |:---:|:---- |
| <span id="--disable-default-execstack">`--disable-default-execstack`</span> | Binutils 2.39 | Require the `GNU_STACK` ELF note for executable stacks, rather than enabling them by default. |
| <span id="--enable-warn-execstack">`--enable-warn-execstack`</span>         | Binutils 2.39 | Warn if an executable stack is requested with `GNU_STACK`. |
| <span id="--enable-error-execstack">`--enable-error-execstack`</span>       | Binutils 2.42 | Error out if an executable stack is requested, even with `GNU_STACK`. |
| <span id="--enable-warn-rwx-segments">`--enable-warn-rwx-segments`</span>   | Binutils 2.39 | Warn if a segment has unsafe permissions. |
| <span id="--enable-error-rwx-segments">`--enable-error-rwx-segments`</span> | Binutils 2.42 | Error out if a segment has unsafe permissions. |
| <span id="--enable-relro">`--enable-relro`</span>                           | Binutils 2.27 | Default to passing `-Wl,-z,relro`. |
| <span id="--enable-textrel-check=">`--enable-textrel-check=`</span>         | Binutils 2.35 | Controls whether TEXTRELs are fatal errors (`=error`), warnings (`=warn`), or ignored (`=no`). |
| <span id="--enable-secureplt">`--enable-secureplt`</span>                   | Binutils 2.16 | Make the PLT read-only. Applies only to the Alpha and PowerPC architectures. |

Some background on the introduction of these options to GNU Binutils is available from Nick Clifton, its Chief Maintainer[^Clifton22].

Note that LLVM recommends using Clang configuration files to pass the relevant options to the linker via the compiler driver, so no such options exist here.

[^clang-config]: LLVM team, [Configuration files](https://clang.llvm.org/docs/UsersManual.html#configuration-files), Clang Compiler User’s Manual, 2024-09-17.

[^Clifton22]: Clifton, Nick, [The linker’s warnings about executable stacks and segments](https://www.redhat.com/en/blog/linkers-warnings-about-executable-stacks-and-segments), Red Hat Blog, 2022-09-14.

## Contributors

The OpenSSF Developer BEST Practices Working group thanks Ericsson for their generous initial donation of content to start collaboration on this guide.

- Thomas Nyman, Ericsson
- Robert Byrne, Ericsson
- Jussi Auvinen, Ericsson
- Christopher "CRob" Robinson, Intel
- Daniel Stenberg, wolfSSL
- David A. Wheeler, Linux Foundation
- David Edelsohn, IBM
- Dominik Czarnota, Trail of Bits
- Florian Berbar
- Florian Weimer, Red Hat
- Gabriel Dos Reis, Microsoft
- Georg Kunz, Ericsson
- George Wilson, IBM
- Jack Kelly, ControlPlane
- Jonathan Wakely, Red Hat
- Kees Cook, Google
- Mark Esler, Canonical
- Mayank Ramnani, NYU
- Merve Gülmez, Ericsson
- Randall T. Vasquez, Linux Foundation
- Robert C. Seacord, Woven by Toyota
- Sam James, Gentoo
- Siddharth Sharma, Red Hat
- Siddhesh Poyarekar, Red Hat
- William Huhn, Intel

## License

Copyright 2024, OpenSSF contributors, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## Appendix: List of Considered Compiler Options

Many more security-relevant compiler options exist than are recommended in this guide. Some of these have been considered for inclusion, but for various reasons have, in-the-end been excluded from the set of recommended options. The following table lists options that have been reviewed and the rationale for their exclusion. While they are not in the recommended list, you may find them useful for your purposes.

| Compiler Flag | Supported since  | Rationale |
|---------------|------------------|-----------|
| <span id="-Wl,-z,nodump">`-Wl,-z,nodump`</span>         | Binutils 2.10.0 | Single-purpose feature for Solaris compatibility[^nodump].
| <span id="-Wl,-z,noexecheap">`-Wl,-z,noexecheap`</span> | Binutils 2.15.0 (Hardened Gentoo / PaX only ) | Hardened Gentoo / PaX specific Binutils extension[^noexecheap], not present in upstream toolchains.
| <span id="-D_LIBCPP_ASSERT">`-D_LIBCPP_ASSERT`</span>   | libc++ 3.3.0 | Deprecated in favor of `_LIBCPP_ENABLE_HARDENED_MODE`[^libcpp_assert]
| <span id="-D_LIBCPP_ENABLE_ASSERTIONS">`-D_LIBCPP_ENABLE_ASSERTIONS`</span> | libc++ 3.3.0 | Deprecated in favor of `_LIBCPP_ENABLE_HARDENED_MODE`[^libcpp_assert]
| <span id="-mshstk">`-mshstk`</span>                                         | GCC 8.0.0<br/>Clang 6.0.0 | Enables discouraged shadow stack built-in functions[^gcc_mshstk], which are only needed for programs with an unconventional management of the program stack. CET instrumentation is controlled by [`-fcf-protection`](#-fcf-protection=full).
| <span id="-fsanitize=safe-stack">`-fsanitize=safe-stack`</span>             | Clang 4.0.0 | Known compatibility limitations with garbage collection, signal handling, and shared libraries[^clang_safestack].
| <span id="-fasynchronous-unwind-tables">`-fasynchronous-unwind-tables`</span> | GCC 3.1.1<br/>Clang 7.0.0  | Generate stack unwind table in DWARF2 format, which improves precision of unwind information[^Song20] and can improve the performance of profilers at the cost of larger binary sizes[^Bastian19], but does not benefit security.
| <span id="-fvtable-verify">`-fvtable-verify`</span> |GCC 4.9.4 | Enables run-time checks for C++ virtual function pointers corruption. This option has significant performance overhead[^Tice2014] and breaks ABI with all existing system libraries unless the entire userspace is built with `-fvtable-verify`[^gentoo-vtv]. Believed to be currently unmaintained in GCC.
| <span id="-mmitigate-rop">`-mmitigate-rop`</span> | GCC 6.1 | Avoids combination of particular opcodes which can be reinterpretted as a return opcode in an attempt to mitigate Return Oriented Programming (ROP) attacks[^gcc-mmitigate-rop].  Was considered to be ineffective and security-theatre-esque, so was deprecated in GCC 9.1[^Bizjak2018].
| <span id="CLANG_DEFAULT_PIE_ON_LINUX">`CLANG_DEFAULT_PIE_ON_LINUX`</span> | Clang 14.0.0 | When compiling Clang, turns on [`-fPIE`](#-fPIE_-pie) and [`-pie`](#-fPIE_-pie) by default for binaries produced by the compiler. Superceded by default provided via configuration files[^clang-config].
| <span id="-fsplit-stack">`-fsplit-stack`</span> | GCC 4.6.0 | Generates code to automatically split the stack before it overflows to enable segmented stacks [^Taylor2011] for use by stackfull co-routines such as Boost Fibers. Interoperability between split-stack code to non-split-stack code requires the gold linker to ensure larger stack segments are allocated for calls to non-split-stack code [^Taylor2015]. Believed to be currently unmaintained in GCC.

[^nodump]: The `-Wl,-z,nodump` option sets `DF_1_NODUMP` flag in the object’s `.dynamic` section tags. On Solaris this restricts calls to `dldump(3)` for the object. However, other operating systems ignore the `DF_1_NODUMP` flag. While Binutils implements `-Wl,-z,nodump` for Solaris compatibility a choice was made to not support it in `lld` ([D52096 lld: add -z nodump support](https://reviews.llvm.org/D52096)).

[^noexecheap]: The `-Wl,-z,noexecheap` option is a [Hardened Gentoo](https://wiki.gentoo.org/wiki/Hardened/PaX_Quickstart) extension to Binutils ported from [PaX](https://pax.grsecurity.net/). PaX is a patch to the Linux kernel and Binutils that adds a `PT_PAX_FLAGS` program header to ELF objects that stores memory protection information the PaX kernel can enforce. The protection information stored in `PT_PAX_FLAGS` will not benefit software running on systems without a PaX kernel. The Gentoo patch (`63_all_binutils-`*\<version\>*`-pt-pax-flags-`*\<date\>*`.patch`) for various versions of Binutils since 2.15 can be found at [https://dev.gentoo.org/~vapier/dist/](https://dev.gentoo.org/~vapier/dist/).

[^libcpp_assert]: The LLVM libc++ has gone through a number of design iterations with its  "safe" mode of operation. Starting with libc++ release 17.0.0 the "safe" mode has been deprecated in favor a new hardened mode of operation that provides a narrower set of checks (security-critical checks that are performant enough to be used in production). For more information see: LLVM team, [Libc++ 17.0.0 Release Notes](https://libcxx.llvm.org/ReleaseNotes/17.html#deprecations-and-removals), Libc++ documentation, 2023-07-27; LLVM Team, [Hardened Mode](https://libcxx.llvm.org/Hardening.html), Libc++ documentation, 2023-07-27 and Varlamov, Konstatin, [Deprecate `_LIBCPP_ENABLE_ASSERTIONS`](https://reviews.llvm.org/D154997), LLVM Phabricator, 2022-07-11.

[^gcc_mshstk]: GCC team, [x86 Built-in Functions](https://gcc.gnu.org/onlinedocs/gcc/x86-Built-in-Functions.html), GCC Manual, 2023-07-27.

[^clang_safestack]: LLVM team, [SafeStack](https://clang.llvm.org/docs/SafeStack.html), Clang documentation, 2023-11-14.

[^Song20]: Song, Fangrui, [Stack unwinding](https://maskray.me/blog/2020-11-08-stack-unwinding), MaskRay blog, 2020-11-18.

[^Bastian19]: Bastian, Théophile and Kell, Stephen and Nardelli, Francesco Zappa, [Reliable and fast DWARF-based stack unwinding](https://doi.org/10.1145/3360572), Proceedings of the ACM Journal of Programming Languages, Volume 3, Issue OOPSLA, Article 146, 2019-10-10.

[^Tice2014]: Tice, Caroline, [Enforcing Forward-Edge Control-Flow Integrity in GCC & LLVM](https://www.usenix.org/system/files/conference/usenixsecurity14/sec14-paper-tice.pdf#page=12) USENIX Security, August 2014

[^gentoo-vtv]: Gentoo Foundation, [Local Use Flag: vtv](https://packages.gentoo.org/useflags/vtv) Gentoo Packages, Retrieved 2024-06-27.

[^gcc-mmitigate-rop]: GCC team, [Using the GNU Compiler Collection (GCC): x86 Options: `-mmitigate-rop`](https://gcc.gnu.org/onlinedocs/gcc-6.1.0/gcc/x86-Options.html#index-mmitigate-rop-2936), GCC Manual, 2016-04-27.

[^Bizjak2018]: Bizjak, Uros [\[RFC PATCH, i386\]: Deprecate `-mmitigate-rop`](https://gcc.gnu.org/pipermail/gcc-patches/2018-August/504637.html), GCC Mailing List, 2018-08-15.

[^Taylor2011]: Taylor, Ian Lance, [Split Stacks in GCC](https://gcc.gnu.org/wiki/SplitStacks), GCC Wiki, 2011-02-07.

[^Taylor2015]: Taylor, Ian Lance, [gccgo split stack implementation](https://groups.google.com/g/golang-dev/c/QBCN9XVkwFk/m/7DgP2Iu_USkJ), golang-dev Google Groups, 2015-07-10.

## Appendix: Scraper Script

A python script is also present in the [GitHub repository](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Compiler-Hardening-Guides/) that can fetch the recommended options table from the latest version of this guide and convert it to a machine readable format (JSON) for use in tooling.

## References
