# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
AI-native note-taking web application with AI-powered features including automatic title generation, tag creation, and content polishing.

## Tech Stack
- **Frontend**: Next.js (static export mode)
- **UI**: Shadcn/UI + Tailwind CSS
- **AI**: OpenRouter API (deepseek-chat-v3.1)
- **Storage**: Browser localStorage
- **Markdown**: react-markdown
- **ID Generation**: uuid

## Development Commands

### Initial Setup
```bash
npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npx shadcn-ui@latest init
```

### Install Dependencies
```bash
npm install react-markdown uuid lucide-react
npm install -D @types/uuid
```

### Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run export       # Generate static files
npm run lint         # Run ESLint
```

### Testing
```bash
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
```

## Architecture

### Component Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── globals.css
├── components/
│   ├── AppLayout.tsx       # Main 3-column layout
│   ├── Sidebar.tsx         # Left navigation
│   ├── NoteList.tsx        # Middle note list
│   ├── NoteListItem.tsx    # Individual note items
│   ├── Editor.tsx          # Right markdown editor
│   ├── PolishModal.tsx     # AI polishing comparison
│   └── Settings.tsx        # API key configuration
├── hooks/
│   └── useLocalStorage.ts  # Custom localStorage hook
├── lib/
│   └── api.ts             # OpenRouter API integration
└── types/
    └── note.ts            # Note interface definitions
```

### Key Data Models
```typescript
interface Note {
  id: string;           // UUID
  title: string;        // Auto-generated or user-edited
  content: string;      // Markdown content
  tags: string[];       // AI-generated tags
  createdAt: string;    // ISO 8601
  updatedAt: string;    // ISO 8601
}
```

### AI Integration
- **Title Generation**: POST `/api/v1/chat/completions` with deepseek-chat-v3.1
- **Tag Generation**: Same endpoint with tag-focused prompts
- **Content Polishing**: Comparison view with original vs AI-enhanced

### Storage Strategy
- Notes stored in browser localStorage
- No backend required (pure frontend)
- Static export deployment ready

## Development Workflow

### Feature Implementation Order
1. Basic Next.js setup with TypeScript and Tailwind
2. Shadcn/UI integration and theme setup
3. localStorage utilities and Note interface
4. Sidebar component with navigation
5. NoteList and NoteListItem components
6. Editor component with markdown support
7. AI API integration utilities
8. PolishModal for AI comparison view
9. Settings page for API key management

### Deployment
- **Vercel**: `vercel --prod`
- **Netlify**: `npm run build && npm run export`
- **GitHub Pages**: Build output to `out/` directory

## Environment Variables
```env
NEXT_PUBLIC_OPENROUTER_API_KEY=your_api_key_here
```