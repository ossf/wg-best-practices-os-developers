# =============================================================================
#  Standalone test case for the -Wimplicit-fallthrough=5 selection logic
#  discussed in ossf/wg-best-practices-os-developers#1116.
#
#  Requirements: GNU Make >= 4.0, a POSIX shell, a C and a C++ compiler.
#
#  Usage:
#      make                        # probe, print flags, build demo, run checks
#      make CC=clang CXX=clang++   # same, with a different compiler
#      make print-flags            # just print the selected flags
#      make demo                   # show the raw compiler diagnostics
#      make clean
# 
# Copyright Open Source Security Foundation (OpenSSF) and its contributors
# SPDX-License-Identifier: Apache-2.0 OR MIT
# =============================================================================

.DEFAULT_GOAL := all

SHELL := /bin/sh
CC    ?= cc
CXX   ?= c++
BUILD := build

# -----------------------------------------------------------------------------
# 1. The probe
# -----------------------------------------------------------------------------
# $(call probe,<compiler>,<source-ext>,<flag>,<extra-probe-flags>)
#   -> expands to <flag> if the compiler accepts it, to nothing otherwise.
#
# The -Werror in <extra-probe-flags> is NOT optional.  Clang reports an
# unrecognised -W option as a *warning* (-Wunknown-warning-option), so a probe
# without -Werror reports success for -Wimplicit-fallthrough=5 on Clang and the
# flag then silently does nothing for the whole build.

probe = $(shell tmp=`mktemp -d 2>/dev/null || echo /tmp/ftprobe.$$$$`; mkdir -p "$$tmp"; \
	printf 'int main(void){return 0;}\n' > "$$tmp/p.$(2)"; \
	if $(1) $(4) $(3) -c "$$tmp/p.$(2)" -o "$$tmp/p.o" >/dev/null 2>&1; then \
		printf '%s' '$(3)'; \
	fi; \
	rm -rf "$$tmp")

WERROR_PROBE := -Werror

# Step 1: prefer -Wimplicit-fallthrough=5 (GCC: attribute annotations only).
# Step 2: fall back to bare -Wimplicit-fallthrough (Clang: same semantics).

FT_CFLAGS := $(call probe,$(CC),c,-Wimplicit-fallthrough=5,$(WERROR_PROBE))
ifeq ($(FT_CFLAGS),)
FT_CFLAGS := $(call probe,$(CC),c,-Wimplicit-fallthrough,$(WERROR_PROBE))
endif

FT_CXXFLAGS := $(call probe,$(CXX),cpp,-Wimplicit-fallthrough=5,$(WERROR_PROBE))
ifeq ($(FT_CXXFLAGS),)
FT_CXXFLAGS := $(call probe,$(CXX),cpp,-Wimplicit-fallthrough,$(WERROR_PROBE))
endif

# Same probe with the -Werror omitted, purely to demonstrate the false positive.
FT_CFLAGS_NAIVE := $(call probe,$(CC),c,-Wimplicit-fallthrough=5,)
NAIVE_MISMATCH  := $(if $(FT_CFLAGS_NAIVE),$(if $(filter -Wimplicit-fallthrough=5,$(FT_CFLAGS)),,yes))

# Append after -Wall/-Wextra.  (-Wextra implies -Wimplicit-fallthrough=3, and
# an explicitly repeated -Wimplicit-fallthrough option is last-one-wins.)
WARN_CFLAGS   := -Wall -Wextra $(FT_CFLAGS)
WARN_CXXFLAGS := -Wall -Wextra $(FT_CXXFLAGS)

# Deliberately wrong flag set: what you get from a "collect every supported
# argument" helper instead of a "first supported argument" one.
WARN_CFLAGS_BOTH := -Wall -Wextra -Wimplicit-fallthrough=5 -Wimplicit-fallthrough

# -----------------------------------------------------------------------------
# 2. Expected outcomes
# -----------------------------------------------------------------------------
# With a correctly selected flag, a comment is *not* an acceptable annotation.
# If neither flag is supported (MSVC, very old compilers) there is nothing to
# assert, so those cases are reported but not scored.

ifeq ($(FT_CFLAGS),)
EXPECT_COMMENT_C  := skip
EXPECT_ACCIDENT_C := skip
else
EXPECT_COMMENT_C  := warn
EXPECT_ACCIDENT_C := warn
endif

ifeq ($(FT_CXXFLAGS),)
EXPECT_COMMENT_CXX  := skip
EXPECT_ACCIDENT_CXX := skip
else
EXPECT_COMMENT_CXX  := warn
EXPECT_ACCIDENT_CXX := warn
endif

# -----------------------------------------------------------------------------
# 3. Generated test sources
# -----------------------------------------------------------------------------

define HEADER_SRC
/* Portable spelling of the fallthrough annotation. */
#ifndef FALLTHROUGH_H
#define FALLTHROUGH_H

#if defined(__cplusplus)
#  if defined(__has_cpp_attribute)
#    if __has_cpp_attribute(fallthrough)
#      define FALLTHROUGH() [[fallthrough]]
#    endif
#  endif
#else
#  if defined(__has_c_attribute)
#    if __has_c_attribute(fallthrough)
#      define FALLTHROUGH() [[fallthrough]]
#    endif
#  endif
#endif

#ifndef FALLTHROUGH
#  if defined(__GNUC__) || defined(__clang__)
#    define FALLTHROUGH() __attribute__((fallthrough))
#  else
#    define FALLTHROUGH() ((void)0)  /* fallthrough */
#  endif
#endif

#endif
endef

