# Responsible AI, Safety Boundaries & Ethical Disclaimers

## 1. Ethical Mission Statement
HYDROSYNC AI is developed as an advisory decision-support system to empower municipal agencies, water utilities, and disaster emergency managers to protect human life and conserve natural water reserves. It is explicitly designed to assist human decision-makers, not replace them.

---

## 2. Safety Boundaries & Non-Claims

1. **Non-Medical Clinical Claim**:
   - HeatShield AI computes meteorological and environmental heat risk (Heat Index and Wet-Bulb Temperature).
   - **Limitation**: The system does NOT measure human body core temperature, heart rate, or physiological hydration status. It cannot clinically diagnose heat exhaustion or heat stroke. Emergency medical responses must be guided by certified medical practitioners.

2. **Non-Physical Ground Leak Pinpointing**:
   - AquaTrace detects anomalies in District Metered Areas (DMAs) and estimates loss rate based on diurnal deviations.
   - **Limitation**: The system does NOT claim to pinpoint the exact underground coordinates of a pipe crack to the millimeter. Underground leak confirmation requires field crews utilizing acoustic correlators and listening sticks.

3. **Causation vs. Correlation Honesty**:
   - Concurrent heatwaves and water main bursts can occur simultaneously during peak urban stress.
   - **Limitation**: The platform never asserts that high air temperature caused an underground pipe burst without physical soil expansion or water hammer verification. The unified score reflects **operational urgency**, recognizing that water loss during high heat imperils cooling centers.

4. **Synthetic Data Transparency**:
   - All simulated telemetry streams carry a visible `[SIMULATED SENSOR DATA]` badge.
   - Model metrics report true mathematical evaluations on labelled validation sets and do not fabricate 99.9% perfection.

---

## 3. Human-in-the-Loop Governance
- All alert recommendations provide transparent explainability feature breakdowns (e.g. baseline vs. humidity amplification; pressure drop vs. flow surge).
- Municipal operators must acknowledge or resolve alerts explicitly; no automated valve shutoffs or cooling center evacuations occur without human authorization.
