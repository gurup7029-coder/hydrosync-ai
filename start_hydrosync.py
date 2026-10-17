"""
One-click unified launcher for HYDROSYNC AI.
Launches FastAPI backend server and Vite frontend concurrently,
then opens the web dashboard in your default browser.
"""

import subprocess
import sys
import os
import time
import webbrowser

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=" * 70)
    print("  HYDROSYNC AI — Climate Intelligence & Water Conservation Platform")
    print("  'Predict the Heat. Detect the Loss. Protect the Future.'")
    print("  IBM Z Datathon 2026 | Real-Time AI for Critical Decisions")
    print("=" * 70)

    # 1. Ensure Model Artifact exists
    model_artifact = os.path.join(root_dir, "ml", "artifacts", "water_detector.joblib")
    if not os.path.exists(model_artifact):
        print("\n[INFO] Initializing AquaTrace ML baseline artifacts...")
        subprocess.run([sys.executable, "ml/train_models.py"], cwd=root_dir)

    # 2. Start Backend Server
    print("\n[1/2] Starting FastAPI Backend on http://localhost:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd=root_dir
    )

    time.sleep(2)

    # 3. Start Frontend Server
    print("[2/2] Starting Frontend Vite Server on http://localhost:3000 ...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        f"{npm_cmd} run dev -- --port 3000",
        cwd=frontend_dir,
        shell=True
    )

    time.sleep(2)

    print("\n" + "=" * 70)
    print("  HYDROSYNC AI IS ONLINE AND RUNNING!")
    print("  -> Client Dashboard: http://localhost:3000")
    print("  -> OpenAPI Docs:     http://localhost:8000/docs")
    print("  -> Health Check:     http://localhost:8000/api/health")
    print("  Press Ctrl+C to terminate both servers.")
    print("=" * 70 + "\n")

    # Automatically open default web browser
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\n[INFO] Gracefully shutting down HYDROSYNC AI services...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("[INFO] All services stopped.")

if __name__ == "__main__":
    main()
