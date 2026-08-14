# Deploy Invest Smarter to Vercel

This guide deploys the **frontend only** to Vercel from GitHub — no local terminal required.

The app is a static Vite + React SPA. No environment variables are needed for the current sprint (mock data only).

---

## What gets deployed

| Item | Location |
|------|----------|
| Application | `frontend/` |
| Build config | `vercel.json` (repo root) |
| Output | `frontend/dist/` |

The root `vercel.json` tells Vercel to install and build inside `frontend/`, so you do **not** need to set a custom Root Directory in the Vercel dashboard.

---

## Prerequisites

- A [GitHub](https://github.com) account
- A [Vercel](https://vercel.com) account (free tier is sufficient)
- Access to push this repository to GitHub (GitHub Desktop, VS Code GUI, or your company’s approved Git client)

---

## Step 1 — Push to GitHub

If the repository is not on GitHub yet:

1. Create a new **empty** repository on GitHub (e.g. `invest-smarter`).
2. Push your local `InvestSmarter` folder using your approved Git tool.

**Do not commit:**

- `node_modules/`
- `.env` files with secrets
- `frontend/dist/`

These are already listed in `.gitignore`.

**Minimum files required for deployment:**

```
.gitignore
vercel.json
DEPLOY.md
frontend/
  package.json
  index.html
  vite.config.ts
  tsconfig.json
  src/
    main.tsx
    index.css
    app/App.tsx
    pages/HomePage.tsx
    pages/InterviewPage.tsx
    mocks/interview.ts
    types/interview.ts
    vite-env.d.ts
```

---

## Step 2 — Import project in Vercel

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New… → Project**.
3. Import your GitHub repository.
4. Vercel reads `vercel.json` at the repo root. Confirm these settings:

| Setting | Expected value |
|---------|----------------|
| Framework Preset | Vite |
| Root Directory | *(leave empty — use repo root)* |
| Build Command | `npm run build --prefix frontend` |
| Output Directory | `frontend/dist` |
| Install Command | `npm install --prefix frontend` |

5. **Environment variables:** none required for the current mock-data frontend.
6. Click **Deploy**.

First build typically takes 1–2 minutes.

---

## Step 3 — Verify deployment

After a successful deploy, Vercel provides a URL (e.g. `https://invest-smarter.vercel.app`).

Check:

1. **Home page** — title “Invest Smarter”, subtitle “Your AI Investment Analyst”.
2. Enter an investment idea and click **Start Interview**.
3. **Interview page** — shows Investment Idea, AI Question, answer field, and **Next** button.
4. **Direct URL** — open `https://your-app.vercel.app/interview` in the browser. You should see the home content load and redirect (no 404). This confirms SPA routing is configured.

---

## How routing works on Vercel

The app uses React Router (`BrowserRouter`). Vercel must serve `index.html` for client-side routes like `/interview`.

Root `vercel.json` includes:

```json
"rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
```

Static assets (`/assets/*`) are served automatically before rewrites apply.

---

## Automatic deployments

After the first deploy, Vercel redeploys on every push to the connected branch (usually `main`).

Typical workflow without a local terminal:

1. Edit files in your IDE.
2. Commit and push via GitHub Desktop (or approved Git client).
3. Vercel builds and deploys automatically.

---

## Troubleshooting

### Build fails: `npm install` errors

- Ensure `frontend/package.json` is committed.
- Vercel uses Node 18+ (defined in `frontend/package.json` `engines` field).

### Build fails: `vite build` / TypeScript errors

- Check the Vercel build log for the exact file and line.
- All source must live under `frontend/src/`.

### 404 on `/interview` refresh

- Confirm `vercel.json` is at the **repo root** and includes the `rewrites` block.
- Redeploy after adding or changing `vercel.json`.

### Blank page after deploy

- Open browser DevTools → Console for errors.
- Confirm `frontend/dist/index.html` exists in the build log output.

### Wrong directory deployed

- **Do not** set Root Directory to `frontend` if you use the root `vercel.json` as written — commands already use `--prefix frontend`.
- If you prefer Root Directory = `frontend`, remove the root `vercel.json` prefix commands and use a `vercel.json` inside `frontend/` instead (see Alternative setup below).

---

## Alternative setup (Root Directory = `frontend`)

Some teams prefer configuring Vercel manually:

1. Set **Root Directory** to `frontend`.
2. Use this `frontend/vercel.json`:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

3. Remove or ignore the repo-root `vercel.json` to avoid conflicting commands.

The repo-root approach is the default documented above because it works with zero dashboard configuration.

---

## What is not deployed yet

| Component | Status |
|-----------|--------|
| `backend/` | Not deployed — API integration is a later sprint |
| Supabase | Not required for current mock frontend |
| Environment variables | Not required until API keys are added |

When the backend is added, deploy it separately (e.g. Railway, Render, or Vercel Serverless) and configure `VITE_*` env vars in Vercel for the frontend.

---

## Node version

Vercel uses Node 18.x or 20.x by default. The frontend declares `"engines": { "node": ">=18" }` in `package.json`.

To pin a specific version in Vercel: Project Settings → General → Node.js Version.

---

## Support checklist

Before opening a deployment issue, confirm:

- [ ] Repository is on GitHub
- [ ] `vercel.json` exists at repo root
- [ ] `frontend/package.json` and `frontend/src/` are committed
- [ ] No `node_modules/` or `dist/` committed
- [ ] Vercel project is linked to the correct GitHub repo and branch
