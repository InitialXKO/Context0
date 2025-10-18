# Exam Navigator Platform

Exam Navigator delivers a persistent simulation exam checklist, optional AI guidance, and lightweight planning tools. The floating checklist panel is always within reach, persists progress locally, and can be extended with OpenAI-powered suggestions.

The repository currently holds two related workspaces:

| Directory | Purpose |
|-----------|---------|
| `src/` | Existing MCP service utilities (unchanged). |
| `web/` | Next.js 14 application that exposes the checklist UI, AI proxy route, and deployment configuration. |

## Features

- **Global checklist panel** – Floating toggle summons a sheet-based panel (shadcn-inspired) to review tasks from any page. Progress is persisted through a dedicated `ProgressContext` backed by `localStorage`.
- **AI suggestion endpoint** – `/api/ai-suggest` edge route proxies to OpenAI when `OPENAI_API_KEY` is configured and responds with graceful fallbacks otherwise.
- **Rich media assets** – Optimized SVG illustrations live in `web/public/images` for all hero, resources, and Open Graph needs.
- **Performance focus** – Route-level dynamic imports, deferred client components, and prefetch-enabled links keep navigation fast. Images flow through `next/image` for automatic optimization.
- **Accessibility first** – Keyboard and screen-reader support for the floating button, ARIA labelling in the checklist, and visible focus styling.

## Getting started

### 1. Install dependencies

```bash
cd web
npm install
```

> The root `package.json` powers the existing TypeScript MCP service and is unaffected by the web client.

### 2. Start the app in development mode

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000). The floating checklist toggle is rendered globally and can be opened from any route.

### 3. Build for production

```bash
npm run build
npm run start
```

The build step compiles the app using Next.js’ production optimizations. Console statements are stripped in production via the compiler configuration.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Optional | Enables the `/api/ai-suggest` proxy to forward prompts to OpenAI. When not provided, the route responds with clear, user-facing messaging. |

Store environment variables locally in `.env.local` (ignored by default) and configure the same variables in your Vercel project settings for production. A starter file is available at `web/.env.example`.

## Deployment

The app is designed for Vercel deployment.

1. Push the repository to GitHub.
2. Create a new Vercel project and select the `web/` subdirectory as the project root (Project Settings → General → Root Directory).
3. Set the build command to `npm run build`, the install command to `npm install`, and the output directory to `.next`.
4. Add the `OPENAI_API_KEY` environment variable if you would like AI suggestions.
5. The included `vercel.json` pins the AI route to edge regions (`iad1`, `sfo1`) and adds strict transport security headers.

## Performance & accessibility notes

- `ChecklistToggle` and supporting panel code are dynamically imported to keep the initial critical path small.
- Secondary routes use `prefetch` to hint to Next.js which bundles to hydrate ahead of navigation.
- Static assets are SVG-based and optimized for minimal transfer size while maintaining clarity.
- Focus management and ARIA attributes have been applied to the floating button, sheet dialog, and range inputs.
- Lighthouse scores target >95 for Performance, Accessibility, Best Practices, and SEO. Run `npm run build && npm run start` then audit locally via Chrome DevTools Lighthouse.

## Tech stack

- **Framework:** Next.js 14 (App Router, Edge API routes)
- **Language:** TypeScript with React 18
- **UI:** Custom CSS with shadcn-inspired Sheet/Dialog primitives
- **Icons:** Lucide React (optional usage via `lucide-react` dependency)
- **Deployment:** Vercel (edge regions for AI route)

## Repository scripts

Within `web/`:

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Next.js in development mode. |
| `npm run build` | Build optimized production bundles. |
| `npm run start` | Run the compiled app in production mode. |
| `npm run lint` | Execute Next.js ESLint rules. |

> These commands run independently of the root TypeScript build process to keep the MCP service and web experience decoupled.
