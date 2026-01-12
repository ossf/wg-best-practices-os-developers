DOCKER_RUN = docker run --rm -v $(PWD):/workspace compiler-hardening-example-cmake sh -c

.PHONY: build-image
build-image:
	docker build -t compiler-hardening-example-cmake .

.PHONY: run-gcc
run-gcc: build-image
	$(DOCKER_RUN) "mkdir -p /tmp/gcc-build && cd /tmp/gcc-build && cmake -DCMAKE_C_COMPILER=gcc /workspace && make && ./demo"

.PHONY: run-clang
run-clang: build-image
	$(DOCKER_RUN) "mkdir -p /tmp/clang-build && cd /tmp/clang-build && cmake -DCMAKE_C_COMPILER=clang /workspace && make && ./demo"

.PHONY: clean
clean:
	docker rmi compiler-hardening-example-cmake
