# CareerOS Backend

Deployable Express backend for the CareerOS architecture:

- JWT email/password auth plus Firebase ID-token compatibility
- Supabase Postgres persistence when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured
- Seeded in-memory fallback for local demos
- NVIDIA NIM-compatible LLM wrapper
- Piston external code execution
- Aptitude, resume, interview, video quiz, roadmap, jobs, leaderboard, and skill graph APIs
- Crucible workflow, repo review, repo cross-question, and benchmark gap analyzer APIs

## Setup

1. Create a Supabase project.
2. Run `backend/supabase/schema.sql` in the Supabase SQL editor.
3. Copy `.env.example` to `.env`.
4. Set:

```env
PORT=4000
JWT_SECRET=replace-with-a-long-random-secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NVIDIA_API_KEY=your-nvidia-key
NVIDIA_MODEL=meta/llama-3.1-70b-instruct
ADZUNA_APP_ID=optional-adzuna-id
ADZUNA_APP_KEY=optional-adzuna-key
FIREBASE_PROJECT_ID=optional-firebase-project-id
GITHUB_TOKEN=optional-github-token-for-repo-review
```

If Supabase is not configured, the API still starts with seeded local data so the frontend can be tested immediately. For deployment, configure Supabase.

## Run

```bash
npm run dev:api
```

## Useful Checks

```http
GET /api/health
POST /api/auth/register
POST /api/auth/login
GET /api/coding/problems
POST /api/coding/submit
GET /api/leaderboard
POST /api/crucible/workflow/start
POST /api/crucible/repo/analyze
POST /api/crucible/gap-analyzer
```
