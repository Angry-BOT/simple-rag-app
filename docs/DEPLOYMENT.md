# 🚀 Deployment Guide - Local & Cloud

This guide covers deploying the RAG application with both local (Docker) and cloud-hosted ChromaDB.

## Table of Contents

- [Local Development Setup](#local-development-setup)
- [Cloud Deployment](#cloud-deployment)
- [Switching Between Local and Cloud](#switching-between-local-and-cloud)
- [Popular ChromaDB Cloud Options](#popular-chromadb-cloud-options)

---

## 🏠 Local Development Setup

### Prerequisites

- Docker Desktop installed and running
- Node.js 18+ installed

### 1. Start Local ChromaDB

```bash
# Option A: Using the provided script
./start-chromadb.sh

# Option B: Using Docker directly
docker run -d \
  --name chromadb \
  -p 8000:8000 \
  -v "$(pwd)/packages/backend/storage/chroma-data:/chroma/chroma" \
  chromadb/chroma:latest

# Option C: Using docker-compose
docker compose up -d chromadb
```

### 2. Configure Environment

Edit `packages/backend/.env`:

```bash
# Local ChromaDB
CHROMADB_URL=http://localhost:8000
CHROMA_COLLECTION_NAME=rag_documents

# No API key needed for local
# CHROMADB_API_KEY=
```

### 3. Start Backend

```bash
cd packages/backend
npm run dev
```

### 4. Verify

```bash
# Check ChromaDB
curl http://localhost:8000/api/v1/heartbeat

# Check Backend
curl http://localhost:3000/api/health
curl http://localhost:3000/api/chat/health
```

Expected response:

```json
{
  "gemini": true,
  "ingestion": true,
  "overall": true
}
```

---

## ☁️ Cloud Deployment

### Supported Cloud Providers

1. **Chroma Cloud** (Official managed service)
2. **AWS** (Self-hosted on EC2/ECS/EKS)
3. **Google Cloud** (Cloud Run/GKE)
4. **Azure** (Container Apps/AKS)
5. **Railway, Render, Fly.io** (Platform-as-a-Service)

### Option 1: Chroma Cloud (Easiest)

#### Step 1: Sign up for Chroma Cloud

```bash
# Visit: https://www.trychroma.com/cloud
# Create account and get your API key
```

#### Step 2: Update .env

```bash
# Cloud ChromaDB
CHROMADB_URL=https://api.trychroma.com
CHROMADB_API_KEY=your_chroma_cloud_api_key

# Optional: Multi-tenant settings
CHROMADB_TENANT=your_tenant_id
CHROMADB_DATABASE=production

CHROMA_COLLECTION_NAME=rag_documents
```

#### Step 3: Deploy Backend

No code changes needed! Just deploy with updated environment variables.

```bash
# Build
npm run build

# Set environment variables on your cloud platform
# Deploy your dist/ folder
```

### Option 2: Self-Hosted on AWS/GCP/Azure

#### Deploy ChromaDB Server

**Using Docker on EC2/VM:**

```bash
# SSH into your VM
ssh user@your-server.com

# Run ChromaDB
docker run -d \
  --name chromadb \
  -p 8000:8000 \
  -v /data/chroma:/chroma/chroma \
  -e ALLOW_RESET=False \
  -e ANONYMIZED_TELEMETRY=False \
  chromadb/chroma:latest

# Setup reverse proxy (nginx/caddy) with HTTPS
# Get SSL certificate (Let's Encrypt)
```

**Using Kubernetes:**

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: chromadb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: chromadb
  template:
    metadata:
      labels:
        app: chromadb
    spec:
      containers:
        - name: chromadb
          image: chromadb/chroma:latest
          ports:
            - containerPort: 8000
          volumeMounts:
            - name: data
              mountPath: /chroma/chroma
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: chromadb-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: chromadb
spec:
  type: LoadBalancer
  ports:
    - port: 8000
      targetPort: 8000
  selector:
    app: chromadb
```

#### Update Backend .env

```bash
# Your deployed ChromaDB URL
CHROMADB_URL=https://chromadb.yourdomain.com

# Optional: Add authentication
CHROMADB_API_KEY=your_secure_api_key

CHROMA_COLLECTION_NAME=rag_documents
```

---

## 🔄 Switching Between Local and Cloud

The application is fully configurable - just update the environment variables!

### Local Development

```bash
# packages/backend/.env.local
CHROMADB_URL=http://localhost:8000
# No API key needed
```

### Staging Environment

```bash
# packages/backend/.env.staging
CHROMADB_URL=https://staging-chromadb.yourdomain.com
CHROMADB_API_KEY=staging_api_key_here
CHROMADB_TENANT=staging
```

### Production Environment

```bash
# packages/backend/.env.production
CHROMADB_URL=https://chromadb.yourdomain.com
CHROMADB_API_KEY=production_api_key_here
CHROMADB_TENANT=production
CHROMADB_DATABASE=main
```

### Using Environment-Specific Configs

```bash
# Local
npm run dev

# Staging
NODE_ENV=staging npm start

# Production
NODE_ENV=production npm run start:prod
```

---

## 🌐 Popular ChromaDB Cloud Options

### 1. Chroma Cloud (Official)

- **URL**: https://www.trychroma.com/cloud
- **Pros**: Managed, easy setup, official support
- **Pricing**: Pay-as-you-go
- **Best for**: Production, minimal DevOps

### 2. Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy ChromaDB
railway up --template chromadb

# Get URL from Railway dashboard
# Update .env with provided URL
```

### 3. Render

```yaml
# render.yaml
services:
  - type: web
    name: chromadb
    env: docker
    dockerfilePath: Dockerfile
    envVars:
      - key: PORT
        value: 8000
```

### 4. AWS ECS/Fargate

```bash
# Use AWS CDK or CloudFormation
# Deploy Docker container
# Get LoadBalancer URL
# Update .env
```

---

## 📊 Monitoring & Management

### Health Checks

```bash
# ChromaDB health
curl https://your-chromadb-url/api/v1/heartbeat

# Backend health
curl https://your-api-url/api/health
curl https://your-api-url/api/chat/health
```

### Viewing Collections

```bash
# List collections
curl https://your-chromadb-url/api/v1/collections

# Get collection stats
curl https://your-api-url/api/ingestion/stats  # If you add this endpoint
```

---

## 🔒 Security Best Practices

### 1. Always Use HTTPS in Production

```bash
CHROMADB_URL=https://chromadb.yourdomain.com  # ✅ HTTPS
# NOT: http://chromadb.yourdomain.com  # ❌ HTTP
```

### 2. Secure API Keys

```bash
# Use secrets management
# AWS: Secrets Manager
# GCP: Secret Manager
# Azure: Key Vault
# Railway/Render: Built-in secrets
```

### 3. Network Security

```bash
# Allow only backend IP to access ChromaDB
# Use VPC/Security Groups
# Enable authentication
```

### 4. Backup & Recovery

```bash
# Regular backups of ChromaDB data
# For cloud: Use managed backups
# For self-hosted: Backup volumes/persistent storage
```

---

## 🐛 Troubleshooting

### Connection Issues

```bash
# Test ChromaDB connectivity
curl -v https://your-chromadb-url/api/v1/heartbeat

# Check firewall rules
# Check SSL certificate
# Verify API key
```

### Backend Logs

```bash
# Check logs for ChromaDB connection
docker logs -f your-backend-container

# Look for:
# [ChromaStoreService] Connecting to ChromaDB at: ...
# [ChromaStoreService] ChromaDB initialized successfully
```

---

## 📚 Additional Resources

- [ChromaDB Docs](https://docs.trychroma.com/)
- [ChromaDB Deployment Guide](https://docs.trychroma.com/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Kubernetes ChromaDB](https://docs.trychroma.com/deployment/kubernetes)

---

## 🎯 Summary

✅ **Local Development**: `CHROMADB_URL=http://localhost:8000`
✅ **Cloud Deployment**: `CHROMADB_URL=https://your-cloud-url.com`
✅ **No Code Changes**: Just update environment variables!
✅ **Production Ready**: Add API keys and HTTPS
✅ **Scalable**: Deploy on any cloud platform

The application is designed to be **deployment-agnostic** - work locally today, move to cloud tomorrow! 🚀
