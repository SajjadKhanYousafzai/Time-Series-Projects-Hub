.PHONY: help install install-dev pipeline api dashboard test lint clean docker-up docker-down

PYTHON=python
PIP=pip
UVICORN=uvicorn
STREAMLIT=streamlit

help:  ## Show available make targets
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

install:  ## Install production dependencies
	$(PIP) install -r requirements.txt

install-dev:  ## Install dev/test dependencies
	$(PIP) install -r requirements-dev.txt
	pre-commit install

pipeline:  ## Run the data pipeline (load -> clean -> store)
	$(PYTHON) scripts/run_all.py

api:  ## Start FastAPI backend on :8000
	$(PYTHON) -m $(UVICORN) src.api.main:app --reload --host 0.0.0.0 --port 8000

dashboard:  ## Start Streamlit dashboard on :8501
	$(PYTHON) -m $(STREAMLIT) run src/dashboard/app.py --server.port 8501

frontend-install:  ## Install Node.js dependencies for Next.js
	cd frontend && npm install

frontend:  ## Start Next.js dev server on :3000
	cd frontend && npm run dev

test:  ## Run tests with coverage
	pytest tests/ -v --cov=src --cov-report=term-missing

lint:  ## Lint with ruff
	ruff check src/ scripts/ tests/

format:  ## Format with ruff
	ruff format src/ scripts/ tests/

report:  ## Generate PDF report
	$(PYTHON) scripts/generate_report.py

clean:  ## Remove generated files (cache, coverage)
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	find . -type d -name ".ruff_cache" -exec rm -rf {} +
	rm -f coverage.xml .coverage

docker-up:  ## Start full Docker stack
	cp -n .env.example .env 2>/dev/null || true
	docker compose up --build

docker-down:  ## Stop Docker stack
	docker compose down

docker-clean:  ## Stop and remove volumes
	docker compose down -v
