# 🤖 Simple RAG Application

A production-ready **Retrieval-Augmented Generation (RAG)** application built with NestJS, React, and ChromaDB. Upload documents, ask questions, and get AI-powered answers with source citations.

## ✨ Features

- 📄 **Document Upload** - Support for PDF, TXT, and HTML files
- 🔍 **Semantic Search** - Find relevant content using embeddings
- 💬 **AI-Powered Chat** - Ask questions and get contextual answers
- 🎯 **Source Citations** - Answers include references to source documents
- 🌐 **Cloud-Ready** - Deploy locally or to any cloud provider
- 📚 **RESTful API** - Full API with Swagger documentation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Docker Desktop (for ChromaDB)
- Google Gemini API Key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd simple-rag-app

# Install dependencies
npm install

# Start ChromaDB
./scripts/start-chromadb.sh

# Configure environment
cd packages/backend
cp .env.example .env
# Edit .env and add your GOOGLE_API_KEY

# Start the backend
npm run dev
```

The backend will be available at:

- **API**: http://localhost:3000
- **Swagger UI**: http://localhost:3000/api/docs

## 📁 Project Structure

```
simple-rag-app/
├── docs/                    # 📚 All documentation
│   ├── README.md           # Documentation index
│   ├── QUICKSTART.md       # Quick start guide
│   ├── DEPLOYMENT.md       # Deployment guide
│   └── ...                 # Other documentation
├── scripts/                 # 🔧 Utility scripts
│   └── start-chromadb.sh   # ChromaDB startup script
├── packages/
│   └── backend/            # 🎯 NestJS backend
│       ├── src/
│       │   ├── modules/    # Feature modules
│       │   ├── common/     # Shared utilities
│       │   └── main.ts     # Application entry
│       └── storage/        # Local file storage
├── docker-compose.yml      # 🐳 Docker services
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **LangChain** - Document processing pipeline
- **Google Gemini** - LLM for chat responses
- **HuggingFace Transformers** - Text embeddings
- **ChromaDB** - Vector database
- **Swagger** - API documentation

### Infrastructure

- **Docker** - Containerization
- **Lerna** - Monorepo management

## 📚 Documentation

Comprehensive documentation is available in the [`docs/`](./docs/) folder:

- 🚀 [Quick Start Guide](./docs/QUICKSTART.md)
- 🏗️ [Architecture Overview](./docs/DIRECTORY_STRUCTURE.md)
- ☁️ [Deployment Guide](./docs/DEPLOYMENT.md)
- 🐳 [ChromaDB Setup](./docs/CHROMADB_SETUP.md)
- 📊 [Progress Tracker](./docs/progress.md)

## 🎯 API Endpoints

| Endpoint                     | Method | Description                    |
| ---------------------------- | ------ | ------------------------------ |
| `/api/health`                | GET    | Health check                   |
| `/api/files/upload`          | POST   | Upload documents               |
| `/api/files`                 | GET    | List uploaded files            |
| `/api/ingestion/process/:id` | POST   | Process file into vector store |
| `/api/chat/query`            | POST   | Ask questions (RAG)            |
| `/api/docs`                  | GET    | Swagger documentation          |

## 🔧 Scripts

Utility scripts are in the [`scripts/`](./scripts/) folder:

- `start-chromadb.sh` - Start ChromaDB server with Docker

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

## 🌐 Deployment

The application is designed to be deployment-agnostic:

- **Local Development**: Docker + Node.js
- **Cloud**: Any platform supporting Docker (AWS, GCP, Azure, Railway, Render)
- **ChromaDB**: Local Docker or cloud-hosted

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- LangChain for document processing
- Google Gemini for LLM capabilities
- HuggingFace for embeddings
- ChromaDB for vector storage

---

**Need help?** Check the [documentation](./docs/) or open an issue!
A rag application to have its own knowledge base and the user can chat with it.

In-development!
