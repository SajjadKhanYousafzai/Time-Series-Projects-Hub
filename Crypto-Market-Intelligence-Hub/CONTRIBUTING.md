# Contributing

Thanks for your interest in contributing to the Crypto Market Intelligence Hub.

Guidelines:

- Create an issue describing the change before making sizeable contributions.
- Keep notebooks for exploration; extract reusable code into `src/`.
- Add unit tests under `tests/` for any logic you add or change.
- Follow the existing code style and add docstrings for public functions.

Running tests locally:

```bash
python -m pip install -r requirements-pinned.txt
python -m pip install -r requirements-dev.txt
pytest -q
```
