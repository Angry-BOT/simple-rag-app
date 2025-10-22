# 🚀 Getting Started with Simple RAG

Complete guide to set up and run the Simple RAG application locally.

---

## 📋 Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **Docker Desktop** installed ([Download](https://www.docker.com/products/docker-desktop/))
- ✅ **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))
- ✅ **Terminal/Command Line** access

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd simple-rag-app

# Install all dependencies
npm install
```

### Step 2: Start ChromaDB

```bash
# Start ChromaDB with Docker
./scripts/start-chromadb.sh

# Verify it's running
curl http://localhost:8000/api/v1/heartbeat
```

### Step 3: Configure Backend

```bash
# Navigate to backend
cd packages/backend

# Create environment file
cp .env.example .env

# Edit .env and add your Google Gemini API key
# GOOGLE_API_KEY=your_api_key_here
```

### Step 4: Configure Frontend

```bash
# Navigate to frontend
cd ../frontend

# The default values work out of the box
# Create .env file (optional)
echo "VITE_API_URL=http://localhost:3000" > .env
echo "VITE_APP_NAME=Simple RAG" >> .env
```

### Step 5: Start the Application

```bash
# From project root
cd ../..

# Start both backend and frontend
npm run dev
```

**That's it!** 🎉

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000/api/docs
- **ChromaDB**: http://localhost:8000

---

## 📖 Detailed Setup Instructions

### Installing Node.js

**macOS** (using Homebrew):
```bash
brew install node@18
```

**Windows**:
Download and install from [nodejs.org](https://nodejs.org/)

**Linux** (Ubuntu/Debian):
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

Verify installation:
```bash
node --version  # Should show v18.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Installing Docker

**macOS**:
1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop/)
2. Install and start Docker Desktop
3. Verify: `docker --version`

**Windows**:
1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. Install and start Docker Desktop
3. Verify: `docker --version`

**Linux**:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Start Docker
sudo systemctl start docker
sudo systemctl enable docker

# Add your user to docker group
sudo usermod -aG docker $USER
```

### Getting Google Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key (keep it secure!)
5. Add to `packages/backend/.env`:
   ```
   GOOGLE_API_KEY=your_api_key_here
   ```

---

## 🔧 Configuration

### Backend Configuration

Edit `packages/backend/.env`:

```env
# Application
PORT=3000
NODE_ENV=development

# Google Gemini API
GOOGLE_API_KEY=your_api_key_here

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,txt,html
UPLOAD_DIR=./storage/uploads

# ChromaDB
CHROMA_URL=http://localhost:8000
CHROMA_COLLECTION=rag_documents

# RAG Configuration
CHUNK_SIZE=1000
CHUNK_OVERLAP=200
TOP_K=5

# Embeddings
EMBEDDING_MODEL=Xenova/all-MiniLM-L6-v2

