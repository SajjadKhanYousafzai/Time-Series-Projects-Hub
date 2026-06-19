PY=python

install:
	@$(PY) -m pip install --upgrade pip
	@$(PY) -m pip install -r requirements-pinned.txt

run:
	@$(PY) scripts/run_all.py

test:
	@pytest -q

docker-build:
	docker build -t crypto-market-intel:latest .
