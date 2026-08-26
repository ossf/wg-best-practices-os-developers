// Copyright Open Source Security Foundation (OpenSSF) and its contributors
// SPDX-License-Identifier: Apache-2.0 OR MIT

// Local copy of the "malloc" / "malloc (deallocator)" example from
// https://godbolt.org/z/bc97ahbnd referenced in Compiler-Annotations-for-C-and-C++.md

#include <stdlib.h>

void my_free(void *ptr);

// Denotes that my_malloc will return with a dynamically allocated piece of memory which must be freed using my_free.
void *my_malloc(size_t size) __attribute__ ((malloc, malloc (my_free, 1)));

int conforming_function() {
    void* ptr = my_malloc(sizeof(long));
    my_free(ptr);
}

void mismatching_deallocation() {
    void* ptr = my_malloc(sizeof(long));
    free(ptr);
}

void double_free() {
    void* ptr = my_malloc(sizeof(long));
    my_free(ptr);
    my_free(ptr);
}

void use_after_free() {
    long* ptr = my_malloc(sizeof(long));
    my_free(ptr);
    *ptr = 0;
}

void malloc_leak() {
    long* ptr = my_malloc(sizeof(long));
}

void free_of_non_heap() {
    long l = 0;
    my_free((void*)&l);
}
