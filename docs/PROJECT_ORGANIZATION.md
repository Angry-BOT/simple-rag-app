# 📁 Project Organization

This document describes the organization and structure of the Simple RAG Application repository.

## 📂 Directory Structure

```
simple-rag-app/
│
├── 📚 docs/                          # All documentation files
│   ├── README.md                     # Documentation index
│   ├── QUICKSTART.md                 # Quick start guide
│   ├── START.md                      # Backend startup guide
│   ├── DEPLOYMENT.md                 # Deployment guide
│   ├── CHROMADB_SETUP.md            # ChromaDB setup instructions
│   ├── progress.md                   # Implementation progress
│   ├── CURRENT_STATUS.md            # Current project status
│   ├── BACKEND_COMPLETE.md          # Backend completion summary
│   ├── DIRECTORY_STRUCTURE.md       # Directory structure details
│   ├── SETUP_SUMMARY.md             # Setup summary
│   └── FILE_UPLOAD_MODULE_SUMMARY.md # File upload module details
│
├── 🔧 scripts/                       # Utility scripts
│   └── start-chromadb.sh            # Start ChromaDB with Docker
│
├── 📦 packages/                      # Monorepo packages
│   └── backend/                     # NestJS backend application
│       ├── src/                     # Source code
│       │   ├── modules/            # Feature modules
│       │   │   ├── files/          # File upload module
│       │   │   ├── chat/           # Chat/Q&A module
│       │   │   ├── ingestion/      # Document ingestion pipeline
│       │   │   │   ├── parsers/    # Document parsers
│       │   │   │   ├── chunking/   # Text chunking
│       │   │   │   ├── embeddings/ # HuggingFace embeddings
│       │   │   │   └── vector-store/ # ChromaDB integration
│       │   │   └── llm/            # Gemini LLM service
│       │   ├── common/             # Shared utilities
│       │   │   ├── config/         # Configuration
│       │   │   ├── filters/        # Exception filters
│       │   │   ├── interceptors/   # Interceptors
│       │   │   ├── pipes/          # Validation pipes
│       │   │   └── utils/          # Utility functions
│       │   ├── app.module.ts       # Root module
│       │   └── main.ts             # Application entry
│       ├── storage/                # Local file storage
│       │   ├── uploads/            # Uploaded files
│       │   │   ├── pdf/            # PDF files
│       │   │   ├── txt/            # Text files
│       │   │   └── html/           # HTML files
│       │   ├── vector-db/          # Local vector DB (Docker volume)
│       │   └── chroma-data/        # ChromaDB data
│       ├── test/                   # Tests
│       ├── .env                    # Environment variables
│       ├── .env.example            # Environment template
│       ├── package.json            # Backend dependencies
│       ├── tsconfig.json           # TypeScript config
│       ├── nest-cli.json           # NestJS CLI config
│       └── webpack.config.js       # Webpack config
│
├── 🐳 docker-compose.yml            # Docker services configuration
├── 📋 lerna.json                    # Lerna monorepo configuration
├── 📦 package.json                  # Root dependencies
├── 📘 tsconfig.json                 # Root TypeScript config
├── 🔒 .gitignore                    # Git ignore rules
├── 📜 LICENSE                       # MIT License
└── 📖 README.md                     # Main README

```

## 📚 Documentation Structure

All documentation is centralized in the `docs/` folder for easy access:

### Getting Started

- **QUICKSTART.md** - Fast setup for new developers
- **START.md** - Detailed backend server startup
- **CHROMADB_SETUP.md** - ChromaDB installation guide

### Deployment & Configuration

- **DEPLOYMENT.md** - Local and cloud deployment instructions
- **SETUP_SUMMARY.md** - Initial project setup details

### Project Status

- **progress.md** - Real-time implementation progress
- **CURRENT_STATUS.md** - Current state of the project
- **BACKEND_COMPLETE.md** - Backend completion milestone

### Architecture

- **DIRECTORY_STRUCTURE.md** - Detailed directory breakdown
- **FILE_UPLOAD_MODULE_SUMMARY.md** - File module architecture

## 🔧 Scripts Structure

Utility scripts are in the `scripts/` folder:

- **start-chromadb.sh** - Automated ChromaDB server startup with Docker
  - Checks Docker status
  - Pulls ChromaDB image
  - Starts container
  - Verifies health

## 📦 Backend Structure

The backend follows NestJS best practices with a modular architecture:

### Feature Modules

**Files Module** (`src/modules/files/`)

- File upload handling
- Storage management
- File metadata tracking

**Chat Module** (`src/modules/chat/`)

- RAG-powered Q&A
- Gemini LLM integration
- Response formatting

**Ingestion Module** (`src/modules/ingestion/`)

- Document parsing (PDF, TXT, HTML)
- Semantic text chunking
- Embedding generation
- Vector storage

**LLM Module** (`src/modules/llm/`)

- Gemini API integration
- Prompt management
- Response generation

### Common Utilities

**Configuration** (`src/common/config/`)

- Environment-based configuration
- Modular config files
- Type-safe settings

**Filters** (`src/common/filters/`)

- Global exception handling
- Error formatting

**Interceptors** (`src/common/interceptors/`)

- Logging
- Request/response transformation

**Pipes** (`src/common/pipes/`)

- Input validation
- File validation

## 🎯 Key Features of Organization

### ✅ Benefits

1. **Clear Separation** - Docs, code, and scripts are clearly separated
2. **Easy Navigation** - Find what you need quickly
3. **Scalable** - Easy to add new modules and documentation
4. **Maintainable** - Modular structure makes updates simple
5. **Professional** - Follows industry best practices

### 📝 Conventions

- **Markdown files** → `docs/` folder
- **Shell scripts** → `scripts/` folder
- **Source code** → `packages/*/src/` folders
- **Configuration** → Root and package-level config files
- **Storage** → `packages/backend/storage/` (gitignored)

### 🔄 Future Additions

When adding new content:

1. **Documentation** → Add to `docs/` and update `docs/README.md`
2. **Scripts** → Add to `scripts/` and make executable (`chmod +x`)
3. **Modules** → Add to `packages/backend/src/modules/`
4. **Packages** → Add to `packages/` (e.g., frontend)

## 📖 Quick Reference

| Need              | Location                                      |
| ----------------- | --------------------------------------------- |
| Getting Started   | `docs/QUICKSTART.md`                          |
| Start Server      | `docs/START.md`                               |
| Deploy to Cloud   | `docs/DEPLOYMENT.md`                          |
| API Documentation | http://localhost:3000/api/docs (when running) |
| Source Code       | `packages/backend/src/`                       |
| Utility Scripts   | `scripts/`                                    |
| Configuration     | `packages/backend/.env`                       |

---

Last updated: October 2025
