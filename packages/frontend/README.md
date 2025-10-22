# Simple RAG Frontend

Modern React frontend for the RAG (Retrieval-Augmented Generation) application.

## Features

- 📁 **File Upload** - Drag-and-drop interface for PDF, TXT, and HTML files
- 💬 **Chat Interface** - Real-time chat with AI using RAG pipeline
- 📚 **Conversation History** - Manage multiple conversations with LocalStorage persistence
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui
- 🌗 **Dark Mode** - Full theme support with system preference detection
- ⚡ **Fast & Responsive** - Optimized with React Query and GSAP animations

## Tech Stack

- **Vite** - Lightning-fast build tool
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe development
- **TanStack Query (React Query v5)** - Server state management
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible components
- **GSAP** - Professional-grade animations
- **Axios** - HTTP client
- **react-dropzone** - File upload functionality

## Getting Started

### Prerequisites

- Node.js 18+
- Backend server running on http://localhost:3000

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file with:

```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Simple RAG
```

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

The app will be available at http://localhost:5173

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Header, layout components
│   ├── files/           # File upload and management
│   ├── chat/            # Chat interface
│   ├── history/         # Conversation history
│   └── common/          # Shared components (loading, toast, etc.)
├── contexts/
│   ├── app.context.tsx       # Global app state
│   └── chat.context.tsx      # Chat and conversation state
├── hooks/
│   ├── use-files.hook.ts     # File management hooks
│   ├── use-chat.hook.ts      # Chat hooks
│   ├── use-animation.hook.ts # GSAP animation hooks
│   └── use-auto-scroll.hook.ts # Auto-scroll utility
├── services/
│   ├── api.service.ts        # Axios instance
│   ├── files.service.ts      # File API calls
│   └── chat.service.ts       # Chat API calls
├── types/
│   ├── file.types.ts         # File type definitions
│   ├── chat.types.ts         # Chat type definitions
│   └── api.types.ts          # API type definitions
├── utils/
│   ├── animations.util.ts    # GSAP animation helpers
│   └── format.util.ts        # Formatting utilities
├── lib/
│   ├── utils.ts              # cn() utility
│   ├── query-client.ts       # React Query configuration
│   └── query-keys.ts         # Query key constants
├── app.component.tsx          # Main app component
├── main.tsx                   # Entry point
└── index.css                  # Global styles with Tailwind
```

## Features in Detail

### File Management

- Drag-and-drop file upload
- Support for PDF, TXT, and HTML files
- File size validation (max 10MB)
- Process files through RAG pipeline
- Delete uploaded files
- View file metadata

### Chat Interface

- Real-time messaging with typing indicators
- Source citations for AI responses
- Auto-scroll to latest messages
- Message history
- Keyboard shortcuts (Enter to send, Shift+Enter for new line)

### Conversation History

- Create multiple conversations
- Switch between conversations
- Delete conversations
- Persistent storage with LocalStorage
- Conversation search and filtering

### Theming

- Light and dark modes
- System preference detection
- Smooth theme transitions
- Persistent theme selection

## API Integration

The frontend communicates with the backend API:

- `POST /api/files/upload` - Upload files
- `GET /api/files` - List uploaded files
- `DELETE /api/files/:id` - Delete file
- `POST /api/ingestion/process/:id` - Process file
- `POST /api/chat/query` - Send chat message
- `GET /api/chat/health` - Check service health

## Performance Optimizations

- React Query for efficient data caching
- Optimistic updates for better UX
- useMemo and useCallback for render optimization
- GSAP animations with cleanup
- Lazy loading and code splitting
- LocalStorage for conversation persistence

## Development Guidelines

### Component Naming

All components follow the `.component.tsx` naming convention:
- `file-upload.component.tsx`
- `chat-interface.component.tsx`
- `message-bubble.component.tsx`

### Hooks Naming

Custom hooks follow the `.hook.ts` convention:
- `use-files.hook.ts`
- `use-chat.hook.ts`
- `use-animation.hook.ts`

### Services Naming

API services follow the `.service.ts` convention:
- `api.service.ts`
- `files.service.ts`
- `chat.service.ts`

### Code Style

- TypeScript strict mode enabled
- ESLint for linting
- Prettier for formatting
- Tailwind CSS for styling
- shadcn/ui for components

## Troubleshooting

### Port Already in Use

If port 5173 is in use, Vite will automatically use the next available port. Check the terminal output for the actual port.

### API Connection Issues

Ensure the backend server is running and the `VITE_API_URL` in `.env` is correct.

### Build Errors

Clear node_modules and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## License

MIT
