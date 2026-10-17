"""
SQLite Database Layer with Repository Pattern.
Designed to be seamlessly swappable with PostgreSQL or IBM Db2 on LinuxONE.
"""

import sqlite3
import os
import json
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from .config import settings

def get_db_connection() -> sqlite3.Connection:
    os.makedirs(os.path.dirname(settings.DATABASE_PATH), exist_ok=True)
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Alerts Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS alerts (
        id TEXT PRIMARY KEY,
        alert_type TEXT NOT NULL,
        location_id TEXT NOT NULL,
        location_name TEXT NOT NULL,
        severity TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'ACTIVE',
        timestamp TEXT NOT NULL,
        acknowledged_at TEXT,
        resolved_at TEXT,
        meta_json TEXT
    );
    """)

    # Telemetry History Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS telemetry_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        location_id TEXT NOT NULL,
        temp_c REAL,
        rh_pct REAL,
        heat_index REAL,
        flow_rate REAL,
        pressure REAL,
        estimated_loss_l_per_hr REAL,
        unified_score REAL
    );
    """)

    # Audit Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT NOT NULL,
        event TEXT NOT NULL,
        details TEXT
    );
    """)

    conn.commit()
    conn.close()

# Repository Helpers
def insert_alert(alert_data: Dict[str, Any]) -> str:
    conn = get_db_connection()
    cursor = conn.cursor()
    alert_id = alert_data.get("id") or f"ALT-{int(datetime.now(timezone.utc).timestamp()*1000)}"
    meta_str = json.dumps(alert_data.get("meta", {}))
    
    cursor.execute("""
        INSERT OR REPLACE INTO alerts (
            id, alert_type, location_id, location_name, severity, title, message, status, timestamp, meta_json
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        alert_id,
        alert_data.get("alert_type", "CLIMATE"),
        alert_data.get("location_id", "LOC-01"),
        alert_data.get("location_name", "Municipal Center"),
        alert_data.get("severity", "HIGH"),
        alert_data.get("title", "Telemetry Anomaly"),
        alert_data.get("message", "Operational threshold exceeded"),
        alert_data.get("status", "ACTIVE"),
        alert_data.get("timestamp", datetime.now(timezone.utc).isoformat()),
        meta_str
    ))
    conn.commit()
    conn.close()
    return alert_id

def get_alerts(status: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    if status:
        cursor.execute("SELECT * FROM alerts WHERE status = ? ORDER BY timestamp DESC LIMIT ?", (status, limit))
    else:
        cursor.execute("SELECT * FROM alerts ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    result = []
    for r in rows:
        item = dict(r)
        if item.get("meta_json"):
            try:
                item["meta"] = json.loads(item["meta_json"])
            except Exception:
                item["meta"] = {}
        result.append(item)
    return result

def update_alert_status(alert_id: str, new_status: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    now_str = datetime.now(timezone.utc).isoformat()
    if new_status == "ACKNOWLEDGED":
        cursor.execute("UPDATE alerts SET status = ?, acknowledged_at = ? WHERE id = ?", (new_status, now_str, alert_id))
    elif new_status == "RESOLVED":
        cursor.execute("UPDATE alerts SET status = ?, resolved_at = ? WHERE id = ?", (new_status, now_str, alert_id))
    else:
        cursor.execute("UPDATE alerts SET status = ? WHERE id = ?", (new_status, alert_id))
    changed = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return changed

# Automatically initialize database tables on import
try:
    init_db()
except Exception:
    pass
