// Test C/C++ hardening flags

// Copyright Open Source Security Foundation (OpenSSF) and its contributors
// SPDX-License-Identifier: Apache-2.0 OR MIT

#include <stdio.h>

// Linux 5.10 solution:
#if __has_attribute(__fallthrough__)
# define fallthrough                    __attribute__((__fallthrough__))
#else
# define fallthrough                    do {} while (0)  /* fallthrough */
#endif

int main(void) {
	int c = 0;
	switch (c) {
		case 1:
			printf("Hello\n");
			fallthrough;
		case 0:
			printf("Goodbye\n");
			fallthrough;
		default:
			printf("Default\n");
	}
}
