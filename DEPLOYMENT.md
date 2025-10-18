# Deployment Guide

This document describes how to deploy the Context0 MCP service to Vercel with a production-ready configuration and CI/CD integration. While the original requirements referenced a Next.js application, the current codebase is a TypeScript MCP (Model Context Protocol) service. The steps below adapt the deployment strategy so that the service can still be hosted on Vercel or used as the back-end for a future web experience.

## 1. Prerequisites

- Node.js 20.x
- npm 10+
- Access to the Git repository (`InitialXKO/Context0`)
- Vercel account connected to GitHub

## 2. Vercel Configuration

The repository now contains a [`vercel.json`](./vercel.json) file that standardises commands and security headers:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1", "hkg1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" }
      ]
    }
  ]
}
```

> **Note:** Vercel will treat this repository as a Node.js application. The `framework` field is kept for compliance with the ticket requirements but it does not change the behaviour when no Next.js assets are produced. If you later add a Next.js front-end, Vercel will automatically pick up the build output.

### 2.1 Build Output

- `npm run build` compiles the TypeScript sources into the `dist/` directory.
- `npm run start` runs the compiled service. When deploying to Vercel, you can expose the compiled code through Serverless Functions or Edge Functions if you wrap the service entry point accordingly.

## 3. Environment Variables

`.env.example` enumerates the variables expected in production:

```env
OPENAI_API_KEY=sk-xxx
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=作文成长营
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Populate the values in the Vercel dashboard under **Project Settings → Environment Variables**. Only define the variables that are relevant to your deployment.

## 4. Deployment Workflow

1. Push the branch to GitHub.
2. In the Vercel dashboard, create a new project and import the repository.
3. Confirm the default settings:
   - **Framework Preset**: Other (Vercel detects there is no Next.js front-end yet).
   - **Root Directory**: `./`
   - **Install Command**: `npm install`
   - **Build Command**: `npm run build`
   - **Output Directory**: leave default (Vercel will rely on Serverless output).
4. Set the production branch to `main` and ensure both preview and production deployments are enabled.
5. Add required environment variables.
6. Trigger a deploy.

## 5. Continuous Integration

GitHub Actions has been configured at [`.github/workflows/ci.yml`](./.github/workflows/ci.yml). The workflow runs on pushes to `main` or `develop`, and on pull requests targeting `main`:

- `npm ci`
- `npm run lint`
- `npm run type-check`
- `npm run build`

Ensure all checks pass before merging into the production branch to guarantee consistent deployments.

## 6. Post-Deployment Checklist

- [ ] Confirm the service starts without runtime errors in Vercel logs.
- [ ] Verify all MCP tool endpoints behave as expected through your MCP client.
- [ ] Validate that security headers are present in responses.
- [ ] Confirm environment variables are correctly resolved.
- [ ] If a web front-end is added later, run Lighthouse against the Vercel URL and aim for ≥ 90 scores across key categories.

## 7. Monitoring & Analytics

Vercel Analytics and Speed Insights primarily target web front-ends. When you introduce a Next.js UI, wrap your root layout with the provided helpers:

```tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
```

For the current MCP service, focus on Vercel logs and optional third-party monitoring for any outbound API calls (e.g., OpenAI).

## 8. Troubleshooting

| Issue | Resolution |
|-------|------------|
| Build fails | Ensure Node.js 20 is used (via `actions/setup-node@v4` or Vercel settings) and run `npm run build` locally to inspect diagnostics. |
| Missing environment variables | Double check Vercel project settings. Remember that `NEXT_PUBLIC_*` variables are exposed to the browser when you add a front-end. |
| Service cannot bind to stdio | Vercel may require HTTP handlers. Consider wrapping the MCP capabilities behind an HTTP API or using a persistent worker if you need long-lived stdio access. |

## 9. Future Enhancements

- Wrap MCP tools with an HTTP interface for easier hosting on Vercel.
- Add automated tests and extend the CI workflow to include them.
- Integrate alerts (Slack, email, or Vercel notifications) for deployment failures.
- Tag releases in Git and associate them with production deployments for traceability.

---

Document updated for the `deploy-vercel-mvp-prod-ci` task.
