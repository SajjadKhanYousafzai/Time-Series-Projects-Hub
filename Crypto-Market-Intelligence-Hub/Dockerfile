FROM python:3.11-slim
WORKDIR /app

# Install system deps for common python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-pinned.txt /app/requirements-pinned.txt
RUN pip install --no-cache-dir -r requirements-pinned.txt

COPY . /app

ENV PYTHONUNBUFFERED=1

CMD ["python", "scripts/run_all.py"]
