# Project Directory Structure

## Current Structure (Backend Foundation)

```
simple-rag-app/
├── .eslintrc.js                    # Root ESLint configuration
├── .gitignore                      # Git ignore rules
├── .prettierrc                     # Prettier code formatting config
├── lerna.json                      # Lerna monorepo configuration
├── package.json                    # Root package.json with workspaces
├── tsconfig.json                   # Root TypeScript configuration
├── progress.md                     # Implementation progress tracker
├── SETUP_SUMMARY.md               # Setup completion summary
├── DIRECTORY_STRUCTURE.md         # This file
├── LICENSE                         # Apache 2.0 License
├── README.md                       # Project overview
│
└── packages/
    └── backend/                    # Backend NestJS application
        ├── .eslintrc.js           # Backend ESLint config
        ├── nest-cli.json          # NestJS CLI configuration
        ├── package.json           # Backend dependencies
        ├── tsconfig.json          # Backend TypeScript config
        ├── README.md              # Backend documentation
        ├── .env.example           # Environment variables template
        │
        ├── src/                   # Source code
        │   ├── main.ts           # Application entry point
        │   ├── app.module.ts     # Root module
        │   ├── app.controller.ts # Root controller (health check)
        │   ├── app.service.ts    # Root service
        │   │
        │   └── common/           # Shared utilities
        │       ├── index.ts      # Common module exports
        │       │
        │       ├── config/       # Configuration services
        │       │   ├── index.ts
        │       │   ├── app.config.ts          # App settings
        │       │   ├── file.config.ts         # File upload settings
        │       │   ├── vector-db.config.ts    # Vector DB settings
        │       │   ├── embeddings.config.ts   # Embeddings settings
        │       │   ├── rag.config.ts          # RAG pipeline settings
        │       │   └── llm.config.ts          # LLM settings
        │       │
        │       ├── filters/      # Exception filters
        │       │   └── http-exception.filter.ts
        │       │
        │       ├── interceptors/ # Request interceptors
        │       │   └── logging.interceptor.ts
        │       │
        │       ├── pipes/        # Validation pipes
        │       │   └── file-validation.pipe.ts
        │       │
        │       └── utils/        # Utility functions
        │           └── file.utils.ts
        │
        ├── test/                  # Tests
        │   └── e2e/              # End-to-end tests
        │       └── jest-e2e.json
        │
        └── storage/               # Local storage (git-ignored)
            ├── uploads/          # Uploaded files
            │   ├── pdf/
            │   ├── txt/
            │   └── html/
            └── vector-db/        # ChromaDB storage

```

## Planned Structure (To be implemented)

```
packages/backend/src/
│
├── modules/                       # Feature modules
│   │
│   ├── files/                    # File upload module
│   │   ├── files.module.ts
│   │   ├── files.controller.ts
│   │   ├── files.service.ts
│   │   ├── files.service.spec.ts
│   │   └── dto/
│   │       ├── upload-file.dto.ts
│   │       └── file-response.dto.ts
│   │
│   ├── chat/                     # Chat module
│   │   ├── chat.module.ts
│   │   ├── chat.controller.ts
│   │   ├── chat.service.ts
│   │   ├── chat.service.spec.ts
│   │   └── dto/
│   │       ├── chat-query.dto.ts
│   │       └── chat-response.dto.ts
│   │
│   └── ingestion/                # Document ingestion pipeline
│       ├── ingestion.module.ts
│       ├── ingestion.service.ts
│       ├── ingestion.service.spec.ts
│       │
│       ├── parsers/              # Document parsers
│       │   ├── pdf-parser.service.ts
│       │   ├── text-parser.service.ts
│       │   ├── html-parser.service.ts
│       │   └── *.spec.ts
│       │
│       ├── chunking/             # Text chunking
│       │   ├── semantic-chunker.service.ts
│       │   └── semantic-chunker.service.spec.ts
│       │
│       ├── embeddings/           # Embeddings generation
│       │   ├── huggingface-embeddings.service.ts
│       │   └── huggingface-embeddings.service.spec.ts
│       │
│       └── vector-store/         # Vector database
│           ├── chroma-store.service.ts
│           └── chroma-store.service.spec.ts
│
└── llm/                          # LLM integration
    ├── gemini.service.ts
    └── gemini.service.spec.ts

test/
├── unit/                         # Unit tests
│   ├── files.service.spec.ts
│   ├── chat.service.spec.ts
│   └── ...
│
└── e2e/                          # End-to-end tests
    ├── files.e2e-spec.ts
    ├── chat.e2e-spec.ts
    └── integration.e2e-spec.ts

```

## Key Features of Current Structure

### ✅ Monorepo Setup

- Lerna-based monorepo with independent package versioning
- Shared root configuration for TypeScript, ESLint, and Prettier
- Workspace-based dependency management

### ✅ Backend Foundation

- NestJS application structure following best practices
- Modular architecture with separation of concerns
- Global configuration management with environment variables
- Swagger/OpenAPI documentation at `/api/docs`

### ✅ Common Module

- Centralized configuration services
- Global exception handling
- Request/response logging
- File validation utilities
- Reusable utility functions

### ✅ Storage Structure

- Organized file storage by type (PDF, TXT, HTML)
- Local vector database directory for ChromaDB
- Git-ignored but tracked with .gitkeep files

### ✅ Testing Infrastructure

- Jest configuration for unit tests
- Separate E2E test configuration
- Ready for test development

## Next Implementation Phase

The next phase will add:

1. **Files Module** - File upload endpoints
2. **Ingestion Module** - Document processing pipeline
3. **Chat Module** - RAG-powered chat interface
4. **LLM Service** - Gemini integration
5. **Comprehensive Tests** - Unit and E2E tests

---

Last Updated: 2025-09-29
