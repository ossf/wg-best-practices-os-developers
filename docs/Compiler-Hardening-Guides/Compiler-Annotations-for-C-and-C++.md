# Compiler Annotations for C and C++

> ⓘ NOTE: _This is a draft document by the [Open Source Security Foundation (OpenSSF)](https://openssf.org) [Best Practices Working Group](https://best.openssf.org/). Help to [improve it on GitHub](https://github.com/ossf/wg-best-practices-os-developers/edit/main/docs/Compiler-Hardening-Guides/Compiler-Annotations-for-C-and-C++.md)._

Compile time security analysis and runtime mitigation implemented in compilers both depend on the compiler being able to see the flow of data between different points in a program, across functions and modules. This is quite a challenge in C and C++ because both languages allow passing around opaque references, thus losing information about objects. To work around this problem, both GCC and Clang implement attributes to annotate functions and data structures, enabling better analysis. These annotations improve security. They also help compilers make better optimization decisions, often resulting in better code.

## Attributes at a glance

Both GCC and Clang recognize the `__attribute__` keyword to annotate source code.  Both compilers also provide a `__has_attribute()` macro that returns 1 if the attribute name passed to it is supported and 0 otherwise. For example `__has_attribute(malloc)` would return 1 in the latest GCC and Clang. The full syntax description for the `__attribute__` keyword is available in the GCC documentation[^GCCATTR].

The C++11[^CPP11] and C23[^C23] standards specify a new attribute specifier sequence to standardize the `__attribute__` functionality. The syntax is simply `[[prefix::attribute]]`, where the `prefix` specifies the namespace (e.g. `gnu` for a number of attributes described in this document) and `attribute` is the name of the attribute. Use this style when you can target these standards.

When declaring functions, put attributes at the end of the declaration:

~~~c
extern void *custom_allocator (size_t sz) [[gnu::malloc]] [[alloc_size (1)]];
~~~

In a function definition, place attributes before the function name:

~~~c
void * [[gnu::malloc]] [[gnu::alloc_size (1)]] custom_allocator (size_t sz);
~~~

Some function attributes accept parameters. Parameters can be numbers that indicate the position of the argument to the function; 1 indicates the first argument, 2 the second and so on. Parameters can also be keywords or names of identifiers that have been declared earlier in the program.

Table 1: Recommended attributes

| Attribute                                                                                  | Supported since             | Type                         | Description                                                                                       |
|:------------------------------------------------------------------------------------------ |:---------------------------:|:----------------------------:|:------------------------------------------------------------------------------------------------- |
| `malloc`                                                                                   | GCC 2.95.3<br/>Clang 13.0.0 | Function                     | Mark custom allocation functions that return non-aliased (possibly NULL) pointers.                |
| `malloc (`_`deallocator`_`)`                                                               | GCC 11.0.0<br/>Clang 21.0.0 | Function                     | Associates _`deallocator`_ as the valid deallocator for the storage allocated by marked function. |
| `ownership_returns(`_`allocation-type`_`)`                                                 | Clang 20.1.0                | Function                     | Associate pointers returned by custom allocation function with _`allocation-type`_ .              |
| `ownership_takes(`_`allocation-type`_`,` _`ptr-index`_`)`                                  | Clang 20.1.0                | Function                     | Mark function as valid deallocator for _`allocation-type`_.                                       |
| `ownership_holds(`_`allocation-type`_`,` _`ptr-index`_`)`                                  | Clang 20.1.0                | Function                     | Mark function taking responsibility of deallocation for _`allocation-type`_.                      |
| `alloc_size(`_`size-index`_`)`<br/>`alloc_size(`_`size-index-1`_`,`_`size-index-2`_`)`     | GCC 2.95.3<br/>Clang 4.0.0  | Function                     | Mark positional arguments holding the allocation size that the returned pointer points to.        |
| `access(`_`mode`_`,`_`ref-index`_`)`<br/>`access(`_`mode`_`,` _`ref-index`_`,` _`size-pos`_`)` | GCC 10.0.0                  | Function                     | Mark access restrictions for positional argument.                                                 |
| `fd_arg(`_`fd-index`_`)`                                                                   | GCC 13.1.0                  | Function                     | Mark open file descriptors in positional arguments.                                               |
| `fd_arg_read(`_`fd-index`_`)`                                                              | GCC 13.1.0                  | Function                     | Mark readable file descriptors in positional arguments.                                           |
| `fd_arg_write(`_`fd-index`_`)`                                                             | GCC 13.1.0                  | Function                     | Mark writable file descriptors in positional arguments.                                           |
| `noreturn`                                                                                 | GCC 2.5.0<br/>Clang 4.0.0   | Function                     | Mark functions that never return.                                                                 |
| `tainted_args`                                                                             | GCC 12.1.0                  | Function or function pointer | Mark functions with arguments that require sanitization.                                          |

## Performance considerations

Attributes influence not only diagnostics generated by the compiler but also the generated code. As a result, annotations affect performance. They may enable more traps for additional security more conservative optimizations. However, they can also unlock optimizations that make generated code smaller and faster, and often improve code layout.

[^GCCATTR]: GCC team, [Attribute Syntax](https://gcc.gnu.org/onlinedocs/gcc/Attribute-Syntax.html), GCC manual, 2024-01-17
[^CPP11]: ISO/IEC, [Programming languages — C++ ("C++11")](https://web.archive.org/web/20240112105643/https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3797.pdf), ISO/IEC 14882, 2011. Note: The official ISO/IEC specification is paywalled and therefore not publicly available. The final specification draft is publicly available.
[^C23]: ISO/IEC, [Programming languages — C ("C23")](https://web.archive.org/web/20240105084047/https://open-std.org/JTC1/SC22/WG14/www/docs/n3096.pdf), ISO/IEC 9899:2023, 2023. Note: The official ISO/IEC specification is not available.

---

### Mark custom allocation and deallocation functions

| Attribute                                                                                   | Supported since             | Type                         | Description                                                                                       |
|:--------------------------------------------------------------------------------------------|:---------------------------:|:----------------------------:|:------------------------------------------------------------------------------------------------- |
| <span id="malloc">`malloc`</span>                                                           | GCC 2.95.3<br/>Clang 13.0.0 | Function                     | Mark custom allocation functions that return non-aliased (possibly NULL) pointers.                |
| <span id="malloc (dealloc)">`malloc (`_`deallocator`_`)`</span>                             | GCC 11.0.0<br/>Clang 21.0.0 | Function                     | Associates _`deallocator`_ as the valid deallocator for the storage allocated by marked function. |
| <span id="malloc (dealloc, ptr-index)">`malloc (`_`deallocator`_`,` _`ptr-index`_`)`</span> | GCC 11.0.0                  | Function                     | Same as above but also denotes the positional argument where the pointer must be passed.           |
| <span id="ownership_returns">`ownership_returns(`_`allocation-type`_`)`</span>              | Clang 20.1.0                | Function                     | Associate pointers returned by custom allocation function with _`allocation-type`_ .              |
| <span id="ownership_takes">`ownership_takes(`_`allocation-type`_`,` _`ptr-index`_`)`</span> | Clang 20.1.0                | Function                     | Mark function as valid deallocator for _`allocation-type`_.                                       |
| <span id="ownership_holds">`ownership_holds(`_`allocation-type`_`,` _`ptr-index`_`)`</span> | Clang 20.1.0                | Function                     | Mark function taking responsibility of deallocation for _`allocation-type`_.                      |

The `malloc` attribute in GCC[^gcc-malloc] and Clang[^clang-malloc] indicates that the function behaves like an allocator, meaning it returns a pointer to allocated storage that is disjoint (non-aliased) from the storage for any other object accessible to the caller.

The attribute tells the compiler the returned pointer is unique and does not contain pointers to existing objects, enabling optimizations. Functions like `malloc` and `calloc` have this property because they return a pointer to uninitialized or zeroed-out, newly obtained storage. However, functions like `realloc` do not have this property, as they may return pointers to storage containing pointers to existing objects. GCC also assumes such functions rarely return null, enabling caller optimizations.

In GCC, the `malloc (`_`deallocator`_`)` and `malloc (`_`deallocator`_`,` _`ptr-index`_`)` forms associate the pointer returned by the marked function with the specified _`deallocator`_ function. Here, _`deallocator`_ must be declared before use. The _`ptr-index`_ denotes the positional argument to _`deallocator`_ where the pointer must be passed to deallocate the storage. Using these forms of the `malloc` attribute interacts with the GCC `-Wmismatched-dealloc` and `-Wmismatched-new-delete` warnings[^gcc-mismatched-dealloc] and GCC’s static analyzer (`-fanalyzer`[^gcc-analyzer]) to allow it to catch:

- **Mismatched deallocation** (`-Wanalyzer-mismatching-deallocation`) if there is an execution path in which the result of an allocation call is passed to a different _`deallocator`_.
- **Double free** (`-Wanalyzer-double-free`) if there is an execution path in which a value is passed more than once to a deallocation call.
- **Null pointer dereference** (`-Wanalyzer-possible-null-dereference`) if there are execution paths in which an unchecked result of an allocation call is dereferenced or passed to a function requiring a non-null argument.
- **Use-after-free** (`-Wanalyzer-use-after-free`) if there is an execution path in which the memory passed by pointer to a deallocation call is used after the deallocation.
- **Memory leaks** (`-Wanalyzer-malloc-leak`) if if there is an execution path in which the result of an allocation call goes out of scope without being passed to the deallocation function.
- **Invalid free** (`-Wanalyzer-free-of-non-heap`) if a deallocation function is used on a global or on-stack variable.

Clang supports both forms of the `malloc` attribute but does not yet implement the `-Wmismatched-dealloc` and `-Wmismatched-new-delete` warnings. Instead, Clang provides the `ownership_returns`, `ownership_takes`, and `ownership_holds` attributes[^clang-ownership]: that interact with the Clang static analyzer[^clang-checkers].

In Clang, the `ownership_returns(`_`allocation-type`_`)` associates the pointer returned by the marked function with an _`allocation-type`_. Here, _`allocation-type`_ is any string which will subsequently be used to detect mismatched allocations in cases where the pointer is passed to a deallocator marked with another _`allocation-type`_. The _`allocation-type`_ `malloc` has a special meaning and causes the Clang static analyzer to treat the associated pointer as though the allocated storage would have been allocated using the standard `malloc()` function, and can subsequently be safely deallocated with the standard `free()` function.

The Clang `ownership_takes(`_`allocation-type`_`,` _`ptr-index`_`)` attribute marks a function as a deallocator for pointers of _`allocation-type`_ and `ownership_holds(`_`allocation-type`_`,` _`ptr-index`_`)` marks a function as taking over the ownership of a pointer of _`allocation-type`_ and will deallocate it at some unspecified point in the future. Here, _`ptr-index`_ denotes the positional argument to where the pointer must be passed in order to deallocate or take ownership of the storage.

Using the `ownership_returns`, `ownership_takes`, and `ownership_holds` attributes allows the Clang static analyzer to catch:

- **Mismatched deallocation** (`unix.MismatchedDeallocator`) if there is an execution path in which the result of an allocation call of type _`allocation-type`_ is passed to a function annotated with `ownership_takes` or `ownership_holds` with a different allocation type.
- **Double free** (`unix.Malloc`, `cplusplis.NewDelete`) if there is an execution path in which a value is passed more than once to a function annotated with `ownership_takes` or `ownership_holds`.
- **Use-after-free** (`unix.Malloc`, `cplusplus.NewDelete`) if there is an execution path in which the memory passed by pointer to a function annotated with `ownership_takes` is used after the call. Using memory passed to a function annotated with `ownership_holds` is considered valid.
- **Memory leaks** (`unix.Malloc`, `cplusplus.NewDeleteLeaks`) if there is an execution path in which the result of an allocation call goes out of scope without being passed to a function annotated with `ownership_takes` or `ownership_holds`.
- **Dubious `malloc()` arguments involving `sizeof`** (`unix.MallocSizeof`) if the size of the pointer type the returned pointer does not match the size indicated by `sizeof` expression passed as argument to the allocation function.
- **Potentially attacker controlled `size` parameters to allocation functions** (`optin.taint.TaintedAlloc`) if the `size` parameter originates from a tainted source and the analyzer cannot prove that the size parameter is within reasonable bounds (`<= SIZE_MAX/4`).

#### Example usage

GCC `malloc`, `malloc (`_`deallocator`_`)`, and `malloc (`_`deallocator`_, _`ptr-index`_`)` in C++11 / C23 attribute syntax:

~~~c
void my_free(void *ptr);

// Denotes that my_malloc will return with a dynamically allocated piece of memory which must be freed using my_free.
void * my_malloc(size_t size) [[gnu::malloc]] [[gnu::malloc(my_free, 1)]];
~~~

In `__attribute__` keyword syntax:

~~~c
// Denotes that my_malloc will return with a dynamically allocated piece of memory which must be freed using my_free.
void *my_malloc(size_t size) __attribute__ ((malloc, malloc (my_free, 1))) { … }
~~~

Note that to benefit both from the associated optimizations and improved detection of memory errors functions should be marked with _both_ the form of the attribute without arguments and the form of the attribute with one or two arguments. [[Extended example at Compiler Explorer](https://godbolt.org/z/bc97ahbnd)]

Clang `ownership_returns`, `ownership_takes`, and `ownership_holds` in C++11 / C23 attribute syntax:

~~~c
// Denotes that my_malloc will return with a pointer to storage labeled as "my_allocation".
void * my_malloc(size_t size) [[gnu::malloc]] [[clang::ownership_returns(my_allocation)]];

// Denotes that my_free will deallocate storage pointed to by ptr that has been labeled "my_allocation".
voidmy_free(void *ptr) [[clang::ownership_takes(my_allocation, 1)]] ;

// Denotes that my_hold will take over the ownership of storage pointed to by ptr that has been labeled "my_allocation".
void my_hold(void *ptr) [[clang::ownership_holds(my_allocation, 1)]];
~~~

In `__attribute__` keyword syntax:

~~~c
// Denotes that my_malloc will return with a pointer to storage of labeled as "my_allocation" .
void *my_malloc(size_t size) __attribute((malloc, ownership_returns(my_allocation)));

// Denotes that my_free will deallocate storage pointed to by ptr that has been labeled "my_allocation".
void my_free(void *ptr) __attribute((ownership_takes(my_allocation, 1)));

// Denotes that my_hold will take over the ownership of storage pointed to by ptr that has been labeled "my_allocation".
void my_hold(void *ptr) __attribute((ownership_holds(my_allocation, 1)));
~~~

[^gcc-malloc]: GCC team, [Using the GNU Compiler Collection (GCC): 6.35.1 Common Function Attributes: malloc](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html#index-malloc-function-attribute), GCC Manual, 2024-08-01.
[^gcc-mismatched-dealloc]: GCC team, [Using the GNU Compiler Collection (GCC): 3.9 Options to Request or Suppress Warnings: -Wmismatched-dealloc](https://gcc.gnu.org/onlinedocs/gcc/Warning-Options.html#index-Wmismatched-dealloc), GCC Manual, 2024-08-01.
[^gcc-analyzer]: GCC team, [Using the GNU Compiler Collection (GCC): 3.10 Options That Control Static Analysis](https://gcc.gnu.org/onlinedocs/gcc/Static-Analyzer-Options.html), GCC Manual, 2024-08-01.
[^clang-malloc]: LLVM team, [Attributes in Clang: malloc](https://clang.llvm.org/docs/AttributeReference.html#malloc), Clang Compiler User's Manual, 2025-03-04.
[^clang-ownership]: LLVM team, [Attributes in Clang: ownership_holds, ownership_returns, ownership_takes](https://releases.llvm.org/18.1.8/tools/clang/docs/AttributeReference.html#ownership-holds-ownership-returns-ownership-takesc), Clang Compiler User's Manual, 2025-03-04.
[^clang-checkers]: LLVM team, [Clang Static Analyzer: 1. Available Checkers¶](https://clang.llvm.org/docs/analyzer/checkers.html), Clang Compiler User's Manual, 2025-03-04.

---

### Mark positional arguments holding allocation size information

| Attribute                                                                                   | Supported since             | Type                         | Description                                                                                       |
|:--------------------------------------------------------------------------------------------|:---------------------------:|:----------------------------:|:------------------------------------------------------------------------------------------------- |
| `alloc_size(`_`size-index`_`)`<br/>`alloc_size(`_`size-index-1`_`,`_`size-index-2`_`)`      | GCC 2.95.3<br/>Clang 4.0.0  | Function                     | Mark positional arguments holding the allocation size that the returned pointer points to.        |

The `alloc_size` attribute in GCC[^gcc-alloc_size] and Clang[^clang-alloc_size] indicates that the function's return value points to a memory The `alloc_size` attribute in GCC[^gcc-alloc_size] and Clang[^clang-alloc_size] indicates that the function's return value points to a memory allocation and the specified positional arguments hold the size of that allocation. The compiler uses this information to improve the results of `__builtin_object_size` and `__builtin_dynamic_object_size`[^gcc-object-size]. This can improve the accuracy of source fortification for unsafe libc usage and buffer overflows, as these builtins are used by [`__FORTIFY_SOURCE`](Compiler-Options-Hardening-Guide-for-C-and-C++.html#-D_FORTIFY_SOURCE=3) to determine correct object bounds.

The `alloc_size(`_`size-index`_`)` form tells the compiler that the size of the allocation is denoted by the positional argument at _`size-index`_(using one-based indexing). This form can be used for functions with a `malloc`-like API.

The `alloc_size(`_`size-index-1`_`,`_`size-index-2`_`)` form tells the compiler that the size of the allocation is denoted by the product of the positional arguments at _`size-index-1`_ and _`size-index-2`_. This form can be used for functions with a `calloc`-like API.

In Clang, the size information hints provided via `alloc_size` attribute only affects `__builtin_object_size` and `__builtin_dynamic_object_size` calls for pointer variables that are declared `const`. In GCC the provided size information hints also affect `__builtin_object_size` and `__builtin_dynamic_object_size` calls for non-`const` pointer variables.

#### Example usage

In C++11 / C23 attribute syntax:

~~~c
// Denotes that my_malloc will return with a pointer to storage capable of holding up to size bytes.
void * my_malloc(size_t size) [[gnu::alloc_size(1)]];

// Denotes that my_realloc will return with a pointer to storage capable of holding up to size bytes.
void * my_realloc(void* ptr, size_t size)  [[gnu::alloc_size(2)]];

// Denotes that my_calloc will return with a pointer to storage capable of holding up to n * size bytes.
void * my_calloc(size_t n, size_t size)  [[gnu::alloc_size(1, 2)]];
~~~

In `__attribute__` keyword syntax:

~~~c
// Denotes that my_malloc will return with a pointer to storage capable of holding up to size bytes.
void *my_malloc(size_t size) __attribute__((alloc_size(1)));

// Denotes that my_realloc will return with a pointer to storage capable of holding up to size bytes.
void *my_realloc(void* ptr, size_t size) __attribute__((alloc_size(2)));

// Denotes that my_calloc will return with a pointer to storage capable of holding up to n * size bytes.
void *my_calloc(size_t n, size_t size) __attribute__((alloc_size(1, 2)));

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
~~~

[[Extended example at Compiler Explorer](https://godbolt.org/z/EoEWsnE7f)]

[^gcc-alloc_size]: GCC team, [Using the GNU Compiler Collection (GCC): 6.35.1 Common Function Attributes: alloc_size](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html#index-alloc_005fsize-function-attribute), GCC Manual, 2024-08-01.
[^gcc-object-size]: GCC team, [Using the GNU Compiler Collection (GCC): 6.62 Object Size Checking](https://gcc.gnu.org/onlinedocs/gcc/Object-Size-Checking.html), GCC Manual, 2024-08-01.
[^clang-alloc_size]: LLVM team, [Attributes in Clang: alloc_size](https://clang.llvm.org/docs/AttributeReference.html#alloc-size), Clang Compiler User's Manual, 2025-03-04.

---

### Mark access restrictions for positional arguments

| Attribute                                                                                      | Supported since             | Type                         | Description                                                                                       |
|:-----------------------------------------------------------------------------------------------|:---------------------------:|:----------------------------:|:------------------------------------------------------------------------------------------------- |
| `access(`_`mode`_`,`_`ref-index`_`)`<br/>`access(`_`mode`_`,`_`ref-index`_`,`_`size-index`_`)` | GCC 11.0.0                  | Function                     | Mark access restrictions for positional argument.                                                 |

The `access` attribute in GCC[^gcc-access] specifies how the function uses the specified argument. GCC uses this to detect nonconforming accesses and write-only accesses to objects that are never read. Diagnostics of such non-conforming accesses are reported through compiler warnings. Examples include `-Wstringop-overread`, `-Wstringop-overflow`, `-Wuninitialized`, `-Wmaybe-uninitialized`, and `-Wunused`.

The `access(`_`mode`_`,`_`ref-index`_`)` form indicates to GCC that the annotated function accesses the object passed to the function by-reference denoted the by the positional argument at _`ref-index`_ (using one-based indexing) according to _`mode`_, where _`mode`_ is one of the following access modes:

- `read_only`: the pointer or C++ reference corresponding to the specified positional argument may be used to read the referenced object but not write to it.
- `write_only`: the pointer or C++ reference corresponding to the specified positional argument may be used to write the referenced object but not to read from it.
- `read_write`: the pointer or C++ reference corresponding to the specified positional argument may be used to both read and write to the referenced object.
- `none`: the pointer or C++ reference corresponding to the specified positional argument may not be used to access the referenced object at all.

The `access(`_`mode`_`,`_`ref-index`_`,`_`size-index`_`)` form behaves as the `access(`_`mode`_`,`_`ref-index`_`)` form but additionally hints to the compiler that the maximum size of the object (for the purposes of accesses) referenced by the pointer (or C++ reference) corresponding to the _`ref-index`_ positional argument is denoted by the positional argument at _`size-index`_. The size is expected to the expressed as the number of bytes if the pointer type denoted by _`ref-index`_ is `void*`. Otherwise, the size is expressed as the number of elements of the type being referenced by the pointer denoted by _`ref-index`_. The actual bounds of the accesses carried out by the function may be less than the size denoted by the positional argument at _`size-index`_ but they must not exceed the denoted size.

The `write_only` and `read_write` access modes are applicable only to non-`const` pointer types. The `read_only` access mode implies a stronger guarantee than the `const` qualifier which may be cast away from a pointer.

In the `read_only` and `read_write` access modes the object referenced by the pointer corresponding to the _`ref-index`_ must be initialized unless the argument specifying the size of the access denoted by _`size-index`_ is zero. In the `write_only` access mode the object referenced by the pointer need not be initialized.

### Example usage

In C++11 / C23 attribute syntax:

~~~c
// Denotes that puts performs read-only access on the memory pointed to by ptr.
int puts (const char* ptr) [[gnu::access(read_only, 1)]];

// Denotes that strcat performs read-write access on the memory pointed to by destination and read-only access on the memory pointed to by source.
char* strcat (char* destination, const char* source) [[gnu::access(read_write, 1)]] [[gnu::access(read_only, 2)]];

// Denotes that strcpy performs write-only access on the memory pointed to by destination and read-only access on the memory pointed to by source.
char* strcpy (char* destination, const char* source) [[gnu::access(write_only, 1)]] [[gnu::access(read_only, 2)]];

// Denotes that fgets performs write-only access up to n characters on the memory pointed to by buff and read-write access on the memory pointed to by stream.
int] fgets (char* buff, int n, FILE* stream) [[gnu::access(write_only, 1, 2)]] [[gnu::access(read_write, 3)];

// Denotes that print_buffer performs read-only access up to size characters on memory pointed to by buffer.
void print_buffer(const char *buffer, size_t size) [[gnu::access(read_only, 1, 2)]];

// Denotes that fill_buffer performs write-only access up to size characters on memory pointed to by buffer.
void fill_buffer(char *buffer, size_t size) [[gnu::access(write_only, 1, 2)]];

// Denotes that to_uppercase performs read-write access up to size characters on memory pointed to by buffer.
void to_uppercase(char *buffer, size_t size) [[gnu::access(read_write, 1, 2)]];
~~~

In `__attribute__` keyword syntax:

~~~c
// Denotes that puts performs read-only access on the memory pointed to by ptr.
int puts (const char* ptr) __attribute__ ((access (read_only, 1)));

// Denotes that strcat performs read-write access on the memory pointed to by destination and read-only access on the memory pointed to by source.
char* strcat (char* destination, const char* source) __attribute__ ((access (read_write, 1), access (read_only, 2)));

// Denotes that strcpy performs write-only access on the memory pointed to by destination and read-only access on the memory pointed to by source.
char* strcpy (char* destination, const char* source) __attribute__ ((access (write_only, 1), access (read_only, 2)));

// Denotes that fgets performs write-only access up to n character on the memory pointed to by buff and read-write access on the memory pointed to by stream.
int fgets (char* buff, int n, FILE* stream) __attribute__ ((access (write_only, 1, 2), access (read_write, 3)));

// Denotes that print_buffer performs read-only access up to size characters on memory pointed to by buffer.
void print_buffer(const char *buffer, size_t size) __attribute__((access(read_only, 1, 2)));

// Denotes that fill_buffer performs write-only access up to size characters on memory pointed to by buffer.
void fill_buffer(char *buffer, size_t size) __attribute__((access(write_only, 1, 2)));

// Denotes that to_uppercase performs read-write access up to size characters on memory pointed to by buffer.
void to_uppercase(char *buffer, size_t size) __attribute__((access(read_write, 1, 2)));
~~~

[[Extended example at Compiler Explorer](https://godbolt.org/z/K44d89YM7)]

[^gcc-access]: GCC team, [Using the GNU Compiler Collection (GCC): 6.35.1 Common Function Attributes: access](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html#index-access-function-attribute), GCC Manual, 2024-08-01.

---

### Mark positional arguments holding open file descriptors

| Attribute                                                                                      | Supported since             | Type                         | Description                                                                                       |
|:-----------------------------------------------------------------------------------------------|:---------------------------:|:----------------------------:|:------------------------------------------------------------------------------------------------- |
| `fd_arg(`_`fd-index`_`)`                                                                       | GCC 13.0.0                  | Function                     | Mark positional argument holding a valid and open file descriptor.                                |
| `fd_arg_read(`_`fd-index`_`)`                                                                  | GCC 13.0.0                  | Function                     | Mark positional argument holding a valid, open, and readable file descriptor.                     |
| `fd_arg_write(`_`fd-index`_`)`                                                                 | GCC 13.0.0                  | Function                     | Mark positional argument holding a valid, open, and writable file descriptor.                     |

The `fd_arg`, `fd_arg_read`, and `fd_arg_write` attributes in GCC[^gcc-fd_arg] indicate that the annotated function expects an open file descriptor as an argument. GCC’s static analyzer (`-fanalyzer`[^gcc-analyzer]) can use this information to catch:

- **Access mode mismatches** (`-Wanalyzer-fd-access-mode-mismatch`) if there are code paths through which a read on a write-only file descriptor or write on a read-only file descriptor is attempted.
- **Double-close conditions** (`-Wanalyzer-fd-double-close`) if there are code paths through which a file descriptor can be closed more than once.
- **File descriptor leaks** (`-Wanalyzer-fd-leak`) if there are code paths through which a file descriptor goes out of scope without being closed.
- **Use-after-close** (`-Wanalyzer-fd-use-after-close`) if there are code paths through which a read or write is attempted on a closed file descriptor.
- **Use-without-check** (`-Wanalyzer-fd-use-without-check`) if there are code paths through which a file descriptor is used without being first checked for validity.

The `fd_arg(`_`fd-index`_`)` form acts as a hint to the compiler that the positional argument at _`fd-index`_(using one-based indexing) must be an open file descriptor and must have been checked for validity (such as by calling `fcntl(fd, F_GETFD)` on it) before usage.

The `fd_arg_read(`_`fd-index`_`)` form is like `fd_arg` but also requires that the file descriptor must not have been opened as write-only.

The  `fd_arg_write(`_`fd-index`_`)` form is like `fd_arg` but also requires that the file descriptor must not have been opened as read-only.

#### Example usage

In C++11 / C23 attribute syntax:

~~~c
// Denotes that use_file expects fd to be a valid and open file descriptor
void use_file (int fd) [[gnu::fd_arg(1)]] ;

// Denotes that write_to_file expects fd to be a valid, open, and writable file descriptor
void write_to_file (int fd, void *src, size_t size) [[gnu::fd_arg_write(1)]];

// Denotes that read_from_file expects fd to be a valid, open, and readable file descriptor
void  read_from_file (int fd, void *dst, size_t size) [[gnu::fd_arg_read(1)]];
~~~

In `__attribute__` keyword syntax:

~~~c
// Denotes that use_file expects fd to be a valid and open file descriptor
void use_file (int fd) __attribute__ ((fd_arg (1)));

// Denotes that write_to_file expects fd to be a valid, open, and writable file descriptor
void write_to_file (int fd, void *src, size_t size) __attribute__ ((fd_arg_write (1)));

// Denotes that read_from_file expects fd to be a valid, open, and readable file descriptor
void read_from_file (int fd, void *dst, size_t size) __attribute__ ((fd_arg_read (1)));
~~~

[[Extended example at Compiler Explorer](https://godbolt.org/z/T66Wj5YKv)]

[^gcc-fd_arg]: GCC team, [Using the GNU Compiler Collection (GCC): 6.35.1 Common Function Attributes: fd_arg](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html#index-fd_005farg-function-attribute), GCC Manual, 2024-08-01.

---

### Mark functions that never return

| Attribute                                                                                      | Supported since             | Type                         | Description                                                                                       |
|:-----------------------------------------------------------------------------------------------|:---------------------------:|:----------------------------:|:------------------------------------------------------------------------------------------------- |
| `noreturn`                                                                                     | GCC 2.5.0<br/>Clang 4.0.0   | Function                     | Mark functions that never return.                                                                 |

The `noreturn` attribute indicates that the annotated function never returns to its caller. Examples include functions that terminate the application (e.g., `abort()` and `exit()`), throw exceptions, or loop indefinitely. Such functions and methods must be declared void.

This lets the compiler optimize assuming the function never returns. In addition, the compiler can diagnose any function declared as `noreturn` that appears to return[^clang-noreturn]. The attribute can also improve other diagnostics, for example by reducing false warnings for uninitialized variables[^gcc-noreturn].

Users should be careful not to assume that registers saved by the calling function are restored before calling the `noreturn` function.

#### Example usage

In C++11 / C23 attribute syntax:

~~~c
// Denotes that fatal will never return
void fatal () [[noreturn]];
~~~

In `__attribute__` keyword syntax:

~~~c
// Denotes that fatal will never return
void fatal () __attribute__ ((noreturn));
          
void    /* It does not make sense for a noreturn function to have a return type other than void. */
fatal (...)
{
    ... /* Print error message. */ ...
    exit (1);
}
~~~

Before GCC 2.5.0, a non-returning function could be declared as[^gcc-voidfn]:

~~~c
typedef void voidfn ();
volatile voidfn fatal;
~~~

[[Extended example at Compiler Explorer](https://godbolt.org/z/1csnxsjrc)]

[^gcc-noreturn]: GCC team, [Using the GNU Compiler Collection (GCC): 6.35.1 Common Function Attributes: noreturn](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html#index-noreturn-function-attribute), GCC Manual, 2024-08-01.
[^gcc-voidfn]: GCC team, [Using the GNU Compiler Collection (GCC): 6.35.1 Common Function Attributes: noreturn](https://gcc.gnu.org/onlinedocs/gcc-3.2.3/gcc/Function-Attributes.html), GCC Manual, 2003-05-25.
[^clang-noreturn]: LLVM team, [Attributes in Clang: noreturn](https://clang.llvm.org/docs/AttributeReference.html#noreturn-noreturn), Clang Compiler User's Manual, 2025-03-04.

---

### Mark functions with arguments that require sanitization

| Attribute                                                                                  | Supported since             | Type                         | Description                                                                                       |
|:------------------------------------------------------------------------------------------ |:---------------------------:|:----------------------------:|:------------------------------------------------------------------------------------------------- |
| `tainted_args`                                                                             | GCC 12.1.0                  | Function or function pointer | Mark functions with arguments that require sanitization.                                          |

The `tainted_args` attribute marks functions whose arguments must be sanitized[^gcc-tainted-args]. GCC's static analyzer (`-fanalyzer`[^gcc-analyzer]) uses this information to treat all parameters (and pointed-to buffers) as potentially attacker-controlled. It then checks how those values are used. The analyzer can subsequently warn when tainted arguments are used as:

- **Allocation sizes** (`-Wanalyzer-tainted-allocation-size`) if there are code paths through which a tainted argument is used as a size argument to an memory allocation function such as `malloc()` without sanitization.
- **Part of assertion conditions** (`-Wno-analyzer-tainted-assertion`) if there are code paths through which a tainted argument is used in a condition without sanitization which can lead to a function annotated with `noreturn`, such as assertion failure handlers.
- **Array index** (`-Wno-analyzer-tainted-array-index`) if there are code paths through which a tainted argument is used as an array index without sanitization, potentially exposing the code to out-of-bounds conditions.
- **Divisor** (`-Wanalyzer-tainted-divisor`) if there are code paths through which a tainted argument is used as a divisor in an arithmetic division operations without sanitization, potentially exposing the code to division-by-zero errors.
- **Pointer offsets** (`-Wanalyzer-tainted-offset`) if there are code paths through which a tainted argument is used an offset in pointer arithmetic without sanitization, potentially exposing the code to spatial-safety violations.
- **Sizes** (`-Wanalyzer-tainted-size`) if there are code paths through which a tainted argument is used a size argument to a (non-memory-allocation) function, such as `memset()`, potentially exposing the code to spatial-safety violations.

The main use case of the `tainted_args` attribute is annotating the program's attack surface, i.e., the functions that are exposed to untrusted, potentially malicious inputs originating from outside the program. The associated static analysis ensures that such untrusted input cannot propagate to sensitive operations without sanitization.

You can apply `tainted_args` to function declarations and to fields that hold function pointers. In the latter case, any function used as an initializer of such a callback field will be treated as being called with tainted arguments.

Prior to GCC 14.1.0 the GCC analyzer's _taint mode_ had to be explicitly enabled by supplying the `-fanalyzer-checker=taint` option. In GCC 14.1.0 onwards taint tracking and the above diagnostics are enabled by default with the `-fanalyzer` option [^Malcolm23].

### Example usage

In C++11 / C23 attribute syntax:

~~~c
// Marks arguments to do_with_untrusted as requiring sanitization
void do_with_untrusted_input(int untrusted_input) [[gnu::tainted_args]];
~~~

In `__attribute__` keyword syntax:

~~~c
// Marks arguments to do_with_untrusted as requiring sanitization
void do_with_untrusted_input(int untrusted_input) __attribute__ ((tainted_args));
~~~

[[Extended example at Compiler Explorer](https://godbolt.org/z/rWzd68YvW)]

[^gcc-tainted-args]: GCC team, [Using the GNU Compiler Collection (GCC): 6.35.1 Common Function Attributes: tainted_args](https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html#index-tainted_005fargs-function-attribute), GCC Manual, 2025-08-08.
[^Malcolm23]: Malcolm, David. [Enable "taint" state machine with -fanalyzer without requiring -fanalyzer-checker=taint](https://gcc.gnu.org/bugzilla/show_bug.cgi?id=103533#c9), GCC Bug 103533, 2023-12-01.

## License

Copyright 2024, OpenSSF contributors, licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

## References
