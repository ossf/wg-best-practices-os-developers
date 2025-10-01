FROM --platform=linux/amd64 ubuntu:24.04

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc-14 g++-14 \
    clang-19 \
    cmake make \
    valgrind \
    && update-alternatives --install /usr/bin/gcc gcc /usr/bin/gcc-14 100 \
    && update-alternatives --install /usr/bin/g++ g++ /usr/bin/g++-14 100 \
    && update-alternatives --install /usr/bin/clang clang /usr/bin/clang-19 100 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace
COPY . /workspace
