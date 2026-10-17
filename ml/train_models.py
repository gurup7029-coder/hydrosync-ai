"""
Model Training and Calibration Script for AquaTrace.
Trains baseline Isolation Forest and validates on synthetic DMA pipeline benchmarks.
"""

import os
import numpy as np
import pandas as pd
from water_anomaly_detector import WaterAnomalyDetector
from evaluator import evaluate_water_leak_model

def generate_synthetic_training_data(n_samples: int = 1500) -> pd.DataFrame:
    """
    Generate realistic DMA water network time series with normal diurnal curves,
    pressure fluctuations, minor sensor noise, and occasional transient spikes.
    """
    np.random.seed(42)
    time_indices = pd.date_range("2026-10-01", periods=n_samples, freq="15min")
    
    # Diurnal flow curve: base 60 L/min + 30 L/min sinusoidal daytime peak + noise
    hour_of_day = time_indices.hour + time_indices.minute / 60.0
    diurnal_factor = np.sin((hour_of_day - 6.0) / 24.0 * 2.0 * np.pi)
    base_flow = 65.0 + 25.0 * np.clip(diurnal_factor, 0.0, 1.0)
    flow_noise = np.random.normal(0, 3.5, n_samples)
    flow_rate = np.clip(base_flow + flow_noise, 15.0, 300.0)

    # Pressure: inverse correlation with high demand, nominal 4.2 bar
    pressure_base = 4.3 - (flow_rate - 65.0) * 0.008
    pressure_noise = np.random.normal(0, 0.08, n_samples)
    pressure = np.clip(pressure_base + pressure_noise, 1.0, 6.0)

    # Inlet / Outlet flows
    inlet_flow = flow_rate + np.random.normal(1.5, 0.8, n_samples)
    outlet_flow = flow_rate - np.random.normal(0.0, 0.5, n_samples)

    df = pd.DataFrame({
        "timestamp": time_indices,
        "sensor_id": "DMA-CENTRAL-01",
        "location_id": "LOC-CTR",
        "flow_rate": np.round(flow_rate, 2),
        "pressure": np.round(pressure, 2),
        "inlet_flow": np.round(inlet_flow, 2),
        "outlet_flow": np.round(outlet_flow, 2),
        "leak_label": 0
    })

    # Inject 50 anomalous events (bursts, gradual leaks, stuck sensors)
    anomaly_indices = np.random.choice(range(100, n_samples - 50), size=50, replace=False)
    for idx in anomaly_indices:
        scenario = np.random.choice(["burst", "gradual_leak", "imbalance"])
        if scenario == "burst":
            df.loc[idx:idx+3, "pressure"] = np.maximum(1.2, df.loc[idx:idx+3, "pressure"] - 2.2)
            df.loc[idx:idx+3, "flow_rate"] = df.loc[idx:idx+3, "flow_rate"] + 85.0
            df.loc[idx:idx+3, "leak_label"] = 1
        elif scenario == "gradual_leak":
            df.loc[idx:idx+6, "flow_rate"] = df.loc[idx:idx+6, "flow_rate"] + 30.0
            df.loc[idx:idx+6, "pressure"] = df.loc[idx:idx+6, "pressure"] - 0.7
            df.loc[idx:idx+6, "leak_label"] = 1
        elif scenario == "imbalance":
            df.loc[idx:idx+4, "inlet_flow"] = df.loc[idx:idx+4, "outlet_flow"] + 45.0
            df.loc[idx:idx+4, "leak_label"] = 1

    return df

def main():
    print("Generating synthetic DMA telemetry training dataset...")
    df = generate_synthetic_training_data(2000)
    
    # Save sample dataset
    data_dir = os.path.join(os.path.dirname(__file__), "..", "data", "sample")
    os.makedirs(data_dir, exist_ok=True)
    csv_path = os.path.join(data_dir, "synthetic_leak_scenarios.csv")
    df.to_csv(csv_path, index=False)
    print(f"Saved dataset to {csv_path}")

    # Train model
    print("Training AquaTrace Isolation Forest detector...")
    detector = WaterAnomalyDetector(contamination=0.06)
    detector.fit(df)

    # Save model artifact
    artifact_path = os.path.join(os.path.dirname(__file__), "artifacts", "water_detector.joblib")
    detector.save_model(artifact_path)
    print(f"Saved model artifact to {artifact_path}")

    # Evaluate on test slice
    print("Running evaluation on labelled subset...")
    y_true = df["leak_label"].tolist()
    
    # Predict for each sample
    recent_flows = []
    recent_pressures = []
    y_pred = []
    y_scores = []
    
    for _, row in df.iterrows():
        recent_flows.append(row["flow_rate"])
        recent_pressures.append(row["pressure"])
        res = detector.predict_sample(
            flow_rate=row["flow_rate"],
            pressure=row["pressure"],
            baseline_flow=80.0,
            baseline_pressure=4.2,
            inlet_flow=row["inlet_flow"],
            outlet_flow=row["outlet_flow"],
            recent_flows=recent_flows[-10:],
            recent_pressures=recent_pressures[-10:]
        )
        y_pred.append(1 if res["anomaly_detected"] else 0)
        y_scores.append(res["anomaly_score"])

    eval_results = evaluate_water_leak_model(y_true, y_pred, y_scores)
    print("\n=== Model Benchmark Metrics ===")
    print(f"Precision: {eval_results['metrics']['precision']}")
    print(f"Recall:    {eval_results['metrics']['recall']}")
    print(f"F1-Score:  {eval_results['metrics']['f1_score']}")
    print(f"ROC-AUC:   {eval_results['metrics']['roc_auc']}")
    print(f"False Alarm Rate: {eval_results['metrics']['false_alarm_rate']}")
    print("Training and validation complete.")

if __name__ == "__main__":
    main()
