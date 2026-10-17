"""
One-click launcher for HYDROSYNC AI.
Launches FastAPI backend server and Vite frontend concurrently.
"""

import subprocess
import sys
import os
import time

def main():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(root_dir, "frontend")

    print("=" * 70)
    print("  HYDROSYNC AI — Climate Intelligence & Water Conservation Platform")
    print("  'Predict the Heat. Detect the Loss. Protect the Future.'")
    print("  Target: IBM Z Datathon 2026 | Real-Time AI for Critical Decisions")
    print("=" * 70)

    # 1. Start Backend Server
    print("\n[1/2] Starting FastAPI Backend on http://localhost:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"],
        cwd=root_dir
    )

    time.sleep(2)

    # 2. Start Frontend Server
    print("[2/2] Starting Frontend Vite Server on http://localhost:3000 ...")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev", "--", "--port", "3000"],
        cwd=frontend_dir
    )

    print("\n" + "=" * 70)
    print("  HYDROSYNC AI IS RUNNING!")
    print("  -> Client Web Dashboard: http://localhost:3000")
    print("  -> API OpenAPI Docs:     http://localhost:8000/docs")
    print("  Press Ctrl+C to stop both servers.")
    print("=" * 70 + "\n")

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping HYDROSYNC AI services...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("Services cleanly shutdown.")

if __name__ == "__main__":
    main()
