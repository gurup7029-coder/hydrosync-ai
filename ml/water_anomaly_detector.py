"""
AquaTrace - Water Distribution Network Anomaly & Leak Detection Pipeline.

Methodology:
- Unsupervised Isolation Forest for multivariate anomaly detection.
- Physical hydraulic domain rules:
  1. Pressure drop accompanied by flow increase (classic burst leak indicator).
  2. Mass balance deficit: (Inlet Flow - Outlet Flow) exceeding nominal DMA tolerance.
  3. Sensor operational health: flatline / zero variance or out-of-physical-range telemetry.
- Water loss estimation (L/hr and cumulative Litres) based on diurnal baseline departure.
"""

import numpy as np
import pandas as pd
from typing import Dict, Any, List, Optional, Tuple
from sklearn.ensemble import IsolationForest
import joblib
import os

class WaterAnomalyDetector:
    def __init__(self, contamination: float = 0.08, random_state: int = 42):
        self.contamination = contamination
        self.random_state = random_state
        self.model = IsolationForest(
            contamination=self.contamination,
            random_state=self.random_state,
            n_estimators=100
        )
        self.is_fitted = False
        self.feature_names = [
            "flow_rate",
            "pressure",
            "flow_rolling_mean",
            "flow_rolling_std",
            "pressure_delta",
            "imbalance"
        ]

    def _extract_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Extract rolling and difference features from sensor time series.
        """
        df = df.copy()
        
        # Ensure numeric columns
        for col in ["flow_rate", "pressure"]:
            if col in df.columns:
                df[col] = pd.to_numeric(df[col], errors="coerce").fillna(0.0)
            else:
                df[col] = 0.0

        # Optional inlet / outlet flow
        if "inlet_flow" in df.columns and "outlet_flow" in df.columns:
            df["inlet_flow"] = pd.to_numeric(df["inlet_flow"], errors="coerce").fillna(df["flow_rate"])
            df["outlet_flow"] = pd.to_numeric(df["outlet_flow"], errors="coerce").fillna(df["flow_rate"])
            df["imbalance"] = df["inlet_flow"] - df["outlet_flow"]
        else:
            df["imbalance"] = 0.0

        # Rolling statistics (window size 5 readings)
        df["flow_rolling_mean"] = df["flow_rate"].rolling(window=5, min_periods=1).mean()
        df["flow_rolling_std"] = df["flow_rate"].rolling(window=5, min_periods=1).std().fillna(0.0)
        df["pressure_delta"] = df["pressure"].diff().fillna(0.0)

        return df

    def fit(self, training_df: pd.DataFrame):
        """
        Fit Isolation Forest baseline model on historical normal/mixed data.
        """
        processed_df = self._extract_features(training_df)
        X = processed_df[self.feature_names].values
        self.model.fit(X)
        self.is_fitted = True

    def predict_sample(
        self,
        flow_rate: float,
        pressure: float,
        baseline_flow: float = 80.0,
        baseline_pressure: float = 4.2,
        inlet_flow: Optional[float] = None,
        outlet_flow: Optional[float] = None,
        recent_flows: Optional[List[float]] = None,
        recent_pressures: Optional[List[float]] = None
    ) -> Dict[str, Any]:
        """
        Analyze a single sensor point or live telemetry message.
        """
        # Sensor Health Check
        sensor_status = "HEALTHY"
        sensor_issue = None

        if recent_flows and len(recent_flows) >= 5:
            # Check for flatline stuck sensor
            if np.std(recent_flows[-5:]) < 0.001:
                sensor_status = "DEGRADED"
                sensor_issue = "Sensor Flatline: Zero variance detected over 5 intervals (potential telemetry freeze)."
        
        if pressure < 0.2:
            sensor_status = "CRITICAL"
            sensor_issue = "Severe pressure loss (<0.2 bar): Possible line collapse or offline gauge."
        elif pressure > 10.0 or flow_rate > 800.0:
            sensor_status = "WARNING"
            sensor_issue = "Telemetry value exceeds standard physical threshold for urban distribution main."

        # Compute imbalance
        imbalance = 0.0
        if inlet_flow is not None and outlet_flow is not None:
            imbalance = inlet_flow - outlet_flow

        # Rolling statistics
        flow_std = np.std(recent_flows[-5:]) if (recent_flows and len(recent_flows) >= 2) else 1.5
        flow_mean = np.mean(recent_flows[-5:]) if (recent_flows and len(recent_flows) >= 1) else flow_rate
        pressure_delta = (pressure - recent_pressures[-1]) if (recent_pressures and len(recent_pressures) >= 1) else (pressure - baseline_pressure)

        features = np.array([[
            flow_rate,
            pressure,
            flow_mean,
            flow_std,
            pressure_delta,
            imbalance
        ]])

        # Anomaly scoring
        if not self.is_fitted:
            # Fit on standard default baseline if model not pre-fitted
            dummy_normal = np.column_stack([
                np.random.normal(baseline_flow, 5.0, 100),
                np.random.normal(baseline_pressure, 0.2, 100),
                np.random.normal(baseline_flow, 4.0, 100),
                np.random.uniform(0.5, 3.0, 100),
                np.random.normal(0.0, 0.1, 100),
                np.random.normal(0.0, 1.0, 100)
            ])
            self.model.fit(dummy_normal)
            self.is_fitted = True

        raw_score = float(self.model.decision_function(features)[0])
        # Decision function: negative values indicate anomaly, positive normal.
        # Scale to 0-1 anomaly confidence where 1 is severe anomaly.
        normalized_anomaly_score = max(0.0, min(1.0, 0.5 - (raw_score * 2.5)))

        # Physical Rule Augmentation
        is_burst = (pressure < (baseline_pressure * 0.75)) and (flow_rate > (baseline_flow * 1.35))
        is_sustained_leak = (pressure < (baseline_pressure * 0.88)) and (flow_rate > (baseline_flow * 1.15))
        is_imbalance_anomaly = (imbalance > 25.0)

        anomaly_detected = (normalized_anomaly_score > 0.65) or is_burst or is_sustained_leak or is_imbalance_anomaly

        # Water Loss Calculation
        excess_flow_l_per_min = max(0.0, flow_rate - baseline_flow)
        loss_rate_l_per_hr = round(excess_flow_l_per_min * 60.0, 1)

        # Confidence & Explanation
        explanations = []
        severity = "NORMAL"
        confidence = round(normalized_anomaly_score * 100.0, 1)

        if is_burst:
            severity = "CRITICAL"
            confidence = max(confidence, 94.0)
            explanations.append(
                f"Hydraulic burst pattern: Severe pressure drop to {pressure:.1f} bar (-{(1 - pressure/baseline_pressure)*100:.0f}%) "
                f"with concurrent flow surge to {flow_rate:.1f} L/min (+{(flow_rate/baseline_flow - 1)*100:.0f}%)."
            )
        elif is_sustained_leak:
            severity = "HIGH"
            confidence = max(confidence, 82.0)
            explanations.append(
                f"Sustained pipe leakage pattern: Pressure depressed at {pressure:.1f} bar with elevated nocturnal/diurnal demand."
            )
        elif is_imbalance_anomaly:
            severity = "HIGH"
            confidence = max(confidence, 80.0)
            explanations.append(
                f"District Metered Area (DMA) mass imbalance: Inlet exceeds outlet by {imbalance:.1f} L/min."
            )
        elif anomaly_detected:
            severity = "MODERATE"
            explanations.append(
                f"Statistical multivariate deviation: Isolation Forest anomaly score ({normalized_anomaly_score:.2f}) indicates unusual flow/pressure state."
            )
        else:
            explanations.append("Flow and pressure operating within expected baseline envelope.")

        return {
            "flow_rate_lpm": round(flow_rate, 2),
            "pressure_bar": round(pressure, 2),
            "baseline_flow_lpm": round(baseline_flow, 2),
            "baseline_pressure_bar": round(baseline_pressure, 2),
            "anomaly_detected": anomaly_detected,
            "anomaly_score": round(normalized_anomaly_score, 3),
            "confidence_pct": confidence,
            "severity": severity,
            "estimated_loss_l_per_hr": loss_rate_l_per_hr if anomaly_detected else 0.0,
            "sensor_health": {
                "status": sensor_status,
                "detail": sensor_issue or "Sensor telemetry transmitting with nominal variance and signal strength."
            },
            "explanations": explanations,
            "assumptions": (
                "Water loss estimated assuming rigid pipe District Metered Area (DMA); "
                "excess flow calculated against diurnal baseline flow curve."
            )
        }

    def save_model(self, file_path: str):
        """Save model artifact safely with joblib."""
        os.makedirs(os.path.dirname(file_path), exist_ok=True)
        joblib.dump(self.model, file_path)

    def load_model(self, file_path: str):
        """Load trained model artifact."""
        if os.path.exists(file_path):
            self.model = joblib.load(file_path)
            self.is_fitted = True
