# Xin Chào

A real time chat application with built in Vietnamese and English translation. Xin Chào combines a full real time chat platform (one to one and group messaging, friends, presence, image uploads) with live message translation, photo text translation, and voice input.


## Features

- One to one and group chat in real time over Socket.IO
- Friends and friend requests with online presence
- Image messages with Cloudinary uploads
- Full interface in both English and Vietnamese with a language toggle in settings
- Automatic browser language detection on first load, with English as the fallback
- Per message translation between English and Vietnamese
- Photo text translation that overlays the translation on the image
- Voice input that turns speech into a message using the browser speech engine

## Project structure

```
backend/    Node + Express + MongoDB + Socket.IO API and realtime server
frontend/   React + TypeScript + Vite client
```

## Prerequisites

- Node.js 18 or newer
- A MongoDB database (local or MongoDB Atlas)
- A Cloudinary account for image uploads
- An Anthropic API key for translation and photo text translation

## Backend setup

```bash
cd backend
npm install
cp .env.example .env   # then fill in your own values
npm run dev
```

The backend runs on port 5001 by default.

## Frontend setup

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

The frontend runs on port 5173 by default and expects the backend at the URL set in the env files. The `--legacy-peer-deps` flag is required because the emoji picker library has not yet declared React 19 support.

## Environment variables

Never commit real secrets. The file `backend/.env.example` lists every variable with placeholder values. Copy it to `.env` and fill in real values locally. The `.env` file is ignored by git.

## AI features

Translation and photo text translation call the Anthropic API and require `ANTHROPIC_API_KEY` in the backend `.env`. When the key is missing the endpoints return a safe fallback instead of failing, so the rest of the app keeps working. Voice input runs entirely in the browser and needs no key. It works in browsers that support the Web Speech API, such as Chrome.

## Language behavior

User facing text is fully controlled by the frontend translation system in both English and Vietnamese. Backend code, comments, logs, and API messages are in English. Because the frontend renders its own translated messages, the language toggle controls everything the user sees.
