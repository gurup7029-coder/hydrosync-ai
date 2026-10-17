# HYDROSYNC AI — Technical Architecture Specification

## 1. System Overview
**HYDROSYNC AI** is a dual-core climate intelligence and municipal water conservation platform with the tagline:
> *"Predict the Heat. Detect the Loss. Protect the Future."*

It bridges the historical gap between municipal public health management and water utility operations by evaluating compound climate-infrastructure risks.

---

## 2. Dual Intelligent Processing Engines

### 2.1 HeatShield AI: Thermal Stress & Wet-Bulb Engine
- **NOAA Rothfusz Regression**: Translates dry-bulb temperature ($T$) and relative humidity ($RH$) into perceived Heat Index ($HI$).
- **Stull Wet-Bulb Formulation**: Computes physiological evaporative cooling potential ($T_{wb}$) to alert emergency dispatch when human sweating efficiency is curtailed ($T_{wb} \ge 31^\circ\text{C}$).
- **NWS 5-Tier Categorization**:
  1. *Low / Normal* ($< 27^\circ\text{C}$)
  2. *Caution* ($27^\circ\text{C} - 32^\circ\text{C}$)
  3. *Extreme Caution* ($32^\circ\text{C} - 41^\circ\text{C}$)
  4. *Danger* ($41^\circ\text{C} - 54^\circ\text{C}$)
  5. *Extreme Danger* ($> 54^\circ\text{C}$)

### 2.2 AquaTrace: Hydraulic Anomaly & Leak Detection Pipeline
- **Unsupervised Isolation Forest**: Evaluates multivariate telemetry vectors:
  $$\mathbf{x} = [Q, P, \mu_Q, \sigma_Q, \Delta P, \Delta Q_{\text{in-out}}]$$
- **Physics-Informed Heuristic Layer**:
  - Main burst trigger: $\Delta P < -1.5\text{ bar}$ concurrent with $\Delta Q > +35\%$.
  - Mass-balance deficit: $(Q_{\text{in}} - Q_{\text{out}}) > \text{threshold}$.
- **Loss Estimation**:
  $$\text{Loss Rate (L/hr)} = \max(0, Q_{\text{actual}} - Q_{\text{baseline}}) \times 60$$

---

## 3. Unified Decision Prioritization Formulation

To eliminate siloed municipal responses, the Unified Engine calculates an explainable Composite Priority Score $P \in [0, 100]$:

$$P = \left( w_{\text{heat}} S_{\text{heat}} + w_{\text{water}} S_{\text{water}} + w_{\text{vuln}} S_{\text{vuln}} + \text{SynergyBonus} \right) \times \Phi_{\text{freshness}}$$

- $w_{\text{heat}} = 0.35$
- $w_{\text{water}} = 0.40$
- $w_{\text{vuln}} = 0.15$
- **Synergy Bonus**: An exponential escalation ($+10$ to $+16$ points) triggered when both severe heat ($S_{\text{heat}} \ge 65$) and water rupture ($S_{\text{water}} \ge 65$) strike simultaneously.
- $\Phi_{\text{freshness}} \in [0.85, 1.0]$: Penalizes stale or disconnected telemetry.

---

## 4. Software Stack

| Component | Technology | Rationale |
|---|---|---|
| Frontend | React 19 + TypeScript + Vite | Blazing fast client rendering, typed API contracts |
| Styling | Tailwind CSS 4 | Clean dark glassmorphic UI, responsive layouts |
| Visualizations | Recharts + SVG Topology | Dynamic real-time graphs and DMA network charts |
| Backend | FastAPI (Python 3.11+) | Async high-concurrency REST endpoints |
| Machine Learning | Scikit-learn + NumPy + Joblib | Lightweight, CPU-efficient, s390x compatible |
| Storage | SQLite (Repository Pattern) | Zero-config local persistence, swappable for Db2/Postgres |
