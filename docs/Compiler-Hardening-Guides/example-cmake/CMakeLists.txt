cmake_minimum_required(VERSION 3.27 FATAL_ERROR)
project(demo LANGUAGES C)

set(CMAKE_C_STANDARD 23)
set(CMAKE_C_STANDARD_REQUIRED ON)

#
# compiler hardening
# 

if(CMAKE_C_COMPILER_ID MATCHES "GNU" AND CMAKE_C_COMPILER_VERSION VERSION_LESS 14.0.0)
  message(FATAL_ERROR "GCC is outdated: ${CMAKE_C_COMPILER_VERSION}")
endif()
if(CMAKE_C_COMPILER_ID MATCHES "Clang" AND CMAKE_C_COMPILER_VERSION VERSION_LESS 16.0.0)
  message(FATAL_ERROR "Clang is outdated: ${CMAKE_C_COMPILER_VERSION}")
endif()

add_compile_options(
  -O2
  -Wall
  -Wextra
  -Wformat
  -Wformat=2
  -Wconversion
  -Wsign-conversion
  -Wimplicit-fallthrough
  -Werror=format-security
  # more portable and explicit than -fhardened
  -U_FORTIFY_SOURCE
  -D_FORTIFY_SOURCE=3
  -D_GLIBCXX_ASSERTIONS
  -fstrict-flex-arrays=3
  -fstack-protector-strong
  # deprecated c calls
  -Werror=implicit
  -Werror=incompatible-pointer-types
  -Werror=int-conversion
  # multithreading with pthreads
  -fexceptions
  # for shared libraries use `-fPIC`
  -fPIE
)

# build mode specific
if(CMAKE_BUILD_TYPE STREQUAL "Release")
  add_compile_options(
    -fno-delete-null-pointer-checks -fno-strict-overflow -fno-strict-aliasing -ftrivial-auto-var-init=zero
  )
else()
  add_compile_options(-Werror)
endif()

# os specific
if(CMAKE_SYSTEM_NAME STREQUAL "Linux")
  add_compile_options(-fstack-clash-protection)
  add_link_options(
    -pie
    -Wl,-z,nodlopen
    -Wl,-z,noexecstack
    -Wl,-z,relro
    -Wl,-z,now
    -Wl,--as-needed
    -Wl,--no-copy-dt-needed-entries
  )
endif()

# compiler specific
if(CMAKE_C_COMPILER_ID MATCHES "GNU")
  # from gcc-15 add `-fzero-init-padding-bits=all`
  add_compile_options(-Wtrampolines -Wbidi-chars=any)
endif()
if(CMAKE_C_COMPILER_ID MATCHES "Clang")
  # nop
endif()

# architecture specific
if(CMAKE_SYSTEM_PROCESSOR MATCHES "x86_64|AMD64|i686|i386")
  add_compile_options(-fcf-protection=full)
endif()
if(CMAKE_SYSTEM_PROCESSOR MATCHES "aarch64|arm64|ARM64")
  add_compile_options(-mbranch-protection=standard)
endif()

#
# sources
#

add_executable(demo demo.c)