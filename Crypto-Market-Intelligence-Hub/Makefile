PY     = python
PYTEST = pytest
NPM    = npm

# ── Help ───────────────────────────────────────────────────────────────────────
.PHONY: help
help:
	@echo ""
	@echo "  Crypto Market Intelligence Hub — Makefile Targets"
	@echo "  ────────────────────────────────────────────────────"
	@echo "  install         Install Python dependencies"
	@echo "  install-dev     Install dev + all optional extras"
	@echo "  run             Run the data pipeline"
	@echo "  api             Start FastAPI server (dev mode)"
	@echo "  dashboard       Start Streamlit dashboard"
	@echo "  frontend-dev    Start Next.js dev server"
	@echo "  test            Run unit tests"
	@echo "  test-all        Run all tests with coverage"
	@echo "  lint            Ruff lint check"
	@echo "  format          Ruff auto-format"
	@echo "  pre-commit      Run pre-commit on all files"
	@echo "  docker-build    Build all Docker images"
	@echo "  docker-up       Start Docker Compose stack"
	@echo "  docker-down     Stop Docker Compose stack"
	@echo "  clean           Remove caches and build artifacts"
	@echo ""

# ── Install ────────────────────────────────────────────────────────────────────
.PHONY: install
install:
	$(PY) -m pip install --upgrade pip
	$(PY) -m pip install -r requirements.txt

.PHONY: install-dev
install-dev:
	$(PY) -m pip install --upgrade pip
	$(PY) -m pip install -r requirements.txt -r requirements-dev.txt
	$(PY) -m pip install -e ".[dev,live,notebooks]"
	pre-commit install

# ── Pipeline ───────────────────────────────────────────────────────────────────
.PHONY: run
run:
	$(PY) scripts/run_all.py

# ── Servers ────────────────────────────────────────────────────────────────────
.PHONY: api
api:
	uvicorn src.api.main:app --host 0.0.0.0 --port 8000 --reload

.PHONY: dashboard
dashboard:
	streamlit run src/dashboard/app.py

.PHONY: frontend-dev
frontend-dev:
	cd frontend && $(NPM) run dev

# ── Testing ────────────────────────────────────────────────────────────────────
.PHONY: test
test:
	$(PYTEST) tests/unit/ -v

.PHONY: test-all
test-all:
	$(PYTEST) tests/ -v --cov=src --cov-report=term-missing --cov-report=html

# ── Code Quality ───────────────────────────────────────────────────────────────
.PHONY: lint
lint:
	ruff check src/ tests/ config/

.PHONY: format
format:
	ruff format src/ tests/ config/
	ruff check --fix src/ tests/ config/

.PHONY: pre-commit
pre-commit:
	pre-commit run --all-files

# ── Docker ─────────────────────────────────────────────────────────────────────
.PHONY: docker-build
docker-build:
	docker build -f deployment/docker/Dockerfile.api -t crypto-hub-api:latest .
	docker build -f deployment/docker/Dockerfile.dashboard -t crypto-hub-dashboard:latest .

.PHONY: docker-up
docker-up:
	docker compose up -d

.PHONY: docker-down
docker-down:
	docker compose down

# ── Clean ──────────────────────────────────────────────────────────────────────
.PHONY: clean
clean:
	find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .mypy_cache -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name .ruff_cache -exec rm -rf {} + 2>/dev/null || true
	find . -name "*.pyc" -delete 2>/dev/null || true
	rm -rf htmlcov/ coverage.xml .coverage
