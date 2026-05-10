# Execution OS

Execution OS is a production-ready MVP for reducing decision paralysis and increasing daily execution. It is built as a mobile-first web app with a Next.js frontend, Express backend, Firebase Google login, and MongoDB persistence.

## Folder Structure

```text
execution-os/
  apps/
    api/                  Express API, auth verification, MongoDB models
    web/                  Next.js mobile-first frontend
  docs/                   Architecture, API, database, deployment notes
  packages/
    shared/               Shared TypeScript types and constants
```

## Local Run

1. Install dependencies:

```bash
npm install
```

2. Copy environment files:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

3. Fill Firebase and MongoDB values in those files.

4. Start both apps:

```bash
npm run dev
```

On Windows PowerShell, if `npm.ps1` is blocked, run:

```powershell
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Frontend: http://localhost:3000  
API: http://localhost:4000

MongoDB must be running before starting the API. The default local connection is:

```text
mongodb://127.0.0.1:27017/execution-os
```

## Documentation

- [Full Folder Structure](docs/folder-structure.md)
- [Phase 1 Web MVP](docs/phase-1-web-mvp.md)
- [Architecture](docs/architecture.md)
- [API Routes](docs/api.md)
- [Database Schema](docs/database-schema.md)
- [Deployment](docs/deployment.md)
