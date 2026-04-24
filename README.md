# RolePilot AI

RolePilot AI is a starter full-stack app for a role-based career chatbot. It is designed to feel like a focused guide for a specific job path instead of a generic assistant.

## MVP included

- Next.js app-router project structure
- Role selector for different career tracks
- Chat interface with local conversation persistence
- Quick-start prompts based on the selected role
- `/api/chat` endpoint with mocked role-aware responses

## Run locally

1. Install dependencies:

   ```bash
   npm.cmd install
   ```

2. Start the dev server:

   ```bash
   npm.cmd run dev
   ```

3. Open `http://localhost:3000`

## Run automated tests

```bash
npm.cmd run test
```

## Current status

This version works in two modes:

- If `OPENAI_API_KEY` is set, the API route will call the configured OpenAI model.
- If no key is set, it falls back to the local response generator in [`lib/chat.ts`](./lib/chat.ts).

## Next steps

- Connect a real LLM provider in [`app/api/chat/route.ts`](./app/api/chat/route.ts)
- Add authentication and persistent database-backed chat history
- Create a dashboard for saved learning plans and mock interviews
- Add admin tools for managing roles and prompt templates
