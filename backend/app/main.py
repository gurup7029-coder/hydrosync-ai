"""
HYDROSYNC AI - FastAPI Central Application Server.
"Predict the Heat. Detect the Loss. Protect the Future."
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from .config import settings
from .database import init_db
from .routers import (
    health,
    dashboard,
    heat,
    water,
    climate,
    alerts,
    simulation,
    data,
    metrics
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database schema
    init_db()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Unified Climate Intelligence & Water Conservation Platform combining HeatShield AI and AquaTrace.",
    version=settings.VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers under API prefix
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["Health"])
app.include_router(dashboard.router, prefix=settings.API_PREFIX, tags=["Dashboard"])
app.include_router(heat.router, prefix=settings.API_PREFIX, tags=["HeatShield AI"])
app.include_router(water.router, prefix=settings.API_PREFIX, tags=["AquaTrace"])
app.include_router(climate.router, prefix=settings.API_PREFIX, tags=["Unified Climate Intelligence"])
app.include_router(alerts.router, prefix=settings.API_PREFIX, tags=["Alerts"])
app.include_router(simulation.router, prefix=settings.API_PREFIX, tags=["Live Simulation"])
app.include_router(data.router, prefix=settings.API_PREFIX, tags=["Data Explorer"])
app.include_router(metrics.router, prefix=settings.API_PREFIX, tags=["Model Evaluation"])

@app.get("/")
def root():
    return {
        "message": "Welcome to HYDROSYNC AI API",
        "tagline": "Predict the Heat. Detect the Loss. Protect the Future.",
        "version": settings.VERSION,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
