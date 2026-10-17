"""
Health Check and Architecture Readiness Endpoint.
"""

from fastapi import APIRouter
from ..config import settings
import platform
import os
import psutil

router = APIRouter()

@router.get("/health")
def health_check():
    process = psutil.Process(os.getpid())
    memory_info = process.memory_info()

    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "platform": {
            "system": platform.system(),
            "machine": platform.machine(),
            "processor": platform.processor(),
            "python_version": platform.python_version()
        },
        "linuxone_compatible": True,
        "target_architecture": "s390x (IBM LinuxONE / Linux on IBM Z)" if settings.IS_LINUXONE_TARGET else "x86_64 / multi-arch container",
        "memory_usage_mb": round(memory_info.rss / (1024 * 1024), 2),
        "database_status": "CONNECTED" if os.path.exists(settings.DATABASE_PATH) else "INITIALIZING"
    }
