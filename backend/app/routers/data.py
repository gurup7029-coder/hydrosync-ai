"""
Data Explorer API Router.
Handles CSV file uploads, schema validation, data quality checks, and sample dataset downloads.
"""

from fastapi import APIRouter, UploadFile, File, HTTPException
import pandas as pd
import io
import os
from typing import Dict, Any

router = APIRouter()

SAMPLE_DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "data", "sample"))

@router.post("/data/upload")
async def upload_dataset(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files (.csv) are currently supported.")

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to parse CSV file: {str(e)}")

    row_count = len(df)
    columns = list(df.columns)
    
    # Data Quality Validation
    missing_counts = df.isnull().sum().to_dict()
    total_missing = sum(missing_counts.values())

    # Detect dataset category
    col_set = set(columns)
    dataset_type = "UNKNOWN"
    analysis_summary = {}

    if {"temperature_c", "relative_humidity_pct"}.issubset(col_set):
        dataset_type = "WEATHER_HEAT_SERIES"
        analysis_summary = {
            "mean_temp_c": round(float(df["temperature_c"].mean()), 2),
            "max_temp_c": round(float(df["temperature_c"].max()), 2),
            "mean_rh_pct": round(float(df["relative_humidity_pct"].mean()), 2)
        }
    elif {"flow_rate", "pressure"}.issubset(col_set):
        dataset_type = "WATER_HYDRAULIC_SERIES"
        analysis_summary = {
            "mean_flow_lpm": round(float(df["flow_rate"].mean()), 2),
            "min_pressure_bar": round(float(df["pressure"].min()), 2),
            "mean_pressure_bar": round(float(df["pressure"].mean()), 2)
        }

    preview_rows = df.head(10).to_dict(orient="records")

    return {
        "filename": file.filename,
        "dataset_type": dataset_type,
        "row_count": row_count,
        "column_count": len(columns),
        "columns": columns,
        "missing_values_summary": missing_counts,
        "total_missing_cells": int(total_missing),
        "analysis_summary": analysis_summary,
        "preview": preview_rows,
        "message": f"Successfully parsed {row_count} rows with {len(columns)} columns."
    }

@router.get("/data/samples/{sample_name}")
def get_sample_dataset(sample_name: str):
    allowed_files = {
        "weather": "weather_sample.csv",
        "water": "water_sensors_sample.csv",
        "synthetic_leaks": "synthetic_leak_scenarios.csv"
    }

    if sample_name not in allowed_files:
        raise HTTPException(status_code=404, detail="Sample dataset not found. Options: 'weather', 'water', 'synthetic_leaks'")

    file_path = os.path.join(SAMPLE_DATA_DIR, allowed_files[sample_name])
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File {file_path} not found on server.")

    df = pd.read_csv(file_path)
    return {
        "name": sample_name,
        "file": allowed_files[sample_name],
        "rows": len(df),
        "columns": list(df.columns),
        "data": df.head(50).to_dict(orient="records")
    }