# One body, three annotation styles, compiled as both C and C++.
define BODY
#include "fallthrough.h"

int classify(int c)
{
    int n = 0;

    switch (c) {
    case 1:
        n += 1;
        ANNOTATION
    case 2:
        n += 2;
        break;
    default:
        n = -1;
        break;
    }

    return n;
}
endef

ANNOTATION_attribute := FALLTHROUGH();
ANNOTATION_comment   := /* fall through */
ANNOTATION_accident  :=

CASES := attribute comment accident

$(BUILD):
	@mkdir -p $@

$(BUILD)/fallthrough.h: Makefile | $(BUILD)
	$(file >$@,$(HEADER_SRC))

define emit_case
$(BUILD)/$(1).c: Makefile | $(BUILD)
	$$(file >$$@,$$(subst ANNOTATION,$(ANNOTATION_$(1)),$$(BODY)))
$(BUILD)/$(1).cpp: $(BUILD)/$(1).c
	@cp $$< $$@
endef
$(foreach c,$(CASES),$(eval $(call emit_case,$(c))))

SOURCES := $(BUILD)/fallthrough.h \
           $(foreach c,$(CASES),$(BUILD)/$(c).c $(BUILD)/$(c).cpp)

# -----------------------------------------------------------------------------
# 4. Targets
# -----------------------------------------------------------------------------

.PHONY: all print-flags demo check clean

all: print-flags demo check

print-flags:
	@echo "compilers"
	@echo "  CC              = $(CC)   [`$(CC) --version 2>/dev/null | head -1`]"
	@echo "  CXX             = $(CXX)   [`$(CXX) --version 2>/dev/null | head -1`]"
	@echo "probe results"
	@echo "  selected for C  = $(if $(FT_CFLAGS),$(FT_CFLAGS),<none supported>)"
	@echo "  selected for C++= $(if $(FT_CXXFLAGS),$(FT_CXXFLAGS),<none supported>)"
	@echo "  probe w/o -Werror says '-Wimplicit-fallthrough=5' is \
$(if $(FT_CFLAGS_NAIVE),SUPPORTED,NOT supported)"
ifeq ($(NAIVE_MISMATCH),yes)
	@echo "  *** MISMATCH: without -Werror the probe would have selected a flag"
	@echo "      this compiler does not actually understand."
endif
	@echo "resulting flags"
	@echo "  WARN_CFLAGS     = $(WARN_CFLAGS)"
	@echo "  WARN_CXXFLAGS   = $(WARN_CXXFLAGS)"
	@echo

demo: $(SOURCES)
	@echo "=== raw diagnostics (C) ======================================="
	@for c in $(CASES); do \
		echo "--- $$c.c"; \
		$(CC) $(WARN_CFLAGS) -I$(BUILD) -c $(BUILD)/$$c.c -o $(BUILD)/$$c.demo.o 2>&1 | sed 's/^/    /'; \
	done
	@echo "=== raw diagnostics (C++) ====================================="
	@for c in $(CASES); do \
		echo "--- $$c.cpp"; \
		$(CXX) $(WARN_CXXFLAGS) -I$(BUILD) -c $(BUILD)/$$c.cpp -o $(BUILD)/$$c.demo.oo 2>&1 | sed 's/^/    /'; \
	done
	@echo

# $(call assert,<compiler>,<flags>,<source>,<expected: warn|clean>)
define assert
	printf '  %-24s expect %-5s ... ' '$(3)' '$(4)'; \
	if $(1) $(2) -I$(BUILD) -Werror -c $(BUILD)/$(3) -o $(BUILD)/$(3).chk.o >/dev/null 2>&1; then \
		got=clean; else got=warn; fi; \
	if [ "$(4)" = "skip" ]; then echo "SKIP (got $$got)"; \
	elif [ "$$got" = "$(4)" ]; then echo "PASS"; \
	else echo "FAIL (got $$got)"; rc=1; fi;
endef

check: $(SOURCES)
	@rc=0; \
	echo "=== assertions ================================================"; \
	echo "C:"; \
	$(call assert,$(CC),$(WARN_CFLAGS),attribute.c,clean) \
	$(call assert,$(CC),$(WARN_CFLAGS),comment.c,$(EXPECT_COMMENT_C)) \
	$(call assert,$(CC),$(WARN_CFLAGS),accident.c,$(EXPECT_ACCIDENT_C)) \
	echo "C++:"; \
	$(call assert,$(CXX),$(WARN_CXXFLAGS),attribute.cpp,clean) \
	$(call assert,$(CXX),$(WARN_CXXFLAGS),comment.cpp,$(EXPECT_COMMENT_CXX)) \
	$(call assert,$(CXX),$(WARN_CXXFLAGS),accident.cpp,$(EXPECT_ACCIDENT_CXX)) \
	if [ -z "$(FT_CFLAGS)$(FT_CXXFLAGS)" ]; then \
		echo "  NOTE: this compiler supports neither flag; nothing was enforced."; \
	fi; \
	if [ "$(FT_CFLAGS)" = "-Wimplicit-fallthrough=5" ]; then \
		echo "pitfall (adding *both* flags instead of the first supported one):"; \
		$(call assert,$(CC),$(WARN_CFLAGS_BOTH),comment.c,clean) \
		echo "     ^ 'clean' here is the bug: the trailing bare option"; \
		echo "       silently downgrades the check back to level 3."; \
	fi; \
	echo; \
	if [ $$rc -eq 0 ]; then echo "RESULT: all assertions passed"; \
	else echo "RESULT: failures above"; fi; \
	exit $$rc

clean:
	@rm -rf $(BUILD)
