# Chatify — Bun + TypeScript Edition

A fully native Bun real-time chat app written in TypeScript. No transpile step needed — Bun runs `.ts` directly.

## Project structure

```
chatify/
├── package.json
├── tsconfig.json
├── .env              ← PORT=3000 (optional)
├── public/
│   ├── index.html
│   └── client.js
└── src/
    ├── index.ts
    └── app.ts
```

## Run

```bash
# Install bun-types (for type checking only, not required to run)
bun install

# Development (hot reload)
bun dev

# Production
bun start
```

Requires Bun v1.0+. Bun runs TypeScript natively — no `tsc`, no build step.
