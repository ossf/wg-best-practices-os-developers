// Copyright Open Source Security Foundation (OpenSSF) and its contributors
// SPDX-License-Identifier: Apache-2.0 OR MIT

// Local copy of the "access" example from
// https://godbolt.org/z/K44d89YM7 referenced in Compiler-Annotations-for-C-and-C++.md

#include <stddef.h>
#include <stdio.h>
#include <string.h>
#include <ctype.h>

// Denotes that print_buffer will perform read-only access up to size characters on memory pointed to by buffer.
__attribute__((access(read_only, 1, 2)))
void print_buffer(const char *buffer, size_t size) {
    for (size_t i = 0; i < size; ++i)
        putchar(buffer[i]);
}

// Denotes that fill_buffer will perform write-only access up to size characters on memory pointed to by buffer.
__attribute__((access(write_only, 1, 2)))
void fill_buffer(char *buffer, size_t size) {
    memset(buffer, 'a', size);
}

// Denotes that to_uppercase will perform read-write access up to size characters on memory pointed to by buffer.
__attribute__((access(read_write, 1, 2)))
void to_uppercase(char *buffer, size_t size) {
    for (size_t i = 0; i < size; ++i)
        buffer[i] = toupper((unsigned char)buffer[i]);
}

void conformant_function() {
    char buf[256];
    fill_buffer(buf, sizeof(buf));
    to_uppercase(buf, sizeof(buf));
    print_buffer(buf, sizeof(buf));
}

void nonconformant_unitialized_read_in_print_buffer() {
    char buf[256];
    print_buffer(buf, sizeof(buf));  // Violation: access to unitialized buffer.
}

void nonconformant_maybe_unitialized_read_write_in_to_uppercase() {
    char buf[256];
    to_uppercase(buf, sizeof(buf));  // Violation: Possible access to unitialized buffer.
    print_buffer(buf, sizeof(buf));
}

void nonconformant_out_of_bounds_fill_buffer() {
    char buf[128];
    size_t size = 256;
    fill_buffer(buf, size);   // Violation: Access beyond the allocated buffer size.
    print_buffer(buf, size);  // Violation: Access beyond the allocated buffer size.
    to_uppercase(buf, size);  // Violation: Access beyond the allocated buffer size.
}
