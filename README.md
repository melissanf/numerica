# Numerica

Numerical analysis web app — FastAPI + Next.js.

## Setup

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload        # API → http://localhost:8000
cd frontend && npm run dev       # UI  → http://localhost:3000
```
