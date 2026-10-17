# IBM Z & IBM LinuxONE Deployment Guide

## 1. Executive Summary & Hardware Value Alignment

Deploying **HYDROSYNC AI** on **IBM LinuxONE** and **Linux on IBM Z** provides distinct enterprise advantages for municipal critical infrastructure management:

1. **CPU-Optimized Machine Learning**:
   Unlike large parameter LLMs that demand expensive, hot-running discrete GPUs, HYDROSYNC AI's Isolation Forest and NOAA regression models run natively and efficiently on IBM Telum / LinuxONE CPU cores.

2. **Five-Nines High Availability (99.999%)**:
   Municipal disaster management cannot fail during severe weather events. LinuxONE's mainframe-grade fault tolerance, redundant I/O, and non-disruptive firmware updates ensure continuous sensory processing.

3. **IBM Secure Execution & Confidential Computing**:
   Municipal water distribution topology, pipe locations, and hospital patient vulnerability indices are sensitive critical infrastructure data. IBM Secure Execution creates hardware-isolated enclaves that protect data-in-use from unauthorized host administrators or compromised hypervisors.

4. **Massive I/O Telemetry Throughput**:
   A metropolitan city generates millions of sensor readings per minute. LinuxONE's dedicated SAPs (System Assist Processors) process immense telemetry volume without CPU choking.

---

## 2. Multi-Architecture Container Build for s390x

The project provides a dedicated `docker/Dockerfile.s390x` utilizing verified Python base images for s390x:

```bash
# 1. Enable Docker Buildx multi-arch builder
docker buildx create --name linuxone_builder --use
docker buildx inspect --bootstrap

# 2. Build and tag for IBM LinuxONE (s390x) and x86_64
docker buildx build \
  --platform linux/s390x,linux/amd64 \
  -t hydrosync-ai-backend:v1.0.0 \
  -f docker/Dockerfile.s390x \
  --push .
```

---

## 3. Deployment on Red Hat OpenShift on IBM Z

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: hydrosync-ai-backend
  namespace: climate-intelligence
  labels:
    app: hydrosync-ai
    arch: s390x
spec:
  replicas: 4
  selector:
    matchLabels:
      app: hydrosync-ai
  template:
    metadata:
      labels:
        app: hydrosync-ai
    spec:
      nodeSelector:
        kubernetes.io/arch: s390x
      containers:
      - name: backend
        image: hydrosync-ai-backend:v1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: IS_LINUXONE_TARGET
          value: "true"
        - name: ENVIRONMENT
          value: "production"
        resources:
          limits:
            cpu: "2000m"
            memory: "2Gi"
          requests:
            cpu: "500m"
            memory: "512Mi"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 8000
          initialDelaySeconds: 10
          periodSeconds: 20
```

---

## 4. Hardware Verification Disclaimer
This application architecture has been packaged and validated with CPU-only dependencies to ensure 100% s390x binary compatibility. Demonstration instances run in a containerized environment; physical enterprise deployment onto on-premise IBM z16 / LinuxONE Emperor 4 follows the documented roadmap.
