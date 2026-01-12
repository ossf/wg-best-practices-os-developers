DOCKER_RUN = docker run --rm -v $(PWD):/workspace:ro compiler-hardening-example-cmake sh -c

.PHONY: require-docker # Ensure Docker is installed and running
require-docker:
	@which docker > /dev/null || (echo "Error: Docker is not installed" && exit 1)
	@docker info > /dev/null 2>&1 || (echo "Error: Docker is not running" && exit 1)

.PHONY: build-image # Build the Docker image for the example
build-image: require-docker
	docker build -t compiler-hardening-example-cmake .

.PHONY: run-gcc # Build and run the example using GCC
run-gcc: build-image require-docker
	$(DOCKER_RUN) "mkdir -p /tmp/gcc-build && cd /tmp/gcc-build && cmake -DCMAKE_C_COMPILER=gcc /workspace && make && ./demo"

.PHONY: run-clang # Build and run the example using Clang
run-clang: build-image require-docker
	$(DOCKER_RUN) "mkdir -p /tmp/clang-build && cd /tmp/clang-build && cmake -DCMAKE_C_COMPILER=clang /workspace && make && ./demo"

.PHONY: clean # Remove the Docker image
clean: require-docker
	docker rmi compiler-hardening-example-cmake

.PHONY: help # Show all available commands
help:
	@echo "Usage: make \033[1;32m<target>\033[0m"
	@echo ""
	@echo "Available targets:"
	@grep -E '^\.PHONY: [a-zA-Z_-]+ #' $(MAKEFILE_LIST) | sed 's/\.PHONY: //' | awk 'BEGIN {FS = " # "}; {printf "  \033[1;32m%-18s\033[0m %s\n", $$1, $$2}'
