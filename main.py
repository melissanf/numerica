from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from axe1.router import router as axe1_router
from axe2.router import router as axe2_router
from axe3.main_axe3 import router as axe3_router
from custom_algorithms.runner import router as custom_router

app = FastAPI(title="Numerica API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    axe1_router, prefix="/axe1", tags=["Axe 1 - Fonctions non linéaires"]
)
app.include_router(axe2_router, prefix="/axe2", tags=["Axe 2 - Systèmes linéaires"])
app.include_router(
    axe3_router, prefix="/axe3", tags=["Axe 3 - Interpolation & Gradient"]
)
app.include_router(custom_router, prefix="/custom", tags=["Custom Algorithms"])


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.get("/")
async def root():
    return {
        "message": "Welcome to the Numerica API! Visit /docs for API documentation."
    }
