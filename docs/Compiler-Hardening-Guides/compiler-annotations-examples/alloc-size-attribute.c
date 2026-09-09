// Copyright Open Source Security Foundation (OpenSSF) and its contributors
// SPDX-License-Identifier: Apache-2.0 OR MIT

// Local copy of the "alloc_size" example from
// https://godbolt.org/z/EoEWsnE7f referenced in Compiler-Annotations-for-C-and-C++.md

#include <stdlib.h>
#include <assert.h>

// Denotes that my_malloc will return with a pointer to storage capable of holding up to size bytes.
void *my_malloc(size_t size) __attribute__((alloc_size(1)));

// Denotes that my_realloc will return with a pointer to storage capable of holding up to size bytes.
void *my_realloc(void* ptr, size_t size) __attribute__((alloc_size(2)));

// Denotes that my_calloc will return with a pointer to storage capable of holding up to n * size bytes.
void *my_calloc(size_t n, size_t size) __attribute__((alloc_size(1, 2)));

int main() {
    // The following assertions will evaluate to true in both GCC and Clang
    void *const p = my_malloc(100);
    assert(__builtin_object_size(p, 0) == 100);

    void *const q = my_calloc(20, 5);
    assert(__builtin_object_size(q, 0) == 100);

    // The following assertions will evaluate to true in GCC
    void *r = my_malloc(100);
    assert(__builtin_object_size(r, 0) == 100);

    void *s = my_calloc(20, 5);
    assert(__builtin_object_size(s, 0) == 100);
}
