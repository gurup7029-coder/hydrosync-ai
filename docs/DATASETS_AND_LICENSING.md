# Datasets, Licensing & Data Attribution

## 1. Overview
HYDROSYNC AI adheres to strict data transparency and open-source licensing principles. All synthetic datasets are explicitly labelled, and open-source benchmarks are cited with their permissive distribution terms.

---

## 2. Public Datasets & Data Sources

### 2.1 NOAA National Weather Service (NWS) Ground-Truth Benchmark
- **Source**: National Oceanic and Atmospheric Administration (NOAA) Technical Attachment SR 90-23
- **Variables**: Dry-Bulb Temperature (°C / °F), Relative Humidity (%), Heat Index (°C / °F)
- **License**: Public Domain (U.S. Federal Government work under 17 U.S.C. § 105)
- **Use in HYDROSYNC**: Calibrating and verifying Rothfusz equation regression coefficients across 1,250 climate coordinate pairs.

### 2.2 Open-Meteo Global Meteorological API
- **Direct URL**: https://open-meteo.com
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0)
- **Attributes**: Real-time hourly temperature (2m), relative humidity (2m), wind speed (10m), solar irradiance.
- **Handling**: Queried on the backend with 3.5s timeout; falls back gracefully to calibrated offline baseline if offline.

### 2.3 Synthetic DMA Pipeline Benchmark Callset
- **File**: `data/sample/synthetic_leak_scenarios.csv`
- **Rows**: 2,000 timestamped readings at 15-minute intervals.
- **Generator**: `ml/train_models.py`
- **Columns**: `timestamp`, `sensor_id`, `location_id`, `flow_rate`, `pressure`, `inlet_flow`, `outlet_flow`, `leak_label`.
- **Anomalies Injected**: 50 labelled anomaly events (sudden main ruptures, nocturnal leaks, sensor flatlines).
- **Label**: Explicitly labelled `[SYNTHETIC BENCHMARK]` in UI and documentation.

---

## 3. Data Schema Specifications

| Column | Type | Units | Physical Valid Range | Description |
|---|---|---|---|---|
| `timestamp` | ISO-8601 String | UTC | - | Telemetry acquisition timestamp |
| `temperature_c` | Float | °C | -20.0 to 60.0 | Ambient air temperature |
| `relative_humidity_pct` | Float | % | 0.0 to 100.0 | Relative atmospheric humidity |
| `flow_rate` | Float | L/min | 0.0 to 800.0 | Water flow through DMA flow meter |
| `pressure` | Float | bar | 0.0 to 12.0 | Water hydraulic head pressure |
| `leak_label` | Integer | Binary | 0 or 1 | Ground truth label (0=normal, 1=anomaly) |
