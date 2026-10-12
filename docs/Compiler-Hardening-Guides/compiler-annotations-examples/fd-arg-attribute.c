// Copyright Open Source Security Foundation (OpenSSF) and its contributors
// SPDX-License-Identifier: Apache-2.0 OR MIT

// Local copy of the "fd_arg" / "fd_arg_read" / "fd_arg_write" example from
// https://godbolt.org/z/T66Wj5YKv referenced in Compiler-Annotations-for-C-and-C++.md

#include <fcntl.h>
#include <unistd.h>

// Denotes that use_file expects fd to be a valid and open file descriptor
void use_file (int fd) __attribute__ ((fd_arg (1)));

// Denotes that write_to_file expects fd to be a valid, open, and writable file descriptor
void write_to_file (int fd, void *src, size_t size) __attribute__ ((fd_arg_write (1)));

// Denotes that read_from_file expects fd to be a valid, open, and readable file descriptor
void read_from_file (int fd, void *dst, size_t size) __attribute__ ((fd_arg_read (1)));


void conforming_write_to_file(char *path, void *buf, size_t bufsize)
{
    int fd = open (path, O_WRONLY);
    if (fd != -1)
        write_to_file(fd, buf, bufsize);
    close (fd);
}

void conforming_read_from_file(char *path, void *buf, size_t bufsize)
{
    int fd = open (path, O_RDONLY);
    if (fd != -1)
        read_from_file(fd, buf, bufsize);
    close(fd);
}

__attribute((fd_arg(1))) void conforming_read(int old_fd, void *buf, size_t bufsize)
{
    if (fcntl(old_fd, F_GETFD) != -1) {
        int fd = dup2 (old_fd, 3);
        if (fcntl(fd, F_GETFD)) {
            read (fd, buf, bufsize);
            close(fd);
        }
    }
}

// This results in a [-Wanalyzer-fd-access-mode-mismatch] warning
void read_from_write_only_fd(char *path, void *buf, size_t bufsize)
{
    int f = open (path, O_WRONLY);
    if (f != -1)
        read_from_file(f, buf, bufsize);
    close (f);
}

// This results in a [-Wanalyzer-fd-access-mode-mismatch] warning
void write_to_read_only_fd(char *path, void *buf, size_t bufsize)
{
    int f = open(path, O_RDONLY);
    if (f != -1)
        write_to_file(f, buf, bufsize);
    close (f);
}

// This results in a [-Wanalyzer-fd-double-close] warning
void use_file_on_double_closed_fd (char *path)
{
    int fd = open (path, O_RDWR);
    if (fd != -1) {
        use_file(fd);
        close (fd);
        close (fd);
    }
}

// This results in a [-Wanalyzer-fd-use-adter-close] warning
void use_file_on_closed_fd(int fd)
{
    close (fd);
    use_file(fd);
}

// This results in a [-Wanalyzer-fd-use-without-check] warning
void use_unchecked_fd(int old_fd)
{
    int fd = dup2(old_fd, 3);
    use_file(fd);
}
