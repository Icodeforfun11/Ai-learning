# UCP CODE AI

**An AI coding and programming education platform by Universal Creativity Projects.**

Learn HTML, CSS, JavaScript, Python, TypeScript, React and programming fundamentals. Write code in a real editor, preview it in a secure sandbox, and get help from an AI tutor in English or Arabic.

---

## What's included

| Area | What works |
|---|---|
| **Landing page** | Hero with animated code demo, features, how it works, learning pathway, testimonials (clearly marked as placeholders), FAQ, calls to action |
| **AI Studio** (`/studio`) | Monaco editor, file explorer (add, rename, delete), file tabs, sandboxed HTML/CSS/JS preview with auto-run, real console, streaming AI chat with conversation history, attaching the current file or the whole project, one-tap "Apply" for AI code, error explanation, autosave, .zip export, projects |
| **Learn** (`/learn`) | 7 courses / 19 lessons at Beginner, Intermediate and Advanced levels, filtering, a recommended course for your level, progress percentages |
| **Lessons** (`/learn/[id]`) | Explanations, runnable examples (HTML/JS/React), exercises with instant automatic checks, step-by-step hints before the solution is revealed, quizzes, XP |
| **Daily challenge** | Rotating JS challenge with tests, +40 XP |
| **AI Tutor** (`/tutor`) | Line-by-line explanations, practice exercises, solution reviews, bug diagnosis, improvement suggestions. The tutor gives guidance instead of finished answers. Replies in English or Arabic. Follow-up questions. |
| **Project Builder** (`/builder`) | Portfolio, landing page, calculator, dashboard and game templates. Describe a project → AI generates the files → preview → ask for changes → open in Studio or export |
| **Community** (`/community`) | Sample projects with live previews and Remix. Public sharing is **labelled "coming soon"**; it isn't built yet. |
| **Dashboard** | XP, level, streak, lessons done, course progress, recent lessons, projects, saved chats, 11 badges |
| **Settings** | Profile, skill level, dark/light theme, English/Arabic (full RTL), text size, reduced motion, high contrast, AI speed/depth, data export, progress reset, delete all data, sign in/out |

### Honest status

- **AI:** real and streaming when an `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` is set on the server. Without a key, the app shows **Demo Mode** in the header, and every pre-written reply carries a "DEMO · not AI" badge.
- **Accounts and cloud sync:** use Supabase when it's configured. Without Supabase, sign-in is shown as unavailable and data stays in the browser (localStorage).
- **Code execution:** HTML, CSS, JS and React run **only** in a sandboxed iframe (`sandbox="allow-scripts"`, opaque origin). Nothing runs on the server. Python and TypeScript lessons use static checks plus AI review; they're never executed.
- **Billing/payments:** none exist.
- **Build status:** this source was written and syntax/type-checked offline, but `npm install` / `next build` couldn't be run in the authoring environment. Run `npm run typecheck` after installing; the production build is set not to fail on type or lint warnings.

---

## Run it locally

Requires **Node.js 20+**.

```bash
npm install
cp .env.example .env.local     # add your AI key (optional)
npm run dev                    # http://localhost:3000
```

## Environment variables

See `.env.example`. Server-side secrets (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) are **never** prefixed with `NEXT_PUBLIC_`, so they never reach the browser.

| Variable | Purpose |
|---|---|
| `AI_PROVIDER` | `anthropic` or `openai` |
| `ANTHROPIC_API_KEY` / `ANTHROPIC_MODEL` | Anthropic key and model (default `claude-sonnet-5-5`) |
| `OPENAI_API_KEY` / `OPENAI_MODEL` | OpenAI key and model |
| `AI_MAX_OUTPUT_TOKENS` | Hard cap on response length (cost control) |
| `AI_RATE_LIMIT_PER_MINUTE`, `AI_RATE_LIMIT_PER_DAY` | Per-user/IP limits |
| `AI_REQUIRE_AUTH` | `true` = only signed-in users can call the AI |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Enable accounts + sync (public anon key; data is protected by RLS) |

## Supabase (optional)

