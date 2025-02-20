# Compiler Annotations for C and C++

Compile time security analysis and runtime mitigation implemented in compilers both depend on the compiler being able to see the flow of data between different points in a program, across functions and modules. This is quite a challenge in C and C++ because both languages allow passing around opaque references, thus losing information about objects.  To work around this problem, both GCC and Clang implement attributes to annotate source code, especially functions and data structures, to allow them to do better analysis of source code.  These annotations are not only beneficial for security, but they also help the compilers make better optimization decisions, often resulting in better code.

## Attributes at a glance

Both GCC and Clang recognize the `__attribute__` keyword to annotate source code.  Both compilers also provide a `__has_attribute()` macro function that returns 1 if the attribute name passed to it is supported and 0 otherwise.  For example `__has_attribute(malloc)` would return 1 in the latest GCC and Clang.  The full syntax description for the `__attribute__` keyword is available in the GCC documentation[^GCCATTR].

The C++11[^CPP11] and C23[^C23] standards specify a new attribute specifier sequence to standardize the `__attribute__` functionality. The syntax is simply `[[prefix::attribute]]`, where the `prefix` specifies the namespace (e.g. `gnu` for a number of attributes described in this document) and `attribute` is the name of the attribute. This style is recommended whenever it is possible to build your applications to target these standards.

When declaring functions, attributes may be added to the function at the end of the declaration, like so:

~~~c
extern void *custom_allocator (size_t sz) [[gnu::malloc]] [[alloc_size (1)]];
~~~

At function definition, function attributes come right before the function name:

~~~c
void * [[gnu::malloc]] [[gnu::alloc_size (1)]] custom_allocator (size_t sz);
~~~

Some function attributes can accept parameters that have specific meanings.  Parameters can be numbers that indicate the position of the argument to the function; 1 indicates the first argument, 2 the second and so on.  Parameters can also be keywords or names of identifiers that have been declared earlier in the program.

Table 1: Recommended attributes

| Attribute                                                      | Supported since             | Type                         | Description                                                                                                                                                                                                      |
|:-------------------------------------------------------------- |:---------------------------:|:----------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `malloc`                                                       | GCC 2.95.3<br/>Clang 13.0.0 | Function                     | Mark custom allocation functions that return non-aliased (possibly NULL) pointers.                                                                                                                               |
| `malloc (`_`deallocator`_`)`                                   | GCC 11.0.0<br/>Clang 21.0.0 | Function                     | Associates _`deallocator`_ as the valid deallocator for the storage allocated by marked function.                                                                                                                |
| `ownership_returns(`_`allocation-type`_`)`                     | Clang 20.1.0                | Function                     | Associate pointers returned by custom allocation function with _`allocation-type`_ .                                                                                                                             |
| `ownership_takes(`_`allocation-type`_`,` _`ptr-index`_`)`      | Clang 20.1.0                | Function                     | Mark function as valid deallocator for _`allocation-type`_.                                                                                                                                                      |
| `ownership_holds(`_`allocation-type`_`,` _`ptr-index`_`)`      | Clang 20.1.0                | Function                     | Mark function taking responsibility of deallocation for _`allocation-type`_.                                                                                                                                     |
| `alloc_size(pos)`<br/>`alloc_size(pos-1, pos-2)`               | GCC 2.95.3<br/>Clang 4.0.0  | Function                     | Size of the object that the returned pointer points to is at argument `pos` of the function or product of arguments at `pos-1` and `pos-2`.                                                                      |
| `access(mode, ref-pos)`<br/>`access(mode, ref-pos, size-pos)`  | GCC 10                      | Function                     | Indicate how the function uses argument at `ref-pos`.  `mode` could be `read_only`, `read_write`, `write_only` or `none`.  `size-pos`, if mentioned, is the argument indicating the size of object at `ref-pos`. |
| `fd_arg(N)`                                                    | GCC 13                      | Function                     | Argument N is an open file descriptor.                                                                                                                                                                           |
| `fd_arg_read(N)`                                               | GCC 13                      | Function                     | Argument N is an open file descriptor that can be read from.                                                                                                                                                     |
| `fd_arg_write(N)`                                              | GCC 13                      | Function                     | Argument N is an open file descriptor that can be written to.                                                                                                                                                    |
| `noreturn`                                                     | GCC 2.95.3<br/>Clang 4.0.0  | Function                     | The function does not return.                                                                                                                                                                                    |
| `tainted_args`                                                 | GCC 12                      | Function or function pointer | Function needs sanitization of its arguments. Used by `-fanalyzer=taint`                                                                                                                                         |

