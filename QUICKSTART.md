# Quick Start Guide - RAG Application Backend

## 🎉 Backend Foundation Complete!

The backend foundation is fully set up and ready for development. Here's how to get started:

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Google Gemini API Key (for LLM integration when implemented)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# From project root
cd /Users/shaileshdas/Desktop/Dev/simple-rag-app
npm install
```

### 2. Set Up Environment Variables

```bash
# Navigate to backend
cd packages/backend

# Copy environment template
cp .env.example .env

# Edit .env and add your configuration
# For now, you can use the defaults. Add GOOGLE_API_KEY when ready to implement chat.
```

### 3. Build the Project

```bash
# From backend directory
npm run build
```

### 4. Start Development Server

```bash
# From backend directory
npm run dev
```

The server will start on `http://localhost:3000`

### 5. Access API Documentation

Open your browser and navigate to:

- **Swagger UI**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## ✅ What's Been Implemented

### Core Infrastructure

- ✅ Lerna monorepo setup
- ✅ NestJS application with TypeScript
- ✅ Global configuration management
- ✅ Swagger/OpenAPI documentation
- ✅ Global exception handling
- ✅ Request/response logging
- ✅ File validation utilities
- ✅ Storage directory structure

### Configuration Services

All configurations are environment-based and loaded globally:

- ✅ App configuration (port, environment)
- ✅ File upload configuration (size limits, allowed types)
- ✅ Vector database configuration
- ✅ Embeddings configuration
- ✅ RAG pipeline configuration
- ✅ LLM configuration

### API Endpoints (Current)

- `GET /api/health` - Health check endpoint

## 📁 Project Structure

```
simple-rag-app/
├── packages/backend/          # Backend NestJS application
│   ├── src/
│   │   ├── main.ts           # Application entry
│   │   ├── app.module.ts     # Root module
│   │   ├── app.controller.ts # Health check
│   │   └── common/           # Shared utilities
│   │       ├── config/       # Configuration services
│   │       ├── filters/      # Exception filters
│   │       ├── interceptors/ # Logging interceptors
│   │       ├── pipes/        # Validation pipes
│   │       └── utils/        # Utility functions
│   └── storage/              # File storage (git-ignored)
│       ├── uploads/          # Uploaded files by type
│       └── vector-db/        # ChromaDB storage
└── ...
```

## 🔧 Available Scripts

### From Backend Directory (`packages/backend`)

```bash
# Development
npm run dev              # Start development server with hot-reload

# Building
npm run build            # Build the project

# Testing
npm run test             # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:cov         # Generate test coverage report
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
```

### From Root Directory

```bash
# Run commands across all packages
npm run dev              # Start all packages in parallel
npm run build            # Build all packages
npm run test             # Test all packages
npm run lint             # Lint all packages
npm run format           # Format all packages
```

## 📚 Documentation

- **Setup Summary**: `SETUP_SUMMARY.md` - Detailed setup completion report
- **Directory Structure**: `DIRECTORY_STRUCTURE.md` - Complete project structure
- **Progress Tracker**: `progress.md` - Implementation progress
- **Backend README**: `packages/backend/README.md` - Backend-specific docs

## 🧪 Verify Installation

Test that everything works:

```bash
# 1. Build the project
cd packages/backend
npm run build

# 2. Run linting
npm run lint

# 3. Start the server
npm run dev

# 4. In another terminal, test the health endpoint
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-09-29T...",
  "service": "RAG Application API"
}
```

## 📝 Next Steps

Ready to continue building? Here's what to implement next:

1. **File Upload Module**
   - Create files module with upload endpoint
   - Implement file storage service
   - Add file listing and deletion endpoints

2. **Document Ingestion Pipeline**
   - Implement PDF, TXT, HTML parsers
   - Create semantic chunking service
   - Set up HuggingFace embeddings

3. **Vector Store Integration**
   - Implement ChromaDB service
   - Add document storage and retrieval

4. **Chat Module**
   - Implement Gemini LLM service
   - Create RAG pipeline
   - Add chat endpoint

5. **Testing**
   - Write unit tests for services
   - Create E2E tests for APIs
   - Integration tests for full pipeline

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Change PORT in .env file
PORT=3001
```

### Dependencies Issues

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Build Errors

```bash
# Clean build
npm run clean
npm run build
```

## 💡 Development Tips

1. **Swagger Documentation**: Use the Swagger UI at `/api/docs` to test APIs manually as you build them

2. **Hot Reload**: The dev server supports hot-reload, changes are reflected automatically

3. **Logging**: All requests are logged via the LoggingInterceptor - check console for details

4. **Type Safety**: TypeScript strict mode is enabled - leverage it for better code quality

5. **Testing**: Write tests as you implement features for better code reliability

## 🎯 Current Status

**✅ Backend Foundation: 100% Complete**

- Project compiles without errors
- All configurations load correctly
- Swagger documentation is accessible
- Code follows NestJS best practices
- Ready for feature development

---

**Happy Coding! 🚀**

Need help? Check the documentation files or the implementation plan in the project root.