1. Create a project at supabase.com.
2. In **SQL Editor**, run `supabase/schema.sql`. It creates `profiles`, `projects` and `chats` with Row Level Security, so each user can only read and write their own rows.
3. Under **Authentication → URL Configuration**, add your site URL.
4. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

---

## Put it on your own https:// link (Netlify)

A Netlify project named **`ucp-code-ai`** already exists in your account. Its address is **https://ucp-code-ai.netlify.app** (it goes live after the first deploy).

**Option A: Git (recommended, auto-deploys on every change)**
1. Create a GitHub repository and upload this folder's contents.
2. In Netlify, open **ucp-code-ai → Project configuration → Build & deploy → Link repository** and pick the repo. Netlify detects Next.js; `netlify.toml` sets the build.
3. Open **Project configuration → Environment variables** and add `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY` with `AI_PROVIDER=openai`). Mark it **secret**.
4. Trigger a deploy.

**Option B: Netlify CLI (from a computer)**
```bash
npm install
npx netlify-cli login
npx netlify-cli link --id d3ddc1c9-8f40-434f-9e8e-8df68576f567
npx netlify-cli env:set ANTHROPIC_API_KEY sk-ant-... --secret
npx netlify-cli deploy --build --prod
```

Vercel works the same way: import the repo and add the same environment variables.

A custom domain (for example `code.yourschool.ae`) can be added under **Domain management** after the first deploy.

---

## iPhone / iOS

**1. Home-screen web app (no App Store, works today)**
Open your https link in **Safari → Share → Add to Home Screen**. The app includes a web manifest, Apple touch icon, full-screen `standalone` mode, safe-area padding for the notch and home bar, and a service worker that caches the app shell.

**2. Native App Store app (Capacitor)**
Requirements: a Mac with Xcode, and an Apple Developer account ($99/year) to publish.
```bash
npm install
export CAPACITOR_SERVER_URL=https://ucp-code-ai.netlify.app   # your deployed URL
npx cap add ios
npm run ios:sync
npm run ios:open      # opens Xcode → set your Team → Run on a device, or Archive → App Store Connect
```
The native shell loads your deployed site, so the server-side AI keeps working and keys stay off the device. Use `public/icons/icon-1024.png` as the App Store icon. Apple asks native apps to offer more than a website, so the touch-first Studio, offline shell and lessons help here. Review Apple's guidelines before you submit.

---

## Security notes

- AI keys stay server-side in `/api/ai`; the browser only receives streamed text.
- Requests are validated with **zod** (roles, lengths, message count) and capped in total size.
- Rate limiting per user (when signed in) or IP. The default limiter is in-memory, so for multi-instance/serverless scale, swap in Redis/Upstash (see `src/lib/ai/rateLimit.ts`).
- AI output is rendered by an escape-first Markdown renderer (`src/lib/markdown.ts`): HTML is escaped before formatting, so model output can't inject markup.
- Untrusted code runs only in opaque-origin sandboxed iframes.
- Supabase tables use Row Level Security policies scoped to `auth.uid()`.
- Security headers are set in `next.config.mjs`.

## Project structure

```
src/
  app/
    page.tsx                 Landing
    studio/                  AI Coding Studio
    learn/                   Courses, course/[courseId], [lessonId]
    tutor/  builder/  community/  dashboard/  settings/  login/
    api/ai/route.ts          Streaming AI endpoint (validation, auth, rate limit, cost caps)
    api/status/route.ts      Tells the client whether live AI or Demo Mode applies
  components/                AppShell, CodeEditor (Monaco), Preview, Markdown, Modal, DailyChallenge
  lib/
    ai/                      providers (Anthropic/OpenAI streaming), prompts, rate limiter
    sandbox.ts               Sandboxed preview + exercise test runner
    markdown.ts              Safe Markdown + highlighter
    store.tsx                State, gamification, local + Supabase sync, AI client
  data/                      courses, templates, i18n (EN/AR)
supabase/schema.sql          Tables + RLS
public/                      manifest, service worker, icons
capacitor.config.ts          iOS wrapper
```

© Universal Creativity Projects
