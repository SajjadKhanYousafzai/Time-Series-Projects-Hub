# ── Makefile ────────────────────────────────────────────────────────────────────
# Hourly Energy Demand Forecasting Hub
# Usage: make <target>

.PHONY: help install install-dev pipeline api dashboard test lint format \
        docker-up docker-down docker-build clean

PYTHON      := python
PIP         := pip
REGION      := AEP
PORT_API    := 8000
PORT_DASH   := 8501

# ────────────────────────────────────────────────────────────────────────────────
help:
	@echo ""
	@echo "⚡ Hourly Energy Demand Forecasting Hub — Available Commands"
	@echo "══════════════════════════════════════════════════════════════"
	@echo "  make install        Install production dependencies"
	@echo "  make install-dev    Install production + dev dependencies"
	@echo "  make pipeline       Run data pipeline (all regions)"
	@echo "  make pipeline-one   Run pipeline for REGION=$(REGION)"
	@echo "  make api            Start FastAPI server on :$(PORT_API)"
	@echo "  make dashboard      Start Streamlit dashboard on :$(PORT_DASH)"
	@echo "  make test           Run all tests with coverage"
	@echo "  make test-unit      Run unit tests only"
	@echo "  make test-int       Run integration tests only"
	@echo "  make lint           Run ruff linter"
	@echo "  make format         Run ruff formatter"
	@echo "  make docker-up      Start all services via Docker Compose"
	@echo "  make docker-down    Stop Docker services"
	@echo "  make docker-build   Build Docker images"
	@echo "  make clean          Remove __pycache__, .pytest_cache, logs"
	@echo ""

# ────────────────────────────────────────────────────────────────────────────────
install:
	$(PIP) install --upgrade pip
	$(PIP) install -r requirements.txt

install-dev: install
	$(PIP) install -r requirements-dev.txt

# ────────────────────────────────────────────────────────────────────────────────
pipeline:
	$(PYTHON) scripts/run_pipeline.py

pipeline-one:
	$(PYTHON) scripts/run_pipeline.py --region $(REGION)

pipeline-all:
	$(PYTHON) scripts/run_pipeline.py --region AEP COMED DAYTON DEOK DOM DUQ EKPC FE NI PJME PJMW

# ────────────────────────────────────────────────────────────────────────────────
api:
	uvicorn src.api.main:app --host 0.0.0.0 --port $(PORT_API) --reload

api-prod:
	uvicorn src.api.main:app --host 0.0.0.0 --port $(PORT_API) --workers 4

dashboard:
	streamlit run src/dashboard/app.py --server.port $(PORT_DASH)

# ────────────────────────────────────────────────────────────────────────────────
test:
	pytest tests/ -v --cov=src --cov-report=term-missing --cov-report=html

test-unit:
	pytest tests/unit/ -v

test-int:
	pytest tests/integration/ -v

test-fast:
	pytest tests/unit/ -v -x --timeout=30

# ────────────────────────────────────────────────────────────────────────────────
lint:
	ruff check src/ scripts/ tests/

format:
	ruff format src/ scripts/ tests/

lint-fix:
	ruff check --fix src/ scripts/ tests/

# ────────────────────────────────────────────────────────────────────────────────
docker-build:
	docker-compose build

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f

# ────────────────────────────────────────────────────────────────────────────────
clean:
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null; true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null; true
	find . -type d -name "htmlcov" -exec rm -rf {} + 2>/dev/null; true
	find . -name "*.pyc" -delete 2>/dev/null; true
	find . -name ".coverage" -delete 2>/dev/null; true
	@echo "✅ Cleaned build artifacts"
