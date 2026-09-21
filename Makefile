.PHONY: help dev test lint seed eval clean

help:
	@echo "NeuroLens Makefile commands:"
	@echo "  make dev             - Start backend and frontend in dev mode"
	@echo "  make test            - Run all Python and frontend tests"
	@echo "  make lint            - Run code formatting and linter checks"
	@echo "  make seed            - Generate synthetic demo dataset"
	@echo "  make clean           - Clean temporary files and caches"

dev:
	docker compose up --build

test:
	pytest ml/tests backend/tests

seed:
	python ml/scripts/make_synthetic_study.py --output-dir ./data/demo_study --size 96

lint:
	python -m flake8 backend ml || true

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
