// Copyright Open Source Security Foundation (OpenSSF) and its contributors
// SPDX-License-Identifier: Apache-2.0 OR MIT

// Local copy of the "noreturn" example from
// https://godbolt.org/z/1csnxsjrc referenced in Compiler-Annotations-for-C-and-C++.md

#include <stdio.h>
#include <stdlib.h>

// Denotes that hasta_la_vista and ill_be_back will never return
void hasta_la_vista() __attribute__ ((noreturn));
void ill_be_back() __attribute__ ((noreturn));

void hasta_la_vista()
{
    printf("Hasta la vista, baby!");
    exit (1);
}

void ill_be_back()
{
    printf("I'll be back...");
}

int main(int argc, char *argv[])
{
    int i;
    printf("%d", i);  // Printing the unitialized i here will emit a diagnostic from [-Wuninitialized]

    hasta_la_vista();

    int j;
    printf("%d", j);  // Printing the unitialized j here has been optimized away as dead code since its after a noreturn function
}
