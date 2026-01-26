.PHONY: venv # Create venv if it doesn't exist
venv:
	@test -d .venv || (uv venv .venv --python 3.13 && uv pip install -r requirements.txt)

.PHONY: lock # Update and lock dependency versions in current venv
lock:
	@uv pip freeze > requirements.in
	@uv pip compile requirements.in -o requirements.txt

.PHONY: run # Run the scraper and set up venv if needed
run: venv
	@uv run main.py

.PHONY: help # Show all available commands
help:
	@echo "Usage: make \033[1;32m<target>\033[0m"
	@echo ""
	@echo "Available targets:"
	@grep -E '^\.PHONY: [a-zA-Z_-]+ #' $(MAKEFILE_LIST) | sed 's/\.PHONY: //' | awk 'BEGIN {FS = " # "}; {printf "  \033[1;32m%-18s\033[0m %s\n", $$1, $$2}'
