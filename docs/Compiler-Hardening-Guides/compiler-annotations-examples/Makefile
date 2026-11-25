# Copyright Open Source Security Foundation (OpenSSF) and its contributors
# SPDX-License-Identifier: Apache-2.0 OR MIT

# Each example is a local copy of the corresponding "Extended example at
# Compiler Explorer" link in the guide. Most of the examples only declare
# (but do not define) the annotated allocator/deallocator functions, since
# their purpose is to show the *diagnostics* the annotations enable, not to
# be run. Those examples are therefore only compiled to an object file
# (linking would fail with "undefined reference"). The "noreturn" and
# "tainted_args" examples are fully self-contained and can also be run.
#
# The "malloc", "access", "fd_arg"/"fd_arg_read"/"fd_arg_write", and
# "tainted_args" examples rely on GCC's -fanalyzer or on GCC-specific
# warnings (-Wstringop-overread, -Wstringop-overflow, -Wmismatched-dealloc)
# that Clang does not implement, so CC must be a recent GCC (GCC 13+
# recommended; GCC 15 was used to verify these examples) for those targets.
# "alloc_size" and "noreturn" are portable and also build with Clang, e.g.:
#   make CC=clang noreturn-attribute

# Note: plain "?=" would not override these, since GNU Make's built-in
# rules already assign CC/CXX a "default"-origin value of cc/g++. Using ":="
# still allows `make CC=clang` on the command line to take precedence.
CC  := gcc
CXX := g++

.PHONY: all clean \
	malloc-attribute alloc-size-attribute access-attribute \
	fd-arg-attribute noreturn-attribute tainted-args-attribute \
	noreturn-attribute-run tainted-args-attribute-run

all: malloc-attribute alloc-size-attribute access-attribute \
	fd-arg-attribute noreturn-attribute tainted-args-attribute

# "malloc" and "malloc (deallocator[, ptr-index])" attributes.
# Compiling with -fanalyzer reports mismatched deallocation, double-free,
# use-after-free, memory leak, and free-of-non-heap diagnostics for the
# nonconforming functions in the file. Requires GCC 11+ for the two-argument
# "malloc" attribute form used here.
malloc-attribute: malloc-attribute.c
	$(CC) -c $< -o /dev/null \
		-Wmismatched-dealloc -fanalyzer \
		-Wanalyzer-mismatching-deallocation \
		-Wanalyzer-double-free \
		-Wanalyzer-possible-null-dereference \
		-Wanalyzer-use-after-free \
		-Wanalyzer-malloc-leak \
		-Wanalyzer-free-of-non-heap

# "alloc_size" attribute.
# No warnings are expected. Instead, the attribute lets __builtin_object_size
# fold the asserts in main() to true at compile time. Compile with -O1 or
# higher (constant folding of __builtin_object_size needs optimization) and
# inspect the generated assembly to confirm the asserts (and the abort() call
# behind them) are optimized away.
alloc-size-attribute: alloc-size-attribute.c
	$(CC) -O2 -c $< -o /dev/null

alloc-size-attribute.s: alloc-size-attribute.c
	$(CC) -O2 -S $< -o $@

# "access" attribute (C++).
# Compiling reports -Wuninitialized / -Wmaybe-uninitialized for reads of
# uninitialized buffers and -Wstringop-overread / -Wstringop-overflow for
# accesses that exceed the declared object size. Requires GCC 11+ (GCC
# 10 introduced the "access" attribute itself, but these warnings improved
# in later releases).
access-attribute: access-attribute.cpp
	$(CXX) -c $< -o /dev/null \
		-Wstringop-overread -Wstringop-overflow \
		-Wuninitialized -Wmaybe-uninitialized

# "fd_arg" / "fd_arg_read" / "fd_arg_write" attributes.
# Compiling with -fanalyzer reports access-mode mismatches, double-close,
# use-after-close, and use-without-check diagnostics for the nonconforming
# functions in the file. Requires GCC 13+.
fd-arg-attribute: fd-arg-attribute.c
	$(CC) -c $< -o /dev/null \
		-fanalyzer \
		-Wanalyzer-fd-access-mode-mismatch \
		-Wanalyzer-fd-double-close \
		-Wanalyzer-fd-leak \
		-Wanalyzer-fd-use-after-close \
		-Wanalyzer-fd-use-without-check

# "noreturn" attribute.
# Compiling reports that ill_be_back() is declared noreturn but falls off
# the end of the function, plus a -Wuninitialized diagnostic for "i". This
# example is fully defined, so it also builds a runnable executable. It
# intentionally terminates via exit(1) inside hasta_la_vista(), so ignore
# the resulting nonzero exit status.
noreturn-attribute: noreturn-attribute.c
	$(CC) -Wall $< -o $@

noreturn-attribute-run: noreturn-attribute
	-./noreturn-attribute

# "tainted_args" attribute.
# Compiling with -fanalyzer reports use of the tainted "divisor" argument
# without a zero check. Requires GCC 12+; taint tracking is enabled by
# default with -fanalyzer from GCC 14.1 onwards. On earlier GCC 12/13
# releases add -fanalyzer-checker=taint explicitly. This example is fully
# defined and reads two integers from stdin, so it can also be run, e.g.
# with a zero divisor to trigger the division-by-zero the warning warns
# about.
tainted-args-attribute: tainted-args-attribute.c
	$(CC) -fanalyzer $< -o $@

tainted-args-attribute-run: tainted-args-attribute
	printf '10\n0\n' | ./tainted-args-attribute

clean:
	rm -f noreturn-attribute tainted-args-attribute alloc-size-attribute.s *.o
