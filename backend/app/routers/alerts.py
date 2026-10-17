"""
Alerts Management API Router.
Supports fetching active and historical alerts, acknowledging, and resolving alerts.
"""

from fastapi import APIRouter, HTTPException
from typing import Optional
from ..database import get_alerts, update_alert_status

router = APIRouter()

@router.get("/alerts")
def fetch_alerts(status: Optional[str] = None, limit: int = 50):
    return get_alerts(status=status, limit=limit)

@router.post("/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    success = update_alert_status(alert_id, "ACKNOWLEDGED")
    if not success:
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")
    return {"status": "SUCCESS", "alert_id": alert_id, "new_status": "ACKNOWLEDGED"}

@router.post("/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    success = update_alert_status(alert_id, "RESOLVED")
    if not success:
        raise HTTPException(status_code=404, detail=f"Alert {alert_id} not found")
    return {"status": "SUCCESS", "alert_id": alert_id, "new_status": "RESOLVED"}
