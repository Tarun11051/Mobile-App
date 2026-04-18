from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.patient_routes import router as patient_router
from app.routes.doctors_routes import router as doctors_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(patient_router)
app.include_router(doctors_router)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "doctors-slots-api",
    }

# Run
# uvicorn app.main:app --reload --host 0.0.0.0 --port 8000