# LLM
LLM_MODEL=gemini-1.5-pro
LLM_TEMPERATURE=0.7
LLM_MAX_TOKENS=2048
```

### Frontend Configuration

Edit `packages/frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Simple RAG
```

---

## 🎮 Running the Application

### Option 1: Run Everything Together

```bash
# From project root
npm run dev
```

This starts:
- Backend on port 3000
- Frontend on port 5173
- With colored terminal output

### Option 2: Run Separately

**Terminal 1 - Backend**:
```bash
npm run dev:backend
```

**Terminal 2 - Frontend**:
```bash
npm run dev:frontend
```

**Terminal 3 - ChromaDB** (if not already running):
```bash
./scripts/start-chromadb.sh
```

---

## ✅ Verifying Installation

### 1. Check ChromaDB

```bash
curl http://localhost:8000/api/v1/heartbeat
# Expected: {"nanosecond heartbeat": <number>}
```

### 2. Check Backend

```bash
curl http://localhost:3000/api/health
# Expected: {"status":"ok","message":"Server is running"}
```

### 3. Check Frontend

Open browser to http://localhost:5173
- You should see the Simple RAG interface
- Three columns: Files, Chat, History

### 4. Check API Documentation

Open browser to http://localhost:3000/api/docs
- You should see Swagger UI
- All API endpoints documented

---

## 🎯 First Use

### Upload and Process a Document

1. **Open Frontend**: http://localhost:5173

2. **Upload a File**:
   - Drag & drop a PDF, TXT, or HTML file
   - Or click "Browse Files"
   - Wait for upload to complete

3. **Process the File**:
   - Click the "Play" icon on the uploaded file
   - Wait for processing (may take a minute for first file)
   - Status will show when complete

4. **Ask a Question**:
   - Type a question in the chat input
   - Press Enter to send
   - Wait for AI response with sources

5. **View Sources**:
   - AI responses show which documents were used
   - Source files are displayed as badges

---

## 📁 Project Structure

```
simple-rag-app/
├── docs/                    # 📚 Documentation
│   ├── GETTING_STARTED.md  # This file
│   ├── FRONTEND_COMPLETE.md # Frontend docs
│   ├── BACKEND_COMPLETE.md  # Backend docs
│   └── ...
├── scripts/                 # 🔧 Utility scripts
│   └── start-chromadb.sh   # Start ChromaDB
├── packages/
│   ├── backend/            # 🎯 NestJS API
│   │   ├── src/           # Source code
│   │   ├── storage/       # File storage
│   │   └── .env           # Configuration
│   └── frontend/           # ⚛️ React UI
│       ├── src/           # Source code
│       └── .env           # Configuration
├── docker-compose.yml      # 🐳 Docker config
└── package.json           # Root package
```

---

## 🐛 Troubleshooting

### "Port 3000 is already in use"

**Solution**: Kill the process using port 3000
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### "Port 5173 is already in use"

**Solution**: Vite will automatically use the next available port. Check terminal output.

### "ChromaDB connection failed"

**Solution 1**: Ensure Docker is running
```bash
docker ps
# Should show chromadb container
```

**Solution 2**: Restart ChromaDB
```bash
docker restart chromadb
```

**Solution 3**: Check ChromaDB logs
```bash
docker logs chromadb
```

### "GOOGLE_API_KEY not configured"

**Solution**: Add your API key to `packages/backend/.env`
```bash
cd packages/backend
echo "GOOGLE_API_KEY=your_actual_key_here" >> .env
```

Then restart the backend.

### "Module not found" errors

**Solution**: Reinstall dependencies
```bash
# Remove all node_modules
rm -rf node_modules packages/*/node_modules

# Reinstall
npm install
```

### "File upload failed"

**Solution 1**: Check file type and size
- Only PDF, TXT, HTML supported
- Max 10MB file size

**Solution 2**: Check storage permissions
```bash
cd packages/backend
mkdir -p storage/uploads/{pdf,txt,html}
chmod -R 755 storage
```

### "Chat not working"

**Solution**: Ensure file is processed
1. Upload file
2. Click "Process" button (play icon)
3. Wait for completion
4. Then try chatting

---

## 🔒 Security Notes

### API Keys

- **Never commit** `.env` files to Git
- **Keep API keys** private
- **Rotate keys** regularly
- **Use environment variables** in production

### File Upload

- Files are validated on the server
- Only whitelisted file types accepted
- Size limits enforced
- Files stored locally (not in database)

### Production Deployment

For production:
- Use HTTPS
- Set `NODE_ENV=production`
- Use environment variables (not .env files)
- Enable CORS only for your domain
- Add rate limiting
- Add authentication
- Use a reverse proxy (nginx)

---

## 📊 Available Scripts

From project root:

```bash
# Development
npm run dev              # Start both backend & frontend
npm run dev:backend      # Start backend only
npm run dev:frontend     # Start frontend only

# Building
npm run build            # Build both
npm run build:backend    # Build backend
npm run build:frontend   # Build frontend

# Testing
npm test                 # Run all tests
npm run test:e2e        # Run E2E tests
npm run test:cov        # Run with coverage

# Maintenance
npm run lint             # Lint all packages
npm run format           # Format code
npm run clean            # Clean node_modules
```

---

## 🎓 Learning Resources

### Backend (NestJS)
- [NestJS Documentation](https://docs.nestjs.com/)
- [LangChain Documentation](https://js.langchain.com/)
- [ChromaDB Documentation](https://docs.trychroma.com/)

### Frontend (React)
- [React Documentation](https://react.dev/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)

---

## 🤝 Need Help?

1. **Check Documentation**: See `docs/` folder
2. **Check API Docs**: http://localhost:3000/api/docs
3. **Check Logs**: Look at terminal output
4. **Check Issues**: GitHub issues (if applicable)

---

## 🎉 Next Steps

Once everything is running:

1. ✅ Upload some documents
2. ✅ Process them through RAG
3. ✅ Ask questions
4. ✅ Explore the API documentation
5. ✅ Try different document types
6. ✅ Experiment with dark mode
7. ✅ Create multiple conversations

---

**Enjoy using Simple RAG!** 🚀

If you encounter any issues, refer to the troubleshooting section or check the detailed documentation in the `docs/` folder.

