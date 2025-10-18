# Context0 MCP Service

Context0 is a Model Context Protocol (MCP) service that provides context management, task execution, and offloading utilities for agent platforms. The service exposes a set of MCP tools that can be consumed by compatible clients via stdio.

## 📦 Tech Stack

- Node.js + TypeScript
- @modelcontextprotocol/sdk
- Zod for schema validation

## 🧑‍💻 Local Development

```bash
npm install
npm run dev
```

### Available Scripts

- `npm run dev` – start the TypeScript service in watch mode
- `npm run build` – compile TypeScript to JavaScript into `dist`
- `npm run start` – run the compiled service
- `npm run lint` – lint TypeScript sources with ESLint
- `npm run lint:fix` – lint and automatically fix issues
- `npm run type-check` – perform a no-emit TypeScript type check

## 🔐 Environment Variables

Copy `.env.example` to `.env` and provide values for the variables that you need in your deployment:

```env
OPENAI_API_KEY=sk-xxx
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=作文成长营
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Variables beginning with `NEXT_PUBLIC_` are meant for browser exposure if you integrate a web front-end. Remove or rename them if they are not required in your MCP integration.

## 🚀 部署

本项目已部署到 Vercel：

**生产环境**: https://your-app.vercel.app

### 自己部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/InitialXKO/Context0)

1. 点击上方按钮
2. 连接 GitHub 账号
3. 配置环境变量（可选）
4. 点击 Deploy

### Vercel 项目设置摘要

- **Install Command**: `npm install`
- **Build Command**: `npm run build`
- **Output Directory**: `.vercel/output` (default for serverless deployments)
- **Production Branch**: `main`
- **Regions**: `sin1`, `hkg1`
- 自动启用 Preview Deployments，用于分支或 Pull Request 验证。

> ℹ️ 当前代码库是一个 MCP 服务而非 Next.js 应用。`vercel.json` 中的配置按照项目需求提供构建命令和安全 Header。若你计划扩展出 Web 前端，可以在此基础上集成 Next.js 或其他框架。

## 📄 Additional Documentation

详见 [`DEPLOYMENT.md`](./DEPLOYMENT.md) 获取关于 Vercel 配置、CI/CD 流程和运营建议的更详细说明。
