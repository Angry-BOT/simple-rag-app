# 🚀 Starting the RAG Backend Server

## Prerequisites

1. **Node.js** installed (v18 or higher)
2. **Google Gemini API Key** - Get one from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Quick Start

### 1. Configure Environment Variables

Edit the `.env` file in `packages/backend/.env` and add your Google API key:

```bash
GOOGLE_API_KEY=your_actual_api_key_here
```

### 2. Install Dependencies (if not already done)

From the **project root**:

```bash
npm install
```

Or from the **backend directory**:

```bash
cd packages/backend
npm install
```

### 3. Start the Server

You have several options:

#### Option A: Development Mode with Hot Reload (Recommended)

```bash
# From project root:
cd packages/backend
npm run start:dev

# Or using Lerna from root:
lerna run start:dev --scope=@simple-rag-app/backend
```

#### Option B: Production Mode

```bash
# From backend directory:
npm run build
npm run start:prod
```

#### Option C: Debug Mode

```bash
# From backend directory:
npm run start:debug
```

## Expected Output

When the server starts successfully, you should see:

```
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [InstanceLoader] ConfigModule dependencies initialized
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [InstanceLoader] FilesModule dependencies initialized
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [InstanceLoader] IngestionModule dependencies initialized
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [InstanceLoader] ChatModule dependencies initialized
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [GeminiService] Configured model: gemini-1.5-pro
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [GeminiService] Gemini LLM initialized successfully
[Nest] 12345  - 10/05/2025, 10:00:00 AM     LOG [ChromaStoreService] ChromaDB initialized successfully
🚀 Application is running on: http://localhost:3000
📚 Swagger documentation available at: http://localhost:3000/api/docs
```

## Available Endpoints

Once the server is running, you can access:

| URL                              | Description                                    |
| -------------------------------- | ---------------------------------------------- |
| http://localhost:3000            | API root                                       |
| http://localhost:3000/api/health | Health check endpoint                          |
| http://localhost:3000/api/docs   | **Swagger UI** - Interactive API documentation |

## Test the Server

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-10-05T10:00:00.000Z",
  "environment": "development"
}
```

### 2. Swagger UI (Recommended)

Open http://localhost:3000/api/docs in your browser to:

- See all available endpoints
- Test API calls interactively
- View request/response schemas

### 3. Upload a Test File

```bash
curl -X POST http://localhost:3000/api/files/upload \
  -F "file=@/path/to/your/document.pdf"
```

### 4. Query the Knowledge Base

```bash
curl -X POST http://localhost:3000/api/chat/query \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is this document about?",
    "topK": 5
  }'
```

## Troubleshooting

### Issue: "GOOGLE_API_KEY not configured"

**Solution**: Make sure you've set your API key in `.env`:

```bash
GOOGLE_API_KEY=your_actual_api_key_here
```

### Issue: Port 3000 already in use

**Solution**: Change the port in `.env`:

```bash
PORT=3001
```

### Issue: Module not found errors

**Solution**: Reinstall dependencies:

```bash
cd packages/backend
rm -rf node_modules
npm install
```

### Issue: Build errors

**Solution**: Clean build and rebuild:

```bash
npm run build:clean
npm run build
```

## Stop the Server

Press `Ctrl + C` in the terminal where the server is running.

## Next Steps

1. ✅ Server is running
2. 📝 Test APIs via Swagger UI
3. 📤 Upload documents
4. 💬 Ask questions with RAG
5. 🎨 Build the frontend (coming next!)

## Need Help?

- Check the Swagger docs at http://localhost:3000/api/docs
- Review logs in the terminal
- See `progress.md` for implementation details
