FROM python:3.11-slim

ENV PORT=8000 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Install backend deps
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source as a package so relative imports resolve
COPY backend/ ./backend/

EXPOSE $PORT

# Run as package — "from .utils import ..." works because backend/ has __init__.py
CMD uvicorn backend.main:app --host 0.0.0.0 --port $PORT
