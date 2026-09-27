// Copyright Open Source Security Foundation (OpenSSF) and its contributors
// SPDX-License-Identifier: Apache-2.0 OR MIT

// Local copy of the "tainted_args" example from
// https://godbolt.org/z/rWzd68YvW referenced in Compiler-Annotations-for-C-and-C++.md

#include <stdio.h>
#include <string.h>

int get_dividend();
int get_divisor();

// Denotes that the arguments to do_division contain values that must be sanitized before use
int do_division(int dividend, int divisor) __attribute__((tainted_args));

int get_dividend()
{
    int d;
    printf("Enter dividend: ");
    scanf("%d", &d);
    return d;
}

int get_divisor()
{
    int d;
    printf("Enter divisor: ");
    scanf("%d", &d);
    return d;
}

int do_division(int dividend, int divisor)
{
    return dividend / divisor;  // use of attacker-controlled value 'divisor' as divisor without checking for zero [CWE-369] [-Wanalyzer-tainted-divisor]
}

int main() {
    int dividend, divisor, result;

    dividend = get_dividend();
    divisor = get_divisor();

    result = do_division(dividend, divisor);

    printf("The result is: %d\n", result);

    return 0;
}
