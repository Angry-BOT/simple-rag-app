# ChromaDB Setup Guide

ChromaDB is required for the vector storage functionality in this RAG application.

## Prerequisites

- Docker installed on your system

## Option 1: Docker (Recommended)

### 1. Start ChromaDB Server

From the project root:

```bash
docker-compose up -d chromadb
```

This will:

- Pull the ChromaDB image
- Start ChromaDB on port 8000
- Persist data in `packages/backend/storage/chroma-data`

### 2. Verify ChromaDB is Running

```bash
curl http://localhost:8000/api/v1/heartbeat
```

Expected response:

```json
{"nanosecond heartbeat": <timestamp>}
```

### 3. View Logs

```bash
docker-compose logs -f chromadb
```

### 4. Stop ChromaDB

```bash
docker-compose down
```

## Option 2: Python (Alternative)

If you prefer not to use Docker:

### 1. Install ChromaDB

```bash
pip install chromadb
```

### 2. Run ChromaDB Server

```bash
chroma run --path ./packages/backend/storage/chroma-data --port 8000
```

## Verifying Integration

Once ChromaDB is running, restart your NestJS application:

```bash
cd packages/backend
npm run dev
```

Check the logs for:

```
[Nest] LOG [ChromaStoreService] ChromaDB initialized successfully
```

And test the health endpoint:

```bash
curl http://localhost:3000/api/chat/health
```

Should show:

```json
{
  "gemini": true,
  "ingestion": true,
  "overall": true
}
```

## Troubleshooting

### ChromaDB Connection Failed

If you see connection errors:

1. **Check if ChromaDB is running:**

   ```bash
   curl http://localhost:8000/api/v1/heartbeat
   ```

2. **Check Docker logs:**

   ```bash
   docker-compose logs chromadb
   ```

3. **Restart ChromaDB:**
   ```bash
   docker-compose restart chromadb
   ```

### Port Already in Use

If port 8000 is already in use, edit `docker-compose.yml`:

```yaml
ports:
  - '8001:8000' # Use port 8001 instead
```

Then update your `.env`:

```bash
CHROMADB_URL=http://localhost:8001
```

## Data Persistence

ChromaDB data is stored in:

```
packages/backend/storage/chroma-data/
```

To reset the database:

```bash
docker-compose down
rm -rf packages/backend/storage/chroma-data
docker-compose up -d chromadb
```
