# AI Resume & Portfolio Builder

A modern, AI-powered application to generate professional resumes and portfolios. Built with React (Vite), Node.js (Express), and Groq AI.

## Quick Start (Demo Mode)

The application includes a robust **Demo Mode** that allows you to run it even without valid API keys.

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Installation

Open two terminal windows (one for client, one for server).

**Terminal 1: Server**
```bash
cd server
npm install
```

**Terminal 2: Client**
```bash
cd client
npm install
```

### 3. Environment Setup

**Server**
Create a `.env` file in the `server` directory:
```env
PORT=5000
DATABASE_URL="postgresql://user:password@localhost:5432/resume_db" # Optional for Mock Mode
GROQ_API_KEY="your_groq_api_key" # Required for Real AI
GROQ_MODEL="llama-3.1-8b-instant" # Optional, defaults to llama-3.1-8b-instant
CLERK_SECRET_KEY="your_clerk_secret_key" # Optional for Mock Mode
```

**Client**
Create a `.env.local` file in the `client` directory:
```env
VITE_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key" # Use "PLACEHOLDER" for Demo Mode
VITE_API_URL="http://localhost:5000"
```

### 4. Running the Application

**Start the Server (Terminal 1)**
```bash
cd server
npm run dev
```
*Server will start on http://localhost:5000*

**Start the Client (Terminal 2)**
```bash
cd client
npm run dev
```
*Client will start on http://localhost:5173*

## Features

- **AI Resume Generation**: Simply enter a job title, and the AI (Groq) generates a professional summary and skills.
- **Resume Preview & PDF**: View your resume in a clean format and download it as a PDF.
- **Demo Mode**: Works out-of-the-box without complex setup.
- **Authentication**: Supports Clerk Auth (or falls back to a mock user).

## Troubleshooting

- **Blank Page?** Ensure you are running the backend server. The client needs the API to function correctly.
- **AI Not Working?** Check your `GROQ_API_KEY` in `server/.env`.
- **"Database unavailable"?** The app will switch to in-memory mock storage so you can still save resumes.