## Performance considerations

Attributes influence not only diagnostics generated by the compiler but also the resultant code. As a result, annotating code with attributes will have an impact on performance, although the impact may go either way.  The annotation may allow compilers to add more traps for additional security and be conservative about some optimizations, thus impacting performance of output code. At the same time however, it may allow compilers to make some favorable optimization decisions, resulting in generation of smaller and faster running code and often, better code layout.

[^GCCATTR]: GCC team, [Attribute Syntax](https://gcc.gnu.org/onlinedocs/gcc/Attribute-Syntax.html), GCC manual, 2024-01-17
[^CPP11]: ISO/IEC, [Programming languages — C++ ("C++11")](https://web.archive.org/web/20240112105643/https://www.open-std.org/jtc1/sc22/wg21/docs/papers/2013/n3797.pdf), ISO/IEC 14882, 2011. Note: The official ISO/IEC specification is paywalled and therefore not publicly available. The final specification draft is publicly available.
[^C23]: ISO/IEC, [Programming languages — C ("C23")](https://web.archive.org/web/20240105084047/https://open-std.org/JTC1/SC22/WG14/www/docs/n3096.pdf), ISO/IEC 9899:2023, 2023. Note: The official ISO/IEC specification is not available.

---

### Mark custom allocation and deallocation functions

| Attribute                                                                                   | Supported since             | Type                         | Description                                                                                       |
|:--------------------------------------------------------------------------------------------|:---------------------------:|:----------------------------:|:------------------------------------------------------------------------------------------------- |
| <span id="malloc">`malloc`</span>                                                           | GCC 2.95.3<br/>Clang 13.0.0 | Function                     | Mark custom allocation functions that return non-aliased (possibly NULL) pointers.                |
| <span id="malloc (dealloc)">`malloc (`_`deallocator`_`)`</span>                             | GCC 11.0.0<br/>Clang 21.0.0 | Function                     | Associates _`deallocator`_ as the valid deallocator for the storage allocated by marked function. |
| <span id="malloc (dealloc, ptr-index)">`malloc (`_`deallocator`_`,` _`ptr-index`_`)`</span> | GCC 11.0.0                  | Function                     | Same as above but also denotes the positional argument here the pointer must be passed.           |
| <span id="ownership_returns">`ownership_returns(`_`allocation-type`_`)`</span>              | Clang 20.1.0                | Function                     | Associate pointers returned by custom allocation function with _`allocation-type`_ .              |
| <span id="ownership_takes">`ownership_takes(`_`allocation-type`_`,` _`ptr-index`_`)`</span> | Clang 20.1.0                | Function                     | Mark function as valid deallocator for _`allocation-type`_.                                       |
| <span id="ownership_holds">`ownership_holds(`_`allocation-type`_`,` _`ptr-index`_`)`</span> | Clang 20.1.0                | Function                     | Mark function taking responsibility of deallocation for _`allocation-type`_.                      |

The `malloc` attribute in GCC[^gcc-malloc] and Clang[^clang-malloc] indicates that the function acts like a memory allocation function, meaning it returns a pointer to allocated storage that is disjoint (non-aliased) from the storage for any other object accessible to the caller.

Using the attribute with no arguments is designed to allow the compiler to rely on that the returned pointer does not alias any other valid pointers at the time of return and does not contain pointers to existing objects for program optimization. Functions like `malloc` and `calloc` have this property because they return a pointer to uninitialized or zeroed-out, newly obtained storage. However, functions like `realloc` do not have this property, as they may return pointers to storage containing pointers to existing objects. Additionally, GCC uses the `malloc` attribute to infer that the marked function returns null only infrequently, allowing callers to be optimized based on that assumption.

In GCC, the `malloc (`_`deallocator`_`)` and `malloc (`_`deallocator`_`,` _`ptr-index`_`)` forms associate the pointer returned by the marked function with the specified _`deallocator`_ function. Here, _`deallocator`_ is a function name that must have been declared before it can be referenced in the attribute and _`ptr-index`_ denotes the positional argument to _`deallocator`_ where the pointer must be passed in order to deallocate the storage. Using these forms of the `malloc` attribute interacts with the GCC `-Wmismatched-dealloc` and `-Wmismatched-new-delete` warnings[^gcc-mismatched-dealloc] and GCC’s static analyzer (`-fanalyzer`[^gcc-analyzer]) to allow it to catch:

- **Mismatched deallocation** (`-Wanalyzer-mismatching-deallocation`) if there is an execution path in which the result of an allocation call is passed to a different _`deallocator`_.
- **Double free** (`-Wanalyzer-double-free`) if there is an execution path in which a value is passed more than once to a deallocation call.
- **Null pointer dereference** (`-Wanalyzer-possible-null-dereference`) if there are execution paths in which an unchecked result of an allocation call is dereferenced or passed to a function requiring a non-null argument.
- **Use-after-free** (`-Wanalyzer-use-after-free`) if there is an execution path in which the memory passed by pointer to a deallocation call is used after the deallocation.
- **Memory leaks** (`-Wanalyzer-malloc-leak`) if if there is an execution path in which the result of an allocation call goes out of scope without being passed to the deallocation function.
- **Invalid free** (`-Wanalyzer-free-of-non-heap`) if a deallocation function is used on a global or on-stack variable.

Clang supports both forms of the `malloc` attribute but does not yet implement the `-Wmismatched-dealloc` and `-Wmismatched-new-delete` warnings. Instead, Clang provides the `ownership_returns`, `ownership_takes`, and `ownership_holds` attributes[^clang-ownership]: that interact with the Clang static analyzer[^clang-checkers].

In Clang, the `ownership_returns(`_`allocation-type`_`)` associates the pointer returned by the marked function with an _`allocation-type`_. Here, _`allocation-type`_ is any string which will subsequently be used to detect mismatched allocations in cases where the pointer is passed to a deallocator marked with another _`allocation-type`_. The _`allocation-type`_ `malloc` has a special meaning and causes the Clang static analyzer to treat the associated pointer as though the allocated storage would have been allocatated using the standard `malloc()` function, and can subsequently be safely deallocated with the standard `free()` function.

The Clang `ownership_takes(`_`allocation-type`_`,` _`ptr-index`_`)` attribute marks a function as a deallocator for pointers of _`allocation-type`_ and `ownership_holds(`_`allocation-type`_`,` _`ptr-index`_`)` marks a function as taking over the ownership of a pointer of _`allocation-type`_ and will deallocate it at some unspecified point in the future. Here, _`ptr-index`_ denotes the positional argument to where the pointer must be passed in order to deallocate or take ownerwship of the storage.

Using the the `ownership_returns`, `ownership_takes`, and `ownership_holds` attributes allows the Clang static analyzer to catch:

- **Mismatched deallocation** (`unix.MismatchedDeallocator`) if there is an execution path in which the result of an allocation call of type _`allocation-type`_ is passed to a function annotated with `ownership_takes` or `ownership_holds` with a different allocation type.
- **Double free** (`unix.Malloc`, `cplusplis.NewDelete`) if there is an execution path in which a value is passed more than once to a function annotated with `ownership_takes` or `ownership_holds`.
- **Use-after-free** (`unix.Malloc`, `cplusplis.NewDelete`) if there is an execution path in which the memory passed by pointer to a function annotated with `ownership_takes` is used after the call. Using memory passed to a function annotated with `ownership_holds` is considered valid.
- **Memory leaks** (`unix.Malloc`, `cplusplus.NewDeleteLeaks`) if if there is an execution path in which the result of an allocation call goes out of scope without being passed to a function annotated with `ownership_takes` or `ownership_holds`.
- **Dubious `malloc()` arguments involving `sizeof`** (`unix.MallocSizeof`) if the size of the pointer type the returned pointer does not match the size indicated by `sizeof` expression passed as argument to the allocation function.
- **Potentially attacker controlled `size` parameters to allocation functions** (`optin.taint.TaintedAlloc`) if the `size` parameter originates from a tained source and the analyzer cannot prove that the size parameter is within reasonable bounds (`<= SIZE_MAX/4`).

#### Example usage

GCC `malloc`, `malloc (`_`deallocator`_`)`, and `malloc (`_`deallocator`_, _`ptr-index`_`)` :

~~~c
void my_free(void *ptr);

// Denotes that my_malloc will return with a dynamically allocated piece of memory which must be freed using my_free.
void *my_malloc(size_t size) __attribute__ ((malloc, malloc (my_free, 1)));
~~~

Note that to benefit both from the associated optimizations and improved detection of memory errors functions should be marked with _both_ the form of the attribute without arguments and the form of the attribute with one or two arguments. [[Extended example at Compiler Explorer](https://godbolt.org/z/bc97ahbnd)]

Clang `ownership_returns`, `ownership_takes`, and `ownership_holds`:

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
