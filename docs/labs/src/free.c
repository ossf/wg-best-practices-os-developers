// To compile and run:
// gcc free.c ; ./a.out 

#include <stdlib.h>
#include <string.h>
#include <stdio.h>

char *tweak(char *s) {
	char *result;
	asprintf(&result, "pre_%s_post", s);
	free(s);
	return result;
}

int main() {
	char *s = "This is a test";
	// Create something we can free
	char *modify = strdup(s);
	// Create modified version
	char *res = tweak(modify);
	printf("Result = %s\n", res);
}

