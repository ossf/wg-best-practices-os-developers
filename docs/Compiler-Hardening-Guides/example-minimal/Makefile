# Test C/C++ hardening flags

# Copyright Open Source Security Foundation (OpenSSF) and its contributors
# SPDX-License-Identifier: Apache-2.0 OR MIT

# Test hardening flags. You can set CC to the compiler to use. E.g.:
# make CC=clang
# make CC=/usr/local/Cellar/gcc/13.2.0/bin/gcc-13

# Extract the current hardening recommendations so we can test them.
# We use GNU make extensions $(shell ...) and ":=" to do this.
# Recent POSIX adds "!=" and "::=" but they are not yet universally supported,
# e.g., Apple MacOS only supplies an obsolete version of GNU Make.

ifndef CFLAGS_HARDENING
CFLAGS_HARDENING := $(shell sed -e '1,/~~~/d' -e '/~~~/,$$d' -e 's/\\$$//' \
                      Compiler-Options-Hardening-Guide-for-C-and-C++.md )
endif

# Could add architecture-specific flags, e.g.:
# -fcf-protection=full -mbranch-protection=standard

CFLAGS := $(CFLAGS_HARDENING) $(CFLAGS)

all: demo

debug_print:
	$(info CFLAGS_HARDENING=${CFLAGS_HARDENING})
	$(info CFLAGS=${CFLAGS})

demo: demo.c

.PHONY: all print
