# RAG Application - Backend

NestJS backend API for Retrieval-Augmented Generation (RAG) application with document ingestion and chat capabilities.

## Features

- 📁 File upload (PDF, TXT, HTML)
- 🔄 Document ingestion pipeline
- 🧠 Semantic chunking
- 🔢 HuggingFace embeddings (all-MiniLM-L6-v2)
- 💾 ChromaDB vector storage
- 💬 RAG-powered chat with Gemini LLM
- 📚 Swagger/OpenAPI documentation

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

## Installation

```bash
# Install dependencies
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
# Server
PORT=3000
NODE_ENV=development

# API Keys
GOOGLE_API_KEY=your_gemini_api_key

# File Upload
UPLOAD_DIR=./storage/uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,txt,html

# Vector Database
VECTOR_DB_DIR=./storage/vector-db
CHROMA_COLLECTION_NAME=rag_documents

# Embeddings
EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2
EMBEDDING_DIMENSION=384

# RAG Configuration
CHUNK_SIZE=512
CHUNK_OVERLAP=50
TOP_K_RESULTS=5
LLM_MODEL=gemini-pro
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=2048
```

## Running the Application

```bash
# Development mode
npm run dev

# Production mode
npm run build
npm run start:prod
```

## API Documentation

Once the application is running, access Swagger documentation at:

- http://localhost:3000/api/docs

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
├── common/                # Shared utilities
│   ├── config/            # Configuration files
│   ├── filters/           # Exception filters
│   ├── interceptors/      # Request interceptors
│   ├── pipes/             # Validation pipes
│   └── utils/             # Utility functions
├── modules/
│   ├── files/             # File upload module
│   ├── chat/              # Chat module
│   └── ingestion/         # Document ingestion pipeline
└── llm/                   # LLM integration

storage/
├── uploads/               # Uploaded files
│   ├── pdf/
│   ├── txt/
│   └── html/
└── vector-db/             # ChromaDB storage
```

## API Endpoints

### Health

- `GET /api/health` - Application health check

### Files

- `POST /api/files/upload` - Upload a file
- `GET /api/files` - List all uploaded files
- `DELETE /api/files/:id` - Delete a file

### Chat

- `POST /api/chat` - Chat with knowledge base

## Development

```bash
# Lint code
npm run lint

# Format code
npm run format
```
